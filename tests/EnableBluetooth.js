var ConnMan = require('../');
var async = require('async');

var connman = new ConnMan();
connman.init(function() {

	var bluetooth = connman.technologies['Bluetooth'];

	// Powered
	bluetooth.setProperty('Powered', true, function() {

		// Getting available connections
		bluetooth.getServices(function(err, services) {

			async.eachSeries(Object.keys(services), function(serviceName, next) {

				connman.getConnection(serviceName, function(err, conn) {

					// Establish a connection
					conn.connect(function(err) {
						next();
					});
					
				});
			}, function() {
				console.log('Enabled');
				process.exit();
			});
		});
	});
});
