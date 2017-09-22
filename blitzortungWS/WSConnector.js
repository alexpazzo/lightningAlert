'use strict'
const wsConfig = require('./WSConfig.js');
const WebSocket = require('ws');
const geolib = require('geolib');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
let myPosition;
let radius;

module.exports.init = (config = wsConfig.defaultConfig) => {
     myPosition = config.posistion;
     radius = config.radius;
     const myEmitter = new MyEmitter();

    const ws = new WebSocket(wsConfig.wsurl, {
        perMessageDeflate: false
    });

    ws.on('open', _ => {
        //SENDING INIT MESSAGE TO blitzortung.org WS
        ws.send(JSON.stringify(wsConfig.initMessage));
        console.log(`LISTENING TO STRIKES... \nHOME POSISTION: ${JSON.stringify(myPosition)}, RADIUS: ${JSON.stringify(radius)}`);
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