var express = require('express');
var router = express.Router();
var db = require('../models/db');
var Card = require('../models/Card');
var Busboy = require('busboy');

var path = require('path');
var os = require('os');
var fs = require('fs');
var STATIC_PATH = '/Users/yeqingnan/Sites/ETIWTT/public/images/card/'

/* Create card */
router.post('/:id', function (req, res) {
	var busboy = new Busboy({ headers: req.headers});
	var imageBuffer = new Buffer('', 'binary');
	var cardId = req.params.id;
	var oldimage;
	var fileName;

	// @TODO serious performance to save image file from client to server
	busboy.on('file', function (
		fieldname, file, filename, encoding, mimetype
	) {
		if (filename.length > 30) filename = 'backone' + filename.split('.')[1];
		fileName = Date.now() + '-' + filename;
		file.on('data', function (data) {
			imageBuffer = Buffer.concat([imageBuffer, data]);
		});

		file.on('end', function () {
			if (cardId && cardId !== 'null') {
				Card.find({'_id': cardId}, function (err, data) {
					if (err) er(res);
					oldimage = data[0].image;
					if (oldimage.indexOf('/default.jpg') !== -1) return;
					fs.unlink('/Users/yeqingnan/Sites/ETIWTT/public' + oldimage, function (err) {
						if (err) er(res);
					});
				});
			}

			fs.writeFile(STATIC_PATH + fileName, imageBuffer, function (err) {
				if (err) er(res);
			});
		});
	});

	// busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    //   console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    // });
	//
	busboy.on('finish', function() {
      	// res.writeHead(200, { Connection: 'close', Location: '/' });
		res.json({image: '/images/card/' + fileName});
      	res.end();
    });

	return req.pipe(busboy);
});

function er(res) {
	res.status(500).json({'error': 'whoops XD'});
}

module.exports = router;
