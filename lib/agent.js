/*
 * Agent Support
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

module.exports = function(connman) {
	var path = '/jsdx/connman/agent';
	var dbus = connman.dbus;

	dbus.requestName(connman.systemBus, 'jsdx.connman');
//	connman.manager.RegisterAgent(path);
};
