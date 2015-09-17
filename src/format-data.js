var utils = require('./utils');

var mod = {};

// Create a JSON object ready to be sent to the server
mod.generate_msg_json = function(socket, input, input_type) {
  var msg = {'nick': socket.nick, 'command': input_type, 'input': input};
  msg.output = mod.format_data(socket, msg);
  return JSON.stringify(msg);
};

// Determine which output formatter to use based on input type 'command'
mod.format_data = function(socket, msg) {
  switch (msg.command) {
    case 'register':
      return mod.format_nick(msg);
    case 'me':
      return mod.format_me(msg);
    case 'rolls':
      return mod.format_rolls(msg);
    case 'switch':
      return mod.format_switch(msg, socket);
    default:
      return mod.format_message(msg);
  }
};

// Functions to parse input into output strings

mod.format_message = function(msg) {
  return msg.nick + '> ' + msg.input;
};

mod.format_nick = function(msg) {
  return 'User ' + msg.nick + ' just regesitered';
};

mod.format_me = function(msg) {
  return msg.nick + ' ' + utils.remove_command_str(msg.input);
};

mod.format_rolls = function(msg) {
  var sides = utils.chomp(utils.remove_command_str(msg.input)),
      rolled;

  sides = utils.int_try_parse(sides) || 6;
  rolled = utils.random_int(sides);

  return msg.nick + ' rolled a D' + sides + ' and got a ' + rolled;
};

mod.format_switch = function(msg, socket) {
  console.log(msg.input);
  socket.nick = utils.chomp(utils.remove_command_str(msg.input));

  return msg.nick + ' is now known as ' + socket.nick;
};

module.exports = mod;
