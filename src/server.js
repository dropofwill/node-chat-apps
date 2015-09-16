var constants = require('./constants'),
    protocol = require('./tcp'),
    broadcast_address = require('./broadcast-address').broadcast_address,
    utils = require('./utils');

// Let's you either input a specific address to broadcast with env vars, e.g.:
//   $ ADDRESS=127.255.255.255 npm run server
// Or let's you say whether you would like to run internally on the loopback or
// on the LAN. It uses netmask to calculate the appropriate address:
//   $ LOOPBACK=false npm run server
// Else it defaults to just working on your internal loopback since that
// /should/ always work.
var BROADCAST_ADDRESS = utils.get_env_var('ADDRESS') ||
                        utils.get_env_var('LOOPBACK', parse_broadcast_address) ||
                        broadcast_address(),

    CLIENT_PORT = constants.CLIENT_PORT,
    SERVER_PORT = constants.SERVER_PORT,
    
    clients = [];

var start = function() {
  protocol.on_data(socket,
      { 'data':  data_cb,
        'error': error_cb,
        'end':   end_cb,
        'close': close_cb });

  protocol.bind_socket(socket, CLIENT_PORT, true);
};

var socket = protocol.create_socket(),
    send_data = protocol.send_data_factory(socket, SERVER_PORT, BROADCAST_ADDRESS);

var message_cb = function(data, remote_info) {
  if (protocol.valid_port(remote_info, CLIENT_PORT)) {
    send_data(data);
  }
};

start();
