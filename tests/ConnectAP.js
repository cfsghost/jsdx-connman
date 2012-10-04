var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {

	connman.Agent.on('Release', function() {
		console.log('Release');
	});

	connman.Agent.on('ReportError', function(path, err) {
		console.log('ReportError:');
		console.log(err);
		/* connect-failed */
		/* invalid-key */
	});

	connman.Agent.on('RequestBrowser', function(path, url) {
		console.log('RequestBrowser');
	});

	/* Initializing Agent for connectiing access point */
	connman.Agent.on('RequestInput', function(path, dict) {
		console.log(dict);
	});

	connman.Agent.on('Cancel', function() {
		console.log('Cancel');
	});

	/* Making connection with access point */
	connman.Wifi.Connect('MyAP');
	
});
