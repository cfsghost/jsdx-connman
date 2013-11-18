var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	var wifi = connman.technologies['WiFi'];

	wifi.findAccessPoint('Fred', function(err, ap) {
		console.log();
	});

	connman.Wifi.findAccessPoint('1F', function(err, service) {
		console.log(service);
		process.exit();
	});

});
