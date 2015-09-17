var constants = require('./constants'),
    protocol = require('./tcp'),
    format = require('./format-data'),
    utils = require('./utils');

var PORT = constants.PORT,
    HOST = constants.HOST,

    clients = [];

var init_client = function(socket) {
  clients.push(socket);

  protocol.on_data(socket,
      { 'data':  data_cb_factory(socket),
        'error': error_cb_factory(socket),
        'end':   end_cb_factory(socket),
        'close': close_cb_factory(socket) });
};

var start = function() {
  protocol.create_server(PORT, init_client);
};

var send_data = function(data) {
  clients.forEach(function(client) {
    client.write(data);
  });
};

var data_cb_factory = function(socket) {
  return function(data) {
    send_data(data);
  };
};

var error_cb_factory = function(socket) {
  return function(data) {
    socket.destroy();
  };
};

var end_cb_factory = function(socket) {
  return function(data) {
    socket.write('Good-bye');
  };
};

var close_cb_factory = function(socket) {
  return function(data) {
    clients = clients.filter(function(c) { return c !== socket; });
    send_data('User left');
  };
};

start();
