var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	connman.EnableTechnology('wifi');
	connman.DisableTechnology('wifi');
});
