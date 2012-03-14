/*
 * Wifi Support
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

var dbus = require('node-dbus');

module.exports = function(connman) {
	self = this;

	/* Create connection for Wifi Technology */
	this.technology = null;
	var technologies = connman.manager.GetProperties().Technologies;
	for (var index in technologies) {
		self.technology = dbus.get_interface(connman.systemBus, 'net.connman', technologies[index], 'net.connman.Technology');
			
		if (self.technology.GetProperties().Type == 'wifi') {
			break;
		}

		self.technology = null;
	}

	this.ListAPs = function(callback) {
		process.nextTick(function() {
			var origList = connman.manager.GetServices();
			var list = [];

			/* We only get services of wifi */
			for (var index in origList) {
				if (origList[index][1].Type != 'wifi')
					continue;

				origList[index][1].dbusObject = origList[index][0];

				list.push(origList[index][1]);
			}

			delete origList;

			callback(list);
		});
	};

	this.RequestScan = function() {
		connman.manager.RequestScan('wifi');
	};

	/* Properties */
	this.__defineGetter__('State', function() {
		return self.technology.GetProperties().State;
	});
};
