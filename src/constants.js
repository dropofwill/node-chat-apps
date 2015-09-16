var pkg = require('../package.json');

var constants = {};

constants.SERVER_PORT = pkg.config.server_port;
constants.CLIENT_PORT = pkg.config.client_port;
constants.HOST        = pkg.config.host;

module.exports = constants;
