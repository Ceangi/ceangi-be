module.exports = (sequelize, Sequelize) => {
    const Song = sequelize.define("songs", {
        title: {
            type: Sequelize.STRING,
        },
        lyrics: {
            type: Sequelize.TEXT('long'),
        },
        chord: {
            type: Sequelize.STRING,
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return Song;
};
