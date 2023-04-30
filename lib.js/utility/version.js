(function()
{

	//
	version = module.exports = {};

	//
	version.toArray = function()
	{
		var ver;
		
		if(arguments.length === 0 || typeof arguments[0] === 'undefined' || arguments[0] === null)
		{
			return [ 0, 0, 0 ];
		}
		else if(arguments.length === 1)
		{
			if(typeof arguments[0] === 'string')
			{
				ver = arguments[0];
			}
			else if(Array.isArray(arguments[0]))
			{
				ver = version.toString(arguments[0]);
			}
			else if(typeof arguments[0] === 'number')
			{
				return [ arguments[0] ];
			}
			else
			{
				return x('Invalid version argument');
			}
		}
		else
		{
			return version.toArray(arguments);
		}

		//
		if(ver[0] === 'v')
		{
			ver = ver.substr(1);
		}

		if(ver.length === 0)
		{
			return x('Version is zero/empty');
		}
		else
		{
			ver = ver.removeStarting('.').removeEnding('.')
				.removeStarting('-').removeEnding('-')
				.removeStarting('_').removeEnding('_');

			while(ver.indexOf('..') > -1)
			{
				ver = ver.replaceAll('..', '.');
			}
		}

		//
		const result = [];
		var release = null;
		var sub = '';
		
		for(var i = 0; i < ver.length; i++)
		{
			if(release === null)
			{
				if(ver[i] === '.' || ver[i] === '-' || ver[i] === '_')
				{
					if(ver[i] !== '.')
					{
						release = '';
					}
					
					if(sub.length > 0)
					{
						if(sub.isInt())
						{
							result.push(parseInt(sub));
						}
						else
						{
							release = sub;
						}

						sub = '';
					}

					if(ver[i] !== '.' && release === null)
					{
						release = '';
					}

					if(release !== null && release.length > 0)
					{
						release += ver[i];
					}
				}
				else
				{
					sub += ver[i];
				}
			}
			else
			{
				release += ver[i];
			}
		}

		//
		if(sub.length > 0)
		{
			if(sub.isInt())
			{
				result.push(parseInt(sub));
			}
			else if(release === null)
			{
				release = sub;
			}
			else
			{
				release += sub;
			}
		}

		if(typeof release === 'string' && release.length > 0)
		{
			result.push(release.removeStarting('.').removeEnding('.')
				.removeStarting('-').removeEnding('-')
				.removeStarting('_').removeEnding('_'));
		}

		//
		return version.pad(result);
	}

	version.pad = function(_array)
	{
		//
		var tmp = null;

		if(typeof _array.last() === 'string')
		{
			tmp = _array.removeLast();
		}

		for(var i = _array.length; i < 3; i++)
		{
			_array[i] = 0;
		}

		if(tmp)
		{
			_array.push(tmp);
		}

		//
		return _array;
	}

	version.toString = function()
	{
		var ver;

		if(arguments.length === 0 || typeof arguments[0] === 'undefined' || arguments[0] === null)
		{
			return 'v0.0.0';
		}
		else if(arguments.length === 1)
		{
			if(typeof arguments[0] === 'string')
			{
				if(arguments[0].length === 0 || arguments[0] === 'v')
				{
					return x('Version string is empty');
				}

				ver = version.toArray(arguments[0]);
			}
			else if(Array.isArray(arguments[0]))
			{
				if(arguments[0].length === 0)
				{
					return x('Version array is empty');
				}
				else for(var i = 0; i < arguments[0].length; i++)
				{
					if(typeof arguments[0][i] === 'string')
					{
						if(arguments[0].length > (i + 1))
						{
							return x('There can be only one string at the end of the version array');
						}

						break;
					}
					else if(typeof arguments[0][i] !== 'number')
					{
						return x('Invalid version array');
					}
				}

				ver = arguments[0];
			}
			else if(typeof arguments[0] === 'number')
			{
				ver = [ ver, 0, 0 ];
			}
			else
			{
				return x('Invalid version argument');
			}
		}
		else
		{
			return version.toString(arguments);
		}
		
		//
		ver = version.pad(ver);

		//
		var result = 'v';

		for(var i = 0; i < ver.length; i++)
		{
			if(typeof ver[i] === 'number')
			{
				if(ver[i].isInt)
				{
					result += ver[i] + '.';
				}
				else
				{
					return x('A version can\'t carry floating point numbers');
				}
			}
			else if(typeof ver[i] === 'string')
			{
				if(ver[i].length === 0)
				{
					continue;
				}
				else if(ver[i].isInt())
				{
					ver[i] = parseInt(ver[i]);
					--i;
				}
				else
				{
					if(result === 'v')
					{
						result = ver[i];
					}
					else
					{
						if(result.last() === '.')
						{
							result = result.removeLast();
						}

						result += ('-' + ver[i]);
					}

					break;
				}
			}
		}

		return result.removeStarting('.').removeEnding('.');
	}

	//
	version.release = function(_version, _release, _append)
	{
		if(arguments.length === 0 || typeof _version === 'undefined' || _version === null)
		{
			return '';
		}

		const wasString = (typeof _version === 'string');

		if(Array.isArray(_version = version.toArray(_version)))
		{
			if(typeof _release === 'string' && _release.length > 0)
			{
				if(typeof _version.last() === 'string')
				{
					if(typeof _append === 'string' && _append.length > 0)
					{
						_version[_version.length - 1] += (_append + _release);
					}
					else
					{
						_version[_version.length - 1] = _release;
					}
				}
				else
				{
					_version.push(_release);
				}

				if(wasString)
				{
					return version.toString(_version);
				}

				return _version;
			}
			
			if(typeof _version.last() === 'string')
			{
				return _version.last();
			}
			
			return '';
		}
		
		return null;
	}

	version.unrelease = function()
	{
		const wasString = (typeof arguments[0] === 'string');
		const v = version.toArray.apply(this, arguments);

		while(typeof v.last() === 'string')
		{
			v.removeLast();
		}

		if(wasString)
		{
			return version.toString(v);
		}

		return v;
	}

	//
	version.parse = function(_string)
	{
		return version.toArray(_string);
	}

	version.toJSON = function()
	{
		const ver = version.toArray.apply(this, arguments);

		if(ver.length === 0)
		{
			return '[ 0, 0, 0 ]';
		}

		//
		var result = '[ ';

		for(var i = 0; i < ver.length; i++)
		{
			if(typeof ver[i] === 'number')
			{
				result += ver[i] + ', ';
			}
			else if(typeof ver[i] === 'string')
			{
				result += ver[i].quote('"') + ', ';
			}
		}

		return (result.removeLast(2) + ' ]');
	}

	version.fromJSON = function(_json)
	{
		return version.parse(JSON.parse(_json));
	}

	//
	version.major = function(_version, _release)
	{
		return version.update(0, _version, _release);
	}

	version.minor = function(_version, _release)
	{
		return version.update(1, _version, _release);
	}

	version.patch = function(_version, _release)
	{
		return version.update(2, _version, _release);
	}

	version.update = function(_index, _version, _release)
	{
		//
		_version = version.toArray(_version);
		const release = (typeof _version.last() === 'string' ? _version.pop() : '');

		//
		if(typeof _index !== 'number')
		{
			return x('Invalid _index');
		}
		else if(_index < 0)
		{
			_index = _version.getIndex(_index);
		}

		//
		for(var i = 0; i <= _index; i++)
		{
			if(typeof _version[i] !== 'number')
			{
				if(i === _index)
				{
					_version[i] = 1;
				}
				else
				{
					_version[i] = 0;
				}
			}
			else if(i === _index)
			{
				_version[i]++;
			}
		}

		_version = _version.subarr(0, Math._max(3, _index + 1));

		for(var i = _index + 1; i < 3; i++)
		{
			_version[i] = 0;
		}

		//
		if(typeof _release === 'string' || typeof _release === 'boolean')
		{
			if(typeof _release === 'string' && _release.length > 0)
			{
				_version.push(_release);
			}
			else if(_release === true && release)
			{
				_version.push(release);
			}
		}

		//
		return _version;
	}

	//
	version.order = function(_array, _asc = true, _type = 'original', _release = true)
	{
		if(arguments.length === 0)
		{
			return x('At least one argument is necessary');
		}
		else if(! Array.isArray(_array))
		{
			return x('Invalid _array');
		}

		if(typeof _type === 'string') switch(_type.toLowerCase())
		{
			case 'original':
			case 'string':
			case 'array':
			case 'order':
			case 'all':
				_type = _type.toLowerCase();
				break;
			default:
				return x('_type needs to be one of [ original, string, array, order, all ]');
		}
		else
		{
			return x('_type should be a String [ original, string, array, order, all ]');
		}

		//
		const array = new Array(_array.length);
		const max = [];

		for(var i = 0; i < _array.length; i++)
		{
			array[i] = { original: _array[i],
				array: version.toArray(_array[i]),
				string: version.toString(_array[i]),
				order: ''
			};

			//
			for(var j = 0; j < array[i].array.length; j++)
			{
				if(typeof max[j] !== 'number')
				{
					max[j] = 0;
				}

				if(typeof array[i].array[j] === 'number')
				{
					max[j] = Math._max(max[j], array[i].array[j].toString().length);
				}
			}
		}
		
		for(var i = 0; i < array.length; i++)
		{
			for(var j = 0; j < max.length; j++)
			{
				if(typeof array[i].array[j] === 'number')
				{
					array[i].order += array[i].array[j].toString().padStart(max[j], '0');
				}
				else
				{
					array[i].order += String.fill(max[j], '0');
				}
			}

			if(_release && typeof array[i].array.last() === 'string')
			{
				array[i].order += ' ' + array[i].array.last();
			}
		}

		//
		array.sort('order', _asc, true);

		//
		switch(_type)
		{
			case 'original':
				for(var i = 0; i < array.length; i++)
				{
					array[i] = array[i].original;
				}
				break;
			case 'string':
				for(var i = 0; i < array.length; i++)
				{
					array[i] = array[i].string;
				}
				break;
			case 'array':
				for(var i = 0; i < array.length; i++)
				{
					array[i] = array[i].array;
				}
				break;
			case 'order':
				for(var i = 0; i < array.length; i++)
				{
					array[i] = array[i].order;
				}
				break;
			case 'all':
				//
				break;
		}

		//
		return array;
	}

	//

})();

