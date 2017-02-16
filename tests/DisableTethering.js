//NOTE: Network.js DBUS needs environment vars below
//from: http://stackoverflow.com/questions/8556777/dbus-php-unable-to-launch-dbus-daemon-without-display-for-x11
process.env.DISPLAY = ':0';
process.env.DBUS_SESSION_BUS_ADDRESS = 'unix:path=/run/dbus/system_bus_socket';

var ConnMan = require('../');

var connman = new ConnMan();

connman.init(function() {

	var wifi = connman.technologies['WiFi'];

	wifi.disableTethering(function(err, res) {
		if (!err) {
			console.log('Tethering disabled');
		} else {
			console.log(err);
		}
	});

});
