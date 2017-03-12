module.exports = {

	getDistancesForStop: function (stopId, maxTime, callback) {
		const gtfs = require('gtfs');
		var Sync = require('sync');
		const mongoose = require('mongoose');
		mongoose.Promise = global.Promise;


		let getStopIndex = function (stopTimes) {
			return stopTimes.findIndex(stopTime => stopTime.stop_id == stopId);
		}

		Sync(function () {

			let stop = gtfs.getStops.sync(null, "stmBusMetro", stopId);

			let route = gtfs.getRoutesByStop.sync(null, "stmBusMetro", stopId)[0];

			let direction = gtfs.getDirectionsByRoute.sync(null, "stmBusMetro", route.route_id)[0];

			let trip = gtfs.getTripsByRouteAndDirection.sync(null, "stmBusMetro", route.route_id, direction.direction_id)[0];

			let stopTimes = gtfs.getStoptimesByTrip.sync(null, "stmBusMetro", trip.trip_id);

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
			let stops = gtfs.getStopsByDistance.sync(null, lat, lng, .1);

			stops = stops
				.filter(stop =>
					/\/bus$/.test(stop.stop_url) //why would you do it this way?
				)
				.map(stop => {
					let route = gtfs.getRoutesByStop.sync(null, "stmBusMetro", stop.stop_id)[0];

					return { nom: route.route_short_name, id: stop.stop_id, lat: stop.stop_lat, lng: stop.stop_lon }
				});
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
				.map(stop => {

					let route = gtfs.getRoutesByStop.sync(null, "stmBusMetro", stop.stop_id)[0];
					return { nom: route.route_long_name, id: stop.stop_id, lat: stop.stop_lat, lng: stop.stop_lon }
				});

			let calcDist = function(stop) {
				var R = 6371e3; // metres
				const pi = 3.14159;
				var φ1 = lat * (pi/180);
				var φ2 = stop.stop_lat * (pi/180);
				var Δφ = (stop.lat - lat) * (pi/180);
				var Δλ = (stop.lng - lng) * (pi/180);

				var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
					Math.cos(φ1) * Math.cos(φ2) *
					Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

				return R * c;
			}

			let distances = stops.map(stop => calcDist(stop));

			callback(stops);
		});
	}
}

