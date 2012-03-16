var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	connman.Wired.Powered = false;
	connman.Wifi.Powered = true;
});
