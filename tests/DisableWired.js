var ConnMan = require('../');
var async = require('async');

var connman = new ConnMan();
connman.init(function() {

	var wired = connman.technologies['Wired'];

	// Getting current connections
	wired.getServices(function(err, services) {

		async.eachSeries(Object.keys(services), function(serviceName, next) {

			connman.getConnection(serviceName, function(err, conn) {

				// Disconnect
				conn.disconnect(function(err) {

					next();

				});
				
			});

		}, function() {

			// Power off
			wired.setProperty('Powered', false, function() {

				console.log('Disabled');
				process.exit();

			});
		});
	});
});
