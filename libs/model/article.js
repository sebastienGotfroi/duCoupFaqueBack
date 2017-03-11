module.exports = {
	
	doStuffWithRouteAndStop: function(route, stop) {
		const gtfs = require('gtfs');

	    const mongoose = require('mongoose');
		mongoose.Promise = global.Promise;

        console.log("ok");
    },
	

	doStuffWithNearbyStops: function(stop) {
		const gtfs = require('gtfs');
	    const mongoose = require('mongoose');
		mongoose.Promise = global.Promise;

        gtfs.getRoutesByStop(stop.agency_key, stop.stop_id, (err, route) => this.doStuffWithRouteAndStop(err, stop));
    },

	getForPosition: function (lat, lng, callback) {
		const gtfs = require('gtfs');
		var Sync = require('sync');
	    const mongoose = require('mongoose');
		mongoose.Promise = global.Promise;
	
		gtfs.getStopsByDistance(lat, lng, .35, callback);
		
	}
}

// module.exports = function () {
//     var gtfs = require('gtfs');

//     const mongoose = require('mongoose');
//     mongoose.Promise = global.Promise;

//     mongoose.connect('mongodb://localhost:27017/gtfs');

//     var getForPosition = function(lat, lng) {
// 	console.log(gtfs);
//         gtfs.getStopsByDistance(lat, lng, 0.35, (err, stops) => stops.forEach(stop => doStuffWithNearbyStops(stop)));
//     }




// }