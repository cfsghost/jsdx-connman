var ConnMan = require('../');
var async = require('async');

var connman = new ConnMan();
connman.init(function() {

	var wifi = connman.technologies['WiFi'];

	// Powered
	wifi.setProperty('Powered', true, function() {

		console.log('Enabled');
		process.exit();
	});
});
