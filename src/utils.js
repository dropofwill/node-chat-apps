var _ = require('lodash'),
    constants = require('./constants'),

    rl = require('readline');

var utils = {};

// Shortcut for accessing environment, optional callback with given var
// returns undefined if nothing is found and callback is not fired
utils.get_env_var = function(env_var_key, callback) {
  var env_var = process.env[env_var_key];
  console.log(env_var_key, env_var);

  if (utils.is_param_defined(process.env[env_var])) {
    if (utils.is_param_defined(callback)) {
      return callback(env_var);
    }
    else {
      return env_var;
    }
  }
  else {
    return undefined;
  }
};

utils.create_rl = function(params) {
  params = utils.default_param(params, {input: process.stdin, output: process.stdout});

  return rl.createInterface(params);
};

utils.is_param_defined = function(param) {
  if (param === undefined || param === null) {
    return false;
  }
  else {
    return true;
  }
};

// Overrides user input with a given default parameter if the input is either
// null or undefined.
utils.default_param = function(input_param, default_param) {
  if (utils.is_param_defined(input_param)) {
    return input_param;
  }
  else {
    return default_param;
  }
};

utils.prep_input = function(buf) {
  return utils.chomp(buf.toString());
};

utils.chomp = function(str) {
  return str.replace(/\s+$/g, '');
};

utils.remove_command_str = function(str) {
  return str.replace(/^\/[A-z]+\s+/, '');
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
