var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {

	connman.Agent.on('Release', function() {
		console.log('Release');
	});

	connman.Agent.on('ReportError', function(path, err) {
		console.log('ReportError:');
		console.log(err);
	});

	connman.Agent.on('RequestBrowser', function(path, url) {
		console.log('RequestBrowser');
	});

	connman.Agent.on('RequestInput', function(path, dict, callback) {
		console.log(dict);
/*
		if ('Passphrase' in dict) {
			callback({ 'Passphrase': '12345' });
		}
*/
	});

	connman.Agent.on('Cancel', function() {
		console.log('Cancel');
	});
});
