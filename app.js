'use strict'
const appKernel = require('./appKernel.js');
const blitzortung = require('./analyzer/lightningAnalyzer.js');
const db = require('./sqlite/sqliteManager');
const emailSender = require('./mail/mailManager');
const moment = require('moment');
const log = require("loglevel").getLogger("app");

//CONST
let counterAlert = 0;
let counterWatching = 0;
let counterNoWatching = 0;
let lastMail;
let freqMail;
let myemail;
let dbFolder;
let delay;
let home;

//GETCONFIG
try {
    const myConfig = require('./myconfig.json');
    freqMail = myConfig.freqMail;
    myemail = myConfig.myemail;
    dbFolder = myConfig.dbFolder;
    delay = myConfig.logFreq;
    home = myConfig.home;

} catch (err) {
    throw new Error(err)
}

//INIT DB / WS / EMAIL
const dbEvent = db.init(dbFolder);
const alerter = blitzortung.init(home);
emailSender.init({
    'freqMail': freqMail
});


//DB READY
dbEvent.on('connected', () => {
    //STATISTIC LOGGER
    loopLogger();
    //START ANALYZE
    var lightEvent = blitzortung.start();

    //ALERT FOUND
    lightEvent.on('alert', (strike, distance) => {
        manageAlert('ALERT', strike, distance);
        db.insertStrike(strike, 'ALERT');
        counterAlert++;
    });
    //WATCHING FOUND
    lightEvent.on('watching', strike => {
        db.insertStrike(strike, 'WATCHING');
        counterWatching++;
    });
    //NO WATCHING
    lightEvent.on('noWatching', strike => {
        counterNoWatching++;
    });
});

//
function loopLogger() {
    setInterval(() => {
        log.info(`From ${moment().subtract(delay, 'ms').format('HH:mm:ss')} to ${moment().format('HH:mm:ss')} Saved ${counterAlert} ALERT / ${counterWatching} WATCHING  Strikes. ${counterNoWatching} discarded`);
        counterAlert = 0;
        counterWatching = 0;
        counterNoWatching = 0;
    }, delay);
}

function manageAlert(level, strike, distance) {
    //DO ALERT STUFF
    sendEmail(level, strike, distance, blitzortung.getHome());
}

function sendEmail(level, strike, distance, home) {

    var text = '<h3>&Egrave; stato avvistato un&nbsp;<span class="emoji">⚡&nbsp;</span>a ' + distance + ' metri dalla la tua abitazione, precisamente&nbsp;<a href="https://www.google.com/maps/search/?api=1&query=' + strike.lat + ',' + strike.lon + '">QUI</a>.</h3>' +
        '<h3>Corri a controllare la situazione su&nbsp;<a href="https://www.lightningmaps.org/?lang=it#y=' + home.latitude + ';x=' + home.longitude + ';z=12;t=3;m=sat;r=0;s=0;o=0;b=0.00;d=2;dl=2;dc=0;">lightningmaps.org</a></h3>';
    emailSender.sendEmail(level, myemail, text);
}