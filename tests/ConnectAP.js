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
//		return { 'Passphrase': 'CCMA0275' };

		/* leaf */
//		return { 'Passphrase': '23634943' };

		/* Peixin */
//		return { 'Passphrase': '12345' };
//		return { 'Passphrase': '882525270' };

		/* dCafe */
//		return { 'Passphrase': '0223919233' };
//		return { 'Passphrase': '23919233' };

		/* Symbio */
//		return { 'Passphrase': 'abbab2717398327173983abbab' };

		/* Symbio TaipeiG */
		return { 'Passphrase': 'abbab2717398327174283abbab' };
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

	/* Making connection with access point which is called '1F' */
	//connman.Wifi.Connect('CPBAE(C.I.E)-WB08');
	//connman.Wifi.Connect('trendmicro');
//	connman.Wifi.Connect('培培的愛逢逢');
//	connman.Wifi.Connect('dcafe');
//	connman.Wifi.Connect('dcafe-2');
//	connman.Wifi.Connect('SymbioGuest');
	connman.Wifi.Connect('TaipeiG');
//	connman.Wifi.Connect('Rebirth Cafe-4free');
//	connman.Wifi.Connect('TPE-Free');
//	connman.Wifi.Connect('CCMA');
	//connman.Wifi.Connect('GKtea');
	//connman.Wifi.Connect('NewTaipei');
	//connman.Wifi.Connect('Bastille WLAN');
//	connman.Wifi.Connect('ZyXEL-OSSII');
//	connman.Wifi.Connect('insomnia');
	//connman.Wifi.Connect('frog-cafe');
//	connman.Wifi.Connect('1F');
//	connman.Wifi.Connect('Connectify-Peixin');
	//connman.Wifi.Connect('WBR-6011');
//	connman.Wifi.Connect('leaf');
	
});
