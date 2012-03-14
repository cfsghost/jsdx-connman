var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	connman.OfflineMode = false;
	console.log(connman.OfflineMode);
});
