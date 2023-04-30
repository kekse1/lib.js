(function()
{

	//
	VERSION = require('version.json');
	const version = require('utility/version').toString(VERSION);

	if(typeof process === 'undefined')
	{
		require('+process');
	}

	if(typeof process.version === 'undefined')
	{
		process.version = version;
	}

	if(typeof process.versions === 'undefined')
	{
		process.versions = Object.create(null);
	}

	process.versions['library'] = process.versions['lib'] = version.substr(1);
	process.versions['browser'] = (BROWSER ? window.navigator.userAgent : '');

	//
	module.exports = Object.create(null);
	module.exports.VERSION = VERSION;
	module.exports.version = version;
	module.exports.versions = process.versions;

	//

})();

