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

udp.valid_port = function(remote_info, valid_port) {
  if (remote_info.port === valid_port)
    return true;
  else
    return false;
};

// Takes a socket and a hash of callback functions with the events as keys
// e.g. {'message': message_callback}
udp.on_data = function(socket, callbacks_obj) {
  for (event_key in callbacks_obj) {
    socket.on(event_key, callbacks_obj[event_key]);
  }
};

udp.start_server = function(socket, port, callback) {
  socket.bind(port, function(){
    socket.setBroadcast(true);

    if (utils.is_param_defined(callback)) callback();
  });
};

module.exports = udp;
