const { authJwt } = require("../middleware");
const controller = require("../controllers/song.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/song/allSongs", controller.allSongs);
    app.post("/api/song/createSong", controller.createSong);
    app.get('/api/song/getSongById/:id', controller.getSongById);
    app.delete('/api/song/deleteSongById/:id', controller.deleteSongById);
    app.put('/api/song/updateSong/:id', controller.updateSong);

};
