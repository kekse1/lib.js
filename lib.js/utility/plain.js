(function()
{

	//
	plain = module.exports = function(_plain_string, _header_string, _throw = true, ... _replaces)
	{
		return plain.process(_plain_string, _header_string, _throw, ... _replaces);
	}

	//
	//TODO/
	//
	plain.process = function(_plain_string, _header_string, _throw = true, ... _replaces)
	{
		return _plain_string.eol(EOL);
	}

	plain.replace = function(_plain_string, ... _context)
	{
throw new Error('TODO');
		if(typeof _plain_string !== 'string')
		{
			return x('Invalid % argument (not a %)', null, '_plain_string', 'String');
		}
		else if(_plain_string.length === 0)
		{
			return '';
		}

		const context = (typeof web === 'undefined' ? {} : web.REPLACES());
		context.merge(... _context);

		if(context.LEN === 0)
		{
			return _plain_string;
		}

		return String.print(_plain_string, context);
	}

	//

})();

