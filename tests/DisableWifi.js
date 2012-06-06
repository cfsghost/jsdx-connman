var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	connman.Wifi.Powered = false;
});
