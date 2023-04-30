(function()
{

	//
	fs = module.exports = (typeof fs === 'undefined' ? require('+fs') : fs);

	//
	fs.colormap = {
		file: [ 'random', false ],
		directory: [ 'random', false ],
		symlink: [ 'random', false ],
		socket: [ 'random', false ],
		block: [ 'random', false ],
		char: [ 'random', false ],
		fifo: [ 'random', false ],
		unknown: [ 'random', false ]
	};

	//
	fs.color = function(_path, _type = null, _resolve = false)
	{
		if(typeof _path !== 'string')
		{
			return x('Invalid % argument (not a %)', null, '_path', 'String');
		}
		else if(_path.length === 0)
		{
			return _path;
		}

		if(! String.isString(_type))
		{
			if(! path.isValid(_path))
			{
				return x('No % specified, and your % is invalid (so unable to auto-detect the file %)', null, '_type', '_path', 'type');
			}
			else if(typeof _resolve !== 'boolean')
			{
				_resolve = false;
			}

			_type = fs.type(_path, null, _resolve);

			if(! String.isString(_type))
			{
				return x('Invalid % argument (not a %)', null, '_type', 'String');
			}
		}

		if(! ((_type = _type.toLowerCase()) in fs.colormap))
		{
			return x('The % \'%\' is not available in %.%', null, '_type', _type, 'fs', 'colormap');
		}

		return _path.color(... fs.colormap[_type]);
	}

	//
	//TODO/!???
	//
	fs.isPerm = function(_mode, _parse = true)
	{
		if(Number.isInt(_mode))
		{
			return (_mode < 4096);
		}
		else if(_parse && typeof _mode === 'string' && _mode.length === 10)
		{
			return fs.isPerm(fs.parsePerms(_mode));
		}

		return false;
	}

	fs.octalPerms = function(_mode)
	{
		if(Number.isInt(_mode))
		{
			return (_mode & 0o7777).toString(8);
		}

		return null;
	}

	fs.parsePerms = function(_string, _integer = false)
	{
		//
		if(fs.isPerm(_string, false))
		{
			return _string;
		}
		else if(typeof _string !== 'string' || _string.length !== 10)
		{
			return null;
		}

		if(typeof _integer !== 'boolean')
		{
			_integer = false;
		}

		//
		var result = '';

		//
		var perms, specialPerms = 0;

		for(var i = _string.length - 1, l = 0; i > 0; ++l)
		{
			perms = 0;

			for(var j = i, k = 0; j > 0 && k < 3; --j, ++k, --i)
			{
				switch(_string[j])
				{
					case 't':
						if(l === 0)
						{
							specialPerms += 1;
						}
						perms += 1;
						break;
					case 's':
						if(l === 1)
						{
							specialPerms += 2;
						}
						else
						{
							specialPerms += 4;
						}
						perms += 1;
						break;
					case 'x':
						perms += 1;
						break;
					case 'w':
						perms += 2;
						break;
					case 'r':
						perms += 4;
						break;
				}
			}

			result = perms.toString(8) + result;
		}

		if(specialPerms > 0)
		{
			result = specialPerms.toString(8) + result;
		}
		else
		{
			result = result.padStart(4, '0');
		}

		//
		if(_string[0] === 'd')
		{
			result = '40' + result;
		}

		//
		if(_integer)
		{
			return result.parseInt(8);
		}

		//
		return result;
	}

	fs.renderPerms = function(_integer)
	{
		if(typeof _integer === 'string')
		{
			if(_integer.length === 10)
			{
				_integer = fs.parsePerms(_integer, true);
			}
			else if(_integer.isInt(8))
			{
				_integer = _integer.parseInt(8);
			}
			else
			{
				return null;
			}
		}
		else if(! Number.isInt(_integer))
		{
			return null;
		}

		var octal = _integer.toString(8).padStart(3, '0');
		const result = Array.fill(10, ['']);
		var length = octal.length;

		if(length === 4 && octal[0] === '0')
		{
			octal = octal.removeFirst();
		}
		else if(length > 4)
		{
			if(octal[0] === '4')
			{
				result[0] = 'd';
			}
			else
			{
				result[0] = '-';
			}

			if((octal = octal.setLength(-4)).length === 4 && octal[0] === '0')
			{
				octal = octal.removeFirst();
			}
		}
		else
		{
			result[0] = '-';
		}

		const permTable = fs.renderPerms.permTable;
		length = octal.length;
		var sub;

		for(var i = (length === 3 ? 0 : 1), j = 1; i < octal.length; ++i, j += 3)
		{
			result.splice(j, 3, ... permTable[Number(octal[i])].split(''))
		}

		//
		if(length === 4)
		{
			sub = fs.renderPerms.specialPermTable[Number(octal[0])];

			for(var i = 0, j = 3; i < sub.length; ++i, j += 3)
			{
				if(sub[i] !== ' ')
				{
					result.splice(j, 1, sub[i]);
				}
			}
		}

		//
		return result.join('');
	}

	Object.defineProperty(fs.renderPerms, 'permTable', { get: function()
	{
		return [ '---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx' ];
	}});

	Object.defineProperty(fs.renderPerms, 'specialPermTable', { get: function()
	{
		return [ '   ', '  t', ' s ', ' st', 's  ', 's t', 'ss ', 'sst' ];
	}});

	//
	fs.perms = {
		isValid: fs.isPerm,
		octal: fs.octalPerms,
		parse: fs.parsePerms,
		render: fs.renderPerms
	};

	//

})();

