__EXT = (function()
{

	//
	module.exports = {

		modules: require('ext/modules'),

		helper: require('ext/helper'),

		alphabet: require('ext/alphabet'),

		utility: require('ext/utility'),

		numeric: require('ext/numeric'),

		string: require('ext/string/'),

		clock: require('ext/clock'),
		time: require('ext/time'),

		intl: require('ext/intl'),

		animation: require('ext/animation'),

		crypt: require('ext/crypt'),
		sort: require('ext/sort')

	};

	//

	//
	return Date.now();

})();
