var net = require('net'),
    rl = require('readline'),

    utils = require('./utils');

var mod = {};

mod.create_socket = function(params) {
  return new net.Socket();
};

// Takes a socket and a hash of callback functions with the events as keys
// e.g. {'message': message_callback}
mod.on_data = function(socket, callbacks_obj) {
  for (var event_key in callbacks_obj) {
    socket.on(event_key, callbacks_obj[event_key]);
  }
};

mod.connect_socket = function(socket, port, host, callback) {
  socket.connect(port, host, function(){
    if (utils.is_param_defined(callback)) callback();
  });
};


mod.create_server = function(port, callback) {
  net.createServer(callback).listen(port);
};

module.exports = mod;
