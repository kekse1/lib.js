(function()
{
	
	//
	const DEFAULT_CAMEL = '-';

	//
	camel = module.exports = function(_string, _camel = DEFAULT_CAMEL)
	{
		if(typeof _camel === 'string')
		{
			if(_camel.length !== 1)
			{
				return x('Invalid % argument (needs to be a % of length %)', null, '_camel', 'String', 1);
			}
		}
		else
		{
			_camel = DEFAULT_CAMEL;
		}

		if(typeof _string !== 'string')
		{
			return undefined;
		}
		else if(_string.length === 0)
		{
			return null;
		}
		else if(_string.includes(_camel + _camel))
		{
			return null;
		}
		else if(_string.includes(_camel))
		{
			return false;
		}
		else if(_string.oneCase)
		{
			return false;
		}

		return true;
	}

	//
	camel.enable = function(_string, _camel = DEFAULT_CAMEL, _fix = false)
	{
		const c = camel(_string, _camel);

		if(c !== false)
		{
			return _string;
		}

		const split = _string.split(_camel);
		var result = split.shift();

		for(const s of split)
		{
			if(s.length > 0)
			{
				if(_fix)
				{
					result += s[0].toUpperCase() + s.substr(1).toLowerCase();
				}
				else
				{
					result += s[0].toUpperCase() + s.substr(1);
				}
			}
		}

		return result;
	};

	camel.disable = function(_string, _camel = DEFAULT_CAMEL, _fix = true, _filter = false)
	{
		const c = camel(_string, _camel);

		if(c !== true)
		{
			return _string;
		}
		else if(_filter)
		{
			if(_string.isUpperCase)
			{
				return _string;
			}
			else if(_string.indexOf(' ') > -1)
			{
				return _string;
			}
		}

		var result = '';
		var lastWasUpper = null;

		for(var i = 0; i < _string.length; ++i)
		{
			if(_string[i].isUpperCase)
			{
				if(lastWasUpper)
				{
					result += _string[i];
				}
				else if(_fix && i < (_string.length - 1))
				{
					if(_string[i + 1].isUpperCase)
					{
						result += _camel + _string[i];
					}
					else
					{
						result += _camel + _string[i].toLowerCase();
					}
				}
				else
				{
					result += _camel + _string[i].toLowerCase();
				}

				lastWasUpper = true;
			}
			else
			{
				lastWasUpper = false;
				result += _string[i];
			}
		}

		return result;
	}

	//
	
})();

