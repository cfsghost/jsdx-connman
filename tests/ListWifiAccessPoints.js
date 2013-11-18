var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	// Scanning
	var technology = connman.technologies['WiFi'];

	console.log('Scanning...');
	technology.scan(function() {

		// Getting list of access points
		technology.listAccessPoints(function(err, list) {
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
