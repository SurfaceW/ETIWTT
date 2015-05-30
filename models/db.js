/**
 * @module db
 * @description Database connector
 */

var mongoose = require('mongoose');
var db       = mongoose.connection;

// This is a localhost version of db conf
mongoose.connect('mongodb://localhost/ETIWTT');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log(new Date(Date.now()).toISOString() + ':Successfully connect the Database.');
});

module.exports = db;
