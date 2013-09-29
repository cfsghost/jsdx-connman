var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.Wired.setProperty('Powered', true, function() {

		connman.Wired.connect(function(err) {
			console.log('Enabled');
			process.exit();
		});
	});
});
