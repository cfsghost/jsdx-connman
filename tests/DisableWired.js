var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.Wired.disconnect(function(err) {
		connman.Wired.setProperty('Powered', false, function() {
			process.exit();
		});
	});
});
