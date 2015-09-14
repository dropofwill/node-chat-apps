var constants = require('./constants'),
    protocol = require('./udp'),
    utils = require('./utils'),

    broadcast_address = require('./broadcast-address'),
    rl = require('readline');

var BROADCAST_ADDRESS = utils.get_env_var('ADDRESS') || broadcast_address(),
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

var start = function() {
  protocol.on_data(server_socket, {'message': server_message_cb});

  protocol.bind_socket(server_socket, SERVER_PORT);

  protocol.bind_socket(client_socket, CLIENT_PORT, true, client_message_cb);
};

var server_message_cb = function(data, remote_info) {
  var msg = JSON.parse(data);

  client_rl.pause();

  console.log(format_data(msg));

  client_rl.resume();
};

var client_message_cb = function(data, remote_info) {
  if (nick === null) {
    register_nick();
  }
  else {
    take_general_input();
  }
};

var register_nick = function() {

  client_rl.question("Enter your nick:\n", function(nick_input) {
    client_rl.pause();

    nick = nick_input;

    send_data(JSON.stringify({'nick': nick, 'command': 'register', 'input': nick}));

    take_general_input();
  });
};

var take_general_input = function() {

  client_rl.question("", function(input) {
    var input_type = parse_input_type(input);

    client_rl.pause();

    send_data(JSON.stringify({'nick': nick, 'command': input_type, 'input': input}));

    take_general_input();
  });
};

var parse_input_type = function(input) {
  var ME_REGEX = /^\/me/gi,
      QUIT_REGEX = /^\/quit/gi;

  if (ME_REGEX.test(input)) {
    return 'me';
  }
  else if (QUIT_REGEX.test(input)) {
    return 'quit';
  }
  else {
    return 'message';
  }
};

var format_data = function(msg) {
  switch (msg.command) {
    case 'register':
      return format_nick(msg);
    case 'me':
      return format_me(msg);
    case 'quit':
      return format_quit(msg);
    default:
      return format_message(msg);
  }
};

var format_message = function(msg) {
  return msg.nick + '> ' + msg.input + '\n';
};

var format_nick = function(msg) {
  return 'User ' + msg.nick + ' just regesitered\n';
};

var format_me = function(msg) {
  return msg.nick + ' ' + utils.remove_command_str(msg.input) + '\n';
};

start();
