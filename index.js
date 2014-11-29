var gitignoreensure = require('gitignoreensure');
var Plugin = require('microsvc').Plugin;
var servicebus = require('servicebus');
var util = require('util');

function BusPlugin (name, bus) {
  this.bus = bus;
  this.name = name;
  Plugin.call(this);
}

util.inherits(BusPlugin, Plugin);

BusPlugin.prototype._start = function _start (service) {
  var self = this;
  if (this.name) {
    service.buses = service.buses || {};
    service.buses[name] = this.bus;
  } else {
    service.bus = this.bus;
  }
  gitignoreensure.once('done', function () {
    self.done();
  });
  gitignoreensure.ensure('.queues*');
};

module.exports = function (options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = null;
  }
  var bus = options.name ? servicebus.namedBus(options.name, options) : servicebus.bus(options);
  fn(bus);
  return new BusPlugin(options.name, bus);
};