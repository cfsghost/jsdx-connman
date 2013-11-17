var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.getServices('wifi', function(err, services) {
		console.log(services);

		process.exit();
	});
});
