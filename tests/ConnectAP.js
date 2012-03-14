var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	connman.Wifi.Connect('1F');
});
