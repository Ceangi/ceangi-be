const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const dbConfig = require("../db.config");

const BACKUP_DIR = path.join(__dirname, "../backups");
const OUTPUT_FILE = path.join(BACKUP_DIR, `dump_${new Date().toISOString().slice(0, 10)}.sql`); // File di dump con la data corrente

// Configurazione del trasportatore nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "avila@ctfitalia.com",
        pass: "jltp orxo koae bavi",
    },
});

// Carica il file CSS
const cssFilePath = path.join(__dirname, "../templates/style.css");
const styles = fs.readFileSync(cssFilePath, "utf-8");

const cid = "imagelogo@cid";

const deleteOldBackups = (directory) => {
    const files = fs.readdirSync(directory);
    const now = Date.now();
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000); // 30 giorni in millisecondi

    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile() && stats.mtime < oneMonthAgo) {
            fs.unlinkSync(filePath); // Elimina il file se è più vecchio di un mese
            console.log(`File eliminato: ${file}`);
        }
    });
};

const createBackupDirectoryIfMissing = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true }); // Crea la directory se non esiste
        console.log(`Directory di backup creata: ${directory}`);
    }
};

exports.sendBackupEmail = (req, res) => {
    console.log("Inizio del cron job - Creazione del backup del database...");

    // Crea la directory di backup se mancante
    createBackupDirectoryIfMissing(BACKUP_DIR);

    // Elimina i backup più vecchi di un mese prima di creare un nuovo dump
    deleteOldBackups(BACKUP_DIR);

    // Comando mysqldump usando le configurazioni da db.config
    const dumpCommand = `mysqldump -u ${dbConfig.USER} -p${dbConfig.PASSWORD} -h ${dbConfig.HOST} ${dbConfig.DB} > ${OUTPUT_FILE}`;

    exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Errore durante la creazione del dump: ${error.message}`);
            return res.status(500).send("Errore durante la creazione del dump.");
        }

        if (stderr) {
            console.error(`Standard error: ${stderr}`);
            return res.status(500).send("Errore standard durante il dump.");
        }

        console.log(`Dump del database salvato in ${OUTPUT_FILE}`);

        // Verifica se il file esiste
        if (fs.existsSync(OUTPUT_FILE)) {
            console.log("Invio della mail con il backup...");

            // Estrai i dettagli della mail dal body della richiesta
            const { recipient, subject, message } = req.body;

            // Carica il template HTML della mail
            const htmlDefaultTemplate = fs.readFileSync(
                path.join(__dirname, "../templates/defaultEmail.html"),
                "utf-8"
            );

            // Personalizza il contenuto HTML
            let htmlContent = htmlDefaultTemplate.replace("{{imageCid}}", cid);
            htmlContent = htmlContent.replace("{{message}}", message);

            const mailOptions = {
                from: "info@ctfitalia.com",
                to: recipient,
                subject: subject,
                html: htmlContent,
                attachments: [
                    {
                        filename: path.basename(OUTPUT_FILE), // Nome del file di dump
                        path: OUTPUT_FILE,
                    },
                    {
                        filename: "logo.png", // Allegato dell'immagine del logo
                        path: path.join(__dirname, "../templates/logo.png"),
                        cid: cid, // Collegamento per il logo nel corpo della mail
                    },
                ],
            };

            // Invia la mail
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`Errore durante l'invio della mail: ${error.message}`);
                    return res.status(500).send("Errore durante l'invio della mail.");
                }

                console.log(`Email inviata con successo: ${info.response}`);
                res.status(200).send("Email inviata con successo.");
            });
        } else {
            console.error("File di backup non trovato.");
            return res.status(500).send("File di backup non trovato.");
        }
    });
};