/*
 * Agent Support
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

var EventEmitter = require('events').EventEmitter;

module.exports = function(connman) {
	var path = '/jsdx/connman/agent';
	var dbus = connman.dbus;
	var dbusRegister = new dbus.DBusRegister(dbus, connman.systemBus);
	var emitter = new EventEmitter();

	var agentMethods = {};

	var agentHandlers = {
		Release: function() {
			if ('Release' in agentMethods)
				agentMethods.Release();
		},
		ReportError: function(path, err) {
			if ('ReportError' in agentMethods)
				agentMethods.ReportError(path, err);
		},
		RequestBrowser: function(path, url) {
			if ('RequestBrowser' in agentMethods)
				agentMethods.RequestBrowser(path, url);
		},
		RequestInput: function(path, dict) {
			if ('RequestInput' in agentMethods)
				return agentMethods.RequestInput(path, dict);
		},
		Cancel: function() {
			if ('Cancel' in agentMethods)
				agentMethods.Cancel();
		}
	};

	/* Register Agent Methods */
	dbusRegister.addMethods(path, 'net.connman.Agent', agentHandlers);

	/* Tell Manager where is our agent */
	connman.manager.RegisterAgent(path);

	this.on = function(signal, handler) {
		agentMethods[signal] = handler;
	};

	this.run = function() {

		dbus.runListener();
	};

};
