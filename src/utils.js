var _ = require('lodash'),
    constants = require('./constants'),

    readline = require('readline');

var utils = {};

// Overrides user input with a given default parameter if the input is either
// null or undefined.
utils.default_param = function(input_param, default_param) {
  if (input_param === undefined || input_param === null) {
    return default_param;
  }
  else {
    return input_param;
  }
};

utils.prep_input = function(buf) {
  return utils.chomp(buf.toString());
};

utils.chomp = function(str) {
  return str.replace(/\s+$/g, '');
};

utils.json_try_parse = function(str) {
  try {
    return JSON.parse(str);
  }
  catch (e) {
    return false;
  }
};

utils.format_user_input = function(data) {
  json_data = JSON.parse(data);
  return json_data.user + ": " + json_data.input;
};

utils.delay_exit = function(time) {
  return _.debounce(process.exit.bind(void 0, 0), time)();
};

utils.setup_graceful_shutdown = function(send_data_fn, server_msg, client_msg) {
  server_msg = utils.default_param(server_msg, 'Shutting down');
  client_msg = utils.default_param(client_msg, 'Uh-oh, server down.');

  constants.EXIT_SIGNALS.forEach(function(element) {
    process.on(element, function() {
      process.stdout.write("\n" + server_msg + "\n");
      send_data_fn(new Buffer(client_msg));

      utils.delay_exit(1);
    });
  });
};

module.exports = utils;
