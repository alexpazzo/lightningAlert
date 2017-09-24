'use strict'
global.globalConfig = require('./config/config.js');

//ENABLE LOGGER / SET LEVEL
const log = require("loglevel");
log.getLogger("lightningAnalyzer").setLevel(globalConfig.logLevel);
log.getLogger("mailManager").setLevel(globalConfig.logLevel);
log.getLogger("app").setLevel(globalConfig.logLevel);
log.getLogger("sqliteManager").setLevel(globalConfig.logLevel);