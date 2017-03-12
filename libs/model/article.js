module.exports = {
	
	getDistancesForStop: function (stopId, maxTime,  callback) {
		const gtfs = require('gtfs');
		var Sync = require('sync');
		const mongoose = require('mongoose');
		mongoose.Promise = global.Promise;
		

		let getStopIndex = function(stopTimes){
			return stopTimes.findIndex(stopTime => stopTime.stop_id == stopId);
		}

		Sync(function () {

			let stop = gtfs.getStops.sync(null, "stmBusMetro", stopId);

			let route = gtfs.getRoutesByStop.sync(null, "stmBusMetro", stopId)[0];

			let direction = gtfs.getDirectionsByRoute.sync(null, "stmBusMetro", route.route_id)[0];

			let trip = gtfs.getTripsByRouteAndDirection.sync(null, "stmBusMetro", route.route_id, direction.direction_id)[0];

			let stopTimes = gtfs.getStoptimesByTrip.sync(null,"stmBusMetro", trip.trip_id);

			let stopsBefore = stopTimes.splice(0, getStopIndex(stopTimes, stop));
			let stopsAfter = [];
			stopsAfter.push(stopsBefore[stopsBefore.length - 1]);
			stopsAfter = stopsAfter.concat(stopTimes);

			stopsBefore.map()
		});
	},

	getStopsForPosition: function (lat, lng, callback) {
		const gtfs = require('gtfs');
		const mongoose = require('mongoose');
		mongoose.Promise = global.Promise;
		var Sync = require('sync');

		Sync(function () {
			let stops = gtfs.getStopsByDistance.sync(null, lat, lng, .35);
			console.log(stops);

			stops = stops
			.filter(stop => 
				/\/bus$/.test(stop.stop_url) //why would you do it this way?
			)
			.map(stop => 
			{ 
				return {nom:stop.stop_name, id: stop.stop_id, lat:stop.stop_lat, lng: stop.stop_lon}
			});
			console.log(stops);
			callback(stops);
		});
	},

	getMetroForPosition: function (lat, lng, callback) {
		const gtfs = require('gtfs');
		const mongoose = require('mongoose');
		mongoose.Promise = global.Promise;
		var Sync = require('sync');

		Sync(function () {
			let stops = gtfs.getStopsByDistance.sync(null, lat, lng, .35);
			console.log(stops);

			stops = stops
			.filter(stop => 
				!/\/bus$/.test(stop.stop_url) //why would you do it this way?
			)
			.map(stop => 
			{ 
				return {nom:stop.stop_name, id: stop.stop_id, lat:stop.stop_lat, lng: stop.stop_lon}
			});

			callback(stops);
		});
	}
}
