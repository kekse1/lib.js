(function()
{

	//
	css = module.exports = function(_style_string, _header_string, _throw = true, ... _replaces)
	{
		return css.process(_style_string, _header_string, _throw, ... _replaces);
	}

	//
	//TODO/
	//
	css.process = function(_style_string, _header_string, _throw = true, ... _replaces)
	{
		return _style_string.eol(EOL);
	}

	css.replace = function(_css_string, ... _context)
	{
throw new Error('TODO');
		if(typeof _css_string !== 'string')
		{
			return x('Invalid % argument (not a %)', null, '_css_string', 'String');
		}
		else if(_css_string.length === 0)
		{
			return '';
		}

		const context = (typeof web === 'undefined' ? {} : web.REPLACES());
		context.merge(... _context);

		if(context.LEN === 0)
		{
			return _css_string;
		}

		return String.print(_css_string, context);
	}

	//

})();

