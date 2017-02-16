/*
 * Technology Utility
 *
 * Copyright(c) 2012-2013 Fred Chien <fred@mandice.com>
 *
 */

var path = require('path');
var async = require('async');

var Technology = module.exports = function(connman, name, type) {
	var self = this;

	self.name = name;
	self.type = type;
	self.objectPath = path.join('/', 'net', 'connman', 'technology', self.type);
	self.connman = connman;
	self.iface = null;
};

Technology.prototype.init = function(callback) {
	var self = this;

	// Getting interfaces
	self.connman.systemBus.getInterface('net.connman', self.objectPath, 'net.connman.Technology', function(err, iface) {

		self.iface = iface;

		callback(null);
	});
};

Technology.prototype.getProperties = function(callback) {
	var self = this;
	var iface = self.iface;

	if (!iface) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Technology device was found'));
			});

		return;
	}

	iface.GetProperties['timeout'] = 10000;
	if (callback) {
		iface.GetProperties['error'] = callback;
		iface.GetProperties['finish'] = function(props) { callback(null, props); };
	}
	iface.GetProperties();
};

Technology.prototype.setProperty = function(prop, value, callback) {
	var self = this;
	var iface = self.iface;

	if (!iface) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Technology device was found'));
			});

		return;
	}

	iface.SetProperty['timeout'] = 10000;
	iface.SetProperty['error'] = callback || null;
	iface.SetProperty['finish'] = callback || null;
	iface.SetProperty(prop, value);
};

Technology.prototype.getServices = function(callback) {
	var self = this;

	if (!callback)
		return;

	self.connman.getServices(self.type, callback);
};

Technology.prototype.scan = function(callback) {
	var self = this;
	var iface = self.iface;

	if (!iface) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
	}

	iface.Scan['timeout'] = 30000;
	iface.Scan['error'] = callback || null;
	iface.Scan['finish'] = callback || null;
	iface.Scan();
};

Technology.prototype.listAccessPoints = function(callback) {
	var self = this;

	if (!self.iface) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
	}

	self.connman.getServices(self.type, function(err, services) {
		var list = [];

		for (var serviceName in services) {
			var service = services[serviceName];

			service.serviceName = serviceName;
			list.push(service);
		}

		callback(null, list);
	});
};

Technology.prototype.findAccessPoint = function() {
	var self = this;

	var ssid = null;
	var inet = null;
	var callback = null;
	if (arguments.length == 1) {
		callback = arguments[0];
	} else if (arguments.length == 2) {
		ssid = arguments[0];
		callback = arguments[1];
	} else {
		ssid = arguments[0];
		inet = arguments[1];
		callback = arguments[2];
	}

	if (!self.iface || !ssid) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
	}

	self.connman.getServices(self.type, function(err, services) {

		for (var serviceName in services) {
			var service = services[serviceName];

			// Check interface name if it was set
			if (inet) {
				if (service.Ethernet.Interface != inet) {
					continue;
				}
			}

			// Check ESSID
			if (service.Name == ssid) {
				service.serviceName = serviceName;

				callback(null, service);

				return;
			}
		}

		callback(null, null);
	});
};

Technology.prototype.enableTethering = function(ssid, passphrase, callback) {
	var self = this;

	if (!self.iface) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
	}

	async.series([
		function(next) {
			self.setProperty('TetheringIdentifier', ssid, function(err, res) {
				if (!err) {
					next();
				} else {
					if (callback)
						callback(err);
					next(false);
					return;
				}
			});
		}
		,
		function(next) {
			self.setProperty('TetheringPassphrase', passphrase, function(err, res) {
				if (!err) {
					next();
				} else {
					if (callback)
						callback(err);
					next(false);
					return;
				}
			});
		}
	],
	function() {
		self.setProperty('Tethering', true, function(err, res) {
			callback(err,res);
		});
	}
	);

};

Technology.prototype.disableTethering = function(callback) {
	var self = this;

	if (!self.iface) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
	}

	self.setProperty('Tethering', false, function(err, res) {
		callback(err,res);
	});
};
