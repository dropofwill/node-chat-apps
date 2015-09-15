var constants = require('./constants'),
    protocol = require('./udp'),
    utils = require('./utils'),

    broadcast_address = require('./broadcast-address').broadcast_address,
    parse_broadcast_address = require('./broadcast-address').parse_broadcast_address,
    rl = require('readline');

// Let's you either input a specific address to broadcast with env vars, e.g.:
//   $ ADDRESS=127.255.255.255 npm run server
// Or let's you say whether you would like to run internally on the loopback or
// on the LAN. It uses netmask to calculate the appropriate address:
//   $ LOOPBACK=false npm run server
// Else it defaults to just working on your internal loopback since that
// /should/ always work.
var BROADCAST_ADDRESS = utils.get_env_var('ADDRESS') ||
                        utils.get_env_var('LOOPBACK', parse_broadcast_address) ||
                        broadcast_address(),

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
  console.log(msg.output);
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
    send_data(generate_msg_json(nick_input, 'register'));

    take_general_input();
  });
};

var take_general_input = function() {
  client_rl.question("", function(input) {
    var input_type = parse_input_type(input);

    client_rl.pause();

    send_data(generate_msg_json(input, input_type));

    take_general_input();
  });
};

// Create a JSON object ready to be sent to the server
var generate_msg_json = function(input, input_type) {
  var msg = {'nick': nick, 'command': input_type, 'input': input};
  msg.output = format_data(msg);
  return JSON.stringify(msg);
};

// Simple regex matching to figure out what command the user entered
var parse_input_type = function(input) {
  var ME_REGEX = /^\/me/gi,
      SWITCH_REGEX = /^\/switch/gi,
      ROLLS_REGEX = /^\/rolls/gi;

  if (ME_REGEX.test(input)) {
    return 'me';
  }
  else if (ROLLS_REGEX.test(input)) {
    return 'rolls';
  }
  else if (SWITCH_REGEX.test(input)) {
    return 'switch';
  }
  else {
    return 'message';
  }
};

// Determine which output formatter to use based on input type 'command'
var format_data = function(msg) {
  switch (msg.command) {
    case 'register':
      return format_nick(msg);
    case 'me':
      return format_me(msg);
    case 'rolls':
      return format_rolls(msg);
    case 'switch':
      return format_switch(msg);
    default:
      return format_message(msg);
  }
};

// Functions to parse input into output strings

var format_message = function(msg) {
  return msg.nick + '> ' + msg.input;
};

var format_nick = function(msg) {
  return 'User ' + msg.nick + ' just regesitered';
};

var format_me = function(msg) {
  return msg.nick + ' ' + utils.remove_command_str(msg.input);
};

var format_rolls = function(msg) {
  var sides = utils.chomp(utils.remove_command_str(msg.input)),
      rolled;

  sides = utils.int_try_parse(sides) || 6;
  rolled = utils.random_int(sides);

  return msg.nick + ' rolled a D' + sides + ' and got a ' + rolled;
};

var format_switch = function(msg) {
  nick = utils.chomp(utils.remove_command_str(msg.input));

  return msg.nick + ' is now known as ' + nick;
};

start();
