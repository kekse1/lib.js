(function()
{

	//
	javascript = module.exports = function(_script_string, _header_string, _throw = true, ... _replaces)
	{
		return javascript.process(_script_string, _header_string, _throw, ... _replaces);
	}

	//
	javascript.process = function(_script_string, _header_string, _throw = true, ... _replaces)
	{
		return _script_string.eol(EOL);
	}

	javascript.replace = function(_script_string, ... _context)
	{
throw new Error('TODO');//mayhbe...
		if(typeof _script_string !== 'string')
		{
			return x('Invalid % argument (not a %)', null, '_script_string', 'String');
		}
		else if(_script_string.length === 0)
		{
			return '';
		}

		const context = (typeof web === 'undefined' ? {} : web.REPLACES());
		context.merge(... _context);

		if(context.LEN === 0)
		{
			return _script_string;
		}
		
		return String.print(_script_string, context);
	}

	//
	
})();

