(function()
{

	//
	module.exports = JSON;

	//
	JSON.process = function(_string, _throw = true, ... _replaces)
	{
		return _string.eol(EOL);
	}

	JSON.replace = function(_string, ... _context)
	{
throw new Error('TODO');//..maybe.
		if(typeof _string !== 'string')
		{
			return x('Invalid % argument (not a %)', null, '_string', 'String');
		}
		else if(_string.length === 0)
		{
			return '';
		}

		const context = (typeof web === 'undefined' ? {} : web.REPLACES());
		context.merge(... _context);

		if(context.LEN === 0)
		{
			return _string;
		}

		return String.print(_string, context);
	}

	//
	const _parse = JSON.parse.bind(JSON);
	const _stringify = JSON.stringify.bind(JSON);

	JSON.parse = function(_string, ... _args)
	{
		if(typeof _string !== 'string')
		{
			return x('Invalid % argument (expecting a %)', null, '_string', 'String');
		}
		else if(_string.length === 0)
		{
			return Object.create(null);
		}

		return _parse.call(JSON, _string, ... _args);
	}

	JSON.stringify = function(... _args)
	{
		return _stringify.apply(JSON, _args);
	}

	//
	
})();

