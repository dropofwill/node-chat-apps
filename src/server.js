var constants = require('./constants'),
    protocol = require('./tcp'),
    utils = require('./utils');

    PORT = constants.PORT,
    HOST = constants.HOST,

    clients = [];

var start = function() {
  protocol.on_data(socket,
      { 'data':  data_cb,
        'error': error_cb,
        'end':   end_cb,
        'close': close_cb });

  protocol.bind_socket(socket, CLIENT_PORT, true);
};

var send_data = function(data) {
  clients.forEach(function(client) {
    client.write(data);
  });
}

var data_cb = function(data) {
  send_data(data);
};

start();
