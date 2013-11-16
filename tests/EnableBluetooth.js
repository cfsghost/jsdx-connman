var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.Bluetooth.setProperty('Powered', true, function() {

		console.log('Enabled');
		process.exit();
	});
});
