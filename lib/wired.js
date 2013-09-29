"use strict";

var util = require('util');
var events = require('events');

var Wired = module.exports = function(connman) {
	var self = this;

	self.connman = connman;
	self.service = null;
	self.technology = null;
};

util.inherits(Wired, events.EventEmitter);

Wired.prototype.init = function(callback) {
	var self = this;

	/* Create connection for ethernet Technology */
	self.connman.Technology.find('ethernet', function(err, iface) {
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
				if (service.Type != 'ethernet')
					continue;

				self.selectService(objectPath);
				break;
			}

			if (callback)
				callback();
		});
	});
};

Wired.prototype.getProperties = function(callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No wired interface was found'));
			});
	}

	self.technology.GetProperties['timeout'] = 10000;
	self.technology.GetProperties['finish'] = function(props) {
		if (callback)
			callback(null, props);
	};
	self.technology.GetProperties();
};

Wired.prototype.setProperty = function(prop, value, callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No wired interface was found'));
			});
	}

	self.technology.SetProperty['timeout'] = 10000;
	self.technology.SetProperty['finish'] = function() {
		if (callback)
			callback(null);
	};
	self.technology.SetProperty(prop, value);
};

Wired.prototype.geServiceProperties = function(callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No wired interface was found'));
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

Wired.prototype.setServiceProperty = function(prop, value, callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No wired interface was found'));
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

Wired.prototype.connect = function(callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No wired interface was found'));
			});
	}

	if (!self.service) {
		if (callback)
			process.nextTick(function() {
				callback(null);
			});
	}

	// Connect to this access point
	self.service.Connect['timeout'] = 30000;
	self.service.Connect['finish'] = function() {
		callback(null);
	};
	self.service.Connect();

};

Wired.prototype.disconnect = function(callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No wired interface was found'));
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

Wired.prototype.selectService = function(objectPath, callback) {
	var self = this;

	if (!self.technology) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No wired interface was found'));
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
