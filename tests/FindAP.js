var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.Wifi.findAccessPoint('1F', function(err, service) {
		console.log(service);
		process.exit();
	});

});
