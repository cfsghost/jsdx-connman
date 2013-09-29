var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	console.log('Getting Wifi properties ...');
	connman.Wifi.getProperties(function(err, props) {
		if (props.Powered)
			console.log('Wifi is powered');
		else
			console.log('Wifi is not powered');

		if (props.Connected)
			console.log('Wifi is connected');
		else
			console.log('Wifi is not connected');
		

		console.log('Scanning Access Point ...');
		connman.Wifi.scan(function() {

			connman.Wifi.listAccessPoints(function(err, list) {
				console.log('Got ' + list.length + ' Access Point(s)');
				for (var index in list) {
					var ap = list[index];
					console.log('  ' + (ap.Name ? ap.Name : '*hidden*') + '\t\t\t', 'Strength: ' + ap.Strength + '%', 'Security: ' + ap.Security);
				}

				process.exit();
			});

		});
	});
});
