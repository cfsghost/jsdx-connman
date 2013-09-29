/*
 * Agent Support
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

var DBus = require('dbus');
var util = require('util');
var events = require('events');

var Agent = module.exports = function(connman) {
	var self = this;

	self.connman = connman;
	self.dbus = connman.dbus;
	self.path = '/jsdx/connman/agent';
	self.interfaceName = 'net.connman.Agent';
	self.service = null;
	self.object = null;
	self.iface = null;
};

util.inherits(Agent, events.EventEmitter);

Agent.prototype.init = function(callback) {
	var self = this;

	// Register service
	var service = self.service = self.dbus.registerService('session');
	var obj = self.object = service.createObject(self.path);
	var iface = self.iface = obj.createInterface(self.interfaceName);

	// Initializing interface
	iface.addMethod('Release', {}, function(callback) {
		self.emit('Release');
		callback();
	});

	iface.addMethod('ReportError', {
		in: [
			DBus.Define(String),
			DBus.Define(String)
		]
	}, function(service, error, callback) {
		self.emit('ReportError', service, error);
		callback();
	});

	iface.addMethod('RequestBrowser', {
		in: [
			DBus.Define(String),
			DBus.Define(String)
		]
	}, function(service, url, callback) {
		self.emit('RequestBrowser', service, url);
		callback();
	});

	iface.addMethod('RequestInput', {
		in: [
			DBus.Define(String),
			DBus.Define(Object)
		],
		out: DBus.Define(Object)
	}, function(service, fields, callback) {
		self.emit('RequestInput', service, url, callback);
	});

	iface.addMethod('Cancel', {}, function(callback) {
		self.emit('Cancel');
		callback();
	});

	iface.update();

	/* Tell Manager where is our agent */
	self.connman.manager.RegisterAgent['timeout'] = 10000;
	self.connman.manager.RegisterAgent['finish'] = callback || null;
	self.connman.manager.RegisterAgent(self.path);
};
