define(function(require, exports, module) {

	require('jquery');
	var template = require('templates');
	var Dropzone = require('dropzone');
	var dropzoneConf = {
		url: '/file/upload',
		maxFilesize: 2, // 2MB Maxsize
		uploadMultiple: false,
		thumbnailWidth: 200,
		thumbnailHeight: 200
	};

	var _id = 0;

	var Card = function (data) {

		// Card Properties
		this.uid = _id;
		this.$el = template.get('Card');
		this.id = data.id;
		this.name = data.name;
		this.img = data.img;
		this.done = data.done;
		this.favorite = data.favorite == 1 ? true : false;

		// DOM Elements wrappered by jQuery
		this.$image = this.$el.find('.card-image');
		this.$hint = this.$el.find('.card-hint');
		this.$name = this.$el.find('.card-name');
		this.$ui = this.$el.find('.card-ui');
		this.$uiDropzone = this.$el.find('.card-dropzone');
		this.$uiDelete = this.$el.find('.card-delete');
		this.$uiFavorite = this.$el.find('.card-favorite');
		this.$uiDone = this.$el.find('.card-done');
		this.$uiCreate = this.$el.find('.card-ui-create');

		// States
		this.editable = data.editable || false;
		this.newcard = data.newcard || false;
		this.editStatus = {
			'name': data.editableName || false,
			'image': data.editableImage || false
		};
		this.display = data.display || true;

		// ParentView
		this.parent = data.parent;
		this.render();
		_iniEvent(this);
		_id ++;
	};

// Hide the current card
	Card.prototype.hide = function () {
		this.$el.hide();
	};

// Show the current card
	Card.prototype.show = function () {
		this.$el.show();
	};

// Edit the card name
	Card.prototype.editName = function () {
		this.editable = true;
		this.editStatus.name = true;
		this.$name.prop({'contenteditable': true});
	};

// Edit the card image
	Card.prototype.editImage = function () {
		this.editable = true;
		this.editStatus.image = true;
		this.$image.css({'opacity': 0});
		this.$uiDropzone.fadeIn('fast');
		var dropzone = new Dropzone(this.$uiDropzone.get(0), dropzoneConf);
	};

// Stop editing card
	Card.prototype.stopEdit = function () {
		this.editable = false;
		this.$name.prop({'contenteditable': false});
		this.name = this.$name.text();
		this.image = this.$image.css('background-image');
		if (!this.newcard) this.parent.update(this);
	};

// Render the card with data
	Card.prototype.render = function () {
		// Editable or not?
		if (this.editable) {
			this.editName();
			this.editImage();
		}

		// New card to show save button
		if (this.newcard) {
			this.$uiCreate.show();
		}

		// this.$image.css();
		this.$name.text(this.name);
		this.$hint.text(this.done);
	};

// Dispose the current card
	Card.prototype.dispose = function () {
		this.$el.off('click');
		this.$el.remove();
	};

// Ini the event bindings.
	function _iniEvent(ctx) {
		var _this = ctx;

		// Event Proxy
		_this.$el.click(function (e) {
			var $tar = $(e.target);

			if ($tar.hasClass('card-delete')) {

				// Delete a card
				_this.parent.delete(_this);

			} else if ($tar.hasClass('card-favorite')) {

				// Click favorite button
				_this.favorite = !_this.favorite;

			} else if ($tar.hasClass('card-done')) {

				// Click done button
				_this.done ++;
				_this.$hint.text(_this.done);

			} else if ($tar.hasClass('card-create')) {

				// Click the create card button
				_this.parent.create(_this);

			} else if (_this.editStatus['name']
				&& !$tar.hasClass('card-name')) {

				// Stop edit modes
				_this.stopEdit();

			}
			e.stopPropagation();
		});

		// Event Card with Hovering
		_this.$el.hover(
		function (e) {
			// Hover-in
			if (_this.editable) return;
			_this.$ui.fadeIn('fast');
		},
		function (e) {
			// Hover-out
			_this.$ui.fadeOut('fast');
		});

		// Edit the card Event
		_this.$name.dblclick(function (e) {
			_this.editName();
			e.stopPropagation();
		});

		// Edit the image replacement Event
		// Use plugin dropzone
		_this.$image.dblclick(function () {
			_this.editImage();
			e.stopPropagation();
		});

		// Dropzone ini function, called while ini the dropzone plugin
		dropzoneConf.init = function () {
			// this.on();
		};
	}

    module.exports = Card;
});
