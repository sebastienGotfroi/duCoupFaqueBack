const fs = require('graceful-fs');
var express = require('express');
var router = express.Router();


const libs = process.cwd() + '/libs/';
const bike = require(libs + 'util/tmpGraphUtil');

router.get('/info/bike/:long/:lat',
  function(req, res) {
    const long = req.param('long'),
      lat = req.param('lat'),
      bikeContent = JSON.parse(fs.readFileSync(libs + 'data/newCyclables.json'));
    let result = bike.findClosestBikePath(bikeContent.features, [lat, long]).map((item) => { return {start:[item.coords[1], item.coords[0]], distance:0}});
    //[start [long, lat] distance]
    res.json(
      result
    );
  }
);

module.exports = router;
