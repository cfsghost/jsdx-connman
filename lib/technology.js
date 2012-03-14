/*
 * Technology Utility
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

var dbus = require('node-dbus');

module.exports = function(connman) {
	var self = this;

	/* Create connection for Wired Technology */
	this.Find = function(type) {
		var technologies = connman.manager.GetTechnologies();

		for (var index in technologies) {
			var technology = dbus.get_interface(connman.systemBus, 'net.connman', technologies[index][0], 'net.connman.Technology');
				
			if (technology.GetProperties().Type == type) {
				return technology;
			}
		}

		return null;
	}
};
