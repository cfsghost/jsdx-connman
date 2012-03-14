/*
 * Wifi Support
 *
 * Copyright(c) 2012 Fred Chien <fred@mandice.com>
 *
 */

module.exports = function(connman) {

	this.ListAPs = function(callback) {
		process.nextTick(function() {
			var origList = connman.manager.GetServices();
			var list = [];

			/* We only get services of wifi */
			for (var index in origList) {
				if (origList[index][1].Type != 'wifi')
					continue;

				origList[index][1].dbusObject = origList[index][0];

				list.push(origList[index][1]);
			}

			delete origList;

			callback(list);
		});
	};
};
