var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	connman.setOfflineMode(true, function() {
		process.exit();
	});
});
