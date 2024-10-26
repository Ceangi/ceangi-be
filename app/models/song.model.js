module.exports = (sequelize, Sequelize) => {
    const Song = sequelize.define("songs", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
        },
        title: {
            type: Sequelize.STRING,
        },
        index: {
            type: Sequelize.INTEGER,
            allowNull: true,
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
