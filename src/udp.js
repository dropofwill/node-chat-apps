var dgram = require('dgram'),
    rl = require('readline'),

    utils = require('./utils');

var self = {};

self.create_socket = function(params) {
  // Default params for IPv4 and reuseAddr
  params = utils.default_param(params, {reuseAddr: true, type: 'udp4'});

  return dgram.createSocket(params);
};

// Higher-order function to lower the valence of the send_data function
self.send_data_factory = function(socket, port, address) {
  return function(data, callback) {

    socket.send(data, 0, data.length, port, address,
      function(error) {
        if (error) throw error;
        if (utils.is_param_defined(callback)) callback();
      }
    );
  };
};

self.valid_port = function(remote_info, valid_port) {
  if (remote_info.port === valid_port)
    return true;
  else
    return false;
};

// Takes a socket and a hash of callback functions with the events as keys
// e.g. {'message': message_callback}
self.on_data = function(socket, callbacks_obj) {
  for (var event_key in callbacks_obj) {
    socket.on(event_key, callbacks_obj[event_key]);
  }
};

self.bind_socket = function(socket, port, set_broadcast, callback) {
  socket.bind(port, function(){
    if (set_broadcast) socket.setBroadcast(true);
    if (utils.is_param_defined(callback)) callback();
  });
};

module.exports = self;
