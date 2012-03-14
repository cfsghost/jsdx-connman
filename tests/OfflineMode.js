var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	console.log(connman.OfflineMode);
	connman.OfflineMode = false;
	console.log(connman.OfflineMode);
});
