var utils = require('./utils');

var Netmask = require('netmask').Netmask,
    os = require('os'),
    _ = require('lodash');

// Just adding a chainable nth function to lodash
_.mixin({
  nth: function(array, index) {
    if (index !== null) return array[index];
  }
});

nth_non_internal_net_iface = function(nth, is_internal) {
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
broadcast_address = function() {
  var iface = nth_non_internal_net_iface(0, true);
  console.log(new Netmask(iface.address, iface.netmask).broadcast);
  return new Netmask(iface.address, iface.netmask).broadcast;
};

module.exports = broadcast_address;
