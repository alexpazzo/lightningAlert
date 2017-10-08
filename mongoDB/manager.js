'use strict'
const mongoose = require('mongoose');
const log = globalLogger;

const thisManager = {}

const options = {
    user: globalConfig.mongoDB.user,
    pass: globalConfig.mongoDB.password
}

const connection = mongoose.createConnection(globalConfig.mongoDB.host + globalConfig.mongoDB.dbName, options);
thisManager.connection = connection;

connection.on('open', () => {
    log.info(`Connected to ${globalConfig.mongoDB.dbName}!`);
});
connection.on('error', (err) => {
    log.error(`Error trying to connect to ${globalConfig.mongoDB.dbName} DB: \n ${err}`);
});
connection.on('disconnected', () => {
    log.info(``)
});