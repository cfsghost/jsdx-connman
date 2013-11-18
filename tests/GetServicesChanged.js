var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.getOnlineService(function(err, service) {
		if (err)
			return;

		connman.getConnection(service.serviceName, function(err, conn) {

			connman.on('PropertyChanged', function(name, value) {

				console.log('Property Changed:');
				console.log(name, value);
			});
		});

	});
});
