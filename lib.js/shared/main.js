(function()
{

	//
	module.exports = {

		console: require('shared/console'),

		fs: require('shared/fs'),//needs to be *before* 'path'..
		path: require('shared/path'),

		crypto: require('shared/crypto')

	};

	//

})();

