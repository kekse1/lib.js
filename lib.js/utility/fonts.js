(function()
{

	//
	fonts = module.exports = function(_fonts)
	{
		return fonts.count(_fonts);
	}

	//
	fonts.toString = function(_fonts, _quote = '"')
	{
		if((_fonts = fonts.toArray(_fonts)).length === 0)
		{
			return '';
		}

		var result = '';
		var sub;

		for(var i = 0; i < _fonts.length; i++)
		{
			sub = '';

			if(_fonts[i].indexOf(' ') === -1)
			{
				sub = _fonts[i];
			}
			else
			{
				sub = _quote + _fonts[i] + _quote;
			}

			result += sub + ', ';
		}

		return result.removeLast(2);
	}

	fonts.toArray = function(_fonts)
	{
		if(Array.isArray(_fonts))
		{
			return _fonts.clone();
		}
		else if(! String.isString(_fonts))
		{
			return [];
		}
		else
		{
			_fonts = _fonts.replaces('\t', ' ').replaces('  ', ' ').replaces(', ', ',');
		}

		const result = [];
		var open = '';
		var sub = '';

		for(var i = 0, j = 0; i < _fonts.length; i++)
		{
			if(open.length > 0)
			{
				if(_fonts[i] === open)
				{
					if(sub.length > 0)
					{
						result[j++] = sub;
						sub = '';
					}

					open = '';
				}
				else
				{
					sub += _fonts[i];
				}
			}
			else
			{
				if(_fonts[i] === '\'')
				{
					open = '\'';
				}
				else if(_fonts[i] === '"')
				{
					open = '"';
				}
				else if(_fonts[i] === '`')
				{
					open = '`';
				}
				else if(_fonts[i] === ',')
				{
					if(sub.length > 0)
					{
						result[j++] = sub;
						sub = '';
					}
				}
				else
				{
					sub += _fonts[i];
				}
			}
		}

		if(sub.length > 0)
		{
			result.push(sub);
		}

		return result;
	}

	fonts.count = function(_fonts)
	{
		return fonts.toArray(_fonts).length;
	}

	//

})();

