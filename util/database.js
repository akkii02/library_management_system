const Sequelize = require('sequelize');

const sequelize = new Sequelize('library_management_database', 'root', '168179', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+05:30'
});

module.exports = sequelize;