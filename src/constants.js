var pkg = require('../package.json');

var mod = {};

mod.PORT = pkg.config.port;
mod.HOST = pkg.config.host;

module.exports = mod;
