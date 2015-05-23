define(function(require, exports, module) {

    module.exports.rand = function (max) {
		Math.floor(Math.random() * max);
	};

});
