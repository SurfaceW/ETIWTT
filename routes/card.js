var express = require('express');
var router = express.Router();
var db = require('../models/db');
var fs = require('fs');
var Card = require('../models/Card');

/* GET all of the cards */
router.get('/', function (req, res) {
    Card.find()
        .limit(8)
        .exec(function (err, data) {
            if (err) er(res);
            res.status(200).json(data).end();
        });
});

/* Create card */
router.post('/', function (req, res) {
    var card = new Card({
        'name': req.body.name,
        'done': req.body.done,
        'favorite': req.body.favorite,
        'image': req.body.image,
        'createDate': new Date(Date.now()),
        'editDate': new Date(Date.now())
    });

    card.save(function (err, obj) {
        if (err) er(res);
        res.status(200).json(obj).end();
    });
});

/* Delete card */
router.delete('/:id', function (req, res) {
    var _id = req.params['id'];
    Card.find({'_id': _id}, function (err, data) {
        if (err) er(res);

        // Delete the static file of image
        var image = data[0].image;
        if (!image || image.indexOf('/default.jpg') !== -1) {
            Card.remove({'_id': _id }, function (err) {
                if (err) er(res);
                res.status(200).end();
            });
            return;
        }
        fs.unlink('/Users/yeqingnan/Sites/ETIWTT/public' + image, function (err) {
            if (err) er(res);
            Card.remove({'_id': _id }, function (err) {
                if (err) er(res);
                res.status(200).end();
            });
        });
    });
});

/* UPDATE Card */
router.put('/:id', function (req, res) {
	Card
	.update({'_id': req.params['id']}, {
		'name': req.body.name,
		'done': req.body.done,
        'favorite': req.body.favorite,
        'image': req.body.image,
        'editDate': new Date(Date.now())
    },
	function (err) {
		if (err) er(res);
		res.status(200).end();
	});
});

function er(res) {
	res.status(500).json({'error': 'whoops XD'});
}

module.exports = router;
