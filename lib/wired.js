/*
 * Wired Support
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

module.exports = function(connman) {
	var self = this;
	var dbus = connman.dbus;

	/* Create connection for Wired Technology */
	this.technology = connman.Technology.Find('ethernet');

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
