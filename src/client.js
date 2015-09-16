var constants = require('./constants'),
    protocol = require('./tcp'),
    utils = require('./utils'),

    rl = require('readline');

    PORT = constants.PORT,
    HOST = constants.HOST;

var socket = protocol.create_socket(),

    client_rl = utils.create_rl(),

    // The client starts up in a state in which the nick is needed,
    // we can then derive the state of the application by this variable
    socket.nick = null;

var start = function() {
  protocol.on_data(socket,
      { 'data':  data_cb
        'close': close_cb });

  protocol.connect_socket(socket, CLIENT_PORT, HOST, client_message_cb });
};

var data_cb = function(data) {
  var msg = JSON.parse(data);

  client_rl.pause();
  console.log(msg.output);
  client_rl.resume();
};

var close_cb = function(data) {
  client_rl.pause();
  console.log('Leaving...');
};

var client_message_cb = function(data, remote_info) {
  if (socket.nick === null) {
    register_nick();
  }
  else {
    take_general_input();
  }
};

var register_nick = function() {
  client_rl.question("Enter your nick:\n", function(nick_input) {
    client_rl.pause();

    socket.nick = nick_input;
    socket.write(generate_msg_json(nick_input, 'register'));

    take_general_input();
  });
};

var take_general_input = function() {
  client_rl.question("", function(input) {
    var input_type = parse_input_type(input);

    client_rl.pause();

    socket.write(generate_msg_json(input, input_type));

    take_general_input();
  });
};

// Create a JSON object ready to be sent to the server
var generate_msg_json = function(input, input_type) {
  var msg = {'nick': socket.nick, 'command': input_type, 'input': input};
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
  socket.nick = utils.chomp(utils.remove_command_str(msg.input));

  return msg.nick + ' is now known as ' + socket.nick;
};

start();
