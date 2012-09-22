var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
/*
	connman.onServicesChanged(function(services, removed) {
		console.log('Services:');
		console.log(services);
		console.log('Removed:');
		console.log(removed);
	});
*/
	connman.Wifi.onPropertyChanged(function(name, value) {
		console.log('Property Changed:');
		console.log(name, value);
	});
});
