module.exports = function _()
{

	//
	if(typeof utility === 'undefined')
	{
		utility = {};
	}

	//
	utility.assign({

		json: require('utility/json'),
		jsoff: require('utility/jsoff'),
		id: require('utility/id'),
		color: require('utility/color'),
		version: require('utility/version')

		//
		//fuzzy: require('utility/fuzzy'),
		//config: require('utility/config'),
		//big: require('utility/big'),
		//ascii: require('utility/asci''),
		//perso: require('utility/perso'),
		//credit: require('utility/credit'),
		//

	});

	//
	if(__INIT)
	{
		utility.assign({

			camel: (BROWSER ? require('utility/camel') : null),
			fonts: (BROWSER ? require('utility/fonts') : null),
			getopt: (BROWSER ? null : require('utility/getopt')),
			geo: (BROWSER ? require('utility/geo') : null)

		});
	}
	else
	{
		utility.assign({

			javascript: require('utility/javascript'),
			plain: require('utility/plain'),
			css: require('utility/css'),
			xml: require('utility/xml'),
			camel: require('utility/camel'),
			fonts: require('utility/fonts'),
			getopt: require('utility/getopt'),
			geo: require('utility/geo'),
			levenshtein: require('utility/levenshtein'),
			bionic: require('utility/bionic')

		});
	}

	//
	if(typeof utility.id !== 'undefined')
	{
		utility.uuid = utility.id.uuid;
	}

	//
	return utility;
	
}

