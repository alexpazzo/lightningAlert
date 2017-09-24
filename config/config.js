var config = {};

switch (process.env.NODE_ENV) {
    case 'dev':
        config = {
            ws: {
                url: 'ws://ws.blitzortung.org:8088/',
                initMessage: {
                    east: 180,
                    north: 90,
                    south: -90,
                    west: -180,
                }
            },
            logLevel: "info"
        };
        break;

    case 'prod':
        config = {
            ws: {
                url: 'ws://ws.blitzortung.org:8088/',
                initMessage: {
                    east: 180,
                    north: 90,
                    south: -90,
                    west: -180,
                }
            },
            logLevel: "error",
        };
        break;

    default:
        console.error("****** Missing NODE_ENV parameter required");
        break;
}

module.exports = config;