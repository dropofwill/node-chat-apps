var dgram = require('dgram');
var utils = require('./utils');

var udp = {};

udp.create_socket = function(params) {
  // Default params for IPv4 and reuseAddr
  params = utils.default_param(params, {reuseAddr: true, type: 'udp4'});

  return dgram.createSocket(params);
};

// Higher-order function to lower the valence of the send_data function
udp.send_data_factory = function(socket, port, address) {
  return function(data) {

    socket.send(data, 0, data.length, port, address,
      function(error) {
        if (error) throw error;
      }
    );
  };
};

udp.valid_port = function(remote_port, valid_port) {
  if (remote_port === valid_port)
    return true;
  else
    return false;
};

udp.start_server = function() {

};

module.exports = udp;
