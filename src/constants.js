var pkg = require('../package.json');

var constants = {};

constants.SERVER_PORT = pkg.config.server_port;
constants.CLIENT_PORT = pkg.config.client_port;

// constants.BROADCAST_ADDRESS = process.env.BROADCAST_ADDRESS || broadcast_address();

constants.EXIT_SIGNALS = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP',
  'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'];

module.exports = constants;
