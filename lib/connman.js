"usr strict";

var util = require('util');
var events = require('events');
var async = require('async');
var DBus = require('dbus');
var Agent = require('./agent');
var Technology = require('./technology');
var Wired = require('./wired');
var Wifi = require('./wifi');
var Bluetooth = require('./bluetooth');

var dbus = new DBus();

var ConnMan = module.exports = function() {
	var self = this;

	self.dbus = dbus;
	self.systemBus = dbus.getBus('system');
	self.manager = null;
	self.connections = {};
	self.technologies = {};
};

util.inherits(ConnMan, events.EventEmitter);

ConnMan.prototype.init = function(callback) {
	var self = this;

	// Getting Connection Manager DBus Interface
	self.systemBus.getInterface('net.connman', '/', 'net.connman.Manager', function(err, iface) {
		if (err)
			return new Error('Cannot connect to connection manager.');

		self.manager = iface;
		// Initializing signal handler for this service
		iface.on('PropertyChanged', function(name, value) {
			self.emit('PropertyChanged', name, value);
		});

		// Update technologies
		self.getTechnologies(function() {

			// Initializing agent
			self.Agent = new Agent(self);
			self.Agent.init(function() {

				if (callback)
					callback();
			});
		});
	});

};

ConnMan.prototype.getConnection = function(serviceName, callback) {
	var self = this;

	if (self.connections[serviceName]) {
		process.nextTick(function() {
			callback(null, self.connections[serviceName]);
		});
		return;
	}

	// Find out current service we're using
	self.getServices(function(err, services) {

		if (!services[serviceName]) {
			callback(new Error('No such service'));
			return;
		}

		var service = services[serviceName];
		var conn = null;

		switch(service.Type) {
		case 'ethernet':

			conn = new Wired(self);
			conn.init(serviceName, function() {
				self.connections[serviceName] = conn;

				callback(null, conn);
			});

			break;

		case 'wifi':

			conn = new Wifi(self);
			conn.init(serviceName, function() {
				self.connections[serviceName] = conn;

				callback(null, conn);
			});

			break;
		}
	});
};

ConnMan.prototype.getProperties = function(callback) {
	var self = this;

	self.manager.GetProperties['timeout'] = 10000;
	self.manager.GetProperties['finish'] = function(props) {
		if (callback)
			callback(null, props);
	};
	self.manager.GetProperties();
};

ConnMan.prototype.setProperty = function(prop, value, callback) {
	var self = this;

	self.manager.SetProperty['timeout'] = 10000;
	self.manager.SetProperty['finish'] = function() {
		if (callback)
			callback(null);
	};
	self.manager.SetProperty(prop, value);
};

ConnMan.prototype.getServices = function() {
	var self = this;

	var type = null;
	var callback = null;
	if (arguments.length == 1) {
		callback = arguments[0];
	} else {
		type = arguments[0];
		callback = arguments[1];
	}

	self.manager.GetServices['timeout'] = 10000;
	self.manager.GetServices['finish'] = function(services) {

		if (!callback)
			return;

		if (services instanceof Array) {

			if (services.length == 0) {
				callback(null, {});
				return;
			}

			if (!type) {
				for (var serviceName in services[0]) {
					var service = services[0][serviceName];
					service.serviceName = serviceName;
				}

				callback(null, services[0]);
				return;
			}

			var filteredServices = {};
			for (var serviceName in services[0]) {
				if (services[0][serviceName].Type != type) 
					continue;

				var service = services[0][serviceName];
				service.serviceName = serviceName;
				filteredServices[serviceName] = service;
			}

			callback(null, filteredServices);
		}
	};
	self.manager.GetServices();
};

ConnMan.prototype.getTechnologies = function(callback) {
	var self = this;

	if (!callback)
		return;

	self.manager.GetTechnologies['timeout'] = 10000;
	self.manager.GetTechnologies['finish'] = function(technologies) {

		if (technologies instanceof Array) {

			if (technologies.length == 0) {
				callback(null, {});
				return;
			}

			async.eachSeries(Object.keys(technologies[0]), function(techPath, next) {
				var techInfo = technologies[0][techPath];

				// This technology exists already
				if (self.technologies[techInfo.Name]) {
					next();
					return;
				}

				// Initializing technology object
				var technology = new Technology(self, techInfo.Name, techInfo.Type);
				technology.init(function() {

					self.technologies[techInfo.Name] = technology;

					next();
				});

			}, function(err) {

				callback(null, self.technologies);
			});
		}
	};
	self.manager.GetTechnologies();
};

ConnMan.prototype.getAllTechnologyInfo = function(callback) {
	var self = this;

	if (!callback)
		return;

	self.manager.GetTechnologies['timeout'] = 10000;
	self.manager.GetTechnologies['finish'] = function(technologies) {

		if (technologies instanceof Array) {

			if (technologies.length == 0) {
				callback(null, {});
				return;
			}

			var list = {};
			for (var objectPath in technologies[0]) {
				list[technologies[0][objectPath].Name] = technologies[0][objectPath];
			}
			callback(null, list);
		}
	};
	self.manager.GetTechnologies();
};

ConnMan.prototype.getOnlineService = function(callback) {
	var self = this;

	self.getServices(function(err, services) {

		for (var serviceName in services) {
			var service = services[serviceName];
			if (service.State == 'online') {
				service.serviceName = serviceName;
				if (callback)
					callback(null, service);

				break;
			}
		}
	});
};

ConnMan.prototype.setOfflineMode = function(enabled, callback) {
	var self = this;

	self.setProperty('OfflineMode', enabled, callback);
};
