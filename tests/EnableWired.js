var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.getServices('wired', function(err, services) {

		for (var serviceName in services) {

			connman.getConnection(serviceName, function(err, conn) {

				// Powered
				conn.setProperty('Powered', true, function() {

					// Establish a connection
					conn.connect(function(err) {

					});
				});
				
			});
		}
	});
});
