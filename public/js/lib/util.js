define(function(require, exports, module) {

    // Expand the Ajax of jQuery
    $.put = function (url, data, callback, type) {
        return $.ajax({
            url: url,
            method: 'PUT',
            type: type,
            data: data,
            success: callback
        });
    };

    $.delete = function (url, data, callback, type) {
        return $.ajax({
            url: url,
            method: 'DELETE',
            type: type,
            data: data,
            success: callback
        });
    };

    module.exports.rand = function (max) {
		Math.floor(Math.random() * max);
	};

});
