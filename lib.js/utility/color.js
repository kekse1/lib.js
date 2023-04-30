(function()
{

	//
	const DEFAULT_PRECISION = 7;
	const DEFAULT_NORMALIZED = true;

	//
	const tryToPrepareColor = (_color) => {
		if(typeof _color === 'string')
		{
			if(_color.length === 0)
			{
				_color = 'random';
			}
			else
			{
				const c = CONFIG['COLOR_' + _color.toUpperCase()];

				if(color.isColor(c, false, false, false, false, false, false))
				{
					_color = c;
				}
			}
		}

		return _color;
	};

	const checkForAnsiColor = (_c) => {
		if(typeof ansi === 'undefined')
		{
			require('tty/ansi');
		}

		if(Number.isInt(_c) && _c >= 0 && _c <= 255)
		{
			return _c;
		}
		else if(String.isString(_c)) for(const c of ansi.colors)
		{
			if(_c.toLowerCase().endsWith(c.toLowerCase()))
			{
				return _c;
			}
		}

		return null;
	};

	//
	module.exports = color = function(_color, _alpha = false)
	{
		var a;

		if(a = checkForAnsiColor(_color))
		{
			return a;
		}
		else
		{
			a = null;
		}

		if(_color === false || _color === null)
		{
			return false;
		}
		else if(color.isRandomColor(_color))
		{
			_color = 'random';
		}
		else if(typeof _color === 'string')
		{
			_color = tryToPrepareColor(_color);
		}

		return color.random(_color, _alpha);
	}

	color.map = require('utility/color.json');

	color.isAnsiColor = checkForAnsiColor;

	color.depth = function(_color)
	{
		_color = color.hex(... arguments);

		if(color.isColor(_color, true, false, false, false, false, false))
		{
			if(_color.length === 4 || _color.length === 7)
			{
				return 24;
			}
			else if(_color.length === 5 || _color.length === 9)
			{
				return 32;
			}
		}

		return 0;
	}

	color.type = function(_color, _prepare = true, _number = false, _ansi = false)
	{
		var result;

		if(typeof _prepare !== 'boolean')
		{
			_prepare = true;
		}

		if(_prepare)
		{
			_color = tryToPrepareColor(_color);
		}

		if(typeof _color === 'string')
		{
			//
			_color = _color.toLowerCase().trim();

			//
			if(_color.length === 0)
			{
				result = 'random';
			}
			else if(_color.startsWith('random'))
			{
				result = 'random';
			}
			else
			{
				//
				if(_color[0] === '#')
				{
					_color = _color.substr(1);
				}

				//
				if(_color.isInt(16))
				{
					result = 'hex';
				}
				else if(_color.startsWith('argb(') && _color.last() === ')')
				{
					result = 'argb';
				}
				else if(_color.startsWith('rgba(') && _color.last() === ')')
				{
					result = 'rgba';
				}
				else if(_color.startsWith('rgb(') && _color.last() === ')')
				{
					result = 'rgb';
				}
				else if(_color.isInt())
				{
					result = 'number';//TODO/frage: konversion, spaeter? markieren, dass nur in string-form die number!??
				}
				else
				{
					result = '';
				}

				if(result.length > 0)
				{
					try
					{
						getArrayFromString(_color);
					}
					catch(_error)
					{
						result = '';
					}
				}
				
				if(_ansi && result.length === 0 && ansi.isColor(_color))
				{
					result = 'ansi';
				}
			}
		}
		else if(_number && typeof _color === 'number')
		{
			if(_color.isInt)
			{
				result = 'number';
			}
			else if(_color.isFloat)
			{
				result = 'float';//vergliece 'float' vs. 'floats'!!!
			}
			else
			{
				result = '';
			}
		}
		else if(Array.isArray(_color, false))
		{
			if(_color.length === 3 || _color.length === 4)
			{
				if(_color[0].isInt)
				{
					result = 'bytes';
				}
				else if(_color[0].isFloat)
				{
					result = 'floats';
				}
				else
				{
					result = '';
				}
			}
			else if(_color.length > 0)
			{
				if(Number.isInt(_color[0]))
				{
					result = 'random';
				}
				else
				{
					result = '';
				}
			}
			else
			{
				result = '';
			}
		}
		else if(typeof _color === 'undefined' || _color === true)
		{
			result = 'random';
		}
		else
		{
			result = '';
		}

		return result;
	}

	color.isRandomColor = function(_color, _ansi = true)
	{
		if(typeof _color === 'undefined')
		{
			return true;
		}
		else if(_color === true)
		{
			return true;
		}
		else if(typeof _color === 'string' && (_color.length === 0 || _color.toLowerCase().startsWith('random')))
		{
			return true;
		}

		if(_ansi)
		{
			return ansi.isRandomColor(_color);
		}

		return false;
	}

	color.isColor = function(_color, _prepare = true, _boolean = true, _null = false, _undefined = false, _number = false, _ansi = false)
	{
		if(typeof _color === 'undefined')
		{
			return _undefined;
		}
		else if(typeof _color === 'boolean')
		{
			return _boolean;
		}
		else if(_color === null)
		{
			return _null;
		}

		var result = color.is(_color, null, _prepare, _number, _ansi);

		if(! result && _ansi)
		{
			result = ansi.isColor(_color);
		}

		return result;
	}

	color.is = function(_color, _type = null, _prepare = true, _number = false, _ansi = false)
	{
		if(! String.isString(_type))
		{
			return (color.type(_color, _prepare, _number, _ansi).length > 0);
		}

		return (color.type(_color, _prepare, _number, _ansi) === _type);
	}

	color.is.hex = function(_color)
	{
		return color.is(_color, 'hex');
	}

	color.is.rgb = function(_color)
	{
		return color.is(_color, 'rgb');
	}

	color.is.rgba = function(_color)
	{
		return color.is(_color, 'rgba');
	}

	color.is.argb = function(_color)
	{
		return color.is(_color, 'argb');
	}

	color.is.number = function(_color)
	{
		return color.is(_color, 'number', true, true);
	}

	color.is.bytes = function(_color)
	{
		return color.is(_color, 'bytes');
	}

	color.is.floats = function(_color)
	{
		return color.is(_color, 'floats');
	}

	Object.defineProperty(color, 'colors', { get: function()
	{
		return [ 'bytes', 'floats', 'hex', 'number', 'rgb', 'argb', 'rgba' ];
	}});

	color.isColorType = function(_value, _empty = true)
	{
		if(typeof _value === 'string')
		{
			if(_value.length === 0)
			{
				return true;
			}
			
			return (color.colors.indexOf(_value.toLowerCase()) > -1);
		}

		return null;
	}

	color.isValid = function(_color)
	{
		return (color.type(_color).length > 0);

		/*
		try
		{
			_color = color.apply(this, arguments);
		}
		catch(_error)
		{
			return false;
		}

		return true;*/
	}

	//
	color.light = function(_color, _level = 10, _alpha = false)
	{
		if(!color.isValid(_color))
		{
			return x('Invalid _color');
		}
		else
		{
			_color = color(_color);
		}

		if(_alpha)
		{
			var old;

			if(_color.length === 4)
			{
				old = _color.pop() * 255;
			}
			else
			{
				old = 255;
			}

			if((old -= _level) > 255)
			{
				old = 255;
			}

			_color.push(Math.round(old / 255, DEFAULT_PRECISION));
		}
		else for(var i = 0; i < 3; i++)
		{
			if((_color[i] += _level) > 255)
			{
				_color[i] = 255;
			}
		}

		return _color;
	}

	color.light.hex = function(_color, _level = 10, _alpha = false)
	{
		return color.hex(color.light(_color, _level, _alpha));
	}

	color.light.rgb = function(_color, _level = 10)
	{
		return color.rgb(color.light(_color, _level, false));
	}

	color.light.rgba = function(_color, _level = 10, _alpha = false)
	{
		return color.rgba(color.light(_color, _level, _alpha));
	}

	color.light.argb = function(_color, _level = 10, _alpha = false)
	{
		return color.argb(color.light(_color, _level, _alpha));
	}

	color.light.number = function(_color, _level = 10, _alpha = false)
	{
		return color.number(color.light(_color, _level, _alpha));
	}

	color.dark = function(_color, _level = 10, _alpha = false)
	{
		_color = color(_color);

		if(_alpha)
		{
			var old;

			if(_color.length === 4)
			{
				old = _color.pop() * 255;
			}
			else
			{
				old = 255;
			}

			if((old += _level) < 0)
			{
				old = 0;
			}

			_color.push(Math.round(old / 255, DEFAULT_PRECISION));
		}
		else for(var i = 0; i < 3; i++)
		{
			if((_color[i] -= _level) < 0)
			{
				_color[i] = 0;
			}
		}

		return _color;
	}

	color.dark.hex = function(_color, _level = 10, _alpha = false)
	{
		return color.hex(color.dark(_color, _level, _alpha));
	}

	color.dark.rgb = function(_color, _level = 10)
	{
		return color.rgb(color.dark(_color, _level, false));
	}

	color.dark.rgba = function(_color, _level = 10, _alpha = false)
	{
		return color.rgba(color.dark(_color, _level, _alpha));
	}

	color.dark.argb = function(_color, _level = 10, _alpha = false)
	{
		return color.argb(color.dark(_color, _level, _alpha));
	}

	color.dark.number = function(_color, _level = 10, _alpha = false)
	{
		return color.number(color.dark(_color, _level, _alpha));
	}

	//
	color.complement = function(_color)
	{
		_color = color.apply(this, arguments);

		for(var i = 0; i < _color.length; i++)
		{
			_color[i] = (255 - _color[i]);
		}

		return _color;
	}

	color.complement.bytes = color.complement;

	color.complement.floats = function(_color)
	{
		return color.floats(color.complement.apply(this, arguments));
	}

	color.complement.hex = function(_color)
	{
		return color.hex(color.complement.apply(this, arguments));
	}

	color.complement.rgb = function(_color)
	{
		return color.rgb(color.complement.apply(this, arguments));
	}

	color.complement.rgba = function(_color)
	{
		return color.rgba(color.complement.apply(this, arguments));
	}

	color.complement.argb = function(_color)
	{
		return color.argb(color.complement.apply(this, arguments));
	}

	color.complement.number = function(_color)
	{
		return color.number(color.complement.apply(this, arguments));
	}

	//
	color.complement.color4 = function(_color)
	{
		return require('tty/ansi').color4.complement(_color);
	}

	//
	color.contrast = function(_color)
	{
//todo/
throw new Error('TODO');
		//
		_color = color.apply(this, arguments);
	}

	color.contrast.bytes = color.contrast;

	color.contrast.floats = function(_color)
	{
		return color.floats(color.contrast.apply(this, arguments));
	}

	color.contrast.hex = function(_color)
	{
		return color.hex(color.contrast.apply(this, arguments));
	}

	color.contrast.rgb = function(_color)
	{
		return color.rgb(color.contrast.apply(this, arguments));
	}

	color.contrast.rgba = function(_color)
	{
		return color.rgba(color.contrast.apply(this, arguments));
	}

	color.contrast.argb = function(_color)
	{
		return color.argb(color.contrast.apply(this, arguments));
	}

	color.contrast.number = function(_color)
	{
		return color.number(color.contrast.apply(this, arguments));
	}

	//
	color.red = function(_color)
	{
		return color.apply(this, arguments)[0];
	}

	color.green = function(_color)
	{
		return color.apply(this, arguments)[1];
	}

	color.blue = function(_color)
	{
		return color.apply(this, arguments)[2];
	}

	color.alpha = function(_color)
	{
		const res = color.apply(this, arguments)[3];

		if(typeof res !== 'number')
		{
			return 1.0;
		}

		return res;
	}

	//
	color.red.set = function(_value, _color)
	{
		return color.set(0, _value, _color);
	}
//todo/..

	color.red.set.bytes = color.red.set;

	color.red.set.floats = function(_value, _color)
	{
		return color.floats(color.red.set(_value, _color));
	}

	color.red.set.hex = function(_value, _color)
	{
		return color.hex(color.red.set(_value, _color));
	}

	color.red.set.rgb = function(_value, _color)
	{
		return color.rgb(color.red.set(_value, _color));
	}

	color.red.set.rgba = function(_value, _color)
	{
		return color.rgba(color.red.set(_value, _color));
	}

	color.red.set.argb = function(_value, _color)
	{
		return color.argb(color.red.set(_value, _color));
	}

	color.red.set.number = function(_value, _color)
	{
		return color.number(color.red.set(_value, _color));
	}

	//
	color.green.set = function(_value, _color)
	{
		return color.set(1, _value, _color);
	}

	color.green.set.bytes = color.green.set;

	color.green.set.floats = function(_value, _color)
	{
		return color.floats(color.green.set(_value, _color));
	}

	color.green.set.hex = function(_value, _color)
	{
		return color.hex(color.green.set(_value, _color));
	}

	color.green.set.rgb = function(_value, _color)
	{
		return color.rgb(color.green.set(_value, _color));
	}

	color.green.set.rgba = function(_value, _color)
	{
		return color.rgba(color.green.set(_value, _color));
	}

	color.green.set.argb = function(_value, _color)
	{
		return color.argb(color.green.set(_value, _color));
	}

	color.green.set.number = function(_value, _color)
	{
		return color.number(color.green.set(_value, _color));
	}

	color.blue.set = function(_value, _color)
	{
		return color.set(2, _value, _color);
	}

	color.blue.set.bytes = color.blue.set;

	color.blue.set.floats = function(_value, _color)
	{
		return color.floats(color.blue.set(_value, _color));
	}

	color.blue.set.hex = function(_value, _color)
	{
		return color.hex(color.blue.set(_value, _color));
	}

	color.blue.set.rgb = function(_value, _color)
	{
		return color.rgb(color.blue.set(_value, _color));
	}

	color.blue.set.rgba = function(_value, _color)
	{
		return color.rgba(color.blue.set(_value, _color));
	}

	color.blue.set.argb = function(_value, _color)
	{
		return color.argb(color.blue.set(_value, _color));
	}

	color.blue.set.number = function(_value, _color)
	{
		return color.number(color.blue.set(_value, _color));
	}

	color.alpha.set = function(_value, _color)
	{
		return color.set(3, _value, _color);
	}

	color.alpha.set.bytes = color.alpha.set;

	color.alpha.set.floats = function(_value, _color)
	{
		return color.floats(color.alpha.set(_value, _color));
	}

	color.alpha.set.hex = function(_value, _color)
	{
		return color.hex(color.alpha.set(_value, _color));
	}

	color.alpha.set.rgb = function(_value, _color)
	{
		return color.rgb(color.alpha.set(_value, _color));
	}

	color.alpha.set.rgba = function(_value, _color)
	{
		return color.rgba(color.alpha.set(_value, _color));
	}

	color.alpha.set.argb = function(_value, _color)
	{
		return color.argb(color.alpha.set(_value, _color));
	}

	color.alpha.set.number = function(_value, _color)
	{
		return color.number(color.alpha.set(_value, _color));
	}

	//
	color.set = function(_channel, _value, _color)
	{
		_color = color(_color);

		if(typeof _channel === 'string')
		{
			switch(_channel[0].toLowerCase())
			{
				case 'r':
					_channel = 0;
					break;
				case 'g':
					_channel = 1;
					break;
				case 'b':
					_channel = 2;
					break;
				case 'a':
					_channel = 3;
					break;
				default:
					return x('Invalid color _channel');
			}
		}
		else if(typeof _channel === 'number')
		{
			_channel = (_channel.int % 4);

			if(_channel < 0)
			{
				_channel = (4 + _channel);
			}

			_channel = Math.abs(_channel) % 4;
		}
		else
		{
			return x('Invalid color _channel');
		}

		if(typeof _value === 'number')
		{
			_color[_channel] = _value % 256;
		}
		else if(_value === true)
		{
			_color[_channel] = Math.random.byte(255, 0);
		}
		else if(Array.isArray(_value))
		{
			if(_value.length === 0)
			{
				_value = [ 255, 0 ];
			}
			else if(_value.length === 1)
			{
				if(typeof _value[0] === 'number')
				{
					_value[0] = _value[0] % 256;
				}
				else
				{
					_value[0] = 255;
				}

				_value[1] = 0;
			}
			else
			{
				if(typeof _value[0] === 'number')
				{
					_value[0] = _value[0] % 256;
				}
				else
				{
					_value[0] = 255;
				}

				if(typeof _value[1] === 'number')
				{
					_value[1] = _value[1] % 256;
				}
				else
				{
					_value[1] = 0;
				}

				_value.length = 2;
			}

			_color[_channel] = Math.random.byte(_value[0], _value[1]);
		}
		else if(_value === false || _value === null)
		{
			_color.length = 3;
		}
		else
		{
			return x('Invalid _value');
		}

		return _color;
	}

	color.set.bytes = color.set;

	color.set.floats = function(_channel, _value, _color)
	{
		return color.floats(color.set(_channel, _value, _color));
	}

	color.set.hex = function(_channel, _value, _color)
	{
		return color.hex(color.set(_channel, _value, _color));
	}

	color.set.rgb = function(_channel, _value, _color)
	{
		return color.rgb(color.set(_channel, _value, _color));
	}

	color.set.rgba = function(_channel, _value, _color)
	{
		return color.rgba(color.set(_channel, _value, _color));
	}

	color.set.argb = function(_channel, _value, _color)
	{
		return color.argb(color.set(_channel, _value, _color));
	}

	color.set.number = function(_channel, _value, _color)
	{
		return color.number(color.set(_channel, _value, _color));
	}

	//
	color.set.red = color.red.set;
	color.set.green = color.green.set;
	color.set.blue = color.blue.set;
	color.set.alpha = color.alpha.set;

	//
	color.alpha.unset = function(_color)
	{
		_color = color.apply(this, arguments);
		_color.length = 3;
		return _color;
	}

	color.alpha.unset.bytes = color.alpha.unset;

	color.alpha.unset.floats = function(_color)
	{
		_color = color.alpha.unset.apply(this, arguments);
		_color.length = 3;
		return color.floats(_color);
	}

	color.alpha.unset.hex = function(_color)
	{
		_color = color.alpha.unset.apply(this, arguments);
		_color.length = 3;
		return color.hex(_color);
	}

	color.alpha.unset.rgb = function(_color)
	{
		_color = color.alpha.unset.apply(this, arguments);
		_color.length = 3;
		return color.rgb(_color);
	}

	color.alpha.unset.rgba = function(_color)
	{
		_color = color.alpha.unset.apply(this, arguments);
		_color.length = 3;
		return color.rgba(_color);
	}

	color.alpha.unset.argb = function(_color)
	{
		_color = color.alpha.unset.apply(this, arguments);
		_color.length = 3;
		return color.argb(_color);
	}

	color.alpha.unset.number = function(_color)
	{
		_color = color.alpha.unset.apply(this, arguments);
		_color.length = 3;
		return color.number(_color);
	}

	//
	color.unset = function(_channel, _color)
	{
		_color = color(_color);

		if(typeof _channel === 'string')
		{
			switch(_channel[0].toLowerCase())
			{
				case 'r':
					_channel = 0;
					break;
				case 'g':
					_channel = 1;
					break;
				case 'b':
					_channel = 2;
					break;
				case 'a':
					_channel = 3;
					break;
				default:
					return x('Invalid color _channel');
			}
		}
		else if(typeof _channel === 'number')
		{
			_channel = (_channel.int % 4);

			if(_channel < 0)
			{
				_channel = (4 + _channel);
			}

			_channel = Math.abs(_channel) % 4;
		}
		else
		{
			return x('Invalid color _channel');
		}

		switch(_channel)
		{
			case 0:
			case 1:
			case 2:
				_color[_channel] = 0;
				break;
			case 3:
				//_color[_channel] = 255;
				_color.length = 3;
				break;
		}

		return _color;
	}

	color.unset.alpha = color.alpha.unset;

	color.unset.red = function(_color)
	{
		return color.unset(0, color.apply(this, arguments));
	}

	color.red.unset = color.unset.red;

	color.unset.green = function(_color)
	{
		return color.unset(1, color.apply(this, arguments));
	}

	color.green.unset = color.unset.green;

	color.unset.blue = function(_color)
	{
		return color.unset(2, color.apply(this, arguments));
	}

	color.blue.unset = color.unset.blue;

	//
	color.bytes = color;

	color.floats = function(_color)
	{
		var a;

		if(a = checkForAnsiColor(_color))
		{
			return a;
		}
		else if(arguments.length === 1)
		{
			_color = color.bytes(tryToPrepareColor(_color));
		}
		else
		{
			_color = color.bytes(... arguments);
		}

		if(_color === null || _color === false)
		{
			return _color;
		}

		for(var i = 0; i < _color.length; i++)
		{
			_color[i] = Math.round(_color[i] / 255, 8);
		}

		return _color;
	}

	color.hex = function(_color, _alpha = false)
	{
		var a;

		if(a = checkForAnsiColor(_color))
		{
			return a;
		}
		else if(arguments.length === 1)
		{
			_color = color.bytes(tryToPrepareColor(_color));
		}
		else
		{
			_color = color.bytes(... arguments);
		}

		if(_color === null || _color === false)
		{
			return _color;
		}

		var result = '#';

		for(var i = 0; i < _color.length; i++)
		{
			result += _color[i].toString(16).padStart(2, '0');
		}

		//
		var short = true;

		for(var i = 1; i < result.length; i += 2)
		{
			if(result[i] !== result[i + 1])
			{
				short = false;
				break;
			}
		}

		if(short)
		{
			var short = '#';

			for(var i = 1; i < result.length; i += 2)
			{
				short += result[i];
			}

			return short;
		}

		return result;
	}

	color.rgb = function(_color)
	{
		var a;

		if(a = checkForAnsiColor(_color))
		{
			return a;
		}
		else if(arguments.length === 1)
		{
			_color = color.bytes(tryToPrepareColor(_color));
		}
		else
		{
			_color = color.bytes(... arguments);
		}

		if(_color === null || _color === false)
		{
			return _color;
		}

		var result = 'rgb( ';
if(typeof _color === 'number') x("DEBUG");
		for(var i = 0; i < 3; i++)
		{
			result += _color[i].toString().padStart(3, ' ') + ', ';
		}

		return (result.removeLast(2) + ')');
	}

	color.rgba = function(_color)
	{
		var a;

		if(a = checkForAnsiColor(_color))
		{
			return a;
		}
		else if(arguments.length === 1)
		{
			_color = color.bytes(tryToPrepareColor(_color));
		}
		else
		{
			_color = color.bytes(... arguments);
		}

		if(_color === null || _color === false)
		{
			return _color;
		}

		var result = 'rgba(';

		for(var i = 0; i < 3; i++)
		{
			result += _color[i].toString().padStart(3, ' ') + ', ';
		}

		if(_color.length === 3)
		{
			result += '1, ';
		}
		//
		//TODO/... nicht so ganz perfekt... :-/
		//
		else if(_color[3] >= 0 && _color[3] <= 1)
		{
			result += _color[3].toString() + ', ';
		}
		else
		{
			result += (_color[3] / 255).toString() + ', ';
		}

		return (result.removeLast(2) + ')');
	}

	color.argb = function(_color)
	{
		var a;

		if(a = checkForAnsiColor(_color))
		{
			return a;
		}
		else if(arguments.length === 1)
		{
			_color = color.bytes(tryToPrepareColor(_color));
		}
		else
		{
			_color = color.bytes(... arguments);
		}

		if(_color === null || _color === false)
		{
			return _color;
		}

		var result = 'argb(';

		if(_color.length === 3)
		{
			result += '255, ';

			for(var i = 0; i < 3; i++)
			{
				result += _color[i].toString().padStart(3, ' ') + ', ';
			}
		}
		else
		{
			result += _color[3].toString().padStart(3, ' ') + ', ';

			for(var i = 0; i < 3; i++)
			{
				result += _color[i].toString().padStart(3, ' ') + ', ';
			}
		}

		return (result.removeLast(2) + ')');
	}

	color.number = function(_color)
	{
		var a;

		if(a = checkForAnsiColor(_color))
		{
			return a;
		}
		else if(arguments.length === 1)
		{
			_color = color.bytes(tryToPrepareColor(_color));
		}
		else
		{
			_color = color.bytes(... arguments);
		}

		if(_color === null || _color === false)
		{
			return _color;
		}

		var result = 0;

		for(var i = _color.length - 1, mul  = 1; i >= 0; --i, mul *= 256)
		{
			result += (_color[i] * mul);
		}

		return result;
		//return ((-1) - result);
	}

	//
	function getFromHex(_hex)
	{
		if(_hex[0] === '#')
		{
			_hex = _hex.removeFirst();
		}

		if(_hex.length < 3)
		{
			return x('Hex color string length is not correct');
		}
		else
		{
			_hex = _hex.toLowerCase();
		}

		const result = [];

		if(_hex.length === 3 || _hex.length === 4)
		{
			for(var i = 0; i < _hex.length; i++)
			{
				result[i] = (_hex[i] + _hex[i]);
			}
		}
		else if(_hex.length === 6 || _hex.length === 8)
		{
			const six = (_hex.length === 6);

			for(var i = 0, j = 0; i < (six ? 6 : 8); i += 2, j++)
			{
				result[j] = _hex.substr(i, 2);
			}
		}
		else
		{
			return x('Hex color string length is not correct');
		}

		for(var i = 0; i < result.length; i++)
		{
			if((result[i] = parseInt(result[i], 16)) < 0 || result[i] > 255)
			{
				return x('Invalid HEX color string');
			}
		}

		return result;
	}

	function getFromRGB(_rgb)
	{
		if(_rgb.length < 5)
		{
			return x('RGB color string length is not correct');
		}

		if((_rgb = _rgb.remove(' ').split(',')).length < 3)
		{
			return x('Invalid RGB color string');
		}

		const result = new Array(3);

		for(var i = 0; i < 3; i++)
		{
			result[i] = Math.round(parseNumber(_rgb[i]), DEFAULT_PRECISION);

			if(result[i] < 0 || result[i] > 255)
			{
				return x('Invalid RGB color string');
			}
		}

		return result;
	}

	function getFromRGBA(_rgba)
	{
		if(_rgba.length < 5)
		{
			return x('RGBA color string length is not correct');
		}

		if((_rgba = _rgba.remove(' ').split(',')).length < 4)
		{
			return x('Invalid RGBA color string');
		}

		const result = new Array(4);

		for(var i = 0; i < 4; i++)
		{
			result[i] = Math.round(parseNumber(_rgba[i]), DEFAULT_PRECISION);

			if(result[i] < 0 || result[i] > 255)
			{
				return x('Invalid RGBA color string');
			}
		}

		if(result[3] < 0 || result[3] > 1)
		{
			return x('Invalid RGBA color string');
		}

		return result;
	}

	function getFromARGB(_argb)
	{
		if(_argb.length < 5)
		{
			return x('ARGB color string length is not correct');
		}

		if((_argb = _argb.remove(' ').split(',')).length < 4)
		{
			return x('Invalid ARGB color string');
		}

		const result = new Array(4);

		for(var i = 0; i < 3; i++)
		{
			result[i] = Math.round(parseNumber(_argb[i + 1]), DEFAULT_PRECISION);

			if(result[i] < 0 || result[i] > 255)
			{
				return x('Invalid ARGB color string');
			}
		}

		if((result[3] = Math.round(parseNumber(_argb[0]), DEFAULT_PRECISION)) < 0 || result[3] > 1)
		{
			return x('Invalid ARGB color string');
		}

		return result;
	}

	function getArrayFromString(_string)
	{
		//
		if(typeof _string !== 'string')
		{
			return x('Argument is not a String');
		}
		else if(_string.length === 0)
		{
			return x('Invalid color string (has zero length)');
		}

		//
		if(_string[0] === '#')
		{
			return getFromHex(_string.removeFirst());
		}
		else if(_string.startsWith('rgb('))
		{
			return getFromRGB(_string.removeFirst(4).removeLast());
		}
		else if(_string.startsWith('rgba('))
		{
			return getFromRGBA(_string.removeFirst(5).removeLast());
		}
		else if(_string.startsWith('argb('))
		{
			return getFromARGB(_string.removeFirst(5).removeLast());
		}
		else if(_string[0] === '#' || _string.toLowerCase().checkAlphabet('0123456789abcdef', false))
		{
			return getFromHex(_string);
		}
		else
		{
			const res = ansi.hexColor4(_string, false);

			if(typeof res === 'string')
			{
				return res;
			}
		}

		return x('Invalid color % (format not recognized)', null, '_string');
	}

	function getArrayFromNumber(_number)
	{
		//_number is *always* <0..
		_number = (Math.abs(_number.int) - 1) % (2 ** 32);

		//
		const result = new Array(_number < 16777216 ? 3 : 4);

		//
		for(var i = 0; i < result.length; i++)
		{
			result[i] = (_number.int % 256);
			_number /= 256;
		}

		//
		return result;
	}

	function getArrayFromSingleArgument(_arg)
	{
		if(typeof _arg === 'string')
		{
			return getArrayFromString(_arg);
		}
		else if(typeof _arg === 'number' && _arg < 0)
		{
			return getArrayFromNumber(_arg);
		}
		else if(_arg === false || _arg === null)
		{
			return null;
		}

		return x('Invalid _color argument');
	}

	color.random = function(_red, _green, _blue, _alpha, _crypto = CRYPTO)
	{
		if(typeof arguments[0] === 'string')
		{
			Array.prototype.splice.call(arguments, 1, arguments.length - 1);
		}
		else if(! (_red || _green || _blue))
		{
			arguments[0] = arguments[1] = arguments[2] = _red = _green = _blue = [ 255, 0 ];

			if(! _alpha)
			{
				_alpha = null;
			}
		}

		if(arguments.length === 1)
		{
			if(arguments[0] === true || typeof arguments[0] === 'undefined')
			{
				_red = _green = _blue = _alpha = [ 255, 0 ];
			}
			else if(typeof arguments[0] === 'string')
			{
				const str = arguments[0].toLowerCase();

				if(str === 'gray' || str === 'grey')
				{
					return color.random.gray(null, false, _crypto);
				}
				else if(str.length === 0 || str.startsWith('random'))
				{
					if(str.length === 0 || str === 'random' || str.endsWith('24'))
					{
						_red = _green = _blue = [ 255, 0 ];
						_alpha = null;
					}
					else if(str.last() === '8')
					{
						return ansi.getRandomColor8(255, 0, _crypto);
					}
					else if(str.last() === '4')
					{
						return ansi.getRandomColor4(_crypto);
					}
					else
					{
						return x('Invalid \'random*\' string');
					}
				}
				else
				{
					return getArrayFromString(str);
				}
			}
			else if(typeof arguments[0] === 'number')
			{
				if(arguments[0] < 0)
				{
					return getArrayFromSingleArgument(arguments[0]);
				}

				//
				_red = _green = _blue = [ arguments[0] % 256, 0 ];
				_alpha = null;
			}
			else if(Array.isArray(arguments[0]))
			{
				if(arguments[0].length === 2)
				{
					const res = [];

					for(var i = 0; i < arguments[0].length; i++)
					{
						if(typeof arguments[0][i] === 'number')
						{
							res[i] = arguments[0][i] % 256;
						}
						else
						{
							return x('Invalid argument (not a Number)');
						}
					}

					if(res.length > 0)
					{
						_red = _green = _blue = res;
					}
					else
					{
						return x('Invalid array');
					}

					_alpha = null;
				}
				else if(arguments[0].length >= 3)
				{
					return color.random.apply(this, arguments[0]);
				}
				else if(arguments[0].length === 1)
				{
					_red = _green = _blue = [ arguments[0][0] % 256, 0 ];
					_alpha = null;
				}
				else
				{
					_red = _green = _blue = [ 255, 0 ];
					_alpha = null;
				}
			}
			else if(arguments[0] === false)
			{
				_red = _green = _blue = [ 255, 0 ];
				_alpha = null;
			}
			else
			{
				return getArrayFromSingleArgument(arguments[0]);
			}
		}
		else if(arguments.length === 2)
		{
			_alpha = _green;

			if(_red === true)
			{
				_red = _green = _blue = [ 255, 0 ];
			}
			else if(typeof _red === 'number')
			{
				_red = _green = _blue = [ _red % 256, 0 ];
			}
			else if(Array.isArray(_red))
			{
				const res = [];

				for(var i = 0; i < _red.length; i++)
				{
					if(typeof _red[i] === 'number' && _red[i] === _red[i])
					{
						res[i] = _red[i] % 256;
					}
					else
					{
						return x('Invalid array');
					}
				}

				if(res.length < 3)
				{
					_red = _green = _blue = [ 255, 0 ];
				}
				else
				{
					_red = _green = _blue = res;
				}
			}
			else if(_red === false)
			{
				return null;
			}
			else
			{
				return x('Invalid argument(s)');
			}

			if(_alpha === true)
			{
				_alpha = [ 255, 0 ];
			}
			else if(typeof _alpha === 'number')
			{
				_alpha = [ _alpha % 256, 0 ];
			}
			else if(Array.isArray(_alpha))
			{
				const res = [];

				for(var i = 0; i < _alpha.length; i++)
				{
					if(typeof _alpha[i] === 'number')
					{
						res[i] = _alpha[i] % 256;
					}
					else
					{
						return x('Invalid array');
					}
				}

				if(res.length === 0)
				{
					_alpha = [ 255, 0 ];
				}
				else
				{
					_alpha = res;
				}
			}
			else
			{
				_alpha = null;
			}
		}
		else
		{
			if(typeof _red === 'number')
			{
				if(_red > 0 && _red <= 1)
				{
					_red = Math.round(_red * 255);
				}

				_red = [ _red % 256, _red % 256 ];
			}
			else if(_red === true)
			{
				_red = [ 255, 0 ];
			}
			else if(Array.isArray(_red))
			{
				if(_red.length === 0)
				{
					_red = [ 255, 0 ];
				}
				else if(_red.length === 1)
				{
					if(typeof _red[0] === 'number')
					{
						_red[0] = _red[0] % 256;
					}
					else
					{
						_red[0] = 255;
					}
				}
				else
				{
					if(typeof _red[0] === 'number')
					{
						_red[0] = _red[0] % 256;
					}
					else
					{
						_red[0] = 255;
					}

					if(typeof _red[1] === 'number')
					{
						_red[1] = _red[1] % 256;
					}
					else
					{
						_red[1] = 0;
					}

					_red.length = 2;
				}
			}
			else
			{
				return x('Invalid _red argument');
			}

			if(typeof _green === 'number')
			{
				if(_green > 0 && _green <= 1)
				{
					_green = Math.round(_green * 255);
				}

				_green = [ _green % 256, _green % 256 ];
			}
			else if(_green === true)
			{
				_green = [ 255, 0 ];
			}
			else if(Array.isArray(_green))
			{
				if(_green.length === 0)
				{
					_green = [ 255, 0 ];
				}
				else if(_green.length === 1)
				{
					if(typeof _green[0] === 'number')
					{
						_green[0] = _green[0] % 256;
					}
					else
					{
						_green[0] = 255;
					}
				}
				else
				{
					if(typeof _green[0] === 'number')
					{
						_green[0] = _green[0] % 256;
					}
					else
					{
						_green[0] = 255;
					}

					if(typeof _green[1] === 'number')
					{
						_green[1] = _green[1] % 256;
					}
					else
					{
						_green[1] = 0;
					}

					_green.length = 2;
				}
			}
			else
			{
				return x('Invalid _green argument');
			}

			if(typeof _blue === 'number')
			{
				if(_blue > 0 && _blue <= 1)
				{
					_blue = Math.round(_blue * 255);
				}

				_blue = [ _blue % 256, _blue % 256 ];
			}
			else if(_blue === true)
			{
				_blue = [ 255, 0 ];
			}
			else if(Array.isArray(_blue))
			{
				if(_blue.length === 0)
				{
					_blue = [ 255, 0 ];
				}
				else if(_blue.length === 1)
				{
					if(typeof _blue[0] === 'number')
					{
						_blue[0] = _blue[0] % 256;
					}
					else
					{
						_blue[0] = 255;
					}
				}
				else
				{
					if(typeof _blue[0] === 'number')
					{
						_blue[0] = _blue[0] % 256;
					}
					else
					{
						_blue[0] = 255;
					}

					if(typeof _blue[1] === 'number')
					{
						_blue[1] = _blue[1] % 256;
					}
					else
					{
						_blue[1] = 0;
					}

					_blue.length = 2;
				}
			}
			else
			{
				return x('Invalid _blue argument');
			}

			if(typeof _alpha === 'number')
			{
				if(_alpha > 0 && _alpha <= 1)
				{
					_alpha = Math.round(_alpha * 255);
				}

				_alpha = [ _alpha % 256, _alpha % 256 ];
			}
			else if(_alpha === true)
			{
				_alpha = [ 255, 0 ];
			}
			else if(Array.isArray(_alpha))
			{
				if(_alpha.length === 0)
				{
					_alpha = [ 255, 0 ];
				}
				else if(_alpha.length === 1)
				{
					if(typeof _alpha[0] === 'number')
					{
						_alpha[0] = _alpha[0] % 256;
					}
					else
					{
						_alpha[0] = 255;
					}
				}
				else
				{
					if(typeof _alpha[0] === 'number')
					{
						_alpha[0] = _alpha[0] % 256;
					}
					else
					{
						_alpha[0] = 255;
					}

					if(typeof _alpha[1] === 'number')
					{
						_alpha[1] = _alpha[1] % 256;
					}
					else
					{
						_alpha[1] = 0;
					}

					_alpha.length = 2;
				}
			}
			else
			{
				_alpha = null;
			}
		}

		//
		if(Array.equal(_red, _green, _blue))
		{
			return _red;
		}

		//
		const result = new Array(_alpha ? 4 : 3);
		const input = [ _red, _green, _blue, _alpha ];

		for(var i = 0; i < (_alpha ? 4 : 3); i++)
		{
			if(Array.isArray(input[i]))
			{
				if(input[i][0] > 0 && input[i][0] <= 1)
				{
					input[i][0] = Math.round(input[i][0] * 255);
				}

				if(input[i][1] > 0 && input[i][1] <= 1)
				{
					input[i][1] = Math.round(input[i][1] * 255);
				}

				result[i] = Math.random.byte(input[i][0], input[i][1], _crypto);
			}
			else if(Number.isInt(input[i]))
			{
				if(input[i] > 0 && input[i] <= 1)
				{
					input[i] = Math.round(input[i] * 255);
				}

				result[i] = input[i];
			}
			else
			{
				return x('Invalid input[' + i + ']');
			}
		}

		//
		return result;
	}

	color.random.gray = color.random.grey = function(_g = CZ_G, _alpha = false, _crypto = CRYPTO)
	{
		var g;

		if(typeof _g === 'number')
		{
			g = [ Math.abs(_g.int) % 256, 0 ];
		}
		else if(Array.isArray(_g) && _g.length > 0 && typeof _g[0] === 'number')
		{
			g = new Array(2);

			//
			g[0] = Math.abs(_g[0].int) % 256;

			if(typeof _g[1] === 'number')
			{
				g[1] = Math.abs(_g[1].int) % 256;
			}
			else
			{
				g[1] = 0;
			}
		}
		else if(_g === false)
		{
			return null;
		}
		else
		{
			g = [ 255, 0 ];
		}

		//
		g = Math.random.byte(g[0], g[1], _crypto);

		//
		const result = new Array(_alpha === true ? 4 : 3);

		for(var i = 0; i < result.length; i++)
		{
			result[i] = g;
		}

		return result;
	}

	color.random.gray.floats = function(_g, _alpha = false)
	{
		return color.floats(color.random.gray(_g, _alpha));
	}

	color.random.gray.hex = function(_g, _alpha = false)
	{
		return color.hex(color.random.gray(_g, _alpha));
	}

	color.random.gray.rgb = function(_g)
	{
		return color.rgb(color.random.gray(_g, false));
	}

	color.random.gray.rgba = function(_g, _alpha = false)
	{
		return color.rgba(color.random.gray(_g, _alpha));
	}

	color.random.gray.argb = function(_g, _alpha = false)
	{
		return color.argb(color.random.gray(_g, _alpha));
	}

	color.random.gray.number = function(_g, _alpha = false)
	{
		return color.number(color.random.gray(_g, _alpha));
	}

	color.random.bytes = color.bytes.random = color.random;

	color.random.floats = color.floats.random = function()
	{
		return color.floats(color.random.apply(this, arguments));
	}

	color.random.hex = color.hex.random = function()
	{
		return color.hex(color.random.apply(this, arguments));
	}

	color.random.rgb = color.rgb.random = function()
	{
		return color.rgb(color.random.apply(this, arguments));
	}

	color.random.rgba = color.rgba.random = function()
	{
		return color.rgba(color.random.apply(this, arguments));
	}

	color.random.argb = color.argb.random = function()
	{
		return color.argb(color.random.apply(this, arguments));
	}

	color.random.number = color.number.random = function()
	{
		return color.number(color.random.apply(this, arguments));
	}

	//
	//used for anti aliasing..
	color.floating = function(_float, _alpha = false, _type = 'bytes')
	{
		if(Number.isNumber(_float))
		{
			if(_float <= 0)
			{
				_float = 0;
			}
			else if(_float > 1)
			{
				_float = 1;
			}
		}
		else
		{
			return x('Invalid _float value (not a real Number)');
		}

		if(! String.isString(_type))
		{
			_type = 'bytes';
		}

		if(typeof _alpha !== 'boolean')
		{
			return x('Invalid _alpha argument (expecting Boolean)');
		}

		const result = new Array(_alpha ? 4 : 3);

		if(_alpha)
		{
			for(var i = 0; i < 3; i++)
			{
				result[i] = 1;
			}

			result[3] = _float;
		}
		else for(var i = 0; i < 3; i++)
		{
			result[i] = _float;
		}

		if(typeof color[_type = _type.toLowerCase()] === 'function')
		{
			return color[_type](result);
		}

		return x('Color _type not available [ bytes, floats, hex, rgb, rgba, argb, number ]');
	}

	color.floating.bytes = function(_float, _alpha = false)
	{
		return color.floating(_float, _alpha, 'bytes');
	}

	color.floating.floats = function(_float, _alpha = false)
	{
		return color.floating(_float, _alpha, 'floats');
	}

	color.floating.hex = function(_float, _alpha = false)
	{
		return color.floating(_float, _alpha, 'hex');
	}

	color.floating.rgb = function(_float)
	{
		return color.floating(_float, false, 'rgb');
	}

	color.floating.rgba = function(_float, _alpha = false)
	{
		return color.floating(_float, _alpha, 'rgba');
	}

	color.floating.argb = function(_float, _alpha = false)
	{
		return color.floating(_float, _alpha, 'argb');
	}

	color.floating.number = function(_float, _alpha = false)
	{
		return color.floating(_float, _alpha, 'number');
	}

	//
	color.ratio = function(_color, _floating, _type = 'bytes')
	{
		if(Number.isNumber(_floating))
		{
			if(_floating <= 0)
			{
				_floating = 0;
			}
			else if(_floating > 1)
			{
				_floating = 1;
			}
		}
		else
		{
			return x('Invalid _floating argument (expecting Float value)');
		}

		if(! String.isString(_type))
		{
			_type = 'bytes';
		}

		//todo/!! w/ (_alpha = false)!?
		const floats = color.floats(_color);
const alpha = false;//(floats.length === 4);
		const result = new Array(alpha ? 4 : 3);

		if(alpha)//&& _alpha
		{
throw new Error('TODO');
		}
		else for(var i = 0; i < floats.length; i++)
		{
			result[i] = (floats[i] * _floating);
		}

		if(typeof color[_type = _type.toLowerCase()] === 'function')
		{
			return color[_type](result);
		}

		return x('Color _type not available [ bytes, floats, hex, rgb, rgba, argb, number ]');
	}

	color.ratio.bytes = function(_color, _floating)
	{
		return color.ratio(_color, _floating, 'bytes');
	}

	color.ratio.floats = function(_color, _floating)
	{
		return color.ratio(_color, _floating, 'floats');
	}

	color.ratio.hex = function(_color, _floating)
	{
		return color.ratio(_color, _floating, 'hex');
	}

	color.ratio.rgb = function(_color, _floating)
	{
		return color.ratio(_color, _floating, 'rgb');
	}

	color.ratio.rgba = function(_color, _floating)
	{
		return color.ratio(_color, _floating, 'rgba');
	}

	color.ratio.argb = function(_color, _floating)
	{
		return color.ratio(_color, _floating, 'argb');
	}

	color.ratio.number = function(_color, _floating)
	{
		return color.ratio(_color, _floating, 'number');
	}

	//
	color.cmyk2rgb = function(_c, _m, _y, _k, _normalized = DEFAULT_NORMALIZED)
	{
		const err = 'The % argument is not a %';

		if(! Number.isNumber(_c))
		{
			return x(err, null, '_c', 'Number');
		}
		else if(! Number.isNumber(_m))
		{
			return x(err, null, '_m', 'Number');
		}
		else if(! Number.isNumber(_y))
		{
			return x(err, null, '_y', 'Number');
		}
		else if(! Number.isNumber(_k))
		{
			return x(err, null, '_k', 'Number');
		}

		if(typeof _normalized !== 'boolean')
		{
			_normalized = DEFAULT_NORMALIZED;
		}

		_c /= 100;
		_m /= 100;
		_y /= 100;
		_k /= 100;

		_c *= (1 - _k) + _k;
		_m *= (1 - _k) + _k;
		_y *= (1 - _k) + _k;

		var r = 1 - _c;
		var g = 1 - _m;
		var b = 1 - _y;

		if(!_normalized)
		{
			r = Math.round(255 * r);
			g = Math.round(255 * g);
			b = Math.round(255 * b);
		}

		return Object.null({ red: r, green: g, blue: b, alpha: null, r, g, b, a: null });
	}

	color.rgb2cmyk = function(_r, _g, _b, _normalized = DEFAULT_NORMALIZED)
	{
		const err = 'The % argument is not a %';

		if(! Number.isNumber(_r))
		{
			return x(err, '_r', 'Number');
		}
		else if(! Number.isNumber(_g))
		{
			return x(err, '_g', 'Number');
		}
		else if(! Number.isNumber(_b))
		{
			return x(err, '_b', 'Number');
		}

		if(typeof _normalized !== 'boolean')
		{
			_normalized = DEFAULT_NORMALIZED;
		}

		var c = 1 - (_r / 255);
		var m = 1 - (_g / 255);
		var y = 1 - (_b / 255);
		var k = Math._min(c, Math.min(m, y));

		c = (c - k) / (1 - k);
		m = (m - k) / (1 - k);
		y = (y - k) / (1 - k);

		if(!_normalized)
		{
			c = Math.round(c * 10000) / 100;
			m = Math.round(m * 10000) / 100;
			y = Math.round(y * 10000) / 100;
			k = Math.round(k * 10000) / 100;
		}

		c = isNaN(c) ? 0 : c;
		m = isNaN(m) ? 0 : m;
		y = isNaN(y) ? 0 : y;
		k = isNaN(k) ? 0 : k;

		return Object.null({ cyan: c, magenta: m, yellow: y, black: k, c, m, y, k });
	}

	//
	color.hsl = function(_hue, _lightness, _saturation)
	{
		if(Number.isNumber(_hue))
		{
			if(_hue >= -1 && _hue <= 1)
			{
				_hue *= 360;
			}

			if(_hue < 0)
			{
				_hue = (360 - (_hue % 360));
			}
			else if(_hue > 360)
			{
				_hue %= 360;
			}
		}
		else
		{
			_hue = 360;
		}

		if(Number.isNumber(_saturation))
		{
			if(_saturation >= -1 && _saturation <= 1)
			{
				_saturation *= 100;
			}

			if(_saturation < 0)
			{
				_saturation = (100 - (_saturation % 100));
			}
			else if(_saturation > 100)
			{
				_saturation %= 100;
			}
		}
		else
		{
			_saturation = 100;
		}

		if(Number.isNumber(_lightness))
		{
			if(_lightness >= -1 && _lightness <= 1)
			{
				_lightness *= 100;
			}

			if(_lightness < 0)
			{
				_lightness = (100 - (_lightness % 100));
			}
			else if(_lightness > 100)
			{
				_lightness %= 100;
			}
		}
		else
		{
			_lightness = 100;
		}

		return `hsl(${_hue}, ${_saturation.toString()}%, ${_lightness.toString()}%)`;
	}

	color.hsl.create = color.hsl;

	color.hsl.random = function(_hue, _lightness, _saturation)
	{
		if(Number.isNumber(_hue))
		{
			//
		}
		else if(Array.isArray(_hue, false))
		{
			if(! Number.isNumber(_hue[0]))
			{
				return x('Invalid %[%] argument (not a %)', null, '_hue', 0, 'Number');
			}
			else if(! Number.isNumber(_hue[1]))
			{
				_hue[1] = (Math.random() * 360);
			}

			_hue = Math.random.float(_hue[0], _hue[1]);
		}
		else
		{
			_hue = (Math.random() * 360);
		}

		if(Number.isNumber(_lightness))
		{
			//
		}
		else if(Array.isArray(_lightness, false))
		{
			if(! Number.isNumber(_lightness[0]))
			{
				return x('Invalid %[%] argument (not a %)', null, '_lightness', 0, 'Number');
			}
			else if(! Number.isNumber(_lightness[1]))
			{
				_lightness[1] = (Math.random() * 100);
			}

			_lightness = Math.random.float(_lightness[0], _lightness[1]);
		}
		else
		{
			_lightness = (Math.random() * 100);
		}

		if(Number.isNumber(_saturation))
		{
			//
		}
		else if(Array.isArray(_saturation, false))
		{
			if(! Number.isNumber(_saturation[0]))
			{
				return x('Invalid %[%] argument (not a %)', null, '_saturation', 0, 'Number');
			}
			else if(! Number.isNumber(_saturation[1]))
			{
				_saturation[1] = (Math.random() * 100);
			}

			_saturation = Math.random.float(_saturation[0], _saturation[1]);
		}
		else
		{
			_saturation = (Math.random() * 100);
		}

		return color.hsl.create(_hue, _lightness, _saturation);
	}

	//

})();

