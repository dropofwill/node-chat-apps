var _ = require('lodash'),
    constants = require('./constants'),

    rl = require('readline');

var utils = {};

// Shortcut for accessing environment, optional callback with given var
// returns undefined if nothing is found and callback is not fired
utils.get_env_var = function(env_var_key, callback) {
  var env_var = process.env[env_var_key];
  console.log(env_var_key, env_var);

  if (utils.is_param_defined(process.env[env_var_key])) {
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

// Shortcut for creating a readline interface
utils.create_rl = function(params) {
  params = utils.default_param(params, {input: process.stdin, output: process.stdout});

  return rl.createInterface(params);
};

// Shortcut for making default arguments in JS
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

// Get rid of whitespace at end of string
utils.chomp = function(str) {
  return str.replace(/\s+$/g, '');
};

// Remove and /sfdskfjsd  'commands' from a given string
utils.remove_command_str = function(str) {
  return str.replace(/^\/[A-z]+\s+/, '');
};

// Try to parse a string to an int, else return false
// FUN FACT: typeof NaN === 'number'
utils.int_try_parse = function(str) {
  var parse = parseInt(str);

  if (typeof parse === 'number' && parse !== NaN) {
    return parse;
  }
  else {
    return false;
  }
};

// Try to parse JSON, return false if we get an error
utils.json_try_parse = function(str) {
  try {
    return JSON.parse(str);
  }
  catch (e) {
    return false;
  }
};

// Get a random int between 1 and max
utils.random_int = function(max) {
  return Math.ceil(Math.random() * max);
}

module.exports = utils;
