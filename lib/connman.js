"usr strict";

var util = require('util');
var events = require('events');
var async = require('async');
var DBus = require('dbus');
var Agent = require('./agent');
var Technology = require('./technology');
var Wired = require('./wired');
var Wifi = require('./wifi');

var dbus = new DBus();

var ConnMan = module.exports = function() {
	var self = this;

	self.dbus = dbus;
	self.systemBus = dbus.getBus('system');
	self.manager = null;
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

		self.Technology = new Technology(self);

		async.series([
			function(callback) {
				// Initializing Ethernet
				self.Wired = new Wired(self);
				self.Wired.init(callback);
			},
			function(callback) {
				// Initializing Wifi
				self.Wifi = new Wifi(self);
				self.Wifi.init(callback);
			},
			function(callback) {
				// Initializing agent
				self.Agent = new Agent(self);
				self.Agent.init(callback);
			}
		], function() {

			if (callback)
				callback();
		});
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

ConnMan.prototype.getServices = function(callback) {
	var self = this;

	self.manager.GetServices['timeout'] = 10000;
	self.manager.GetServices['finish'] = function(services) {
		if (services instanceof Array) {
			if (services.length > 0) {
				if (callback)
					callback(null, services[0]);
			}
		}
	};
	self.manager.GetServices();
};

ConnMan.prototype.getTechnologies = function(callback) {
	var self = this;

	self.manager.GetTechnologies['timeout'] = 10000;
	self.manager.GetTechnologies['finish'] = function(technologies) {

		if (technologies instanceof Array) {
			if (technologies.length > 0) {
				if (callback)
					callback(null, technologies[0]);
			}
		}
	};
	self.manager.GetTechnologies();
};

ConnMan.prototype.getOnlineService = function(callback) {
	var self = this;

	self.getServices(function(err, services) {

		for (var objectPath in services) {
			var service = services[objectPath];
			if (service.State == 'online') {
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
});
