/*
 * Technology Utility
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

var async = require('async');

var Technology = module.exports = function(connman) {
	var self = this;

	self.connman = connman;
	self.dbus = connman.dbus;
	self.manager = connman.manager;
};

Technology.prototype.find = function(type, callback) {
	var self = this;

	self.manager.GetTechnologies['timeout'] = 10000;
	self.manager.GetTechnologies['finish'] = function(technologies) {

		var objects = technologies[0];
		var objectPaths = Object.keys(objects);

		async.eachSeries(objectPaths, function(objectPath, callback) {

			if (objects[objectPath].Type != type) {
				callback();
				return;
			}

			self.connman.systemBus.getInterface('net.connman', objectPath, 'net.connman.Technology', function(err, iface) {

				iface.GetProperties['timeout'] = 10000;
				iface.GetProperties['finish'] = function(props) {

					callback(iface);
				};

				iface.GetProperties();

			});
			
		}, function(iface) {

			if (iface)
				callback(null, iface);
			else
				callback(null, null);
		});
	};

	self.manager.GetTechnologies();
};
