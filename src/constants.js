var pkg = require('../package.json');

var constants = {};

constants.PORT = pkg.config.port;
constants.HOST = pkg.config.host;

module.exports = constants;
