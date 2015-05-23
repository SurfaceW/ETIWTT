define(function(require, exports, module) {

	var Card = require('/js/module/Card');
	var util = require('/js/lib/util');
	var template = require('/js/lib/templates');
	// Test demo data
	var data = require('/data/new');

	var instance = null;
	var cards = [];

	var CardBoard = function () {
		// Singleton
		if (instance !== null) return instance;
	};


	CardBoard.prototype.ini = function () {
		this.fetch();
		_render();
	};

	CardBoard.prototype.get = function (id) {
		for (var i = 0; i < cards.length; i += 1) {
			if (cards[i].id === id) return cards[i];
		}
	};

	CardBoard.prototype.add = function (card) {
		cards.push(card);
	};

	CardBoard.prototype.del = function () {

	};

	CardBoard.prototype.update = function () {

	};

	CardBoard.prototype.fetch = function () {
		cards = data;
	};

	function _render() {
		// First call need to wait for Ajax loading templates data
		template.get('CardBoard', function (d) {
			console.log(d);
		});

	}

    module.exports = CardBoard;
});
