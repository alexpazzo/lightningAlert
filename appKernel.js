'use strict'
global.globalConfig = require('./config/config.js');

//ENABLE LOGGER / SET LEVEL
/* const log = require("loglevel");
log.getLogger("lightningAnalyzer").setLevel(globalConfig.logLevel);
log.getLogger("mailManager").setLevel(globalConfig.logLevel);
log.getLogger("app").setLevel(globalConfig.logLevel);
log.getLevel('mongoDB').setLevel(globalConfig.logLevel);
log.getLogger("sqliteManager").setLevel(globalConfig.logLevel); */


const logger = require('./logger/loggerHelper.js');
logger.init(globalConfig.logLevel);
global.Cologger = logger.class;