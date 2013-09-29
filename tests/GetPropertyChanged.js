var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {
	connman.on('PropertyChanged', function(name, value) {
		console.log('[Manager]', name, value);
	});

	connman.Wifi.on('PropertyChanged', function(name, value) {
		console.log('[Wifi]', name, value);
	});
});
