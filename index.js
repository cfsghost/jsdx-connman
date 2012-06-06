/*
 * JSDX Connection Manager API
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

var dbus = require('dbus');
var Technology = require('./lib/technology');
var Wifi = require('./lib/wifi');
var Wired = require('./lib/wired');
var Agent = require('./lib/agent');

module.exports = function() {
	var self = this;
	var onlineService = null;
	var onlineServiceInfo = null;
	var onlineServiceChangedCallback = null;
	var PropertyChangedCallback = null;

	self.dbus = dbus;

	/* Internal Functions */
	var _GetOnlineService = function(callback) {

		process.nextTick(function() {
			var List = self.manager.GetServices();
			var service;

			for (var index in List) {
				service = List[index];
				if (service[1].State == 'online') {
					onlineServiceInfo = service;

					callback(null, service);

					return;
				}
			}

			callback(new Error('Cannot find connection which is online'))
		});
	};

	var _setupOnlineService = function(callback) {

		/* Update current online service */
		_GetOnlineService(function(err, service) {

			if (err)
				return;

			onlineService = dbus.get_interface(self.systemBus, 'net.connman', service[0], 'net.connman.Service');

			/* Using Wifi service's PropertyChanged signal to get updates */
			if (service[1].Type == 'wifi') {
				self.Wifi._internalServiceChangedCallback = _OnlineServiceChangedCallback;
				self.Wifi._enableServiceChanged();
			}

			if (callback)
				callback.apply(self, []);
		});
	};

	var _OnlineServiceChangedCallback = function() {
		if (onlineServiceChangedCallback)
			onlineServiceChangedCallback.apply(self, Array.prototype.slice.call(arguments));
	};

	var _PropertyChangedCallback = function(name, value) {
		if (name == 'State') {
			switch(value) {
			case 'online':
				if (onlineService) {
					onlineService = null;
				}

				_setupOnlineService();

				break;

			case 'idle':
				if (onlineService) {
					/* Stop monitoring properties of service */
					if (onlineServiceInfo) {
						if (onlineServiceInfo[1].Type == 'wifi') {
							self.Wifi._internalPropertyChangedCallback = null;
							self.Wifi._disablePropertyChanged();
						}
					}

					onlineService = null;
					onlineServiceInfo = null;
				}

				break;
			}
		}

		if (PropertyChangedCallback)
			PropertyChangedCallback.apply(self, Array.prototype.slice.call(arguments));
	};

	/* Accessor */
	this.__defineGetter__('State', function() {
		return self.manager.GetProperties().State;
	});

	this.__defineGetter__('OfflineMode', function() {
		return self.manager.GetProperties().OfflineMode;
	});

	this.__defineSetter__('OfflineMode', function(value) {
		return self.manager.SetProperty('OfflineMode', value);
	});

	/* Methods */
	this.init = function(callback) {
		dbus.start(function() {
			self.systemBus = dbus.system_bus();
			self.manager = dbus.get_interface(self.systemBus, 'net.connman', '/', 'net.connman.Manager');
//			self.agent = dbus.get_interface(self.systemBus, 'net.connman', '/net/connman/agent', 'net.connman.Agent');

			/* Modules */
			self.Technology = new Technology(self);
			self.Wifi = new Wifi(self);
			self.Wired = new Wired(self);
			self.Agent = new Agent(self);

//			console.log(self.manager.GetProperties());
//			console.log(self.manager);

			/* Initializing current online service */
			_setupOnlineService(function() {
				process.nextTick(function() {
					callback();
				});
			});
		});
	};

	this.GetTechnologies = function() {
		return self.manager.GetTechnologies();
	};

	this.GetServices = function() {
		return self.manager.GetServices();
	};

	this.GetOnlineService = function(callback) {
		/* Online service updater is working */
		if (onlineServiceChangedCallback) {

			/* Get current online service from cached */
			if (onlineServiceInfo) {
				process.nextTick(function() {
					callback.apply(self, [ null, onlineServiceInfo ]);
				});
				return;
			}
		}

		_GetOnlineService(callback);
	};

	/* Signal */
	this.onPropertyChanged = function(callback) {
		PropertyChangedCallback = callback;

		self.manager.PropertyChanged.onemit = _PropertyChangedCallback;
		self.manager.PropertyChanged.enabled = true;
	};

	this.onServicesChanged = function(callback) {
		self.manager.ServicesChanged.onemit = callback;
		self.manager.ServicesChanged.enabled = true;
	};

	this.onOnlineServiceChanged = function(callback) {
		onlineServiceChangedCallback = callback;

		/* Need PropertyChanged signal to update online service */
		self.manager.PropertyChanged.onemit = _PropertyChangedCallback;
		self.manager.PropertyChanged.enabled = true;
		
	};
};
