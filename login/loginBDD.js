// Import module
const jsonfile = require('jsonfile');
const Sequelize = require('sequelize');

// Import file
const config = jsonfile.readFileSync('./config.json');

global.data.dbName = config.name;

exports.login = new Sequelize(config.name, config.user, config.pass, {
    host: config.host,
    dialect: config.type,
    logging: false // console.log
});