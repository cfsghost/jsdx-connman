var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	var wifi = connman.technologies['WiFi'];

	wifi.findAccessPoint('Fred', function(err, service) {
		if (!service) {
			console.log('No such access point');
			process.exit();
			return;
		}

		console.log(service);
		process.exit();
	});

});
