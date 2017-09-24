'use strict'
const WebSocket = require('ws');
const geolib = require('geolib');
const EventEmitter = require('events');
const log = require("loglevel").getLogger("lightningAnalyzer");

class MyEmitter extends EventEmitter {}

let myPosition;
let radius;
let myEmitter;

const defaultConfig = {
    posistion: {
        latitude: 45.643002,
        longitude: 8.762719
    },
    radius: {
        alert: 5000,
        watching: 50000
    }
}


module.exports.init = (config = defaultConfig) => {
    try {
        myPosition = config.posistion;
        radius = config.radius;
        myEmitter = new MyEmitter();
    } catch (err) {
        throw new Error(err);
    }
}

module.exports.start = () => {
    if (!myPosition || !radius || !myEmitter) throw new Error('You mast inizialize the lightningAnalyzer');

    const ws = new WebSocket(globalConfig.ws.url, {
        perMessageDeflate: false
    });

    ws.on('open', _ => {
        //SENDING INIT MESSAGE TO blitzortung.org WS
        ws.send(JSON.stringify(globalConfig.ws.initMessage));
        log.info(`LISTENING TO STRIKES... \nHOME POSISTION: ${JSON.stringify(myPosition)}, RADIUS: ${JSON.stringify(radius)}`);
    });

    ws.on('message', data => {
        try {
            var Strike = getStrikeObject(data);
            //Meter distance
            var distance = geolib.getDistance(myPosition, {
                latitude: Strike.lat,
                longitude: Strike.lon
            });
            //ALERT
            if (distance <= radius.alert) {
                myEmitter.emit('alert', Strike, distance);
                //WATCHING
            } else if (distance <= radius.watching) {
                myEmitter.emit('watching', Strike);
                //ELSE
            } else {
                myEmitter.emit('noWatching', Strike);
            }
        } catch (err) {
            myEmitter.emit('error', err);
        }
    });
    return myEmitter;
}

module.exports.getHome = () => {
    return myPosition;
}

module.exports.getRadius = () => {
    return radius;
}


//UTILS
function getStrikeObject(stringStrike) {
    var json;
    try {
        json = JSON.parse(stringStrike);
    } catch (err) {
        throw new Error(err);
    }
    delete json.sig;
    return json;
}