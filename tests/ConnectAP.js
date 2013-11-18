var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	var wifi = connman.technologies['WiFi'];

	wifi.findAccessPoint('Fred', function(err, service) {
		if (!service) {
			console.log('No such access point');
			process.exit();
			return;
		}

		connman.getConnection(service.serviceName, function(err, ap) {

			/* Making connection to access point */
			ap.connect(function(err, agent) {

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

				ap.on('PropertyChanged', function(name, value) {
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
	});

	
});
