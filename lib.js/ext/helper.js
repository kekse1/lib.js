(function()
{

	//
	helper = module.exports = {};

	//
	helper.debugToFile = function(_path, _data, _append = true)
	{
		if(typeof dataToString === 'function')
		{
			_data = dataToString(_data);
		}
		else if(typeof _data !== 'string')
		{
			return x('Invalid _data (not a String)');
		}

		if(_data.length === 0)
		{
			return 0;
		}
		else
		{
			_path = path.resolve(_path);
		}

		_data += EOL;

		if(_append)
		{
			fs.appendFileSync(_path, _data, { encoding, mode: 0o600 });
		}
		else
		{
			fs.writeFileSync(_path, _data, { encoding, mdoe: 0o600 });
		}

		return _data.length;
	}

	//
	helper.getPixels = function(_string, _maximum = null, _radix = 10)
	{
		if(typeof _radix !== 'number')
		{
			_radix = 10;
		}

		if(typeof _string === 'number')
		{
			return _string;
		}
		else if(typeof _string !== 'string')
		{
			return null;
		}
		else if(_string.isNumber(_radix))
		{
			return _string.parseInt(_radix);
		}
		else if(_string.endsWith('px'))
		{
			return _string.removeLast(2).parseInt(_radix);
		}
		else if(_string.endsWith('%'))
		{
			if(typeof _maximum === 'number')
			{
				return getPercent(_string.removeLast().parseInt(_radix), _maximum, _radix);
			}

			return x('Missing _maximum value (expecting a Number due to _string has \'%\' (percent) suffix)');
		}

		return null;
	}

	helper.getPercent = function(_value, _maximum, _radix = 10)
	{
		if(typeof _radix !== 'number')
		{
			_radix = 10;
		}

		if(typeof _value === 'string' && _value.length > 0)
		{
			if(_value.endsWith('%'))
			{
				_value = _value.removeLast().parseInt(_radix);
			}
			else if(_value.isNumber(_radix))
			{
				_value = _value.parseInt(_radix);
			}
		}
		
		if(typeof _value === 'number')
		{
			if(_value <= 0)
			{
				_value = 0;
			}
			else if(_value > 100)
			{
				_value = 100;
			}
		}
		else
		{
			return x('Invalid _value (expecting Number or non-empty String)');
		}

		if(typeof _maximum !== 'number')
		{
			return x('Invalid _maximum (expecting a Number)');
		}

		if(_maximum === 0)
		{
			return 0;
		}

		return (_maximum * _value / 100);
	}

	helper.getSize = function(_string, _default_unit = 'px', _radix = 10)
	{
		if(typeof _radix !== 'number')
		{
			_radix = 10;
		}

		if(typeof _string === 'number')
		{
			return [ _string, _default_unit ];
		}
		else if(typeof _string !== 'string')
		{
			return null;
		}
		else if((_string = _string.trim()).isNumber(_radix))
		{
			return [ _string.parseNumber(_radix), _default_unit ];
		}
		
		const alpha = alphabet(_radix);
		var size = '';
		var unit = '';
		var unitStarted = false;
		var floatingStarted = false;
		const floatingSupport = (alpha.indexOf('.') === -1);

		for(var i = 0; i < _string.length; i++)
		{
			if(alpha.indexOf(_string[i]) > -1)
			{
				if(unitStarted)
				{
					unit += _string[i];
				}
				else
				{
					size += _string[i];
				}
			}
			else if(_string[i] === '.' && floatingSupport && !floatingStarted)
			{
				size += '.';
				floatingStarted = true;
			}
			else if(_string[i] === ' ' || _string[i] === '.')
			{
			}
			else if(_string.isChar(i))
			{
				unitStarted = true;

				if(_string.isChar(i) && _string[i] !== ' ')
				{
					unit += _string[i].toLowerCase();
				}
			}
		}

		if(size.length === 0)
		{
			return [ null, (unit.length === 0 ? null : unit) ];
		}

		return [ size.parseNumber(_radix), (unit.length === 0 ? null : unit) ];
	}

	helper.getUnit = function(_string)
	{
		return helper.getSize(_string)[1];
	}

	//

	//
	for(var idx in helper)
	{
		if(typeof helper[idx] === 'function')
		{
			global[idx] = helper[idx];
		}
	}

	//

})();

