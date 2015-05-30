define(function(require, exports, module) {

	require('jquery');

	var ready = false;
	var templates = {};

	templates.get = function (name, callback) {
		if (ready && !callback) {
			return $(templates['template-' + name]);
		} else if (ready && callback) {
			callback($(templates.get(name)));
			return;
		}
		$.get('/data/fragments.html', function (data) {
			ready = true;
			data = data.split('---');
			data.splice(0, 1);
			for (var i = 0; i < data.length; i += 2) {
				templates['template-' + data[i]] = data[i+1];
			}
			callback($(templates['template-' + name]));
		}, 'html');
	};


    module.exports = templates;
});
