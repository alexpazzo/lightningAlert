'use strict'
const blitzortung = require('./blitzortungWS/WSConnector.js');
const db = require('./sqlite/sqliteManager');
const emailSender = require('./mail/mailManager');
const moment = require('moment');
const path = require('path');

//CONST
let counterAlert = 0;
let counterWatching = 0;
let counterNoWatching = 0;
const dealy = 60000;
let lastMail;
const freqMail = 10;
const myemail = 'alessandro.belli89@gmail.com'


//INIT
const dbEvent = db.init('C:\\Users\\aless\\Desktop\\db');
const blitzortungEvent = blitzortung.init({
    posistion: {
        latitude: 45.643002,
        longitude: 8.762719
    },
    radius: {
        alert: 1000,
        watching: 50000
    }
});
emailSender.init();

//DB READY
dbEvent.on('connected', () => {
    //STATISTIC LOGGER
    loopLogger();

    blitzortungEvent.on('alert', (strike, distance) => {
        db.insertStrike(strike, 'ALERT');
        manageAlert('ALERT', strike, distance);
        counterAlert++;
    });
    blitzortungEvent.on('watching', strike => {
        db.insertStrike(strike, 'WATCHING');
        counterWatching++;
    });
    blitzortungEvent.on('noWatching', strike => {
        counterNoWatching++;
    });
});

function loopLogger() {
    setInterval(() => {
        console.log(`From ${moment().subtract(dealy, 'ms').format('HH:mm:ss')} to ${moment().format('HH:mm:ss')} Saved ${counterAlert} ALERT / ${counterWatching} WATCHING  Strikes. ${counterNoWatching} discarded`);
        counterAlert = 0;
        counterWatching = 0;
        counterNoWatching = 0;
    }, dealy);
}

function manageAlert(level, strike, distance) {
    sendEmail(level, strike, distance, blitzortung.getHome());
}

function sendEmail(level, strike, distance, home) {
    if (lastMail && moment().diff(lastMail, 'minutes') < freqMail) return;
    console.log(`${moment().format('HH:mm:ss')} - Sending Email`)

    var text = '<h3>&Egrave; stato avvistato un&nbsp;<span class="emoji">⚡&nbsp;</span>a '+ distance + ' metri dalla la tua abitazione, precisamente&nbsp;<a href="https://www.google.com/maps/search/?api=1&query=' + strike.lat + ',' + strike.lon + '">QUI</a>.</h3>' +
    '<h3>Corri a controllare la situazione su&nbsp;<a href="https://www.lightningmaps.org/?lang=it#y=' + home.latitude + ';x=' + home.longitude + ';z=12;t=3;m=sat;r=0;s=0;o=0;b=0.00;d=2;dl=2;dc=0;">lightningmaps.org</a></h3>';

    emailSender.sendEmail(level, myemail, text);
    lastMail = moment();

}

//https://www.lightningmaps.org/?lang=it#y=45.6374;x=8.8191;z=12;t=3;m=sat;r=0;s=0;o=0;b=0.00;d=2;dl=2;dc=0;
//https://www.google.com/maps/@-15.623037,18.388672,8z