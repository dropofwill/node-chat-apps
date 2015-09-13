var constants = require('./constants'),
    protocol = require('./udp'),
    broadcast_address = require('./broadcast-address'),
    utils = require('./utils');

var BROADCAST_ADDRESS = broadcast_address(),
    CLIENT_PORT = constants.CLIENT_PORT,
    SERVER_PORT = constants.SERVER_PORT;

// Creat connection -> create_socket() -> socket
//
// Handle message -> on_data(socket, callback) -> null
//
// Start listening -> start_server() -> null

var socket = protocol.create_socket(),
    send_data = protocol.send_data_factory(socket, SERVER_PORT, BROADCAST_ADDRESS);

var message_cb = function(data, remote_info) {
  if (protocol.valid_port(remote_info, CLIENT_PORT)) {
    send_data(data);
  }
};

protocol.on_data(socket, {'message': message_cb});

protocol.bind_socket(socket, CLIENT_PORT, true)

utils.setup_graceful_shutdown(send_data);
