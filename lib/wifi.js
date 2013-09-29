"use strict";

var util = require('util');
var events = require('events');

var Wifi = module.exports = function(connman) {
	var self = this;

	self.connman = connman;
	self.service = null;
	self.technology = null;
};

util.inherits(Wifi, events.EventEmitter);

Wifi.prototype.init = function(callback) {
	var self = this;

	/* Create connection for Wifi Technology */
	self.connman.Technology.find('wifi', function(err, iface) {
		if (!iface) {

			if (callback)
				callback();

			return;
		}

		self.technology = iface;

		// Find out current service we're using
		self.connman.getServices(function(err, services) {
			if (err) {

				if (callback)
					callback();

				return;
			}

			for (var objectPath in services) {
				var service = services[objectPath];
				if (service.Type != 'wifi')
					continue;

				if (service.State == 'online' || service.State == 'ready') {
					self.selectService(objectPath);
					break;
				}
			}

			if (callback)
				callback();
		});
	});
};

Wifi.prototype.getProperties = function(callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});
	}

	self.technology.GetProperties['timeout'] = 10000;
	self.technology.GetProperties['finish'] = function(props) {
		if (callback)
			callback(null, props);
	};
	self.technology.GetProperties();
};

Wifi.prototype.setProperty = function(prop, value, callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});
	}

	self.technology.SetProperty['timeout'] = 10000;
	self.technology.SetProperty['finish'] = function() {
		if (callback)
			callback(null);
	};
	self.technology.SetProperty(prop, value);
};

Wifi.prototype.geServiceProperties = function(callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});
	}

	if (!self.service) {
		if (callback)
			process.nextTick(function() {
				callback(null, {});
			});
	}

	self.service.GetProperties['timeout'] = 10000;
	self.service.GetProperties['finish'] = function(props) {
		if (callback)
			callback(null, props);
	};
	self.service.GetProperties();
};

Wifi.prototype.setServiceProperty = function(prop, value, callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});
	}

	if (!self.service) {
		if (callback)
			process.nextTick(function() {
				callback(null);
			});
	}

	self.service.SetProperty['timeout'] = 10000;
	self.service.SetProperty['finish'] = function() {
		if (callback)
			callback(null);
	};
	self.service.SetProperty(prop, value);
};

Wifi.prototype.scan = function(callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});
	}

	self.technology.Scan['timeout'] = 30000;
	self.technology.Scan['finish'] = function() {
		if (callback)
			callback();
	};
	self.technology.Scan();
};

Wifi.prototype.listAccessPoints = function(callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});
	}

	self.connman.getServices(function(err, services) {
		var list = [];

		for (var objectPath in services) {
			var service = services[objectPath];
			if (service.Type != 'wifi')
				continue;

			service.ObjectPath = objectPath;
			list.push(service);
		}

		callback(null, list);
	});
};

Wifi.prototype.findAccessPoint = function(ssid, callback) {
	var self = this;

	if (!self.technology || !ssid) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});
	}

	self.connman.getServices(function(err, services) {

		for (var objectPath in services) {
			var service = services[objectPath];
			if (service.Type != 'wifi')
				continue;

			if (service.Name == ssid) {
				service.ObjectPath = objectPath;
				callback(null, service);
				return;
			}
		}

		callback(null, null);
	});
};

Wifi.prototype.connect = function(ssid, callback) {
	var self = this;

	if (!self.technology || !ssid) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});
	}

	self.findAccessPoint(ssid, function(err, service) {
		if (!service) {
			callback(new Error('No such access point'));
			return;
		}

		self.selectService(service.ObjectPath, function(err, iface) {
			if (err) {
				callback(new Error('No such access point'));
				return;
			}

			// Connect to this access point
			iface.Connect['timeout'] = 30000;
			iface.Connect();

			// Return agent for this connection
			callback(null, self.connman.Agent);
		});
	});
};

Wifi.prototype.disconnect = function(callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});
	}

	if (!self.service) {
		if (callback)
			process.nextTick(function() {
				callback(null);
			});
	}

	self.service.Disconnect['finish'] = function() {
		if (callback)
			callback(null);
	};
	self.service.Disconnect();

};

Wifi.prototype.selectService = function(objectPath, callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});
	}

	self.connman.systemBus.getInterface('net.connman', objectPath, 'net.connman.Service', function(err, iface) {
		if (err) {
			callback(new Error('No such service'));
			return;
		}

		// Release current service we used
		if (self.service)
			self.service.removeAllListeners('PropertyChanged');

		// Set new service
		self.service = iface;

		// Initializing signal handler for this new service
		iface.on('PropertyChanged', function(name, value) {
			self.emit('PropertyChanged', name, value);
		});

		if (callback)
			callback(null, iface);
	});
};
