var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {

	connman.Agent.on('Release', function() {
		console.log('Release');
	});

	connman.Agent.on('ReportError', function(path, err) {
		console.log('ReportError:');
		console.log(err);
		/* invalid-key */
	});

	connman.Agent.on('RequestBrowser', function(path, url) {
		console.log('RequestBrowser');
	});

	/* Initializing Agent for connectiing access point */
	connman.Agent.on('RequestInput', function(path, dict) {
		console.log(dict);

		/* dCafe */
//		return { 'Passphrase': '0223919233' };
//		return { 'Passphrase': '882525270' };

		/* Symbio */
//		return { 'Passphrase': 'abbab2717398327173983abbab' };
//
		/* GKtea */
		//return { 'Passphrase': '9876543210' };

		/* OSSII */
//		return { 'Passphrase': '80542203ossii' };

		/* insomnia */
		//return { 'Passphrase': 'insomnia12345' };

		/* frog-cafe */
//		return { 'Passphrase': '1234567890' };
//
		return { 'Passphrase': '11111' };
/*
		if ('Passphrase' in dict) {
			if ('WPS' in dict) {
				console.log('WPS');
				return { 'WPS': '08152268' };
			} else {
				return { 'Passphrase': 'CPBAE187' };
			}
		}
*/
	});

	connman.Agent.on('Cancel', function() {
		console.log('Cancel');
	});

	connman.Agent.run();

	/* Making connection with access point which is called '1F' */
	//connman.Wifi.Connect('CPBAE(C.I.E)-WB08');
	//connman.Wifi.Connect('trendmicro');
	//connman.Wifi.Connect('培培的愛逢逢');
//	connman.Wifi.Connect('dcafe');
//	connman.Wifi.Connect('SymbioGuest');
	//connman.Wifi.Connect('GKtea');
	//connman.Wifi.Connect('NewTaipei');
	//connman.Wifi.Connect('Bastille WLAN');
//	connman.Wifi.Connect('ZyXEL-OSSII');
//	connman.Wifi.Connect('insomnia');
	//connman.Wifi.Connect('frog-cafe');
	connman.Wifi.Connect('1F');
	
});
