var ConnMan = require('../');

var connman = new ConnMan();
connman.init(function() {
	connman.on('PropertyChanged', function(name, value) {
		console.log('[Manager]', name, value);
	});
});
