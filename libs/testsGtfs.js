module.exports = function () {

    var gtfs = require('gtfs');

    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;

    mongoose.connect('mongodb://localhost:27017/gtfs');


    function getForPosition(lat, lng) {
        gtfs.getStopsByDistance(lat, lng, 0.35, (err, stops) => (err, result) => console.log(result));
    }

    function doStuffWithNearbyStops(stop) {
        gtfs.getRoutesByStop(stop.agency_key, stop.stop_id, (err, route) => doStuffWithRouteAndStop(route, stop));
    }

    function doStuffWithRouteAndStop(route, stop) {
        console.log(route);
    }

}