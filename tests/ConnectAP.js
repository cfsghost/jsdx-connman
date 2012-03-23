var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {

	/* Initializing Agent for connectiing access point */
	connman.Agent.on('RequestInput', function(path, dict) {
		console.log(dict);

		if ('Passphrase' in dict) {
			return { 'Passphrase': '11111' };
		}
	});

	connman.Agent.on('Cancel', function() {
		console.log('Cancel');
	});

	connman.Agent.run();

	/* Making connection with access point which is called '1F' */
	connman.Wifi.Connect('1F');
});
