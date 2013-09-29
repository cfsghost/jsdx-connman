var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	/* Making connection with access point */
	//connman.Wifi.connect('1F', function(err, agent) {
	connman.Wifi.connect('223y124627', function(err, agent) {
		if (err)
			return;

		var failed = false;

		console.log('Connecting ...');

		agent.on('Release', function() {
			console.log('Release');
		});

		agent.on('ReportError', function(path, err) {
			console.log('ReportError:');
			console.log(err);
			failed = true;
			/* connect-failed */
			/* invalid-key */
		});

		agent.on('RequestBrowser', function(path, url) {
			console.log('RequestBrowser');
		});

		/* Initializing Agent for connecting access point */
		agent.on('RequestInput', function(path, dict, callback) {
			console.log(dict);

			if ('Passphrase' in dict) {
				callback({ 'Passphrase': '12345' });
				return;
			}

			callback({});
		});

		agent.on('Cancel', function() {
			console.log('Cancel');
		});

		connman.Wifi.on('PropertyChanged', function(name, value) {
			console.log(name + '=' + value);

			if (name == 'State') {
				switch(value) {
				case 'failure':
					console.log('Connection failed');
					break;

				case 'association':
					console.log('Associating ...');
					break;

				case 'configuration':
					console.log('Configuring ...');
					break;

				case 'online':
					console.log('Connected');
					process.exit();
					break;
				}
			}

		});
	});
	
});
