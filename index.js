/*
 * JSDX Connection Manager API
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

var dbus = require('node-dbus');
var Wifi = require('./lib/wifi');

module.exports = function() {
	var self = this;

	this.init = function(callback) {
		dbus.start(function() {
			self.systemBus = dbus.system_bus();
			self.manager = dbus.get_interface(self.systemBus, 'net.connman', '/', 'net.connman.Manager');
//			self.agent = dbus.get_interface(self.systemBus, 'net.connman', '/net/connman/agent', 'net.connman.Agent');

			/* Modules */
			self.Wifi = new Wifi(self);

			console.log(self.manager.GetProperties());
//			console.log(self.manager);

			callback();
		});
	};

	this.__defineGetter__('State', function() {
		return self.manager.GetProperties().State;
	});

	this.__defineGetter__('OfflineMode', function() {
		return self.manager.GetProperties().OfflineMode;
	});

	this.__defineSetter__('OfflineMode', function(value) {
		return self.manager.SetProperty('OfflineMode', value);
	});

	/* Methods */
	this.GetServices = function() {
		return self.manager.GetServices();
	};
};
