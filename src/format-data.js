var utils = require('./utils');

var self = {};

// Create a JSON object ready to be sent to the server
self.generate_msg_json = function(input, input_type) {
  var msg = {'nick': socket.nick, 'command': input_type, 'input': input};
  msg.output = self(msg);
  return JSON.stringify(msg);
};

// Determine which output formatter to use based on input type 'command'
self.format_data = function(msg) {
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

self.format_message = function(msg) {
  return msg.nick + '> ' + msg.input;
};

self.format_nick = function(msg) {
  return 'User ' + msg.nick + ' just regesitered';
};

self.format_me = function(msg) {
  return msg.nick + ' ' + utils.remove_command_str(msg.input);
};

self.format_rolls = function(msg) {
  var sides = utils.chomp(utils.remove_command_str(msg.input)),
      rolled;

  sides = utils.int_try_parse(sides) || 6;
  rolled = utils.random_int(sides);

  return msg.nick + ' rolled a D' + sides + ' and got a ' + rolled;
};

self.format_switch = function(msg) {
  socket.nick = utils.chomp(utils.remove_command_str(msg.input));

  return msg.nick + ' is now known as ' + socket.nick;
};

module.exports = self;
