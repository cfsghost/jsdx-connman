var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {

	connman.getProperties(function(err, props) {
		console.log(props.State);
		process.exit();
	});
});
