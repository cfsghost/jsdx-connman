var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	connman.Wired.Powered = true;
	connman.Wifi.Powered = true;
});
