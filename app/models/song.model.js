module.exports = (sequelize, Sequelize) => {
    const Song = sequelize.define("songs", {
        title: {
            type: Sequelize.STRING,
        },
        lyrics: {
            type: Sequelize.STRING,
        },
        chord: {
            type: Sequelize.STRING,
        },
    });

    return Song;
};
