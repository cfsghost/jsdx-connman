/*
 * Wired Support
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

var dbus = require('node-dbus');

module.exports = function(connman) {
	var self = this;

	/* Create connection for Wired Technology */
	this.technology = null;
	var technologies = connman.manager.GetTechnologies();
	for (var index in technologies) {
		self.technology = dbus.get_interface(connman.systemBus, 'net.connman', technologies[index][0], 'net.connman.Technology');
			
		if (self.technology.GetProperties().Type == 'ethernet') {
			break;
		}

		self.technology = null;
	}

	/* Properties */
	this.__defineGetter__('Connected', function() {
		return self.technology.GetProperties().Connected;
	});

	this.__defineGetter__('Powered', function() {
		return self.technology.GetProperties().Powered;
	});

	this.__defineSetter__('Powered', function(value) {
		self.technology.SetProperty('Powered', value);
	});

	this.__defineGetter__('Tethering', function() {
		return self.technology.GetProperties().Tethering;
	});

	this.__defineSetter__('Tethering', function(value) {
		self.technology.SetProperty('Tethering', value);
	});
};
