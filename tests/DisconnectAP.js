var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.Wifi.disconnect(function() {
		console.log('disconnected');
		process.exit();
	});
	
});
