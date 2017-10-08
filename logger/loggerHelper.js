'use strict'

const chalk = require('chalk');
const LEVELS = {
    ALL: 0,
    DEBUG: 1,
    INFO: 2,
    WARNING: 3,
    ERROR: 4,
    FATAL: 5,
    OFF: 6
}

function getColorByLevel(level) {
    switch (level) {
        case LEVELS.DEBUG:
            return chalk.white;
        case LEVELS.INFO:
            return chalk.green;
        case LEVELS.WARNING:
            return chalk.keyword('orange');
        case LEVELS.ERROR:
            return chalk.red;
        case LEVELS.DEBUG:
            return chalk.bold.red;
        default:
            throw new Error('Wrong type of level');
    }
}

let printLevel = 0;

module.exports.LEVELS = LEVELS

module.exports.init = (level) => {
    if (level == undefined) throw new Error('Wrong level');
    if (!(level instanceof Number)) {
        try {
            printLevel = LEVELS[level];
            return;
        } catch (err) {
            throw new Error(err);
        }
    }
    printLevel = level;
}

module.exports.class = class Cologger {
    constructor(preString) {
        if (printLevel == undefined) throw new Error('PrintLevel not Set');
        this.preString = preString;
    }
    debug(string) {
        this._log(LEVELS.DEBUG, string);
    }
    info(string) {
        this._log(LEVELS.INFO, string);
    }
    warning(string) {
        this._log(LEVELS.WARNING, string);
    }
    error(string) {
        this._log(LEVELS.ERROR, string);
    }
    fatal(string) {
        this._log(LEVELS.FATAL, string);
    }

    _log(level, string) {
        if (printLevel <= level) {
            let pencil = getColorByLevel(level);
            console.log(pencil(this.preString.toUpperCase() + ' | ' + string));
        }

    }
}