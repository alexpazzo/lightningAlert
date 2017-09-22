'use strict'

module.exports = {
    wsurl: 'ws://ws.blitzortung.org:8088/',
    initMessage: {
        east: 180,
        north: 90,
        south: -90,
        west: -180,
    },
    defaultConfig: {
        posistion: {
            latitude: 45.643002,
            longitude: 8.762719
        },
        radius: {
            alert: 5000,
            watching: 50000
        }
    }
}