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

	if (!self.iface) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Technology device was found'));
			});

		return;
	}

	self.iface.GetProperties['timeout'] = 10000;
	self.iface.GetProperties['finish'] = function(props) {
		if (callback)
			callback(null, props);
	};
	self.iface.GetProperties();
};

Technology.prototype.setProperty = function(prop, value, callback) {
	var self = this;

	if (!self.iface) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Technology device was found'));
			});

		return;
	}

	self.iface.SetProperty['timeout'] = 10000;
	self.iface.SetProperty['finish'] = function() {
		if (callback)
			callback(null);
	};
	self.iface.SetProperty(prop, value);
};

Technology.prototype.getServices = function(callback) {
	var self = this;

	if (!callback)
		return;

	self.connman.getServices(self.type, callback);
};

Technology.prototype.scan = function(callback) {
	var self = this;

	if (!self.iface) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
	}

	self.iface.Scan['timeout'] = 30000;
	self.iface.Scan['finish'] = function() {

		if (callback)
			callback();
	};
	self.iface.Scan();
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

Technology.prototype.findAccessPoint = function(ssid, callback) {
	var self = this;

	if (!self.iface || !ssid) {
		if (callback)
			process.nextTick(function() {
				callback(new Error('No Wifi device was found'));
			});

		return;
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
