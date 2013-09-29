var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.Wifi.setProperty('Powered', true, function() {
		process.exit();
	});
});
