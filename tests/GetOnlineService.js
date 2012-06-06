var ConnMan = require('../index.js');

var connman = new ConnMan();
connman.init(function() {
	connman.GetOnlineService(function(err, service) {
		if (err)
			return;

		console.log(service);
	});
});
