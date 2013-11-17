var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.getServices('wired', function(err, services) {

		for (var serviceName in services) {

			connman.getConnection(serviceName, function(err, conn) {

				// Disconnection
				conn.disconnect(function(err) {

					// Power off
					conn.setProperty('Powered', false, function() {

					});
				});
				
			});
		}
	});
});
