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

Wifi.prototype.init = function(serviceName, callback) {
	var self = this;

	self.technology = self.connman.technologies['wifi'];
		
	self.selectService(serviceName, function(err) {

		if (callback)
			callback(err);
	});

};

Wifi.prototype.getProperties = function(callback) {
	var self = this;

	if (!self.service) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
	}

	self.service.GetProperties['timeout'] = 10000;
	self.service.GetProperties['finish'] = function(props) {
		if (callback)
			callback(null, props);
	};
	self.service.GetProperties();
};

Wifi.prototype.setProperty = function(prop, value, callback) {
	var self = this;

	if (!self.service) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
	}

	self.service.SetProperty['timeout'] = 10000;
	self.service.SetProperty['finish'] = function() {
		if (callback)
			callback(null);
	};
	self.service.SetProperty(prop, value);
};

Wifi.prototype.connect = function() {
	var self = this;

	var ssid = null;
	var callback = null;
	if (arguments.length == 1) {
		callback = arguments[0];
	} else {
		ssid = arguments[0];
		callback = arguments[1];
	}

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
	}

	var objectPath = null;
	async.series([

		function(next) {

			// Connect with access point which is set already
			if (!ssid) {
				next(true);
				return;
			}

			next();
		},
		function(next) {

			self.findAccessPoint(ssid, function(err, service) {
				if (!service) {
					callback(new Error('No such access point'));
					next(false);
					return;
				}

				// Getting object path of this access point
				objectPath = service.ObjectPath;

				next();
			});
		},
		function(next) {

			self.selectService(objectPath, function(err, iface) {
				if (err) {
					callback(new Error('No such access point'));
					next(false);
					return;
				}

				next(true);
			});
		}

	], function(connectable) {

		if (!connectable)
			return;

		// No need to connect
		if (!self.service) {
			callback(null);
			return;
		}

		// Establish connection
		self.service.Connect['timeout'] = 30000;
		self.service.Connect();

		// Return agent for this connection
		callback(null, self.connman.Agent);
	});
};

Wifi.prototype.disconnect = function(callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
	}

	if (!self.service) {
		if (callback)
			process.nextTick(function() {
				callback(null);
			});

		return;
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

		return;
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
