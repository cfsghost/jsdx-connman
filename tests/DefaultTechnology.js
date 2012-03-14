var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	console.log(connman.DefaultTechnology);
});
