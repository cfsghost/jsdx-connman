var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	var wifi = connman.technologies['WiFi'];

	// Scanning
	console.log('Scanning...');
	wifi.scan(function() {

		// Getting list of access points
		wifi.listAccessPoints(function(err, list) {
			console.log('Got ' + list.length + ' Access Point(s)');
			for (var index in list) {
				var ap = list[index];

				var name = String('                ' + (ap.Name ? ap.Name : '*hidden*')).slice(-16);
				console.log('  ' + name, '  Strength: ' + ap.Strength + '%', '  Security: ' + ap.Security);
			}

			process.exit();
		});
	});

});
