var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	connman.onPropertyChanged(function(name, value) {
		console.log('[Manager]', name, value);
	});

	connman.Wifi.onPropertyChanged(function(name, value) {
		console.log('[Wifi]', name, value);
	});

	connman.Agent.run();
});
