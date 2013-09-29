var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.getTechnologies(function(err, technologies) {
		console.log(technologies);
		process.exit();
	});

});
