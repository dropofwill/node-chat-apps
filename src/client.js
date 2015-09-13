var constants = require('./constants'),
    protocol = require('./udp'),
    utils = require('./utils'),

    rl = require('readline');

var BROADCAST_ADDRESS = protocol.query_broadcast_address(),
    CLIENT_PORT = constants.CLIENT_PORT,
    SERVER_PORT = constants.SERVER_PORT;

var server_socket = protocol.create_socket(),
    client_socket = protocol.create_socket(),

    // Create a send data function for this combination of socket,
    // port, and address
    send_data = protocol.send_data_factory(client_socket, CLIENT_PORT, BROADCAST_ADDRESS),

    client_rl = utils.create_rl(),

    // The client starts up in a state in which the nick is needed,
    // we can then derive the state of the application by this variable
    nick = null;

var server_message_cb = function(data, remote_info) {
  var msg = JSON.parse(data);

  // client_rl.pause();
  console.log(msg.nick + ': ' + msg.input + '\n');
	// console.log(': ' + data.toString());
};

var register_nick = function() {

  client_rl.question("Enter your desired nick: ", function(nick_input) {
    client_rl.pause();

    nick = nick_input;

    send_data(JSON.stringify({'nick': nick, 'command': 'register', 'input': nick}));

    take_general_input();
  });
};

var take_general_input = function() {

  client_rl.question("> ", function(input) {
    client_rl.pause();

    send_data(JSON.stringify({'nick': nick, 'command': 'message', 'input': input}));

    take_general_input();
  });
};


var client_message_cb = function(data, remote_info) {
  if (nick === null) {
    register_nick();
  }
  else {
    take_general_input();
  }
};

var start = function() {
  protocol.on_data(server_socket, {'message': server_message_cb});

  protocol.bind_socket(server_socket, SERVER_PORT);

  protocol.bind_socket(client_socket, CLIENT_PORT, true, client_message_cb);
};
