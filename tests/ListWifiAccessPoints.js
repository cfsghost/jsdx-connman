var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	connman.Wifi.RequestScan();

	console.log('Wifi is ' + connman.Wifi.State);

	connman.Wifi.ListAPs(function(list) {
		for (var index in list) {
			var ap = list[index];
			console.log('[' + ap.Name + ']');
			console.log('Strength: ' + ap.Strength + '%');
			console.log('Security: ' + ap.Security);
			console.log('PassphraseRequired: ' + ap.PassphraseRequired);
			console.log('');
		}
	});
});
