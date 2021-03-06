var express = require('express');
var passport = require('passport');
var router = express.Router();
var async = require('async');
var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/mongoose');
var stm = require(libs + 'model/article');

let buses = undefined, metro = undefined;
let responseBody = undefined;



router.get('/stops/:lat/:lng', function (req, res) {
	stm.getStopsForPosition(req.param("lat"), req.param("lng"), (result) => { res.json(result); res.end() })
});

router.get('/distance/:stopId', function (req, res) {
	stm.getDistancesForStop(req.param("stopId"), 30, (result) => { res.json(result); res.end() })
});

router.get('/superGoodUrl/:lat/:lng', function (req, res) {
	if (responseBody === undefined) {
		responseBody = {};
		responseBody.ligne = [];
		async.series(
			[
				function (callback) {
					stm.getStopsForPosition(45.4991073, -73.5775732, r => callback(null, r));
				},
				function (callback) {
					stm.getMetroForPosition(45.4991073, -73.5775732, r => callback(null, r));
				},
				function (callback) {
					callback(null, null);
				}
			],
			function (err, r) {
				buses = r[0];
				metro = r[1];

				responseBody = {
					bus: {
						ligne: buses.map(result => {
							return {
								stop: { lat: result.lat, lng: result.lng },
								nom: result.nom
							};
						})
					},
					metro: {
						ligne: metro.map(result => {
							return {
								stop: { lat: result.lat, lng: result.lng },
								nom: result.nom
							};
						})
					}
				};
				res.json(responseBody);
				res.end();
			}

		);

	} else {
		res.json(responseBody);
		res.end();
	}

})

router.get('/bus/:lat/:lng', function (req, res) {
	let result = {};
	result.ligne = [];

	stm.getStopsForPosition(req.param("lat"), req.param("lng"),
		results => {
			res.json(
				{
					bus: {
						ligne: results.map(result => {
							return {
								stop: { lat: result.lat, lng: result.lng },
								nom: result.nom
							};
						})

					}
				});
			res.end();
		})
})

router.get('/metro/:lat/:lng', function (req, res) {

	stm.getMetroForPosition(req.param("lat"), req.param("lng"),
		results => {
			res.json(
				{
					metro: {
						ligne: results.map(result => {
							return {
								stop: { lat: result.lat, lng: result.lng },
								nom: result.nom
							};
						})
					}
				});
			res.end();
		})
})


router.post('/', function (req, res) {

	var article = new stm({
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		images: req.body.images
	});

	article.save(function (err) {
		if (!err) {
			log.info("New article created with id: %s", article.id);
			return res.json({
				status: 'OK',
				article: article
			});
		} else {
			if (err.name === 'ValidationError') {
				res.statusCode = 400;
				res.json({
					error: 'Validation error'
				});
			} else {
				res.statusCode = 500;

				log.error('Internal error(%d): %s', res.statusCode, err.message);

				res.json({
					error: 'Server error'
				});
			}
		}
	});
});

router.get('/:id', function (req, res) {

	stm.findById(req.params.id, function (err, article) {

		if (!article) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				article: article
			});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);

			return res.json({
				error: 'Server error'
			});
		}
	});
});

router.put('/:id', function (req, res) {
	var articleId = req.params.id;

	stm.findById(articleId, function (err, article) {
		if (!article) {
			res.statusCode = 404;
			log.error('Article with id: %s Not Found', articleId);
			return res.json({
				error: 'Not found'
			});
		}

		article.title = req.body.title;
		article.description = req.body.description;
		article.author = req.body.author;
		article.images = req.body.images;

		article.save(function (err) {
			if (!err) {
				log.info("Article with id: %s updated", article.id);
				return res.json({
					status: 'OK',
					article: article
				});
			} else {
				if (err.name === 'ValidationError') {
					res.statusCode = 400;
					return res.json({
						error: 'Validation error'
					});
				} else {
					res.statusCode = 500;

					return res.json({
						error: 'Server error'
					});
				}
			}
		});
	});
});

module.exports = router;
