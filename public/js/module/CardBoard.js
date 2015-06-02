define(function(require, exports, module) {

	var Card = require('/js/module/Card');
	var util = require('/js/lib/util');
	var template = require('/js/lib/templates');

	// Test demo data
	// var data = require('/data/new');

	var instance = null;
	var cards = [];

	// Enrum type
	// Card filter
	var STATUS = {
		'DEFAULT': 0,
		'HEARTED': 1,
		'DONE': 2
	};

	var $window = $(window);

	// Singleton Class CardBoard
	var CardBoard = function () {
		// Singleton
		if (instance !== null) return instance;

		// Ini Properties
		this.$el = null; // container
		this.$box = null;
		this.$body = $('body');

		// Status
		this.display = {
			'HEARTED': false, // DEFAULT
			'DONE': false // HEARTED
		};
	};

	// Ini the whole app
	CardBoard.prototype.ini = function () {
		var _this = this;
		// First call need to wait for Ajax loading templates data
		template.get('CardBoard', function (cardboard) {
			var card;
			_this.$el = $(cardboard);
			_this.$box = _this.$el.find('.card-box');
			_this
			.fetch()
			.done(function () {
				_render(_this);
				_iniEvent(_this);
			});
		});

		_this.$body.width($window.width());
		_this.$body.height($window.height());
	};

	// Handle fetch data from server
	CardBoard.prototype.fetch = function () {
		var _this = this;
		return $.get('/card', function (data) {
			for (var i = 0; i < data.length; i++) {
				var card = $.extend({
					id: data[i]['_id'],
					name: data[i]['name'],
					favorite: data[i].favorite,
					done: data[i].done,
					image: data[i].image
				}, {
					editable: false,
					display: true,
					parent: _this
				});
				card = new Card(card);
				_this.add(card);
				console.log(cards);
			}
		});
	};

	// Handle create a card
	CardBoard.prototype.create = function (card) {
		$.post('/card', {
			'name': card.name,
			'done': card.done,
			'favorite': card.favorite,
			'image': card.image
		}, function (data) {
			card.id = data['_id'];
		});
	};

	// Handle delete a card
	CardBoard.prototype.delete = function (card) {
		this.del(card);
		$.delete('/card/' + card.id, {}, function () {});
	};

	// Hanlde update a card to server
	CardBoard.prototype.update = function (card) {
		$.put('/card/' + card.id, {
			'name': card.name,
			'done': card.done,
			'favorite': card.favorite,
			'image': card.image
		}, function () {

		});
	};

	// Get a card from collection by id
	CardBoard.prototype.get = function (id) {
		for (var i = 0; i < cards.length; i += 1) {
			if (cards[i].id === id) return cards[i];
		}
	};

	// Add a card to collection
	CardBoard.prototype.add = function (card) {
		cards.push(card);
	};

	// Delete a card from collection
	CardBoard.prototype.del = function (card) {
		for (var i = 0; i < cards.length; i++) {
			if (cards[i]['id']=== card['id']) {
				cards.splice(i, 1);
				return;
			}
		}
	};

	// Render the board with cards
	function _render(ctx) {
		var _this = ctx;
		$('body').append(_this.$el);
		for (var i = 0; i < cards.length; i++) {
			_this.$box.append(cards[i].$el);
		}
	}

	// Initialize the board events.
	function _iniEvent(ctx) {
		var _this = ctx;

		// Body delegant events
		_this.$body.on('click', function (e) {
			var $tar = $(e.target);
			// Add button won't trigger this event
			if ($tar.is('img') && $tar.parent().hasClass('add-button')) return;
			_stopEditing();
		});

		// Add a new card
		_this.$el.find('.add-button').click(function () {
			var newcard = new Card({
				id: null,
				name: '新建的ETIWTT卡片',
				image: '/images/card/default.jpg',
				done: 0,
				favorite: 0,
				editable: true,
				display: true,
				newcard: true,
				parent: _this
			});
			_this.add(newcard);
			newcard.$el.addClass('add-card-animation');
			newcard.$el.children().hide();
			_this.$box.prepend(newcard.$el);
			setTimeout(function () {
				newcard.$el.children().fadeIn('fast');
				newcard.$el.removeClass('add-card-animation');
			}, 200);

		});

		// Show the hearted items
		_this.$el.find('.heart-button').click(function () {
			_this.display['HEARTED'] = !_this.display['HEARTED'];
			_renderCard(_this);
		});

		// Show the finised items
		_this.$el.find('.done-button').click(function () {
			_this.display['DONE'] = !_this.display['DONE'];
			_renderCard(_this);
		});
	}

	// Handle event of filter cards
	function _renderCard(ctx) {
		var _this = ctx;
		for (var i = 0; i < cards.length; i++) {
			var card = cards[i];
			if (_this.display['HEARTED']) {
				if (!card.favorite) card.display = false;
			}
			if (_this.display['DONE']) {
				if (card.done == 0) card.display = false;
			}
			if (!_this.display['DONE'] && !_this.display['HEARTED']) card.display = true;
			if (card.display) {
				card.show();
			} else {
				card.hide();
			}
		}
	}

	// Stop the editing cards and save data to models
	function _stopEditing() {
		$.each(cards, function (i, item) {
			item.stopEdit();
		});
	}

    module.exports = CardBoard;
});
