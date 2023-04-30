(function()
{

	//
	if(typeof tty === 'undefined')
	{
		tty = require('+tty');
	}

	//
	module.exports = tty;

	//
	tty.assign({

		ansi: require('tty/ansi'),
		prompt: require('tty/prompt/'),
		raw: require('tty/raw/'),
		vector: require('tty/vector'),
		box: require('tty/box/'),
		//mux: require('tty/mux/')

	});

	//

})();

