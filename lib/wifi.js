/*
 * Wifi Support
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

module.exports = function(connman) {
	var self = this;
	var dbus = connman.dbus;
	var updaterID = null;

	this.service = null;
	this.serviceChangedCallback = null;
	this._internalServiceChangedCallback = null;
	this._enableServiceChanged = function() {
		if (self.service) {
			self.service.PropertyChanged.onemit = _serviceChangedCallback;
			self.service.PropertyChanged.enabled = true;
		}

		/* Timer for pulling strength */
		if (!updaterID) {
			updaterID = setInterval(function() {
				if (self.service) {

					var serviceProp = self.service.GetProperties();

					if ('Strength' in serviceProp) {
						_serviceChangedCallback('Strength', serviceProp.Strength);
					}
				}
			}, 30000);
		}
	};

	this._disableServiceChanged = function() {
		/* ServiceChanged signal is being using */
		if (self.serviceChangedCallback)
			return;

		if (self.service) {
			self.service.ServiceChanged.onemit = null;
			self.service.ServiceChanged.enabled = false;
		}

		if (updaterID)
			clearInterval(updaterID);
	};

	var _serviceChangedCallback = function() {
		if (self._internalServiceChangedCallback)
			self._internalServiceChangedCallback.apply(self, Array.prototype.slice.call(arguments));

		if (self.serviceChangedCallback)
			self.serviceChangedCallback.apply(self, Array.prototype.slice.call(arguments));
	};

	/* Create connection for Wifi Technology */
	this.technology = connman.Technology.Find('wifi');

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

	this.Scan = function(callback) {
		if (self.technology) {
			process.nextTick(function() {
				self.technology.Scan['finish'] = function() {
					callback();
				};
				self.technology.Scan['timeout'] = 30000;
				self.technology.Scan();
			});
		}
	};

	this.FindAccessPoint = function(ssid, callback) {
		process.nextTick(function() {
			var List = connman.manager.GetServices();
			var ap;

			for (var index in List) {
				ap = List[index];
				if (ap[1].Name == ssid) {
					callback(null, ap);

					delete List;

					return;
				}
			}

			delete List;

			callback(new Error('Cannot find such access point'));
		});
	};

	this.ConnectService = function(service, callback) {
		/* Get service interface */
		self.service = dbus.get_interface(connman.systemBus, 'net.connman', service, 'net.connman.Service');

		/* Connect to Agent to make connection with access point */
		if (callback)
			self.service.Connect['finish'] = callback;
		else
			self.service.Connect['finish'] = function() {};

		self.service.Connect['timeout'] = 30000;
		self.service.Connect();
	};

	this.Connect = function(ssid, callback) {
		if (self.technology) {
			self.FindAccessPoint(ssid, function(err, ap) {
				if (err)
					return;

				self.ConnectService(ap[0], callback || null);
			});
		}
	};

	this.GetStatus = function(callback) {
		process.nextTick(function() {
			var List = connman.manager.GetServices();
			var service;

			for (var index in List) {
				service = List[index];
				if (service[1].Type == 'wifi' && (service[1].State == 'online' || service[1].State == 'ready')) {

					/* Get service interface */
					self.service = dbus.get_interface(connman.systemBus, 'net.connman', service[0], 'net.connman.Service');

					callback(null, service);

					return;
				}
			}

			callback(new Error('Cannot get Wifi status'));
		});
	};

	/* Signal */
	this.onPropertyChanged = function(callback) {
		self.technology.PropertyChanged.onemit = callback;
		self.technology.PropertyChanged.enabled = true;
	};

	this.onServiceChanged = function(callback) {
		self.serviceChangedCallback = callback;

		self._enableServiceChanged();
	};

	/* Properties */
	this.__defineGetter__('Connected', function() {
		return self.technology.GetProperties().Connected;
	});

	this.__defineGetter__('Powered', function() {
		return self.technology.GetProperties().Powered;
	});

	this.__defineSetter__('Powered', function(value) {
		self.technology.SetProperty('Powered', value);
	});

	this.__defineGetter__('Tethering', function() {
		return self.technology.GetProperties().Tethering;
	});

	this.__defineSetter__('Tethering', function(value) {
		self.technology.SetProperty('Tethering', value);
	});
};
