//var dbus = module.exports = require('node-dbus');
var dbus = require('node-dbus');
var EventEmitter = require('events').EventEmitter;

module.exports = function() {
	var self = this;

	this.init = function(callback) {
		dbus.start(function() {
			self.systemBus = dbus.system_bus();
			self.manager = dbus.get_interface(self.systemBus, 'net.connman', '/', 'net.connman.Manager');
			self.properties = self.manager.GetProperties();

//			console.log(self.manager.GetProperties());
//			console.log(self.manager);

			callback();
		});
	};

	this.__defineGetter__('AvailableTechnologies', function() {
		return self.manager.GetProperties().AvailableTechnologies;
	});

	this.__defineGetter__('EnabledTechnologies', function() {
		return self.manager.GetProperties().EnabledTechnologies;
	});

	this.__defineGetter__('ConnectedTechnologies', function() {
		return self.manager.GetProperties().ConnectedTechnologies;
	});

	this.__defineGetter__('DefaultTechnology', function() {
		return self.manager.GetProperties().DefaultTechnology;
	});

	this.__defineGetter__('GetState', function() {
		return self.manager.GetState();
	});

	this.__defineGetter__('OfflineMode', function() {
		return self.manager.GetProperties().OfflineMode;
	});

	this.__defineSetter__('OfflineMode', function(value) {
		return self.manager.SetProperty('OfflineMode', false);
	});

	/* Methods */
	this.EnableTechnology = function(technology) {
		process.nextTick(function() {
			self.manager.EnableTechnology(technology);
		});
	};

	this.DisableTechnology = function(technology) {
		process.nextTick(function() {
			self.manager.DisableTechnology(technology);
		});
	};
};
