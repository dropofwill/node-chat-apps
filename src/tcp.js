var net = require('net'),
    rl = require('readline'),

    utils = require('./utils');

var tcp = {};

tcp.create_socket = function(params) {
  return new net.Socket();
};

// Higher-order function to lower the valence of the send_data function
tcp.send_data_factory = function(socket, port, address) {
  return function(data, callback) {

    socket.send(data, 0, data.length, port, address,
      function(error) {
        if (error) throw error;
        if (utils.is_param_defined(callback)) callback();
      }
    );
  };
};

// Takes a socket and a hash of callback functions with the events as keys
// e.g. {'message': message_callback}
tcp.on_data = function(socket, callbacks_obj) {
  for (var event_key in callbacks_obj) {
    socket.on(event_key, callbacks_obj[event_key]);
  }
};

tcp.connect_socket = function(socket, port, host, callback) {
  socket.connect(port, host, function(){
    if (utils.is_param_defined(callback)) callback();
  });
};

module.exports = tcp;
