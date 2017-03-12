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
    //console.log(bikeContent);
    console.log(long + ':' + lat);
    res.json(
      {
        TODO:'Yessir', 
        test:bike.findClosestBikePath(bikeContent.features, [lat, long])
      }
    );
  }
);

module.exports = router;
