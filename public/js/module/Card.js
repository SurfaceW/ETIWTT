define(function(require, exports, module) {

	require('jquery');
	var template = require('templates');
	var Dropzone = require('dropzone');
	var dropzoneConf = {
		url: '/card/image',
		method: 'post',
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
		this.image = data.image;
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
		this.modified = false;

		// Other plugins
		this.dropzone = null;

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

	Card.prototype.stopEditName = function () {
		this.editStatus.name = false;
		this.$name.prop({'contenteditable': false});
	};

	// Edit the card image
	Card.prototype.editImage = function () {
		var _this = this;
		this.editable = true;
		this.editStatus.image = true;
		this.$image.css({'opacity': 0});
		this.$uiDropzone.fadeIn('fast');
		if (!this.dropzone) {
			var conf = $.extend({}, dropzoneConf);
			conf.url += ('/' + this.id);
			this.dropzone = new Dropzone(this.$uiDropzone.get(0), conf);
			// Dropzone ini function, called while ini the dropzone plugin
			this.dropzone.on('success', function (file) {
				var res = $.parseJSON(file.xhr.response);
				_this.image = res.image;
				_this.modified = true;
				_this.stopEdit();
			});
		}
	};

	// Stop edit the image
	Card.prototype.stopEditImage = function () {
		this.$image.css({'background-image': 'url(' + this.image + ')'});
		this.$image.css({'opacity': 1});
		this.$uiDropzone.hide();
	};

// Stop editing card
	Card.prototype.stopEdit = function () {
		this.editable = false;
		if (this.$name.text() !== this.name) {
			this.modified = true;
			this.name = this.$name.text();
		}
		this.stopEditName();
		this.stopEditImage();
		if (this.newcard) {
			this.parent.create(this);
			this.newcard = false;
		} else if (this.modified) {
			this.parent.update(this);
			this.modified = false;
		}
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
		this.image ? this.$image.css({'background-image': 'url(' + this.image + ')'})
			: this.$image.css({'background-image': 'url(/images/card/default.jpg)'});
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
				// _this.$el.css({'-webkit-transform': 'scale(0)'});
				_this.$el.children().fadeOut(400);
				_this.$el.addClass('del-card-animation');
				setTimeout(function () {
					_this.$el.remove();
					_this.parent.delete(_this);
				}, 400);

			} else if ($tar.hasClass('card-favorite')) {

				// Click favorite button
				_this.favorite = !_this.favorite;

			} else if ($tar.hasClass('card-done')) {

				// Click done button
				_this.done ++;
				_this.$hint.text(_this.done);

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
		_this.$image.dblclick(function (e) {
			_this.editImage();
			e.stopPropagation();
		});
	}

    module.exports = Card;
});
