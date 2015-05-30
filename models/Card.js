/**
 * @module Card
 */

var mg = require('mongoose');

var CardSchema = mg.Schema({
	name: String, // The name of this chard
	favorite: Boolean, // Wether this is the favorite Card
	done: Number, // The times to finish this activity
	image: String, // The current location of card iamge
	createDate: Date,
	editDate: Date
});

var Card = mg.model('ETIWTT', CardSchema);

module.exports = Card;
