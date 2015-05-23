define(function(require, exports, module) {

	require('jquery');

	var ready = false;
	var templates = {};

	templates.get = function (name, callback) {
		if (ready) return $(templates['template-' + name]);
		return $.get('/data/fragments.html', function (data) {
			ready = true;
			data = data.split('---');
			data.splice(0, 1);
			for (var i = 0; i < data.length; i += 2) {
				templates['template-' + data[i]] = data[i+1];
			}
			callback($(templates.get(name)));
		}, 'html');
	};


    module.exports = templates;
});
