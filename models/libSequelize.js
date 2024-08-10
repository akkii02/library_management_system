const Sequelize = require('sequelize');

const sequelize = require('../util/database')

const Library = sequelize.define('Library', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    borrowedAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
    returnBy: {
        type: Sequelize.DATE,
        allowNull: true
    },
    fineAmount: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

module.exports = Library;