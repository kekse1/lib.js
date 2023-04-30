(function()
{

	//
	if(BROWSER)
	{
		module.exports = require('ext/string/html');
	}
	else
	{
		module.exports = require('ext/string/ansi');
	}

	//
	
})();

