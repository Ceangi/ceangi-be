const db = require("../models");
const Song = db.song;
const Op = db.Sequelize.Op;

exports.allSongs = (req, res) => {
    Song.findAll()
        .then((songs) => {
            res.status(200).send(songs);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.createSong = (req, res) => {
    // Create a song
    const song = {
        title: req.body.title,
        lyrics: req.body.lyrics,
        chord: req.body.chord,
    };

    // Save song in the database
    Song.create(song)
        .then((data) => {
            res.status(201).send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Song.",
            });
        });
};

exports.getSongById = (req, res) => {
    const id = req.params.id; // Get ID from URL parameters

    Song.findByPk(id)
        .then((song) => {
            if (song) {
                res.status(200).send(song);
            } else {
                res.status(404).send({ message: "Song not found." });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.deleteSongById = async (req, res) => {
    const { id } = req.params; // Extract song ID from the request params

    try {
        // Find the song by ID
        const song = await Song.findByPk(id);

        if (!song) {
            return res.status(404).json({ message: "Song not found!" });
        }

        // Delete the song
        await song.destroy();

        return res.status(200).json({ message: "Song deleted successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting song." });
    }
};
