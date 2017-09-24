'use strict'
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const log = require("loglevel").getLogger("sqliteManager");
const fs = require('fs');


const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let db = undefined;

module.exports.init = (mypath = __dirname) => {
    if (!fs.existsSync(mypath)) {
        fs.mkdirSync(mypath);
        log.info('Creating dir: ', mypath);
    }
    log.info('Database path: ' + path.resolve(mypath, 'lightning.db'));
    db = new sqlite3.Database(path.resolve(mypath, 'lightning.db'), (err) => {
        if (err) {
            console.error(err.message);
        }
        myEmitter.emit('connected')
        console.log('Connected to the lightning database.');
    });

    //mds = maximal deviation span in nano seconds
    //mcg = maximal circular gap in degrees
    db.serialize(() => {
        db.run('CREATE TABLE if not exists strikes (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'tag TEXT NOT NULL,' +
            'latitude REAL NOT NULL,' +
            'longitude REAL NOT NULL,' +
            'altitude INT NOT NULL,' +
            'polarity INTEGER NOT NULL,' +
            'mds INTEGER NOT NULL,' +
            'mcg INTEGER NOT NULL,' +
            'date TEXT NOT NULL' +
            ')'
        );
    });

    return myEmitter;
}


module.exports.insertStrike = (strike, tag) => {
    const moment = require('moment');
    if (!db) throw new Error('DB not inizialized');
    var date = moment(strike.time / 1000000).format('YYYY-MM-DD HH:mm:ss');

    let data = [tag, strike.lat, strike.lon, strike.alt, strike.pol, strike.mds, strike.mcg, date]
    let placeholders = data.map((data) => '? ').join(',');
    var sql = 'INSERT INTO strikes (tag, latitude, longitude ,altitude, polarity, mds, mcg, date) VALUES ' + '(' + placeholders + ')';

    db.run(sql, data, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}


module.exports.close = () => {
    if (!db) throw new Error('DB not inizialized');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        myEmitter.emit('disconnected')
        console.log('Close the database connection.');
    })
}