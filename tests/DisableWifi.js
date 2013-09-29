var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.Wifi.setProperty('Powered', false, function() {
		process.exit();
	});
});
