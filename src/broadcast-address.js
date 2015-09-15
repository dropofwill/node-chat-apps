var utils = require('./utils');

var Netmask = require('netmask').Netmask,
    os = require('os'),
    _ = require('lodash');

var ba = {};

// Just adding a chainable nth function to lodash
_.mixin({
  nth: function(array, index) {
    if (index !== null) return array[index];
  }
});

var nth_non_internal_net_iface = function(nth, is_internal) {
  // Defaults to the first IPv4 interface
  nth = utils.default_param(nth, 0);

  // Defaults to external-only iface
  is_internal = utils.default_param(is_internal, false);

  return _.chain(os.networkInterfaces())
    .values()
    .flatten()
    .where({family: 'IPv4', internal: is_internal})
    .nth(nth)
    .value();
};

// Use Netmask to calculate the broadcast address using the ip and netmask
ba.broadcast_address = function(is_internal) {
  // Defaults to internal-only iface
  is_internal = utils.default_param(is_internal, true);

  var iface = nth_non_internal_net_iface(0, is_internal);
  console.log('Listening on: ' + new Netmask(iface.address, iface.netmask).broadcast + '\n');

  return new Netmask(iface.address, iface.netmask).broadcast;
};

ba.parse_broadcast_address = function(loopback) {
  var is_internal = (loopback === 'true');

  return ba.broadcast_address(is_internal);
};

module.exports = ba;
