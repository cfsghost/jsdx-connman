/*
 * Wired Support
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

module.exports = function(connman) {
	var self = this;
	var dbus = connman.dbus;

	self.service = null;

	/* Create connection for Wired Technology */
	this.technology = connman.Technology.Find('ethernet');

	this.GetStatus = function(callback) {
		process.nextTick(function() {
			var List = connman.manager.GetServices();
			var ap;

			for (var index in List) {
				ap = List[index];
				if (ap[1].Type == 'ethernet') {
					/* Get service interface */
					self.service = dbus.get_interface(connman.systemBus, 'net.connman', ap[0], 'net.connman.Service');

					callback(null, ap);

					delete List;

					return;
				}
			}

			delete List;

			callback(new Error('Cannot get wired status'));
		});
	};

	/* Signal */
	this.onPropertyChanged = function(callback) {
		self.technology.PropertyChanged.onemit = callback;
		self.technology.PropertyChanged.enabled = true;
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
