var pkg = require('../package.json');

var self = {};

self.PORT = pkg.config.port;
self.HOST = pkg.config.host;

module.exports = self;
