var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Bike path
var point = new Schema({
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
});
var path = new Schema({
  start: point,
  end: point
});

var bikePath = new Schema({
	city: { type: String, required: false },
	description: { type: String, required: false },
  nodes: [path]
});

module.exports = mongoose.model('Article', bikePath);
