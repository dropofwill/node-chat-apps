var constants = require('./constants'),
    protocol = require('./tcp'),
    format = require('./format-data'),
    utils = require('./utils'),

    rl = require('readline');

var PORT = constants.PORT,
    HOST = constants.HOST;

var socket = protocol.create_socket(),

    client_rl = utils.create_rl();

// The client starts up in a state in which the nick is needed,
// we can then derive the state of the application by this variable
socket.nick = null;

var start = function() {
  protocol.on_data(socket, { 'data': data_cb, 'close': close_cb });

  protocol.connect_socket(socket, PORT, HOST, client_message_cb);
};

var data_cb = function(data) {
  var msg = JSON.parse(data);

  client_rl.pause();
  // console.log(msg);
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
    socket.write(format.generate_msg_json(socket, nick_input, 'register'));

    take_general_input();
  });
};

var take_general_input = function() {
  client_rl.question("", function(input) {
    var input_type = parse_input_type(input);

    client_rl.pause();

    socket.write(format.generate_msg_json(socket, input, input_type));

    take_general_input();
  });
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

start();
