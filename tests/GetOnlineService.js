var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.getOnlineService(function(err, service) {
		if (err)
			return;

		console.log(service);
		process.exit();
	});
});
