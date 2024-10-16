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
