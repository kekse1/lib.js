// < https://github.com/chromium/hterm/blob/master/doc/ControlSequences.md > (TODO)
//
//
//TODO/cursor.end() etc.. teils auch bei '.is' etc.. einfach erkennen an regulaerem cursor-move mit parameter-check (ob das die grenze/das ende ist.. ;-)
//

(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_DISABLE_ANSI = false;
	const DEFAULT_CURSOR_CALLBACK = true;
	const DEFAULT_CURSOR_STACK_MAX_LENGTH = 50;
	const DEFAULT_CURSOR_STACK_CALLBACK_WITH_TIMEOUT = true;

	//
	if(typeof color === 'undefined')
	{
		color = require('utility/color');
	}

	//
	//TODO/used by all functions which also expected split-array nebst string! ;-)
	const filterInput = (_item) => {
		if(typeof _item === 'string')
		{
			if(_item.length === 0)
			{
				return null;
			}

			return ansi.split(_item);
		}
		else if(Array.isArray(_item))
		{
			for(var i = 0; i < _item.length; i++)
			{
				if(typeof _item[i] !== 'string' || _item[i].length === 0)
				{
					_item.splice(i--, 1);
				}
			}

			if(_item.length === 0)
			{
				return null;
			}

			return _item;
		}

		return null;
	};

	//
	ansi = module.exports = function(_escape, _input, _stream = null, _end = null, _inject = INJECT, _eol = EOL)
	{
		//
		const noAnsi = (DEFAULT_DISABLE_ANSI || !COLORS);

		//
		if((_input = filterInput(_input)) === null)
		{
			_end = false;
		}
		else if(typeof _end === 'undefined' || _end === null)
		{
			if(typeof _input === 'string' && _input.length > 0)
			{
				_end = [ ansi.none ];
			}
			else
			{
				_end = [];
			}
		}
		else if(_end === true)
		{
			_end = [ ansi.none ];
		}
		else if(typeof _end === 'string')
		{
			_end = ansi.split(ansi.seq(_end));
		}
		else if(Array.isArray(_end))
		{
			for(var i = 0; i < _end.length; i++)
			{
				if(typeof _end[i] !== 'string' || _end[i].length === 0)
				{
					_end.splice(i--, 1);
				}
				else
				{
					_end[i] = ansi.seq(_end[i]);
				}
			}
		}
		else
		{
			_end = [];
		}

		if(typeof _escape === 'string')
		{
			if((_escape = ansi.split(ansi.seq(_escape))).length === 0)
			{
				_escape = null;
			}
		}
		else if(Array.isArray(_escape))
		{
			for(var i = 0; i < _escape.length; i++)
			{
				if(typeof _escape[i] !== 'string' || _escape[i].length === 0)
				{
					_escape.splice(i--, 1);
				}
				else
				{
					_escape[i] = ansi.seq(_escape[i]);
				}
			}

			if(_escape.length === 0)
			{
				_escape = null;
			}
		}
		else
		{
			_escape = null;
		}

		if(_escape === null && !noAnsi)
		{
			return x('Missing or invalid _escape sequence');
		}

		//
		var result;

		if(noAnsi)
		{
			if(_input === null)
			{
				result = [];
			}
			else
			{
				result = [ ... _input ];
			}
		}
		else if(_input === null)
		{
			result = [ ... _escape ];
		}
		else if(ansi.is.withoutReset(_escape))
		{
			result = [ ... _escape, ... _input ];
		}
		else
		{
			result = ansi.inject(_escape, _input, _end, _inject);
			result = ansi.eol(result, _eol);
			//result = ansi.clean(result);
		}

		//
		result = result.join('');

		//
		ansi.write(result, _stream);

		//
		return result;
	}

	//
	ansi.findStream = function(_stream, _throw = true)
	{
		if(typeof __PROCESS !== 'number')
		{
			require('+process');
		}

		if(_stream === null)
		{
			return null;
		}
		else if(_stream === 0)
		{
			if((_stream = process.findStream()) === null)
			{
				if(_throw)
				{
					return x('Couldn\'t find a suitable %', null, 'Stream');
				}

				return null;
			}
		}
		else if((_stream = process.findStream(_stream, null)) === null)
		{
			if(_throw)
			{
				return x('Invalid % argument (see \'%\')', null, '_stream', 'process.findStream()');
			}

			return null;
		}

		return _stream;
	}

	//
	ansi.ESC = String.fromCharCode(27);
	ansi.NUL = String.fromCharCode(0);
	ansi.BEL = String.fromCharCode(7);

	ansi.none = (ansi.ESC + '[0m' + ansi.NUL);
	ansi.end = (_stream = 0) => {
		return ansi.write(ansi.none, _stream);
	};

	ansi.eol = function(_input, _eol = EOL, _xml = false)
	{
		//
		if((_input = filterInput(_input)) === null)
		{
			return null;
		}

		//
		if(typeof _eol !== 'string' || _eol.length === 0)
		{
			_eol = EOL;
		}

		if(typeof _xml !== 'boolean')
		{
			_xml = false;
		}

		//
		const result = [];
		const lastAnsiSeq = [];

		//
		for(var i = 0; i < _input.length; i++)
		{
			if(ansi.isSeq(_input[i]))
			{
				if(_input[i] === ansi.none)
				{
					lastAnsiSeq.length = 0;
				}
				else
				{
					lastAnsiSeq.push(_input[i]);
				}

				result.push(_input[i]);
				continue;
			}

			var string = '';

			for(var j = 0; j < _input[i].length; j++)
			{
				var nl;

				if(_input[i][j] === '\n')
				{
					nl = '\n';

					if(j < (_input[i].length - 1) && _input[i][j + 1] === '\r')
					{
						nl += '\r';
						j++;
					}
				}
				else if(_input[i][j] === '\r')
				{
					nl = '\r';

					if(j < (_input[i].length - 1) && _input[i][j + 1] === '\n')
					{
						nl += '\n';
						j++;
					}
				}
				else
				{
					nl = '';
				}

				if(nl.length > 0)
				{
					string += ansi.none + nl + lastAnsiSeq.join('');
				}
				else
				{
					string += _input[i][j];
				}
			}

			if(string.length > 0)
			{
				result.concat(ansi.split(string));
			}
		}

		//
		return result;
	}

	ansi.inject = function(_escape, _input, _end, _inject = INJECT, _with_last_ansi_sequence = false)
	{
		//
		if((_input = filterInput(_input)) === null)
		{
			return null;
		}

		if(typeof _escape === 'string')
		{
			if((_escape = ansi.split(ansi.seq(_escape))).length === 0)
			{
				return null;
			}
		}
		else if(Array.isArray(_escape))
		{
			for(var i = 0; i < _escape.length; i++)
			{
				if(typeof _escape[i] !== 'string' || _escape[i].length === 0)
				{
					_escape.splice(i--, 1);
				}
				else
				{
					_escape[i] = ansi.seq(_escape[i]);
				}
			}

			if(_escape.length === 0)
			{
				return null;
			}
		}
		else
		{
			return null;
		}

		if(_end === true)
		{
			_end = [ ansi.none ];
		}
		else if(typeof _end === 'string')
		{
			_end = ansi.split(ansi.seq(_end));
		}
		else if(Array.isArray(_end))
		{
			for(var i = 0; i < _end.length; i++)
			{
				if(typeof _end[i] !== 'string' || _end[i].length === 0)
				{
					_end.splice(i--, 1);
				}
				else
				{
					_end[i] = ansi.seq(_end[i]);
				}
			}
		}
		else
		{
			_end = [];
		}

		//
		const result = [ ... _escape ];
		const lastAnsi = [];

		for(var i = 0; i < _input.length; i++)
		{
			if(_input[i] === ansi.none)
			{
				result.push(ansi.none);
				result.concat(_escape);
				lastAnsi.length = 0;
			}
			else if(ansi.isSequence(_input[i]))
			{
				result.push(_input[i]);
				lastAnsi.push(_input[i]);
			}
			else
			{
				if(_inject)
				{
					result.concat(_escape);
				}

				result.push(_input[i]);
			}
		}

		//
		if(_end.length > 0)
		{
			result.concat(_end);
		}

		if(lastAnsi.length > 0 && _with_last_ansi_sequence)
		{
			result.concat(lastAnsi);
		}

		//
		return result;
	}

	ansi.clean = function(_input)
	{
		//
		if((_input = filterInput(_input)) === null)
		{
			return null;
		}

		//
		const result = [];
		const lastAnsi = [];
		var openFG = -1;
		var openBG = -1;

		//
		for(var i = 0; i < _input.length; i++)
		{
			if(_input[i] === _input[i + 1])
			{
				i++;
			}
			else if(_input[i] === ansi.none)
			{
				openFG = openBG = -1;
				lastAnsi.length = 0;
				result.push(_input[i]);
			}
			else if(ansi.isSequence(_input[i]))
			{
				if(ansi.is.color.fg(_input[i]))
				{
					openFG = i;
				}
				else if(ansi.is.color.bg(_input[i]))
				{
					openBG = i;
				}
				else if(ansi.is.withReset(_input[i]))
				{
					lastAnsi.push(_input[i]);
				}
				else
				{
					result.push(_input[i]);
				}
			}
			else
			{
				if(openFG > -1)
				{
					result.push(_input[openFG]);
					openFG = -1;
				}

				if(openBG > -1)
				{
					result.push(_input[openBG]);
					openBG = -1;
				}

				if(lastAnsi.length > 0)
				{
					result.concat(lastAnsi);
				}

				result.push(_input[i]);
			}
		}

		//
console.eol(3);
dir(_input, '_input');
dir(result, 'result');
console.eol(3);
		return result;
//methode:
//
//in den 'open*' verweis auf jeweils letzte erscheinung im _input...
//
		//
		//return result;

		//
		//1) mehrfach kausal gleiche weg
		//2) wenn colorfg/bg erneut und dazw kein string,nur letzte lassen
		//3) wenn reset ohne text, nachdem {color,style,?}, eg entfernen
		//4) TODO...!?!???
	}

	//
	ansi.hasStrings = function(_string)
	{
		if(typeof _string !== 'string')
		{
			return null;
		}
		else if(_string.length === 0)
		{
			return false;
		}

		var open = false;

		for(var i = 0; i < _string.length; i++)
		{
			if(open)
			{
				if(_string[i] === NUL)
				{
					open = false;
				}
			}
			else if(_string[i] === ESC)
			{
				open = true;
			}
			else
			{
				return true;
			}
		}

		return false;
	}

	//
	ansi.isRandomColor = function(_color)
	{
		if(typeof _color === 'string') switch(_color.toLowerCase())
		{
			case '':
			case 'random':
			case 'random24':
			case 'random8':
			case 'random4':
				return true;
		}
		else if(Array.isArray(_color) && _color.length <= 2 && typeof _color[0] === 'number' && typeof _color[1] === 'number')
		{
			return true;
		}
		else if(Array.isArray(_color) && Array.isArray(_color[0]) && typeof _color[0][0] === 'number')
		{
			return true;
		}
		else if(_color === true)
		{
			return true;
		}

		return false;
	}

	ansi.isColor = function(_color, _streams = true)
	{
		if(typeof _color === 'string')
		{
			_color = _color.toLowerCase();
		}

		if(ansi.isRandomColor(_color))
		{
			return true;
		}
		else if(typeof _color === 'string')
		{
			if(_streams) switch(_color)
			{
				case 'high':
					return !!COLOR_HIGH;
				case 'log':
					return !!COLOR_LOG;
				case 'info':
					return !!COLOR_INFO;
				case 'warn':
					return !!COLOR_WARN;
				case 'error':
					return !!COLOR_ERROR;
				case 'debug':
					return !!COLOR_DEBUG;
			}

			const bright = _color.startsWith('bright');

			if(bright)
			{
				_color = _color.substr(6);
			}

			if(ansi.colors.indexOf(_color) > -1)
			{
				return true;
			}
		}
		else if(Number.isByte(_color))
		{
			return true;
		}

		if(color.type(_color, null, false).length > 0)
		{
			return true;
		}

		return false;
	}

	//
	ansi.seq = function(_string)
	{
		if(typeof _string !== 'string' || _string.length === 0)
		{
			return '';
		}

		if(_string[0] !== ansi.ESC)
		{
			_string = ansi.ESC + _string;
		}

		if(_string[_string.length - 1] !== ansi.NUL)
		{
			_string += ansi.NUL;
		}

		return _string;
	}

	ansi.unseq = function(_string)
	{
		if(typeof _string !== 'string' || _string.length === 0)
		{
			return '';
		}

		if(_string[0] === ansi.ESC)
		{
			_string = _string.removeFirst();
		}

		if(_string[_string.length - 1] === ansi.NUL)
		{
			_string = _string.removeLast();
		}

		return _string;
	}

	//
	/*
	ansi._clean = function(_string)
	{
		//
		if(typeof _string !== 'string' || _string.length === 0)
		{
			return '';
		}

		//
		const isANSI = (_data) => {
			return (_data[0] === ansi.ESC && _data[_data.length - 1] === ansi.NUL);
		};

		//
		const split = ansi.split(_string);
		var openFG = -1;
		var openBG = -1;
		var open = -1;
		var type;

		//
		for(var i = 0; i < split.length; i++)
		{
			if(isANSI(split[i]))
			{
				//
				type = ansi.type(split[i]);

				//
				if(type !== 'clear.reset')
				{
					if(! (type.startsWith('color') || type.startsWith('style')))
					{
						open = -1;
					}
					else if(open === -1)
					{
						open = i;
					}
				}

				//
				if(type === 'clear.reset' || type.startsWith('color') || type.startsWith('style'))
				{
					while(split[i] === split[i + 1])
					{
						split.splice(i + 1, 1);
					}
				}

				//
				if(type === 'clear.reset')
				{
					if(open > -1)
					{
						split.splice(open, (i - open));
						i = open - 1;
					}

					open = openFG = openBG = -1;
				}
				else if(type.startsWith('color.fg'))
				{
					if(openFG > -1)
					{
						split.splice(openFG, 1);
						i--;
					}

					openFG = i;
				}
				else if(type.startsWith('color.bg'))
				{
					if(openBG > -1)
					{
						split.splice(openBG, 1);
						i--;
					}

					openBG = i;
				}
			}
			else
			{
				open = -1;
				openFG = -1;
				openBG = -1;
			}
		}

		//
		return split.join('');
	}*/

	//
	Object.defineProperty(ansi, 'SIZE', { get: function()
	{
		return console.size;
	}});

	Object.defineProperty(ansi, 'COLORS', { get: function()
	{
		return console.colors;
	}});

	Object.defineProperty(ansi, 'DEPTH', { get: function()
	{
		return console.depth;
	}});

	Object.defineProperty(ansi, 'WIDTH', { get: function()
	{
		return console.width;
	}});

	Object.defineProperty(ansi, 'HEIGHT', { get: function()
	{
		return console.height;
	}});

	/*
	ansi.has = function(_string, _throw = true)
	{
		const esc = _string.indicesOf(ansi.ESC).length;
		const nul = _string.indicesOf(ansi.NUL).length;

		if(esc === 0 && nul === 0)
		{
			return false;
		}

		if(nul >= esc)
		{
			return true;
		}

		if(_throw)
		{
			return x('ESC and NUL are not there in the same amount');
		}

		return false;
	}

	ansi.open = function(_string)
	{
		return (ansi.collect(_string, true).length > 0);
	}*/

	//
	ansi.split = function(_string)
	{
		if(Array.isArray(_string))
		{
			if((_string = _string.join('')).length === 0)
			{
				return [];
			}
		}
		else if(! String.isString(_string))
		{
			return [];
		}

		//
		const result = [];
		var open = false;
		var sub = ''

		for(var i = 0, j = 0; i < _string.length; i++)
		{
			if(open)
			{
				sub += _string[i];

				if(_string[i] === ansi.NUL)
				{
					open = false;

					if(sub.length > 0)
					{
						result[j++] = sub;
						sub = '';
					}
				}
			}
			else
			{
				if(_string[i] === ansi.ESC)
				{
					open = true;

					if(sub.length > 0)
					{
						result[j++] = sub;
						sub = '';
					}
				}

				sub += _string[i];
			}
		}

		//
		if(sub.length > 0)
		{
			result.push(sub);
		}

		//
		return result;
	}

	ansi.isColored = function(_string, _fg = true, _bg = true)
	{
		if(typeof _fg !== 'boolean')
		{
			return x('Invalid % argument (expecting %)', null, '_fg', 'Boolean');
		}
		else if(typeof _bg !== 'boolean')
		{
			return x('Invalid % argument (expecting %)', null, '_bg', 'Boolean');
		}

		if(! (_fg || _bg))
		{
			return x('One of % / % needs to be (%)', null, '_fg', '_bg', 'true');
		}
		else if(String.isString(_string))
		{
			_string = ansi.split(_string);
		}
		else
		{
			return null;
		}

		for(var i = 0; i < _string.length; i++)
		{
			if(_string[i][0] === ansi.ESC)
			{
				if(_fg && ansi.is.color.fg(_string[i]))
				{
					return true;
				}
				else if(_bg && ansi.is.color.bg(_string[i]))
				{
					return true;
				}
			}
		}

		return false;
	}

	ansi.isColored.fg = function(_string)
	{
		return ansi.isColored(_string, true, false);
	}

	ansi.isColored.bg = function(_string)
	{
		return ansi.isColored(_string, false, true);
	}

	/*
	ansi.collect = function(_string, _reset = false)
	{
		if(typeof _string === 'string')
		{
			if(_string.length === 0)
			{
				return [];
			}

			_string = ansi.split(_string);
		}
		else if(! Array.isArray(_string))
		{
			return x('Invalid input (neither String nor Array)');
		}

		//
		const result = [];

		//
		for(var i = 0, k = 0; i < _string.length; i++)
		{
			if(_string[i][0] === ansi.ESC)
			{
				if(_reset && _string[i] === ansi.seq('[0m'))
				{
					result.length = k = 0;
				}
				else
				{
					result[k++] = _string[i];
				}
			}
		}

		//
		return result;
	}*/

	ansi.is = function(_seq, _type)
	{
		if(typeof _type !== 'string')
		{
			return x('Invalid _type argument (expecting String)');
		}

		const result = ansi.type(_seq);

		if(typeof result === 'string')
		{
			if(result === _type)
			{
				return true;
			}

			return (result.startsWith(_type) > 0);
		}
		else if(Array.isArray(result)) for(var i = 0; i < result.length; i++)
		{
			if(result[i] === _type)
			{
				return true;
			}
			else if(result[i].startsWith(_type))
			{
				return true;
			}
		}

		return false;
	}

	ansi.is.withReset = function(_seq)
	{
		const type = ansi.type(_seq);

		if(type.length > 0) for(var i = 0; i < ansi.types.withReset.length; i++)
		{
			if(type.startsWith(ansi.types.withReset[i]) > 0)
			{
				return true;
			}
		}

		return false;
	}

	ansi.is.withoutReset = function(_seq)
	{
		const type = ansi.type(_seq);

		if(type.length > 0) for(var i = 0; i < ansi.types.withoutReset.length; i++)
		{
			if(type.startsWith(ansi.types.withoutReset[i]) > 0)
			{
				return true;
			}
		}

		return false;
	}

	ansi.is.text = function(_seq)
	{
		return ((ansi.type(_seq).startsWith('text')) > 0);
	}

	ansi.is.text.title = function(_seq)
	{
		return (ansi.type(_seq) === 'text.title');
	}

	ansi.is.text.link = function(_seq)
	{
		return (ansi.type(_seq) === 'text.link');
	}

        ansi.is.bright = ansi.is.brightColor = function(_seq)
        {
                return ((ansi.type(_seq).endsWith('bright')) > 0);
        }

        ansi.is.color = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('color')) > 0);
        }

        ansi.is.color.fg = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('color.fg')) > 0);
        }

        ansi.is.color.bg = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('color.bg')) > 0);
        }

        ansi.is.color4 = function(_seq)
        {
                return ( ((ansi.type(_seq).startsWith('color.fg.4')) > 0) || ((ansi.type(_seq).startsWith('color.bg.4')) > 0) );
        }

        ansi.is.color4.fg = function(_seq)
        {
        	return ( ((ansi.type(_seq).startsWith('color.fg.4')) > 0) );
        }

        ansi.is.color4.bg = function(_seq)
        {
        	return ( ((ansi.type(_seq).startsWith('color.bg.4')) > 0) );
        }

        ansi.is.color8 = function(_seq)
        {
                return ( ((ansi.type(_seq).startsWith('color.fg.8')) > 0) || ((ansi.type(_seq).startsWith('color.bg.8')) > 0) );
        }

	ansi.is.color8.fg = function(_seq)
	{
		return ( ((ansi.type(_seq).startsWith('color.fg.8')) > 0) );
	}

	ansi.is.color8.bg = function(_seq)
	{
		return ( ((ansi.type(_seq).startsWith('color.bg.8')) > 0) );
	}

        ansi.is.color24 = function(_seq)
        {
                return ( ((ansi.type(_seq).startsWith('color.fg.24')) > 0) || ((ansi.type(_seq).startsWith('color.bg.24')) > 0) );
        }

        ansi.is.color24.fg = function(_seq)
        {
        	return ( ((ansi.type(_seq).startsWith('color.fg.24')) > 0) );
        }

        ansi.is.color24.bg = function(_seq)
        {
        	return ( ((ansi.type(_seq).startsWith('color.bg.24')) > 0) );
        }

        ansi.is.clear = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('clear')) > 0);
        }

        ansi.is.clear.reset = function(_seq)
        {
		return ((ansi.type(_seq).startsWith('clear.reset')) > 0);
        }

        ansi.is.clear.screen = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('clear.screen')) > 0);
        }

        ansi.is.clear.buffer = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('clear.buffer')) > 0);
        }

        ansi.is.clear.below = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('clear.below')) > 0);
        }

        ansi.is.clear.above = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('clear.above')) > 0);
        }

        ansi.is.clear.line = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('clear.line')) > 0);
        }

        ansi.is.clear.line.end = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('clear.line.end')) > 0);
        }

        ansi.is.clear.line.start = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('clear.line.start')) > 0);
        }

        ansi.is.style = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('style')) > 0);
        }

        ansi.is.style.bold = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('style.bold')) > 0);
        }

        ansi.is.style.faint = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('style.faint')) > 0);
        }

        ansi.is.style.italic = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('style.italic')) > 0);
        }

        ansi.is.style.underline = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('style.underline')) > 0);
        }

        ansi.is.style.slow = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('style.slow')) > 0);
        }

        ansi.is.style.fast = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('style.fast')) > 0);
        }

        ansi.is.style.inverse = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('style.inverse')) > 0);
        }

        ansi.is.style.conceal = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('style.conceal')) > 0);
        }

        ansi.is.style.strike = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('style.strike')) > 0);
        }

        ansi.is.flash = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('flash')) > 0);
        }

        ansi.is.flash.on = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('flash.on')) > 0);
        }

        ansi.is.flash.off = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('flash.off')) > 0);
        }

        ansi.is.cursor = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor')) > 0);
        }

        ansi.is.cursor.show = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.show')) > 0);
        }

        ansi.is.cursor.hide = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.hide')) > 0);
        }

        ansi.is.cursor.home = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.home')) > 0);
        }

	ansi.is.cursor.end = function(_seq)
	{
throw new Error('TODO (geht das ueberhaupt?!??)');
		return ((ansi.type(_seq).startsWith('cursor.end')) > 0);
	}

        ansi.is.cursor.save = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.save')) > 0);
        }

        ansi.is.cursor.load = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.load')) > 0);
        }

	ansi.is.cursor.push = function(_seq)
	{
		return ((ansi.type(_seq).startsWith('cursor.push')) > 0);
	}

	ansi.is.cursor.pop = function(_seq)
	{
		return ((ansi.type(_seq).startsWith('cursor.pop')) > 0);
	}

	ansi.is.cursor.shift = function(_seq)
	{
		return ((ansi.type(_seq).startsWith('cursor.shift')) > 0);
	}

	ansi.is.cursor.unshift = function(_seq)
	{
		return ((ansi.type(_seq).startsWith('cursor.unshift')) > 0);
	}

        ansi.is.cursor.column = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.column')) > 0);
        }

        ansi.is.cursor.up = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.up')) > 0);
        }

        ansi.is.cursor.down = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.down')) > 0);
        }

        ansi.is.cursor.right = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.right')) > 0);
        }

        ansi.is.cursor.left = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.left')) > 0);
        }

        ansi.is.cursor.next = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.next')) > 0);
        }

        ansi.is.cursor.prev = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.prev')) > 0);
        }

        ansi.is.cursor.move = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('cursor.move')) > 0);
        }

        ansi.is.scroll = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('scroll')) > 0);
        }

        ansi.is.scroll.up = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('scroll.up')) > 0);
        }

        ansi.is.scroll.down = function(_seq)
        {
                return ((ansi.type(_seq).startsWith('scroll.down')) > 0);
        }

	ansi.parse = function(_string)
	{
		//
		if(typeof _string !== 'string' || _string.length === 0)
		{
			return [];
		}

		const result = [];
		const split = ansi.split(_string);
		var type, args, idx;

		for(var i = 0, j = 0; i < split.length; i++)
		{
			if(! ansi.isSequence(split[i]))
			{
				continue;
			}
			else
			{
				type = ansi.type(split[i]);
			}

			idx = type.indexOf(' ');

			if(idx === -1)
			{
				result[j++] = [ type ];
				continue;
			}

			args = type.substr(idx + 1).split(' ');
			type = type.substr(0, idx);

			for(var k = 0; k < args.length; k++)
			{
				if(args[k].isInt())
				{
					args[k] = parseInt(args[k]);
				}
			}

			args.unshift(type);
			result[j++] = args;
		}

		//
		if(result.length === 1)
		{
			return result[0];
		}

		return result;
	}

	ansi.render = function(_type, ... _args)
	{
		//
		var args;

		//
		if(typeof _type !== 'string' || _type.length === 0)
		{
			return '';
		}
		else if(_type[0] === ansi.ESC)
		{
			if(ansi.isValid(_type))
			{
				return _type;
			}
			else
			{
				return x('Invalid ANSI escape sequence (not correctly terminated)');
			}
		}
		else
		{
			const idx = _type.indexOf(' ');

			if(idx === -1)
			{
				args = _args;
			}
			else
			{
				args = _type.substr(idx + 1).split(' ');
				_type = _type.substr(0, idx);
			}

			_type = _type.toLowerCase();
			var ints = false;

			for(var i = 0; i < args.length; i++)
			{
				if(typeof args[i] === 'string')
				{
					if(args[i].length === 0)
					{
						args.splice(i--, 1);
					}
					else if(args[i].isInt())
					{
						ints = true;
					}
					else
					{
						ints = false;
						break;
					}
				}
			}

			if(ints) for(var i = 0; i < args.length; i++)
			{
				args[i] = parseInt(args[i]);
			}
		}

		//
		const types = _type.split('.');

		switch(types[0])
		{
			case 'color':
				return ansi.render.color(_type, ... args);
			case 'text':
				return ansi.render.text(_type, ... args);
			case 'clear':
				return ansi.render.clear(_type, ... args);
			case 'style':
				return ansi.render.style(_type, ... args);
			case 'flash':
				return ansi.render.flash(_type, ... args);
			case 'cursor':
				return ansi.render.cursor(_type, ... args);
			case 'scroll':
				return ansi.render.scroll(_type, ... args);
		}

		//
		return '';
	}

	ansi.render.color = function(_type, ... _args)
	{
		//color.fg.24 r g b ([38;2;)
		//color.bg.24 r g b ([48;2;)
		//color.fg.8 b ([38;5;)
		//color.bg.8 b ([48;5;)
		//color.fg.4.black [30m
		//color.fg.4.red [31m
		//		green [32m
		//		yellow
		//		blue
		//		magenta
		//		cyan
		//		white [37m
		//color.bg.4.red [40m
		//	...
		//	bg.4.white [47m
		//color.fg.4.black.bright [90m
		//	..
		//	fg.4.white.bright [97m
		//color.bg.4.black.bright [100m
		//	..
		//	bg.4.white.bright [107m

		if(typeof _type !== 'string' || _type.length === 0)
		{
			return '';
		}
		else
		{
			_type = _type.removeStarting('color.');
		}

		if(_type.startsWith('fg'))
		{
			return ansi.render.color.fg(_type, ... _args);
		}
		else if(_type.startsWith('bg'))
		{
			return ansi.render.color.bg(_type, ... _args);
		}
		else if(_args.length % 2 === 0)
		{
			const count = _args.length / 2;
			const args1 = new Array(count);
			const args2 = new Array(count);

			for(var i = 0; i < count; i++)
			{
				args1[i] = _args[i];
			}

			for(var i = count; i < (count * 2); i++)
			{
				args2[i - count] = _args[i];
			}

			//
			return (ansi.render.color.fg(_type, ... args1)
				+ ansi.render.color.bg(_type, ... args2));
		}

		return '';
	}

	ansi.render.color.fg = function(_type, ... _args)
	{
		if(typeof _type !== 'string' || _type.length === 0)
		{
			return '';
		}
		else
		{
			_type = _type.removeStarting('color.').removeStarting('fg.');
		}

		if(_type.startsWith('24'))
		{
			if(_args[0] === true || (typeof _args[0] === 'string' && (_args[0].length === 0 || _args[0] === 'random' || _args[0] === 'random24')))
			{
				_args = ansi.getRandomColor24();
			}
			else if(typeof _args[0] === 'number' && typeof _args[1] === 'number' && typeof _args[2] === 'number')
			{
				_args.length = 3;
				_args = color.hex(... _args);
			}
			else if(typeof _args[0] === 'string' && _args[0].length > 0)
			{
				_args = _args[0];
			}
			else
			{
				//return x(...
				return '';
			}
		}
		else if(_type.startsWith('8'))
		{
			if(_args[0] === true || typeof _args[0] === 'string' && (_args[0].length === 0 || _args[0] === 'random' || _args[0] === 'random8'))
			{
				_args = ansi.getRandomColor8();
			}
			else if(typeof _args[0] === 'number')
			{
				_args = _args[0];
			}
			else if(typeof _args[0] === 'string' && _args[0].isInt())
			{
				_args = parseInt(_args[0]);
			}
			else
			{
				//return x(
				return '';
			}
		}
		else if(_type.startsWith('4'))
		{
			if(_args[0] === true || typeof _args[0] === 'string' && (_args[0].length === 0 || _args[0] === 'random' || _args[0] === 'random4'))
			{
				_args = ansi.getRandomColor4();
			}
			else if(typeof _args[0] === 'string' && _args[0].length > 0)
			{
				_args = _args[0];
			}
			else
			{
				//return x(..
				return '';
			}
		}

		return '';
	}

	ansi.render.color.bg = function(_type, ... _args)
	{
		if(typeof _type !== 'string' || _type.length === 0)
		{
			return '';
		}
		else
		{
			_type = _type.removeStarting('color.').removeStarting('bg.');
		}

		if(_type.startsWith('24'))
		{
			if(_args[0] === true || typeof _args[0] === 'string' && (_args[0].length === 0 || _args[0] === 'random' || _args[0] === 'random24'))
			{
				_args = ansi.getRandomColor24();
			}
			else if(typeof _args[0] === 'number' && typeof _args[1] === 'number' && typeof _args[2] === 'number')
			{
				_args.length = 3;
				_args = color.hex(... _args);
			}
			else if(typeof _args[0] === 'string' && _args[0].length > 0)
			{
				_args = _args[0];
			}
			else
			{
				//return x(..
				return '';
			}
		}
		else if(_type.startsWith('8'))
		{
			if(_args[0] === true || typeof _args[0] === 'string' && (_args[0].length === 0 || _args[0] === 'random' || _args[0] === 'random8'))
			{
				_args = ansi.getRandomColor8();
			}
			else if(typeof _args[0] === 'number')
			{
				_args = _args[0];
			}
			else if(typeof _args[0] === 'string' && _args[0].isInt())
			{
				_args = parseInt(_args[0]);
			}
			else
			{
				//return x(
				return '';
			}
		}
		else if(_type.startsWith('4'))
		{
			if(_args[0] === true || typeof _args[0] === 'string' && (_args[0].length === 0 || _args[0] === 'random' || _args[0] === 'random4'))
			{
				_args = ansi.getRandomColor4();
			}
			else if(typeof _args[0] === 'string' && _args[0].length > 0)
			{
				_args = _args[0];
			}
			else
			{
				//return x(
				return '';
			}
		}

		return '';
	}

	ansi.render.text = function(_type, ... _args)
	{
		//title (]0;)
		//link (???)

		if(typeof _type !== 'string' || _type.length === 0)
		{
			return '';
		}
		else
		{
			_type = _type.removeStarting('text.');
		}
	}

	ansi.render.clear = function(_type, ... _args)
	{
		//clear.reset [0m
		//	.screen [2J
		//	.buffer [3J
		//	.below [0J
		//	.above [1J
		//	.line [2K
		//	.line.end [0K
		//	.line.start [1K
		//

		if(typeof _type !== 'string' || _type.length === 0)
		{
			return '';
		}
		else
		{
			_type = _type.removeStarting('clear.');
		}
	}

	ansi.render.style = function(_type, ... _args)
	{
		//style.bold [1m
		//style.faint [2m
		//.italic
		//.underline
		//.slow
		//.fast
		//.inverse
		//.conceal
		//.strike [9m
		//

		if(typeof _type !== 'string' || _type.length === 0)
		{
			return '';
		}
		else
		{
			_type = _type.removeStarting('style.');
		}
	}

	ansi.render.flash = function(_type, ... _args)
	{
		//flash.on [?5h
		//flash.off [?5l
		//

		if(typeof _type !== 'string' || _type.length === 0)
		{
			return '';
		}
		else
		{
			_type = _type.removeStarting('flash.');
		}
	}

	ansi.render.cursor = function(_type, ... _args)
	{
		//cursor.show [?25h
		//cursor.hide [?25l
		//cursor.home [H
		//cursor.end (TODO!!!)
		//cursor.save [s
		//cursor.load [u
		//
		//cursor.push
		//cursor.pop
		//cursor.shift
		//cursor.unshift
		//
		//cursor.up [%A
		//cursor.down [%B
		//cursor.right [%C
		//cursor.left [%D
		//cursor.next [%E
		//cursor.prev [%F
		//cursor.move [%;%H
		//

		if(typeof _type !== 'string' || _type.length === 0)
		{
			return '';
		}
		else
		{
			_type = _type.removeStarting('cursor.');
		}
	}

	ansi.render.scroll = function(_type, ... _args)
	{
		//scroll.up [%S
		//scroll.down [%T
		//scroll.column [%G
		//

		if(typeof _type !== 'string' || _type.length === 0)
		{
			return '';
		}
		else
		{
			_type = _type.removeStarting('scroll.');
		}
	}

	ansi.types = [
		'color', 'style',
		'text', 'clear', 'cursor', 'scroll', 'flash'
	];

	ansi.types.withReset = [ 'color', 'style' ];
	ansi.types.withoutReset = [ 'text', 'clear', 'cursor', 'scroll', 'flash' ];

	ansi.type = function(_sequence)
	{
		if(typeof _sequence === 'string')
		{
			if(_sequence[0] === ansi.ESC)
			{
				_sequence = _sequence.removeFirst();
			}

			if(_sequence[_sequence.length - 1] === ansi.NUL)
			{
				_sequence = _sequence.removeLast();
			}

			if(_sequence.length === 0)
			{
				return '';
			}
		}
		else if(Object.isObject(_sequence))
		{
			const isArray = Array.isArray(_sequence);
			const result = (isArray ? [] : Object.create(null));

			if(isArray) for(var i = 0, j = 0; i < _sequence.length; i++)
			{
				result[j++] = ansi.type(_sequence[i]);
			}
			else for(var idx in _sequence)
			{
				result[idx] = ansi.type(_sequence[idx]);
			}

			return result;
		}
		else
		{
			return '';
		}

		//
		const nextNumber = (_index = 0, _parse = false, _float = true, _radix = 10) => {
			var sub = '';
			var hadPoint = false;

			for(var i = _index; i < _sequence.length; i++)
			{
				if(_sequence[i] === '.')
				{
					if(! _float)
					{
						break;
					}
					else if(hadPoint)
					{
						break;
					}
					else
					{
						sub += '.';
						hadPoint = true;
					}
				}
				else if(_sequence[i].isInt(_radix))
				{
					sub += _sequence[i];
				}
				else
				{
					break;
				}
			}

			if(_parse)
			{
				return parseInt(sub);
			}

			return sub;
		};

		//
		if(_sequence.startsWith('[38;2;'))
		{
			const r = nextNumber(6, true, false, 10);
			const g = nextNumber(10, true, false, 10);
			const b = nextNumber(14, true, false, 10);

			return 'color.fg.24 ' + r + ' ' + g + ' ' + b;
		}
		else if(_sequence.startsWith('[48;2;'))
		{
			const r = nextNumber(6, true, false, 10);
			const g = nextNumber(10, true, false, 10);
			const b = nextNumber(14, true, false, 10);

			return 'color.bg.24 ' + r + ' ' + g + ' ' + b;
		}
		else if(_sequence.startsWith('[38;5;'))
		{
			return 'color.fg.8 ' + nextNumber(6, true, false, 10);
		}
		else if(_sequence.startsWith('[48;5;'))
		{
			return 'color.bg.8 ' + nextNumber(6, true, false, 10);
		}
		else if(_sequence.startsWith(']0;'))
		{
			if(_sequence[_sequence.length - 1] === BEL)
			{
				_sequence = _sequence.removeLast();
			}

			return 'text.title ' + _sequence.substr(3);
		}
//TODO		//else if(... => 'text.link'
		else
		{
			switch(_sequence)
			{
				//colors
				case '[30m':
					return 'color.fg.4 black';
				case '[31m':
					return 'color.fg.4 red';
				case '[32m':
					return 'color.fg.4 green';
				case '[33m':
					return 'color.fg.4 yellow';
				case '[34m':
					return 'color.fg.4 blue';
				case '[35m':
					return 'color.fg.4 magenta';
				case '[36m':
					return 'color.fg.4 cyan';
				case '[37m':
					return 'color.fg.4 white';
				case '[40m':
					return 'color.bg.4 black';
				case '[41m':
					return 'color.bg.4 red';
				case '[42m':
					return 'color.bg.4 green';
				case '[43m':
					return 'color.bg.4 yellow';
				case '[44m':
					return 'color.bg.4 blue';
				case '[45m':
					return 'color.bg.4 magenta';
				case '[46m':
					return 'color.bg.4 cyan';
				case '[47m':
					return 'color.bg.4 white';
				case '[90m':
					return 'color.fg.4 black.bright';
				case '[91m':
					return 'color.fg.4 red.bright';
				case '[92m':
					return 'color.fg.4 green.bright';
				case '[93m':
					return 'color.fg.4 yellow.bright';
				case '[94m':
					return 'color.fg.4 blue.bright';
				case '[95m':
					return 'color.fg.4 magenta.bright';
				case '[96m':
					return 'color.fg.4 cyan.bright';
				case '[97m':
					return 'color.fg.4 white.bright';
				case '[100m':
					return 'color.bg.4 black.bright';
				case '[101m':
					return 'color.bg.4 red.bright';
				case '[102m':
					return 'color.bg.4 green.bright';
				case '[103m':
                                        return 'color.bg.4 yellow.bright';
				case '[104m':
					return 'color.bg.4 blue.bright';
				case '[105m':
					return 'color.bg.4 magenta.bright';
				case '[106m':
					return 'color.bg.4 cyan.bright';
				case '[107m':
                                        return 'color.bg.4 white.bright';
				//
				case '[0m':
					return 'clear.reset';
				case '[2J':
					return 'clear.screen';
				case '[3J':
					return 'clear.buffer';
				case '[0J':
					return 'clear.below';
				case '[1J':
					return 'clear.above';
				case '[2K':
					return 'clear.line';
				case '[0K':
					return 'clear.line.end';
				case '[1K':
					return 'clear.line.start';
				//styles
				case '[1m':
					return 'style.bold';
				case '[2m':
					return 'style.faint';
				case '[3m':
					return 'style.italic';
				case '[4m':
					return 'style.underline';
				case '[5m':
					return 'style.slow';
				case '[6m':
					return 'style.fast';
				case '[7m':
					return 'style.inverse';
				case '[8m':
					return 'style.conceal';
				case '[9m':
					return 'style.strike';
				//
				case '[?5h':
					return 'flash.on';
				case '[?5l':
					return 'flash.off';
				//
				case '[?25h':
					return 'cursor.show';
				case '[?25l':
					return 'cursor.hide';
				case '[H':
					return 'cursor.home';//und 'cursor.end'?!? schwieriger..
				case '[s':
					return 'cursor.save';
				case '[u':
					return 'cursor.load';
			}

			if(_sequence[0] === '[')
			{
				_sequence = _sequence.removeFirst();
			}
			else
			{
				return '';
			}

			const params = [];
			var int;

			do
			{
				int = nextNumber(0, false, false, 10);
				_sequence = _sequence.removeFirst(int.length);

				params.push(parseInt(int));

				if(_sequence[0] !== ';')
				{
					break;
				}
				else
				{
					_sequence = _sequence.removeFirst();
				}
			}
			while(true);

			var result;

			switch(_sequence)
			{
				case 'S':
					result = 'scroll.up';
					break;
				case 'T':
					result = 'scroll.down';
					break;
				case 'G':
					result = 'cursor.column';
					break;
				case 'A':
					result = 'cursor.up';
					break;
				case 'B':
					result = 'cursor.down';
					break;
				case 'C':
					result = 'cursor.right';
					break;
				case 'D':
					result = 'cursor.left';
					break;
				case 'E':
					result = 'cursor.next';
					break;
				case 'F':
					result = 'cursor.prev';
					break;
				//
				case 'H':
					result = 'cursor.move';
					break;
				case 'f':
					result = 'cursor.move';
					break;

				//
				default:
					return '';
			}

			for(var i = 0; i < params.length; i++)
			{
				result += ' ' + params[i];
			}

			return result;
		}

		//
		return '';
	}

	//
	ansi.remove = function(_string, _throw = true)
	{
		var result = '';
		var open = false;

		for(var i = 0; i < _string.length; i++)
		{
			if(open)
			{
				if(_string[i] === ansi.NUL)
				{
					open = false;
				}
			}
			else
			{
				if(_string[i] === ansi.ESC)
				{
					open = true;
				}
				else
				{
					result += _string[i];
				}
			}
		}

		if(open && _throw)
		{
			return x('Invalid ANSI escape sequence(s) (no ending % termination found)', null, 'NUL');
		}

		return result;
	}

	ansi.remove.color = function(_string, _fg = true, _bg = true, _24 = true, _8 = true, _4 = true)
	{
		var result = _string;

		if(_24)
		{
			result = ansi.remove.color24(result, _fg, _bg);
		}

		if(_8)
		{
			result = ansi.remove.color8(result, _fg, _bg);
		}

		if(_4)
		{
			result = ansi.remove.color4(result, _fg, _bg);
		}

		return result;
	}

	ansi.remove.color24 = function(_string, _fg = true, _bg = true)
	{
		const split = ansi.split(_string);
		var sub;

		for(var i = 0; i < split.length; i++)
		{
			if(split[i][0] === ansi.ESC && split[i].last() === ansi.NUL)
			{
				sub = split[i].removeFirst();

				if(_fg && sub.startsWith('[38;2;'))
				{
					split.splice(i--, 1);
				}
				else if(_bg && sub.startsWith('[48;2;'))
				{
					split.splice(i--, 1);
				}
			}
		}

		return split.join('');
	}

	ansi.remove.color8 = function(_string, _fg = true, _bg = true)
	{
		const split = ansi.split(_string);
		var sub;

		for(var i = 0; i < split.length; i++)
		{
			if(split[i][0] === ansi.ESC && split[i].last() === ansi.NUL)
			{
				sub = split[i].removeFirst();

				if(_fg && sub.startsWith('[38;5;'))
				{
					split.splice(i--, 1);
				}
				else if(_bg && sub.startsWith('[48;5;'))
				{
					split.splice(i--, 1);
				}
			}
		}

		return split.join('');
	}

	ansi.remove.color4 = function(_string, _fg = true, _bg = true)
	{
		const split = ansi.split(_string);
		var sub;

		for(var i = 0; i < split.length; i++)
		{
			if(split[i][0] === ansi.ESC && split[i].last() === ansi.NUL)
			{
				sub = split[i].removeFirst().removeLast();

				switch(sub)
				{
					case '[30m':
					case '[31m':
					case '[32m':
					case '[33m':
					case '[34m':
					case '[35m':
					case '[36m':
					case '[37m':

						if(_fg)
						{
							split.splice(i--, 1);
						}

						break;

					case '[40m':
					case '[41m':
					case '[42m':
					case '[43m':
					case '[44m':
					case '[45m':
					case '[46m':
					case '[47m':

						if(_bg)
						{
							split.splice(i--, 1);
						}

						break;

					case '[90m':
					case '[91m':
					case '[92m':
					case '[93m':
					case '[94m':
					case '[95m':
					case '[96m':
					case '[97m':

						if(_fg)
						{
							split.splice(i--, 1);
						}

						break;

					case '[100m':
					case '[101m':
					case '[102m':
					case '[103m':
					case '[104m':
					case '[105m':
					case '[106m':
					case '[107m':

						if(_bg)
						{
							split.splice(i--, 1);
						}

						break;
				}
			}
		}

		return split.join('');
	}

//todo/
//alle 4-bit farben einzeln
	//ansi.remove.color4.black{,.fg,.bg}..
	//...

	ansi.remove.style = function(_string, _options)
	{
		if(Object.isObject(_options))
		{
			_options = {};
		}

		if(typeof _options.none !== 'boolean')
		{
			//IMPORTANT (false) ONLY HERE!???!
			_options.none = false;
		}

		if(typeof _options.bold !== 'boolean')
		{
			_options.bold = true;
		}

		if(typeof _options.faint !== 'boolean')
		{
			_options.faint = true;
		}

		if(typeof _options.italic !== 'boolean')
		{
			_options.italic = true;
		}

		if(typeof _options.underline !== 'boolean')
		{
			_options.underline = true;
		}

		if(typeof _options.slow !== 'boolean')
		{
			_options.slow = true;
		}

		if(typeof _options.fast !== 'boolean')
		{
			_options.fast = true;
		}

		if(typeof _options.blink !== 'boolean')
		{
			_options.blink = true;
		}

		if(typeof _options.inverse !== 'boolean')
		{
			_options.inverse = true;
		}

		if(typeof _options.conceal !== 'boolean')
		{
			_options.conceal = true;
		}

		if(typeof _options.strike !== 'boolean')
		{
			_options.strike = true;
		}

		//
		const split = ansi.split(_string);
		var sub;

		for(var i = 0; i < split.length; i++)
		{
			sub = split[i].removeFirst().removeLast();

			switch(sub)
			{
				case '[0m':
					if(_options.none)
					{
						split.splice(i--, 1);
					}
					break;
				case '[1m':
					if(_options.bold)
					{
						split.splice(i--, 1);
					}
					break;
				case '[2m':
					if(_options.faint)
					{
						split.splice(i--, 1);
					}
					break;
				case '[3m':
					if(_options.italic)
					{
						split.splice(i--, 1);
					}
					break;
				case '[4m':
					if(_options.underline)
					{
						split.splice(i--, 1);
					}
					break;
				case '[5m':
					if(_options.slow)
					{
						split.splice(i--, 1);
					}
					break;
				case '[6m':
					if(_options.fast)
					{
						split.splice(i--, 1);
					}
					break;
				case '[7m':
					if(_options.inverse)
					{
						split.splice(i--, 1);
					}
					break;
				case '[8m':
					if(_options.conceal)
					{
						split.splice(i--, 1);
					}
					break;
				case '[9m':
					if(_options.strike)
					{
						split.splice(i--, 1);
					}
					break;
			}
		}

		return split.join('');
	}

	ansi.remove.style.bold = function(_string)
	{
		const split = ansi.split(_string);

		for(var i = 0; i < split.length; i++)
		{
			if(split[i] === ansi.seq('[1m'))
			{
				split.splice(i--, 1);
			}
		}

		return split.join('');
	}

	ansi.remove.style.faint = function(_string)
	{
		const split = ansi.split(_string);

		for(var i = 0; i < split.length; i++)
		{
			if(split[i] === ansi.seq('[2m'))
			{
				split.splice(i--, 1);
			}
		}

		return split.join('');
	}

	ansi.remove.style.italic = function(_string)
	{
		const split = ansi.split(_string);

		for(var i = 0; i < split.length; i++)
		{
			if(split[i] === ansi.seq('[3m'))
			{
				split.splice(i--, 1);
			}
		}

		return split.join('');
	}

	ansi.remove.style.underline = function(_string)
	{
		const split = ansi.split(_string);

		for(var i = 0; i < split.length; i++)
		{
			if(split[i] === ansi.seq('[4m'))
			{
				split.splice(i--, 1);
			}
		}

		return split.join('');
	}

	ansi.remove.style.slow = function(_string)
	{
		const split = ansi.split(_string);

		for(var i = 0; i < split.length; i++)
		{
			if(split[i] === ansi.seq('[5m'))
			{
				split.splice(i--, 1);
			}
		}

		return split.join('');
	}

	ansi.remove.style.fast = function(_string)
	{
		const split = ansi.split(_string);

		for(var i = 0; i < split.length; i++)
		{
			if(split[i] === ansi.seq('[6m'))
			{
				split.splice(i--, 1);
			}
		}

		return split.join('');
	}

	ansi.remove.style.inverse = function(_string)
	{
		const split = ansi.split(_string);

		for(var i = 0; i < split.length; i++)
		{
			if(split[i] === ansi.seq('[7m'))
			{
				split.splice(i--, 1);
			}
		}

		return split.join('');
	}

	ansi.remove.style.conceal = function(_string)
	{
		const split = ansi.split(_string);

		for(var i = 0; i < split.length; i++)
		{
			if(split[i] === ansi.seq('[8m'))
			{
				split.splice(i--, 1);
			}
		}

		return split.join('');
	}

	ansi.remove.style.strike = function(_string)
	{
		const split = ansi.split(_string);

		for(var i = 0; i < split.length; i++)
		{
			if(split[i] === ansi.seq('[9m'))
			{
				split.splice(i--, 1);
			}
		}

		return split.join('');
	}

	//
	ansi.stringLength = function(_string, _throw = true)
	{
		if(_string.length === 0)
		{
			return 0;
		}

		var result = 0;
		var open = false;

		for(var i = 0; i < _string.length; i++)
		{
			if(open)
			{
				if(_string[i] === ansi.NUL)
				{
					open = false;
				}
			}
			else if(_string[i] === '\\')
			{
				if(i < (_string.length - 1)) switch(_string[i + 1])
				{
					case ESC:
						++i;
						result += 2;
						break;
					default:
						++result;
						break;
				}
				else
				{
					++result;
				}
			}
			else if(_string[i] === ansi.ESC)
			{
				open = true;
			}
			else
			{
				result++;
			}
		}

		if(open && _throw)
		{
			return x('Invalid ANSI escape sequence found (no NUL termination)');
		}

		return result;
	}

	ansi.isSequence = ansi.isSeq = function(_string)
	{
		//TODO/ARRAY => check multiple..
		//
		if(typeof _string !== 'string')
		{
			return null;
		}
		else if(_string.length <= 2)
		{
			return false;
		}

		return (_string[0] === ansi.ESC && _string[_string.length - 1] === ansi.NUL);
	}

	ansi.isValid = function(_string)
	{
		var last = null;
		var esc = 0;
		var nul = 0;

		for(var i = 0; i < _string.length; i++)
		{
			if(_string[i] === ansi.ESC)
			{
				esc++;

				if(last === ansi.ESC)
				{
					return false;
				}
				else
				{
					last = ansi.ESC;
				}
			}
			else if(_string[i] === ansi.NUL)
			{
				nul++;

				if(last === ansi.NUL)
				{
					return false;
				}
				else
				{
					last = ansi.NUL;
				}
			}
		}

		if(last === ansi.ESC)
		{
			return false;
		}
		else if(esc > 0 && nul > 0 && esc > nul)
		{
			return false;
		}

		return true;
	}

	//
	ansi.text = {};

	ansi.text.title = ansi.title = function(_title, _stream = 0, _inject = INJECT)
	{
		if(typeof _title !== 'string')
		{
			_title = '';
		}

		return ansi(']0;' + _title + BEL, null, _stream, false, _inject);
	}

	//TODO/!!!
	/*
	ansi.text.link = ansi.link = function(_href, _stream = null, _inject = INJECT)
	{
		if(typeof _href !== 'string' || _href.length === 0)
		{
			return '';
		}

		return ansi(']8;;' + _href + '\\', null, _stream, false, _inject);
	}*/

	//
	ansi.clear = function(_clear_scrollback_buffer = true, _cursor_home = true, _stream = 0)
	{
		var result = (_clear_scrollback_buffer ? ansi.clear.buffer(_stream) : '');
		result += ansi('[2J', null, _stream, false);

		if(_cursor_home)
		{
			result += ansi.cursor.home();
		}

		return result;
	}

	ansi.reset = ansi.clear.reset = function(_stream = 0)
	{
		return ansi('[0m', null, _stream, false);
	}

	ansi.clear.screen = function(_clear_scrollback_buffer = false, _cursor_home = false, _stream = 0)
	{
		return ansi.clear(_clear_scrollback_buffer, _cursor_home, _stream);
	}

	// *only* scrollback buffer..
	ansi.clear.buffer = function(_stream = 0)
	{
		return ansi('[3J', null, _stream, false);
	}

	ansi.clear.below = function(_stream = 0)
	{
		return ansi('[0J', null, _stream, false);
	}

	ansi.clear.above = function(_stream = 0)
	{
		return ansi('[1J', null, _stream, false);
	}

	ansi.clear.line = function(_stream = 0)
	{
		return ansi('[2K', null, _stream, false);
	}

	ansi.clear.line.end = ansi.clear.end = function(_stream = 0)
	{
		return ansi('[0K', null, _stream, false);
	}

	ansi.clear.line.start = ansi.clear.start = function(_stream = 0)
	{
		return ansi('[1K', null, _stream, false);
	}

	//
	//ansi.styles = [ 'bold', 'faint', 'italic', 'underline', 'slow', 'fast', 'blink', 'inverse', 'conceal', 'strike' ];
	ansi.styles = [ 'bold', 'faint', 'italic', 'underline', 'blink', 'inverse', 'conceal', 'strike' ];
	ansi.style = {};

	ansi.style.bold = ansi.bold = function(_string, _stream = null, _end = (typeof _string === 'string'), _inject = INJECT)
	{
		return ansi('[1m', _string, _stream, _end, _inject);
	}

	ansi.style.faint = ansi.faint = function(_string, _stream = null, _end = (typeof _string === 'string'), _inject = INJECT)
	{
		return ansi('[2m', _string, _stream, _end, _inject);
	}

	ansi.style.italic = ansi.italic = function(_string, _stream = null, _end = (typeof _string === 'string'), _inject = INJECT)
	{
		return ansi('[3m', _string, _stream, _end, _inject);
	}

	ansi.style.underline = ansi.underline = function(_string, _stream = null, _end = (typeof _string === 'string'), _inject = INJECT)
	{
		return ansi('[4m', _string, _stream, _end, _inject);
	}

	ansi.style.slow = ansi.slow = function(_string, _stream = null, _end = (typeof _string === 'string'), _inject = INJECT)
	{
		return ansi('[5m', _string, _stream, _end, _inject);
	}

	ansi.style.fast = ansi.fast = function(_string, _stream = null, _end = (typeof _string === 'string'), _inject = INJECT)
	{
		return ansi('[6m', _string, _stream, _end, _inject);
	}

	ansi.style.blink = ansi.blink = function(_string, _stream = null, _end = (typeof _string === 'string'), _inject = INJECT)
	{
		return ansi.style.slow(_string, _stream, _end, _inject);
		//return ansi.style.slow(ansi.style.fast(_string, null, _end, _inject), _stream, _end, _inject);
	}

	ansi.style.inverse = ansi.inverse = function(_string, _stream = null, _end = (typeof _string === 'string'), _inject = INJECT)
	{
		return ansi('[7m', _string, _stream, _end, _inject);
	}

	ansi.style.conceal = ansi.conceal = function(_string, _stream = null, _end = (typeof _string === 'string'), _inject = INJECT)
	{
		return ansi('[8m', _string, _stream, _end, _inject);
	}

	ansi.style.strike = ansi.strike = function(_string, _stream = null, _end = (typeof _string === 'string'), _inject = INJECT)
	{
		return ansi('[9m', _string, _stream, _end, _inject);
	}

	//
	ansi.flash = {};

	ansi.flash.on = function(_stream = 0)
	{
		return ansi('[?5h', null, _stream, false);
	}

	ansi.flash.off = function(_stream = 0)
	{
		return ansi('[?5l', null, _stream, false);
	}

	//
	ansi.scroll = {};

//todo/are these correct? ..had to switch 'T' and 'S'...
	ansi.scroll.up = function(_count = 1, _stream = 0)
	{
		return ansi('[' + _count + 'S', null, _stream, false);
	}

	ansi.scroll.down = function(_count = 1, _stream = 0)
	{
		return ansi('[' + _count + 'T', null, _stream, false);
	}

	//
	function CALLBACK(_callback, _result, _stream, ... _args)
	{
		if(! DEFAULT_CURSOR_CALLBACK)
		{
			return _result;
		}
		else if(typeof _callback === 'function')
		{
			const callback = (... _a) => {
				_a[0].assign({
					result: _result,
					stream: _stream,
					args: _args
				});

				return _callback(... _a, _result, ... _args);
			};

			ansi.cursor.read(callback, _stream);
		}

		return _result;
	}

	ansi.cursor = function(_y, _x, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{

		if(Number.isInt(_y) || String.isString(_y))
		{
			_y = ansi.y(_y, ansi.HEIGHT, _throw);
		}
		else
		{
			return ansi.CURSOR(_y, _x, _callback, _stream, _throw);
		}

		if(Number.isInt(_x) || String.isString(_x))
		{
			_x = ansi.x(_x, ansi.WIDTH, _throw);
		}
		else
		{
			return ansi.CURSOR(_y, _x, _callback, _stream, _throw);
		}

		const seq = [
			('[' + _y + ';' + _x + 'H'),
			('[' + _y + ';' + _x + 'f')
		];

		var result = '';

		for(const s of seq)
		{
			result += ansi(s, null, _stream, false);
		}

		return CALLBACK(_callback, result, _stream, ... arguments);
	}

	ansi.CURSOR = function(_y, _x, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		if(Number.isInt(_y) || String.isString(_y))
		{
			_y = ansi.y(_y, ansi.HEIGHT, _throw);
		}
		else
		{
			_y = null;
		}

		if(Number.isInt(_x) || String.isString(_x))
		{
			_x = ansi.x(_x, ansi.WIDTH, _throw);
		}
		else
		{
			_x = null;
		}

		if(_y === null && _x === null)
		{
			if(_throw)
			{
				return x('At least one of [ %, % ] needs to be defined (% or %)', null, '_y', '_x', 'Integer', 'String');
			}

			return null;
		}
		else if(_y !== null && _x !== null)
		{
			return ansi.cursor(_y, _x, _callback, _stream, _throw);
		}

		const cb = (_event) => {
			if(_x === null)
			{
				_x = _event.x;
			}
			else if(_y === null)
			{
				_y = _event.y;
			}

			ansi.cursor(_y, _x, _callback, _stream, _throw);
		};

		ansi.cursor.read(cb, _stream);
		return null;
	}

	ansi.cursor.x = function(_x, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		return ansi.cursor.column(_x, _callback, _stream, _throw);
	}

	ansi.cursor.y = function(_y, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		if(Number.isInt(_y) || String.isString(_y))
		{
			_y = ansi.y(_y, ansi.HEIGHT, _throw);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting an %)', null, '_y', 'Integer');
		}
		else
		{
			return null;
		}

		const cb = (_event) => {
			return ansi.cursor(_y, _event.x, _callback, _stream, _throw);
		};

		ansi.cursor.read(cb, _stream);
		return null;
	}

	ansi.cursor.move = function(_y, _x, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		const result = {};

		if(Number.isInt(_y) || String.isString(_y))
		{
			result.y = ansi.cursor.move.y(_y, null, _stream, _throw);
		}

		if(Number.isInt(_x) || String.isString(_x))
		{
			result.x = ansi.cursor.move.x(_x, null, _stream, _throw);
		}

		return CALLBACK(_callback, result, _stream, ... arguments);
	}

	ansi.cursor.move.x = function(_x, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		if(Number.isInt(_x))
		{
			//
		}
		else if(String.isString(_x))
		{
			_x = ansi.x(_x, ansi.WIDTH, _throw);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting % or %)', null, '_x', 'Integer', 'String');
		}
		else
		{
			return null;
		}

		if(_x === 0)
		{
			return null;
		}
		else if(_x < 0)
		{
			return ansi.cursor.left(-_x, _callback, _stream, _throw);
		}

		return ansi.cursor.right(_x, _callback, _stream, _throw);
	}

	ansi.cursor.move.y = function(_y, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		if(Number.isInt(_y))
		{
			//
		}
		else if(String.isString(_y))
		{
			_y = ansi.y(_y, ansi.HEIGHT, _throw);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting % or %)', null, '_y', 'Integer', 'String');
		}
		else
		{
			return null;
		}

		if(_y === 0)
		{
			return null;
		}
		else if(_y < 0)
		{
			return ansi.cursor.up(-_y, _callback, _stream, _throw);
		}

		return ansi.cursor.down(_y, _callback, _stream, _throw);
	}

	//
	ansi.cursor.show = ansi.show = function(_stream = 0)
	{
		return ansi('[?25h', null, _stream, false);
	}

	ansi.cursor.hide = ansi.hide = function(_stream = 0)
	{
		return ansi('[?25l', null, _stream, false);
	}

	ansi.cursor.home = ansi.home = function(_stream = 0)
	{
		return ansi('[H', null, _stream, false);
	}

	ansi.cursor.end = ansi.end = function(_stream = 0)
	{
		return ansi.cursor(-1, 0, _stream);
	}

	ansi.cursor.save = ansi.save = function(_stream = 0)
	{
		return ansi('[s', null, _stream, false);
	}

	ansi.cursor.load = ansi.load = function(_stream = 0)
	{
		return ansi('[u', null, _stream, false);
	}

	//
	const CURSOR_STACK = ansi.cursor.STACK = [];
	var CURSOR_STACK_LOCK = false;

	Object.defineProperty(ansi.cursor, 'lock', { get: function()
	{
		return CURSOR_STACK_LOCK;
	}});

	Object.defineProperty(ansi.cursor, 'limit', { get: function()
	{
		return (CURSOR_STACK.length >= DEFAULT_CURSOR_STACK_MAX_LENGTH);
	}});

	Object.defineProperty(ansi.cursor, 'stack', {
		get: function()
		{
			return CURSOR_STACK.length;
		},
		set: function(_value)
		{
			if(Number.isInt(_value))
			{
				CURSOR_STACK.applyLength(_value);
			}

			return CURSOR_STACK.length;
		}
	});

	Object.defineProperty(ansi.cursor, 'empty', { get: function()
	{
		return (CURSOR_STACK.length === 0);
	}});

	const pushStackItem = (_item, _force = false) => {
		if(! _force)
		{
			if(ansi.cursor.lock)
			{
				return -1;
			}
			else if(ansi.cursor.limit)
			{
				return -1;
			}
		}

		return (CURSOR_STACK.push(_item) - 1);
	};

	const unshiftStackItem = (_item, _force = false) => {
		if(! _force)
		{
			if(ansi.cursor.lock)
			{
				return -1;
			}
			else if(ansi.cursor.limit)
			{
				return -1;
			}
		}

		CURSOR_STACK.unshift(_item);
		return 0;
	};

	const popStackItem = (_force = false) => {
		if(! _force)
		{
			if(ansi.cursor.lock)
			{
				return null;
			}
			else if(ansi.cursor.stack === 0)
			{
				return null;
			}
		}

		return CURSOR_STACK.pop();
	};

	const shiftStackItem = (_force = false) => {
		if(! _force)
		{
			if(ansi.cursor.lock)
			{
				return null;
			}
			else if(ansi.cursor.stack === 0)
			{
				return null;
			}
		}

		return CURSOR_STACK.shift();
	}

	const stackLockState = (_value = !ansi.cursor.lock) => {
		if(_value)
		{
			if(ansi.cursor.lock)
			{
				return false;
			}

			return CURSOR_STACK_LOCK = true;
		}
		else if(ansi.cursor.lock)
		{
			return !(CURSOR_STACK_LOCK = false);
		}

		return false;
	};

	const goToPosition = (_y, _x, _stream = 0) => {
		_y = ansi.y(_y, ansi.HEIGHT, true);
		_x = ansi.x(_x, ansi.WIDTH, true);
		
		const seq = [
			('[' + _y + ';' + _x + 'H'),
			('[' + _y + ';' + _x + 'f')
		];

		var result = '';

		for(const s of seq)
		{
			result += ansi(s, null, _stream, false);
		}

		return result;
	};

	const stackReadCallback = (_event, _method, _callback, _stream) => {
		const item = {
			emit: () => {
				if(item.callbacks.length === 0)
				{
					return item;
				}
				else
				{
					++item.count.emitted;
				}

				for(const cb of item.callbacks)
				{
					if(typeof cb[1] === 'number')
					{
						setTimeout(() => {
							cb[0](item);
						}, cb[1]);
					}
					else if(DEFAULT_CURSOR_STACK_CALLBACK_WITH_TIMEOUT)
					{
						setTimeout(() => {
							cb[0](item);
						}, 0);
					}
					else
					{
						cb[0](item);
					}
				}

				return item;
			},
			callbacks: [],
			callback: (_on_load, _timeout) => {
				if(! (Number.isInt(_timeout) && _timeout >= 0))
				{
					_timeout = null;
				}

				if(typeof _on_load === 'function')
				{
					item.callbacks.push([ _on_load, _timeout ]);
				}

				return item;
			},
			clear: () => {
				++item.count.cleared;
				item.callbacks.length = 0;
				return item;
			},
			load: (_add_y = 0, _add_x = 0, _callback = null, _stream = item.stream, _throw = DEFAULT_THROW) => {
				if(! Number.isInt(_add_y))
				{
					_add_y = 0;
				}

				if(! Number.isInt(_add_x))
				{
					_add_x = 0;
				}

				//
				goToPosition(item.y + _add_y, item.x + _add_x, _stream);

				//
				++item.count.loaded;

				//
				if(typeof _callback === 'function')
				{
					_callback(item);
				}

				//
				return item.emit();
			},
			remove: () => {
				if(item.index > -1)
				{
					CURSOR_STACK.splice(item.index, 1);
					item.index = -1;
					++item.count.removed;
				}

				return item;
			},
			insert: (_index = item.index) => {
				if(_index > -1)
				{
					CURSOR_STACK.splice(_index, 0, _item);
					item.index = _index;
					++item.count.inserted;
				}

				return item;
			},
			push: () => {
				if((item.index = pushStackItem(item, true)) > -1)
				{
					++item.count.pushed;
				}

				return item;
			},
			unshift: () => {
				if((item.index = unshiftStackItem(item, true)) > -1)
				{
					++item.count.unshifted;
				}

				return item;
			},
			x: _event.x,
			y: _event.y,
			w: _event.w,
			h: _event.h,
			position: { x: _event.x, y: _event.y },
			size: { width: _event.w, height: _event.h },
			date: new Date(),
			method: _method, stream: _stream,
			unlock: stackLockState(false), stack: CURSOR_STACK,
			count: { loaded: 0, removed: 0, inserted: 0, pushed: 0, unshifted: 0, cleared: 0, emitted: 0 }
		};

		Object.defineProperty(item, 'lock', { get: function() { return ansi.cursor.lock } });
		Object.defineProperty(item, 'real', { get: function() { return { width: ansi.WIDTH, height: ansi.HEIGHT }; } });
		Object.defineProperty(item, 'rest', { get: function() { return ansi.cursor.stack; } });
		Object.defineProperty(item, 'limit', { get: function() { return ansi.cursor.limit; } });

		var result;

		switch(_method)
		{
			case 'push':
				item.index = pushStackItem(item);
				++item.count.pushed;
				break;
			case 'unshift':
				item.index = unshiftStackItem(item);
				++item.count.unshifted;
				break;
			default:
				item.index = -1;
				break;
		}

		if(item.index === -1)
		{
			item.success = false;
			item.error = true;
		}
		else
		{
			item.success = true;
			item.error = false;
		}

		if(_callback)
		{
			_callback(item);
		}

		return item;
	};

	const requestCursorPosition = (_method, _callback, _stream = 0) => {
		if(typeof _callback !== 'function')
		{
			_callback = null;
		}

		if(! stackLockState(true))
		{
			return null;
		}

		return ansi.cursor.read((_e) => {
			stackReadCallback(_e, _method, _callback, _stream);
		}, _stream);
	};

	ansi.cursor.peek = ansi.peek = function()
	{
		if(CURSOR_STACK.length === 0)
		{
			return null;
		}

		return CURSOR_STACK.peek();
	}

	ansi.cursor.push = ansi.push = function(_callback, _stream = 0)
	{
		return requestCursorPosition('push', _callback, _stream);
	}

	ansi.cursor.pop = ansi.pop = function()
	{
		return popStackItem();
	}

	ansi.cursor.shift = ansi.shift = function()
	{
		return shiftStackItem();
	}

	ansi.cursor.unshift = ansi.unshift = function(_callback, _stream = 0)
	{
		return requestCursorPosition('unshift', _callback, _stream);
	}

	ansi.cursor.clear = function(_length = 0)
	{
		if(ansi.cursor.lock)
		{
			return null;
		}
		else if(ansi.cursor.stack === 0)
		{
			return [];
		}
		else if(! Number.isInt(_length))
		{
			_length = 0;
		}

		return CURSOR_STACK.applyLength(_length);
	}

	//
	const parseCursorPositionReport = (_seq) => {
		const split = _seq.split(ESC);

		for(var i = 0; i < split.length; i++)
		{
			if(split[i].length === 0)
			{
				split.splice(i--, 1);
			}
			else if(split[i][0] !== '[' || split[i][split[i].length - 1] !== 'R')
			{
				split.splice(i--, 1);
			}
			else
			{
				split[i] = split[i].removeFirst().removeLast().split(';');

				if(split[i].length !== 2)
				{
					split.splice(i--, 1);
				}
				else for(var j = 0; j < split[i].length; j++)
				{
					if((split[i][j] = parseInt(split[i][j])).isNaN)
					{
						split.splice(i--, 1);
					}
				}
			}
		}

		for(var i = 0; i < split.length; i++)
		{
			for(var j = i + 1; j < split.length; j++)
			{
				if(split[i][0] === split[j][0] && split[i][1] === split[j][1])
				{
					split.splice(j--, 1);
				}
			}
		}

		return split;
	}

	ansi.cursor.read = ansi.read = function(_callback, _stream = 0, _read_stream)
	{
		if(typeof _callback !== 'function')
		{
			return x('Invalid _callback (not a Function)');
		}
		else if(Object.className(_read_stream) !== 'ReadStream')
		{
			_read_stream = process.stdio[0];
		}

		_stream = ansi.findStream(_stream, true);

		const ondata = (_chunk) => {
			if((_chunk = dataToString(_chunk)).charCodeAt(0) !== 27)
			{
				return null;
			}
			else
			{
				_read_stream.off('data', ondata);
				//"FIXME"??
				//_read_stream.end();
				_read_stream.setRawMode(false);
				_read_stream.unref();
			}

			var res = parseCursorPositionReport(_chunk.substr(1));

			var result = [];

			for(var i = 0; i < res.length; i++)
			{
				result[i] = { y: res[i][0], x: res[i][1] };
			}

			var x, y;
			const w = ansi.WIDTH;
			const h = ansi.HEIGHT;

			if(result.length === 0)
			{
				return null;
				//_callback.call(null, ansi.y, ansi.x);
			}
			else if(result.length === 1)
			{
				result = result[0];
				//res = res[0];
				x = result.x;
				y = result.y;
			}
			else
			{
				x = new Array(result.length);
				y = new Array(result.length);

				for(var i = 0; i < result.length; ++i)
				{
					x[i] = result[i].x;
					y[i] = result[i].y;
				}
			}

			//
			_callback({ position: result, size: ansi.SIZE, y, x, h, w });
		};

		_read_stream.on('data', ondata);
		_read_stream.setRawMode(true);

		_stream.write(ESC + '[6n' + NUL);
		_stream.write('');

		return (ESC + '[6n' + NUL);
	}

	ansi.cursor.column = ansi.column = function(_x, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		if(Number.isInt(_x) || String.isString(_x))
		{
			_x = ansi.x(_x, ansi.WIDTH, _throw);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting an %)', null, '_x', 'Integer');
		}
		else
		{
			return null;
		}

		return CALLBACK(_callback, ansi('[' + _x + 'G', null, _stream, false), _stream, ... arguments);
	}

	ansi.cursor.row = ansi.row = function(_y, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		return ansi.cursor.y(_y, _callback, _stream, _throw);
	}

	ansi.cursor.up = ansi.up = function(_count = 1, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		var result;

		if(_count === 0)
		{
			result = '';
		}
		else if(_count < 0)
		{
			return ansi.cursor.down(-_count, _callback, _stream, _throw);
		}
		else if(_count > 0)
		{
			result = ansi('[' + _count + 'A', null, _stream, false);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting an %)', null, '_count', 'Integer');
		}
		else
		{
			return null;
		}

		return CALLBACK(_callback, result, _stream, ... arguments);
	}

	ansi.cursor.down = ansi.down = function(_count = 1, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		var result;

		if(_count === 0)
		{
			result = '';
		}
		else if(_count < 0)
		{
			return ansi.cursor.up(-_count, _callback, _stream, _throw);
		}
		else if(_count > 0)
		{
			result = ansi('[' + _count + 'B', null, _stream, false);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting an %)', null, '_count', 'Integer');
		}
		else
		{
			return null;
		}

		return CALLBACK(_callback, result, _stream, ... arguments);
	}

	ansi.cursor.right = ansi.right = function(_count = 1, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		var result;

		if(_count === 0)
		{
			result = '';
		}
		else if(_count < 0)
		{
			return ansi.cursor.left(-_count, _callback, _stream, _throw);
		}
		else if(_count > 0)
		{
			result = ansi('[' + _count + 'C', null, _stream, false);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting an %)', null, '_count', 'Integer');
		}
		else
		{
			return null;
		}

		return CALLBACK(_callback, result, _stream, ... arguments)
	}

	ansi.cursor.left = ansi.left = function(_count = 1, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		var result;

		if(_count === 0)
		{
			result = '';
		}
		else if(_count < 0)
		{
			return ansi.cursor.right(-_count, _callback, _stream, _throw);
		}
		else if(_count > 0)
		{
			result = ansi('[' + _count + 'D', null, _stream, false);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting an %)', null, '_count', 'Integer');
		}
		else
		{
			return null;
		}

		return CALLBACK(_callback, result, _stream, ... arguments);
	}

	//same as 'ansi.cursor.down', but w/ setting the column to 1.
	ansi.cursor.next = ansi.next = function(_count = 1, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		var result;

		if(_count === 0)
		{
			result = '';
		}
		else if(_count < 0)
		{
			return ansi.cursor.prev(-_count, _callback, _stream, _throw);
		}
		else if(_count > 0)
		{
			result = ansi('[' + _count + 'E', null, _stream, false);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting an %)', null, '_count', 'Integer');
		}
		else
		{
			return null;
		}

		return CALLBACK(_callback, result, _stream, ... arguments);
	}

	//same as 'ansi.cursor.up', but w/ setting the column to 1.
	ansi.cursor.prev = ansi.prev = function(_count = 1, _callback, _stream = 0, _throw = DEFAULT_THROW)
	{
		var result;

		if(_count === 0)
		{
			result = '';
		}
		else if(_count < 0)
		{
			return ansi.cursor.next(-_count, _callback, _stream, _throw);
		}
		else if(_count > 0)
		{
			result = ansi('[' + _count + 'F', null, _stream, false);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting an %)', null, '_count', 'Integer');
		}
		else
		{
			return null;
		}

		return CALLBACK(_callback, result, _stream, ... arguments);
	}

	//
	ansi.high = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_HIGH, null, _string, _stream, _end, _inject);
	}

	ansi.high.fg = ansi.high;

	ansi.high.bg = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_HIGH_C, COLOR_HIGH, _string, _stream, _end, _inject);
	}

	//
	ansi.stream = {};

	ansi.stream.log = ansi.log = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_LOG, false, _string, _stream, _end, _inject);
	}

	ansi.stream.log.fg = ansi.stream.log;

	ansi.stream.log.bg = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_LOG_C, COLOR_LOG, _string, _stream, _end, _inject);
	}

	ansi.stream.info = ansi.info = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_INFO, false, _string, _stream, _end, _inject);
	}

	ansi.stream.info.fg = ansi.stream.info;

	ansi.stream.info.bg = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_INFO_C, COLOR_INFO, _string, _stream, _end, _inject);
	}

	ansi.stream.warn = ansi.warn = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_WARN, false, _string, _stream, _end, _inject);
	}

	ansi.stream.warn.fg = ansi.stream.warn;

	ansi.stream.warn.bg = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_WARN_C, COLOR_WARN, _string, _stream, _end, _inject);
	}

	ansi.stream.error = ansi.error = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_ERROR, false, _string, _stream, _end, _inject);
	}

	ansi.stream.error.fg = ansi.stream.error;

	ansi.stream.error.bg = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_ERROR_C, COLOR_ERROR, _string, _stream, _end, _inject);
	}

	ansi.stream.debug = ansi.debug = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_DEBUG, false, _string, _stream, _end, _inject);
	}

	ansi.stream.debug.fg = ansi.stream.debug;

	ansi.stream.debug.bg = function(_string, _stream = null, _end = true, _inject = INJECT)
	{
		return ansi.color(COLOR_DEBUG_C, COLOR_DEBUG, _string, _stream, _end, _inject);
	}

	//
	function colorization(_type, _data, _force = false, _background = false, _2nd_color = false)
	{
		switch(_type.toLowerCase())
		{
			case 'colorize':
			case 'rainbow':
				break;
			default:
				return x('Invalid colorization type [ "colorize", "rainbow" ]');
		}

		//
		var grays;

		if(_type === 'colorize')
		{
			if(Array.isArray(CZ_G))
			{
				grays = CZ_G.clone();
			}
			else
			{
				grays = [ 255, 128 ];
			}
		}
		else
		{
			grays = null;
		}

		const func = function(_string = '')
		{
			return func[_type]();
		}

		const type = (_background === false ? 'fg' : 'bg');

		func.rainbow = function()
		{
			var result;

			if(_background)
			{
				result = ansi.color24(_2nd_color, true);
			}
			else
			{
				result = ansi.color24(true, _2nd_color);
			}

			return result;
		}

		func.colorize = function()
		{
			var result;
			const gray = Math.random.int(grays[0], grays[1], false);

			if(_background)
			{
				result = ansi.color24(_2nd_color, [ gray, gray, gray ]);
			}
			else
			{
				result = ansi.color24([ gray, gray, gray ], _2nd_color);
			}

			return result;
		}

		//
		if((_data = filterInput(_data)) === null)
		{
			return null;
		}

		if(_force)
		{
			for(var i = 0; i < _data.length; i++)
			{
				if(ansi.is.color[_background ? 'bg' : 'fg'](_data[i]))
				{
					_data.splice(i--, 1);
				}
			}

			if(_data.length === 0)
			{
				return _data;
			}
		}

		//
		var open = false;
		const result = [];

		for(var i = 0; i < _data.length; i++)
		{
			if(_data[i] === ansi.none)
			{
				result.push(_data[i]);
				open = false;
			}
			else if(_background && ansi.is.color.bg(_data[i]))
			{
				result.push(_data[i]);
				open = true;
			}
			else if(! _background && ansi.is.color.fg(_data[i]))
			{
				result.push(_data[i]);
				open = true;
			}
			else if(ansi.isSequence(_data[i]))
			{
				result.push(_data[i]);
			}
			else
			{
				if(open)
				{
					result.push(_data[i]);
				}
				else
				{
					for(var j = 0; j < _data[i].length; j++)
					{
						result.push(func());
						result.push(_data[i][j]);
					}

					result.push(ansi.none);
				}
			}
		}

		//
		if(result[result.length - 1] !== ansi.none)
		{
			result.push(ansi.none);
		}

		//
		return result.join('');//+ ansi.none!?????
	}

	ansi.colorize = function(_data, _force = false, _2nd_color = false)
	{
		return colorization('colorize', _data, _force, false, _2nd_color);
	}

	ansi.colorize.fg = ansi.colorize;

	ansi.colorize.bg = function(_data, _force = false, _2nd_color = false)
	{
		return colorization('colorize', _data, _force, true, _2nd_color);
	}

	ansi.rainbow = function(_data, _force = false, _2nd_color = false)
	{
		return colorization('rainbow', _data, _force, false, _2nd_color);
	}

	ansi.rainbow.fg = ansi.rainbow;

	ansi.rainbow.bg = function(_data, _force = false, _2nd_color = false)
	{
		return colorization('rainbow', _data, _force, true, _2nd_color);
	}

	//
	ansi.getRandomColor4 = function(_crypto = CRYPTO)
	{
		var result = ansi.colors[ansi.colors.getRandomIndex(_crypto)];

		if(Math.random.bool(_crypto))
		{
			result = 'bright' + result.capitalize(null);
		}

		return result;
	}

	ansi.getRandomColor8 = function(_max = 255, _min = 0, _crypto = CRYPTO)
	{
		var max, min;

		if(Array.isArray(_max) && _max.length === 2)
		{
			max = (typeof _max[0] === 'number' ? (_max[0].int % 256) : 255);
			min = (typeof _max[1] === 'number' ? (_max[1].int % 256) : 0);
		}
		else
		{
			if(typeof _max === 'number')
			{
				max = (_max.int % 256);
			}
			else
			{
				max = 255;
			}

			if(typeof _min === 'number')
			{
				min = (_min.int % 256);
			}
			else
			{
				min = 0;
			}
		}

		return Math.random.byte(_max, _min, _crypto);
	}

	ansi.getRandomColor24 = function(_color, _crypto = CRYPTO)
	{
		return color.random.hex(_color);
	}

	ansi.getRandomColor = function(_random, _crypto = CRYPTO)
	{
		if(typeof _random !== 'string' && !Array.isArray(_random) && _random !== true)
		{
			return x('Invalid _random color string');
		}

		if(Array.isArray(_random))
		{
			_random = ansi.getRandomColor24(_random, _crypto);
		}
		else
		{
			if(typeof _random === 'string')
			{
				if(_random.length === 0)
				{
					_random = 'random24';
				}
				else if(_random === 'random')
				{
					_random = 'random24';
				}
			}
			else if(_random === true)
			{
				_random = 'random24';
			}

			if(_random.endsWith('24'))
			{
				return ansi.getRandomColor24(null, _crypto);
			}
			else if(_random.endsWith('8'))
			{
				return ansi.getRandomColor8(255, 0, _crypto);
			}
			else if(_random.endsWith('4'))
			{
				return ansi.getRandomColor4(_crypto);
			}
		}

		return _random;
	}

	function checkColor4(_color)
	{
		//
		const bright = ((_color = _color.toLowerCase()).startsWith('bright') > 0);
		var name;

		if(bright)
		{
			name = _color.removeFirst(6);
		}
		else
		{
			name = _color;
		}

		//
		var result;

		if(ansi.colors.indexOf(name) === -1)
		{
			result = false;
		}
		else if(bright)
		{
			result = 'bright' + name.capitalize(null);
		}
		else
		{
			result = name;
		}

		//
		return result;
	}

	function prepareColors(_fg, _bg)
	{
		_fg = ansi.prepareColor(_fg);
		_bg = ansi.prepareColor(_bg);

		return [ _fg, _bg ];
	}

	ansi.prepareColor = function(_color)
	{
		if(Array.isArray(_color))
		{
			_color = color.hex(_color);
		}
		else if(typeof _color === 'string' || typeof _color === 'boolean')
		{
			if(typeof _color === 'string' && (_color.length === 0 || _color === 'random'))
			{
				_color = 'random24';
			}
			else if(_color === true)
			{
				_color = 'random24';
			}
			else if(_color === false)
			{
				return false;
			}

			if((_color = _color.toLowerCase()).startsWith('random'))
			{
				if(_color.endsWith('24'))
				{
					_color = ansi.getRandomColor24();
				}
				else if(_color.endsWith('8'))
				{
					_color = ansi.getRandomColor8();
				}
				else if(_color.endsWith('4'))
				{
					_color = ansi.getRandomColor4();
				}
				else
				{
					_color = false;
				}
			}
			else if(_color.isInt())
			{
				_color = (parseInt(_color) % 256);
			}
			else
			{
				switch(_color.toLowerCase())
				{
					case 'high':
						_color = COLOR_HIGH;
						break;
					case 'log':
						_color = COLOR_LOG;
						break;
					case 'info':
						_color = COLOR_INFO;
						break;
					case 'warn':
						_color = COLOR_WARN;
						break;
					case 'error':
						_color = COLOR_ERROR;
						break;
					case 'debug':
						_color = COLOR_DEBUG;
						break;
					default:
						const c4 = checkColor4(_color);

						if(c4)
						{
							_color = c4;
						}
						else
						{
							_color = color.hex(_color);
						}

						break;
				}
			}
		}
		else if(typeof _color === 'number')
		{
			_color = (_color.int % 256);
		}
		else
		{
			_color = false;
		}

		return _color;
	}

	//
	ansi.getColorArray = function(... _args)
	{
		if(_args.length === 0)
		{
			return false;
		}
		else if(_args.length === 1)
		{
			if(_args[0] === true)
			{
				return ansi.getRandomColor24();
			}
			else if(typeof _args[0] === 'number')
			{
				if(_args[0] <= 0)
				{
					_args[0] = 0;
				}
				else if(_args[0] > 255)
				{
					_args[0] = 255;
				}

				return _args[0];
			}
			else if(typeof _args[0] === 'string' && _args[0].length > 0)
			{
				const withBright = (_args[0].startsWith('bright'));

				if(withBright)
				{
					_args[0] = _args[0].removeFirst(6).toLowerCase();
				}

				if(_args[0] in ansi.color4)
				{
					var result;

					if(withBright)
					{
						result = 'bright' + _args[0].capitalize(null);
					}
					else
					{
						result = _args[0];
					}

					return result;
				}
				else switch(_args[0].toLowerCase())
				{
					case 'random':
					case 'random24':
						return ansi.getRandomColor24();
					case 'random8':
						return ansi.getRandomColor8();
					case 'random4':
						return ansi.getRandomColor4();
				}

				return color.bytes(_args[0]);
			}
			else
			{
				return color.bytes(_args[0]);
			}
		}

		//
		return color.bytes(... _args);
	}

	//
	ansi.DEFAULT_REDUCE = () => {
		return ((typeof REDUCE === 'string' && REDUCE.length > 0 && (REDUCE.toLowerCase() in ansi.reduce)) || REDUCE === true);
	};

	ansi.reduce = function(_value, _target_bits = 8, _source_bits = 24)
	{
return _value;
		//
		var value = ansi.getColorArray(_value);

		if(Array.isArray(value))
		{
		}
		else if(typeof value === 'number')
		{
		}
		else if(typeof _value === 'string')
		{
		}
		else
		{
			return x('Unexpected');
		}

		//


		//
		return ansi.reduce[REDUCE.toLowerCase()](_value, 2 ** _target_bits, 2 ** _source_bits);
	}

	ansi.reduce.math = function(_value, _target, _source)
	{
		return ((_value / _source) * _target);
	}

	ansi.reduce.modulo = function(_value, _target)
	{
		return (_value % _target);
	}

//TODO/!??!?
//	ansi.reduce.

	//
	ansi.force = function(_fg, _bg, _string, _stream = null, _end = true, _reduce = ansi.DEFAULT_REDUCE())
	{
		return ansi.color(_fg, _bg, ansi.remove.color(_string), _stream, _end, null, _reduce);
	}

	ansi.force.fg = function(_color, _string, _stream = null, _end = true, _reduce = ansi.DEFAULT_REDUCE())
	{
		return ansi.force(_color, false, _string, _stream, _end, _reduce);
	}

	ansi.force.bg = function(_color, _string, _stream = null, _end = true, _reduce = ansi.DEFAULT_REDUCE())
	{
		return ansi.force(false, _color, _string, _stream, _end, _reduce);
	}

	ansi.forceColor = ansi.force;

	//
	ansi.color = function(_fg, _bg, _string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		//
		if(typeof _string !== 'string')
		{
			_end = false;
			_string = '';
		}

		//
		if(_reduce && console.depth < 24)
		{
			return ansi.color8(ansi.reduce(_fg, 8, 24), ansi.reduce(_bg, 8, 24), _string, _stream, _end, _inject, _reduce);
		}
		else
		{
			[ _fg, _bg ] = prepareColors(_fg, _bg);
		}

		//
		var result = _string;

		if(typeof _fg === 'number')
		{
			result = ansi.color8.fg(_fg, result, null, false, _inject, _reduce);
		}
		else if(typeof _fg === 'string')
		{
			if(_fg[0] === '#')
			{
				result = ansi.color24.fg(_fg, result, null, false, _inject, _reduce);
			}
			else
			{
				result = ansi.color4.fg(_fg, result, null, false, _inject, _reduce);
			}
		}

		if(typeof _bg === 'number')
		{
			result = ansi.color8.bg(_bg, result, null, false, _inject, _reduce);
		}
		else if(typeof _bg === 'string')
		{
			if(_bg[0] === '#')
			{
				result = ansi.color24.bg(_bg, result, null, false, _inject, _reduce);
			}
			else
			{
				result = ansi.color4.bg(_bg, result, null, false, _inject, _reduce);
			}
		}

		//
		if(result.length > 0 && result[0] === ansi.ESC)
		{
			if(_end === true)
			{
				_end = ansi.seq('[0m');
			}

			if(typeof _end === 'string')
			{
				result += _end;
			}

			if((_stream = ansi.findStream(_stream, false)) !== null)
			{
				_stream.write(result);
			}
		}

		return result;
	}

	ansi.color24 = ansi.color;

	ansi.color24.fg = function(_color, _string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		//
		if(typeof _string !== 'string')
		{
			_string = '';
			_end = false;
		}

		//
		if(! ansi.isColor(_color))
		{
			_color = false;
		}
		else if(ansi.isRandomColor(_color))
		{
			_color = ansi.getRandomColor(_color);
		}
		else
		{
			_color = ansi.prepareColor(_color);
		}

		//
		if(_reduce && console.depth < 24)
		{
			return ansi.color8.fg(ansi.reduce(_color, 8, 24), _string, _stream, _end, _inject, _reduce);
		}
		else switch(ansi.typeOfColor(_color))
		{
			case 4: return ansi.color4.fg(_color, _string, _stream, _end, _inject, _reduce); break;
			case 8: return ansi.color8.fg(_color, _string, _stream, _end, _inject, _reduce); break;
		}

		//
		if(_color === false || ((_color = ansi.getColorArray(_color)) === null))
		{
			if(typeof _string !== 'string')
			{
				_string = '';
			}

			return _string + (_end ? ansi('[0m') : '');
		}

		const seq = `[38;2;${_color[0].toString().padStart(3, '0')};`
			+ `${_color[1].toString().padStart(3, '0')};`
			+ `${_color[2].toString().padStart(3, '0')}m`;

		return ansi(seq, _string, _stream, _end, _inject);
	}

	ansi.color24.bg = function(_color, _string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		//
		if(typeof _string !== 'string')
		{
			_string = '';
			_end = false;
		}

		//
		if(! ansi.isColor(_color))
		{
			_color = false;
		}
		else if(ansi.isRandomColor(_color))
		{
			_color = ansi.getRandomColor(_color);
		}
		else
		{
			_color = ansi.prepareColor(_color);
		}

		//
		if(_reduce && console.depth < 24)
		{
			return ansi.color8.bg(ansi.reduce(_color, 8, 24), _string, _stream, _end, _inject, _reduce);
		}
		else switch(ansi.typeOfColor(_color))
		{
			case 4: return ansi.color4.bg(_color, _string, _stream, _end, _inject, _reduce); break;
			case 8: return ansi.color8.bg(_color, _string, _stream, _end, _inject, _reduce); break;
		}

		//
		if(_color === false || ((_color = ansi.getColorArray(_color)) === null))
		{
			if(typeof _string !== 'string')
			{
				_string = '';
			}

			return _string + (_end ? ansi('[0m') : '');
		}

		const seq = `[48;2;${_color[0].toString().padStart(3, '0')};`
			+ `${_color[1].toString().padStart(3, '0')};`
			+ `${_color[2].toString().padStart(3, '0')}m`;

		return ansi(seq, _string, _stream, _end, _inject);
	}

	ansi.color.fg = ansi.color24.fg;
	ansi.color.bg = ansi.color24.bg;

	//
	ansi.typeOfColor = function(_color)
	{
		if(typeof _color === 'string')
		{
			_color = _color.toLowerCase();

			if(_color === 'random')
			{
				return 24;
			}
			else if(_color.startsWith('random'))
			{
				if(_color.endsWith('24'))
				{
					return 24;
				}
				else if(_color.last() === '8')
				{
					return 8;
				}
				else if(_color.last() === '4')
				{
					return 4;
				}

				return x('Invalid random color string (no matching bit depth)');
			}

			const bright = (_color.startsWith('bright'));

			if(bright)
			{
				_color = _color.substr(6);
			}

			const idx = ansi.colors.indexOf(_color);

			if(idx > -1)
			{
				return 4;
			}

			_color = color.bytes(ansi.prepareColor(_color));

			if(Array.isArray(_color))
			{
				return (_color.length * 8);
			}
		}
		else if(typeof _color === 'number')
		{
			if(_color < 0)
			{
				const num = Math.abs(_color.int) + 1;

				if(num < 256)
				{
					return 8;
				}
				else if(num < (256**2))
				{
					return 16;
				}
				else if(num < (256**3))
				{
					return 24;
				}
				else if(num < (256**4))
				{
					return 32;
				}

				return -1;
			}

			if(_color < 0 || _color > 255)
			{
				return -1;
			}

			return 8;
		}
		else if(Array.isArray(_color))
		{
			switch(_color.length)
			{
				case 3:
					return 24;
				case 4:
					return 32;
				default:
					return -1;
			}
		}
		else if(_color === true)
		{
			return 24;
		}

		return -1;
	}

	ansi.color.complement = function(_color)
	{
		const type = ansi.typeOfColor(_color);

		switch(type)
		{
			case 0:
			case 16:
			case 24:
			case 32:
				return color.complement(_color);
			case 4:
				return ansi.color4.complement(_color);
			case 8:
				return ansi.color8.complement(_color);
		}

		return x('Invalid % (%.% = %)', null, '_color', 'ansi', 'typeOfColor()', type);
	}

	ansi.color.table = function(_goofy = false, _move, _width = ansi.WIDTH)
	{
throw new Error('TODO');
	}

	//
	ansi.color.rainbow = ansi.color24.rainbow = ansi.rainbow;
	ansi.color.colorize = ansi.color24.colorize = ansi.colorize;

	ansi.color8 = function(_fg, _bg, _string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		//
		if(typeof _string !== 'string')
		{
			_end = true;
			_string = '';
		}

		//
		if(_reduce && console.depth < 8)
		{
			return ansi.color4(ansi.reduce(_fg, 4, 8), ansi.reduce(_bg, 4, 8), _string, _stream, _end, _inject, _reduce);
		}
		else
		{
			_fg = prepareColor8(_fg);
			_bg = prepareColor8(_bg);
		}

		//
		var result = _string;

		if(typeof _fg === 'number')
		{
			result = ansi.color8.fg(_fg, result, null, false, _inject, _reduce);
		}

		if(typeof _bg === 'number')
		{
			result = ansi.color8.bg(_bg, result, null, false, _inject, _reduce);
		}

		if(result.length > 0 && result[0] === ansi.ESC)
		{
			if(_end === true)
			{
				_end = ansi.seq('[0m');
			}

			if(typeof _end === 'string')
			{
				result += _end;
			}

			if((_stream = ansi.findStream(_stream, false)) !== null)
			{
				_stream.write(result);
			}
		}

		return result;
	}

	function prepareColor8(_color)
	{
		if(! ansi.isColor(_color))
		{
			return false;
		}
		else if(ansi.isRandomColor(_color))
		{
			return ansi.getRandomColor8(_color);
		}
		else if(typeof _color === 'number')
		{
			return (Math.abs(_color.int) % 256);
		}
		else if(typeof _color === 'string' && _color.isInt())
		{
			return (Math.abs(parseInt(_color).int) % 256);
		}

		return false;
	}

	ansi.color8.fg = function(_color, _string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 8)
		{
			return ansi.color4.fg(ansi.reduce(_color, 4, 8), _string, _stream, _end, _inject, _reduce);
		}
		//TODO/WILL ICH DAS ECHT HIER?? DANN BITTE AUCH UERBALL SONST @ 4/8/24.BG/FG!!!
		else switch(ansi.typeOfColor(_color))
		{
			case 0:
			case 24:
				if(!_reduce || console.depth >= 24)
				{
					return ansi.color24.fg(_color, _string, _stream, _end, _inject, _reduce); break;
				}
				break;
			case 4: return ansi.color4.fg(_color, _string, _stream, _end, _inject, _reduce); break;
		}

		//
		if(_reduce && console.depth < 8)
		{
			return ansi.color4.fg(ansi.reduce(_color, 4, 8), _string, _stream, _end, _inject, _reduce);
		}

		//
		_color = prepareColor8(_color);

		if(typeof _string !== 'string')
		{
			_string = '';
			_end = false;
		}

		return ansi(`[38;5;${_color.toString().padStart(3, '0')}m`, _string, _stream, _end, _inject);
	}

	ansi.color8.bg = function(_color, _string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		//
		if(_reduce && console.depth < 8)
		{
			return ansi.color4.bg(ansi.reduce(_color, 4, 8), _string, _stream, _end, _inject, _reduce);
		}
		else switch(ansi.typeOfColor(_color))
		{
			case 0:
			case 24:
				if(!_reduce || console.depth >= 24)
				{
					return ansi.color24.bg(_color, _string, _stream, _end, _inject, _reduce); break;
				}
				break;
			case 4: return ansi.color4.bg(_color, _string, _stream, _end, _inject, _reduce); break;
		}

		//
		_color = prepareColor8(_color);

		if(typeof _string !== 'string')
		{
			_string = '';
			_end = false;
		}

		return ansi(`[48;5;${_color.toString().padStart(3, '0')}m`, _string, _stream, _end, _inject);
	}

	ansi.color8.table = function(_goofy = false, _division = 16, _radix = 16, _padding = 0, _margin = 0)
	{
		if(typeof _goofy !== 'boolean')
		{
			_goofy = false;
		}

		if(typeof _margin === 'number')
		{
			_margin = space(Math.abs(_margin.int));
		}
		else
		{
			_margin = space(1);
		}

		if(typeof _padding !== 'number')
		{
			_padding = 0;
		}

		var alpha;
		var maxLength;

		if(typeof _radix !== 'number')
		{
			_radix = 10;
		}

		alpha = alphabet(_radix);

		if(alpha === null)
		{
			return x('Invalid _radix');
		}
		else
		{
			maxLength = Math.ceil(Math.logBase(alpha.length, 256));
		}

		maxLength += _padding;

		if(typeof _division !== 'number')
		{
			_division = 16;
		}
		else
		{
			_division = Math.abs(_division.int);
		}

		//
		const bytes = new Array(256);

		for(var i = 0; i < 256; i++)
		{
			bytes[i] = i.toString(alpha).pad(maxLength, '0').color(255 - i, i);
		}

		//
		const field = (_goofy ? bytes.modulo(_division) : bytes.divide(_division));

		for(var i = 0; i < field.length; i++)
		{
			field[i] = field[i].join(_margin);
		}

		return field.join(EOL);
	}

	ansi.color8.complement = function(_color)
	{
		if(typeof _color !== 'number' || (_color = _color.int) < 0 || _color > 255)
		{
			return x('Invalid 8-bit color [ 0 .. 255 ]');
		}

		return (255 - _color);
	}

	//
	ansi.colors = [ 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white' ];

	ansi.color4 = function(_fg, _bg, _string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		//
		if(typeof _string !== 'string')
		{
			_end = false;
			_string = '';
		}

		//
		_fg = prepareColor4(_fg);
		_bg = prepareColor4(_bg);

		//
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		//
		var result = _string;

		if(_fg)
		{
			result = ansi.color4.fg(_fg, result, null, false, _inject);
		}

		if(_bg)
		{
			result = ansi.color4.bg(_bg, result, null, false, _inject);
		}

		if(result.length > 0 && result[0] === ansi.ESC)
		{
			if(_end === true)
			{
				_end = ansi.seq('[0m');
			}

			if(typeof _end === 'string')
			{
				result += _end;
			}

			if((_stream = ansi.findStream(_stream, false)) !== null)
			{
				_stream.write(result);
			}
		}

		return result;
	}

	//
	ansi.color4.table = function(_goofy = false, _pad, _space = 1)
	{
		var result = [];
		var str;
		var fg, bg;

		if(typeof _pad !== 'number')
		{
			_pad = 0;

			for(var i = 0; i < ansi.colors.length; i++)
			{
				_pad = Math._max(_pad, ('bright' + ansi.colors[i][0].toUpperCase() + ansi.colors[i].substr(1)).length);
			}
		}

		if(typeof _space === 'number')
		{
			_space = space(Math.abs(_space.int));
		}
		else if(typeof _space !== 'string')
		{
			_space = SPACE;
			//return x('Invalid _space (neither String nor Number)');
		}

		for(var i = 0, j = 0; i < ansi.colors.length; i++)
		{
			if(! _goofy)
			{
				fg = str = ansi.colors[i];
				bg = ansi.color4.complement(ansi.colors[i]);
			}
			else
			{
				fg = ansi.color4.complement(ansi.colors[i]);
				bg = str = ansi.colors[i];
			}

			result[j++] = (ansi.color4(fg, bg, str.pad(_pad)) + ' ' + ansi.color4(bg, fg, str.pad(-_pad)));
		}

		for(var i = 0, j = result.length; i < ansi.colors.length; i++)
		{
			if(! _goofy)
			{
				fg = str = 'bright' + ansi.colors[i][0].toUpperCase() + ansi.colors[i].substr(1);
				bg = 'bright' + ansi.color4.complement(fg);
			}
			else
			{
				bg = str = 'bright' + ansi.colors[i][0].toUpperCase() + ansi.colors[i].substr(1);
				fg = 'bright' + ansi.color4.complement(bg);
			}

			result[j++] = (ansi.color4(fg, bg, str.pad(_pad)) + ' ' + ansi.color4(bg, fg, str.pad(-_pad)));
		}

		//
		return result.join(EOL);
	}

	ansi.color4.complement = function(_color)
	{
		if(typeof _color === 'string')
		{
			const orig = _color;
			_color = _color.toLowerCase();
			const bright = (_color.startsWith('bright'));

			if(bright)
			{
				_color = ansi.colors.indexOf(_color.substr(6));
			}
			else
			{
				_color = ansi.colors.indexOf(_color);
			}

			if(_color === -1)
			{
				return x('Color ' + orig.quote() + ' not found');
			}
		}

		if(typeof _color === 'number')
		{
			_color = _color.int % ansi.colors.length;

			if(_color < 0)
			{
				_color = ansi.colors.length + _color;
			}

			_color = Math.abs(_color % ansi.colors.length);
		}
		else
		{
			return x('Invalid _color (needs String or Number)');
		}

		return ansi.colors[ansi.colors.length - 1 - _color];
	}

//todo/!!
	ansi.color4.map = {
		'black': '#000',
		'red': '#a00',
		'green': '#0a0',
		'yellow': '#a50',
		'blue': '#bfbfec',
		'magenta': '#a0a',
		'cyan': '#0aa',
		'white': '#aaa',

		'bright': {
			'black': '#555',
			'red': '#f55',
			'green': '#5f5',
			'yellow': '#ff5',
			'blue': '#55f',
			'magenta': '#f5f',
			'cyan': '#5ff',
			'white': '#fff'
		}
	};

	ansi.getColor4 = function(_color, _return_color_name = false, _throw = true)
	{
		if(! String.isString(_color))
		{
			return x('Expecting a (non-empty) % for % argument', null, 'String', '_color');
		}
		else
		{
			const tmp = ansi.hexColor4(_color, false);

			if(tmp !== null)
			{
				return tmp;
			}
		}

		const split = _color.split('.', 2, false);
		var color, bright;

		for(var i = 0; i < split.length; i++)
		{
			split[i] = split[i].toLowerCase();
		}

		if(ansi.colors.indexOf(split[0]) > -1)
		{
			color = split.shift();
		}
		else if(_throw)
		{
			return x('Invalid color \'%\' (see \'%.%\')', null, color, 'ansi', 'colors');
		}
		else
		{
			return null;
		}

		if(split.length > 0 && split[0] === 'bright')
		{
			bright = true;
		}
		else
		{
			bright = false;
		}

		//
		var result;

		if(bright)
		{
			result = 'bright' + color[0].toUpperCase() + color.substr(1);
		}
		else
		{
			result = color;
		}

		if(_return_color_name === true)
		{
			return result;
		}

		return ansi.hexColor4(result);
	}

	ansi.hexColor4 = function(_color, _throw = true)
	{
		if(! String.isString(_color))
		{
			if(_throw)
			{
				return x('Expecting a (non-empty) % for % argument', null, 'String', '_color');
			}

			return null;
		}

		_color = _color.toLowerCase();

		if(_color.length === 0 || _color === 'random' || _color === 'random4')
		{
			const name = ansi.colors.getRandom(1);

			if(Math.random.bool())
			{
				return ansi.color4.map['bright'][name];
			}

			return ansi.color4.map[name];
		}

		const bright = _color.startsWith('bright');

		if(bright)
		{
			if(((_color = _color.substr(6)) in ansi.color4.map) && _color !== 'bright')
			{
				return ansi.color4.map.bright[_color];
			}

			if(_throw)
			{
				return x('Unknown bright color');
			}

			return null;
		}

		if((_color in ansi.color4.map) && _color !== 'bright')
		{
			return ansi.color4.map[_color];
		}

		if(_throw)
		{
			return x('Unknown color');
		}

		return null;
	}

	for(var idx in ansi.color4.map)
	{
		if(idx === 'bright')
		{
			continue;
		}

		ansi.color4.map['bright' + idx[0].toUpperCase() + idx.substr(1)] = ansi.color4.map.bright[idx];
	}

	function prepareColor4(_color)
	{
		if(_color === true || _color === '' || _color === 'random' || _color === 'random4')
		{
			_color = ansi.getRandomColor4();
		}
		else if(typeof _color === 'string')
		{
			return _color;
		}

		return false;
	}

	ansi.color4.fg = function(_color, _string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(typeof _string !== 'string')
		{
			_end = false;
			_string = '';
		}

		//
		if(_reduce && console.depth < 4)
		{
			return _string;
		}
		else switch(ansi.typeOfColor(_color))
		{
			case 8: return ansi.color8.fg(_color, _string, _stream, _end, _inject); break;
			case 0:
			case 24:
				return ansi.color24.fg(_color, _string, _stream, _end, _inject); break;
		}

		//
		if(typeof _string !== 'string')
		{
			return '';
		}

		//
		_color = prepareColor4(_color);

		if(_end === true)
		{
			_end = ansi.seq('[0m');
		}
		else if(typeof _end !== 'string')
		{
			_end = '';
		}

		if(typeof _color === 'string' && _color.length > 0)
		{
			_color = _color.toLowerCase();

			const bright = (_color.startsWith('bright'));

			if(bright)
			{
				_color = _color.substr(6);
				_color = ansi.color4[_color].bright;
			}
			else
			{
				_color = ansi.color4[_color];
			}
		}
		else
		{
			return (_string + _end);
		}

		return _color.fg(_string, _stream, _end, _inject);
	}

	ansi.color4.bg = function(_color, _string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(typeof _string !== 'string')
		{
			_string = '';
			_end = false;
		}

		//
		if(_reduce && console.depth < 4)
		{
			return _string;
		}
		else switch(ansi.typeOfColor(_color))
		{
			case 8: return ansi.color8.bg(_color, _string, _stream, _end, _inject); break;
			case 0:
			case 24:
				return ansi.color24.bg(_color, _string, _stream, _end, _inject); break;
		}

		//
		if(typeof _string !== 'string' || _string.length === 0)
		{
			return '';
		}

		//
		_color = prepareColor4(_color);

		if(_end === true)
		{
			_end = ansi.seq('[0m');
		}
		else if(typeof _end !== 'string')
		{
			_end = '';
		}

		if(typeof _color === 'string' && _color.length > 0)
		{
			const bright = (_color.startsWith('bright'));

			if(bright)
			{
				_color = _color.removeFirst(6).toLowerCase();
				_color = ansi.color4[_color].bright;
			}
			else
			{
				_color = ansi.color4[_color];
			}
		}
		else
		{
			return (_string + _end);
		}

		return _color.bg(_string, _stream, _end, _inject);
	}

	//
	ansi.color.black = ansi.color4.black = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[30m', _string, _stream, _end, _inject);
	}

	ansi.color.black.fg = ansi.color.black;

	ansi.color.black.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[40m', _string, _stream, _end, _inject);
	}

	ansi.color.red = ansi.color4.red = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[31m', _string, _stream, _end, _inject);
	}

	ansi.color.red.fg = ansi.color.red;

	ansi.color.red.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[41m', _string, _stream, _end, _inject);
	}

	ansi.color.green = ansi.color4.green = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[32m', _string, _stream, _end, _inject);
	}

	ansi.color.green.fg = ansi.color.green;

	ansi.color.green.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[42m', _string, _stream, _end, _inject);
	}

	ansi.color.yellow = ansi.color4.yellow = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[33m', _string, _stream, _end, _inject);
	}

	ansi.color.yellow.fg = ansi.color.yellow;

	ansi.color.yellow.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[43m', _string, _stream, _end, _inject);
	}

	ansi.color.blue = ansi.color4.blue = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[34m', _string, _stream, _end, _inject);
	}

	ansi.color.blue.fg = ansi.color.blue;

	ansi.color.blue.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[44m', _string, _stream, _end, _inject);
	}

	ansi.color.magenta = ansi.color4.magenta = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[35m', _string, _stream, _end, _inject);
	}

	ansi.color.magenta.fg = ansi.color.magenta;

	ansi.color.magenta.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[45m', _string, _stream, _end, _inject);
	}

	ansi.color.cyan = ansi.color4.cyan = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[36m', _string, _stream, _end, _inject);
	}

	ansi.color.cyan.fg = ansi.color.cyan;

	ansi.color.cyan.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[46m', _string, _stream, _end, _inject);
	}

	ansi.color.white = ansi.color4.white = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[37m', _string, _stream, _end, _inject);
	}

	ansi.color.white.fg = ansi.color.white;

	ansi.color.white.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[47m', _string, _stream, _end, _inject);
	}

	//
	ansi.color.black.bright = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[90m', _string, _stream, _end, _inject);
	}

	ansi.color.black.bright.fg = ansi.color.black.bright;

	ansi.color.black.bright.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[100m', _string, _stream, _end, _inject);
	}

	ansi.color.red.bright = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[91m', _string, _stream, _end, _inject);
	}

	ansi.color.red.bright.fg = ansi.color.red.bright;

	ansi.color.red.bright.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[101m', _string, _stream, _end, _inject);
	}

	ansi.color.green.bright = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[92m', _string, _stream, _end, _inject);
	}

	ansi.color.green.bright.fg = ansi.color.green.bright;

	ansi.color.green.bright.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[102m', _string, _stream, _end, _inject);
	}

	ansi.color.yellow.bright = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[93m', _string, _stream, _end, _inject);
	}

	ansi.color.yellow.bright.fg = ansi.color.yellow.bright;

	ansi.color.yellow.bright.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[103m', _string, _stream, _end, _inject);
	}

	ansi.color.blue.bright = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[94m', _string, _stream, _end, _inject);
	}

	ansi.color.blue.bright.fg = ansi.color.blue.bright;

	ansi.color.blue.bright.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[104m', _string, _stream, _end, _inject);
	}

	ansi.color.magenta.bright = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[95m', _string, _stream, _end, _inject);
	}

	ansi.color.magenta.bright.fg = ansi.color.magenta.bright;

	ansi.color.magenta.bright.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[105m', _string, _stream, _end, _inject);
	}

	ansi.color.cyan.bright = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[96m', _string, _stream, _end, _inject);
	}

	ansi.color.cyan.bright.fg = ansi.color.cyan.bright;

	ansi.color.cyan.bright.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[106m', _string, _stream, _end, _inject);
	}

	ansi.color.white.bright = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[97m', _string, _stream, _end, _inject);
	}

	ansi.color.white.bright.fg = ansi.color.white.bright;

	ansi.color.white.bright.bg = function(_string, _stream = null, _end = true, _inject = INJECT, _reduce = ansi.DEFAULT_REDUCE())
	{
		if(_reduce && console.depth < 4)
		{
			return _string;
		}

		return ansi('[107m', _string, _stream, _end, _inject);
	}

	//
	ansi.color.bright = ansi.color4.bright = {};
	ansi.bright = ansi.color.bright = {};

	for(var i = 0; i < ansi.colors.length; i++)
	{
		//
		const color = ansi.colors[i];

		//
		if(color.startsWith('bright'))
		{
			continue;
		}

		//
		ansi[color] = ansi.color[color];
		ansi.bright[color] = ansi.color.bright[color] = ansi.color[color].bright;
	}

	// use these both at 'ansi.cursor'-functions (and tty/box ;-)
	ansi.y = (_value, _height = ansi.HEIGHT, _throw = DEFAULT_THROW) => {
		return String.getY(_value, _height, false, null, _throw);
	}

	ansi.x = (_value, _width = ansi.WIDTH, _throw = DEFAULT_THROW) => {
		return String.getX(_value, _width, false, null, _throw);
	}

	//
	ansi.write = function(_string, _stream = 0)
	{
		if(typeof _string !== 'string' || _string.length === 0)
		{
			return 0;
		}
		else if((_stream = ansi.findStream(_stream, false)) === null)
		{
			return 0;
		}
		else if(typeof _stream.write !== 'function')
		{
			return 0;
		}

		const result = _stream.write(_string);

		if(typeof result === 'boolean')
		{
			if(result)
			{
				return _string.length;
			}

			return -_string.length;
		}
		else if(typeof result === 'number')
		{
			return result;
		}
		else if(typeof result.length === 'number')
		{
			return result.length;
		}

		return -_string.length;
	}

	ansi.write.stdout = function(_string)
	{
		return ansi.write(_string, 1);
	}

	ansi.write.stderr = function(_string)
	{
		return ansi.write(_string, 2);
	}

	//
	ansi.status = function(_stream, _format, ... _printf)
	{
		if((_stream = ansi.findStream(_stream)) === null)
		{
			return '';
		}
		else if(_format === null)
		{
			return ansi.write(EOL);
		}
		else if(Number.isInt(_format) && _format > 0)
		{
			return ansi.write(eol(_format));
		}
		else if(typeof _format !== 'string')
		{
			if(_printf.length === 0)
			{
				_format = '';
			}
			else if(typeof _printf[0] === 'string')
			{
				_format = _printf.shift();
			}
			else
			{
				_format = String.repeat(_printf.length, '% ').removeLast();
			}
		}

		var result = _format.printf(... _printf).eol(EOL).replaces(EOL, ' ');

		if(_stream.isTTY && result.textLength > _stream.columns)
		{
			result = result.substr(0, _stream.columns, true);
		}

		ansi.cursor.column(0, _stream);
		ansi.clear.line(_stream);
		ansi.write(result, _stream);

		return result;
	}

	//

	//
	ansi.INDEX = Object.create(null);
	ansi.TYPES = [];

	ansi.index = function(_type)
	{
		//
		if(typeof _type !== 'string' || _type.length === 0)
		{
			_type = null;
		}

		//
		const result = [];
	}

	ansi.TYPES = [];

	//
	const addSeq = (_seq, _type, _desc, _args, _func = null) => {
		if(typeof _seq !== 'string' || _seq.length === 0)
		{
			return x('Invalid _seq');
		}
		else
		{
			if(_seq[0] === ansi.ESC)
			{
				_seq = _seq.removeFirst();
			}

			if(_seq[_seq.length - 1] === ansi.NUL)
			{
				_seq = _seq.removeLast();
			}
		}

		if(typeof _type !== 'string' || _type.length === 0)
		{
			return x('Invalid _type');
		}
		else
		{
			const idx = (_type = _type.toLowerCase()).indexOf(' ');

			if(idx > -1)
			{
				_type = _type.substr(0, idx);
			}

			if(_type in ansi.INDEX)
			{
				return x('Sequence is already indexed (as \'' + _type + '\')');
			}
		}

		if(typeof _desc !== 'string' || _desc.length === 0)
		{
			_desc = null;
		}

		if(! Array.isArray(_args))
		{
			if(typeof _args === 'string' || typeof _args === 'number')
			{
				_args = [ _args ];
			}
			else
			{
				_args = [];
			}
		}

		if(typeof _func !== 'function')
		{
			_func = null;
		}

		//
		const typeSplit = _type.split('.');

		if(ansi.TYPES.indexOf(typeSplit[0]) === -1)
		{
			ansi.TYPES.push(typeSplit[0]);
		}

		var curr = ansi.INDEX;

		for(var i = 0; i < typeSplit.length; i++)
		{
			if(typeSplit[i] in curr)
			{
				curr = curr[typeSplit[i]];
			}
			else
			{
				curr = curr[typeSplit[i]] = {};
			}
		}
	//
	//tree or virtual tree???
		//
	//	const obj = Object.create(null);

	//	obj.seq = _seq;
	//	obj.type = _type;
	//	obj.desc = _desc;
	//	obj.args = _args;
	//	obj.func = _func;

		//
	//	return (ansi.INDEX[obj.type] = obj);
	}

	//
	//TODO/are all the [new..] sequences in there..? and STILL named correctly?!?
	//
	addSeq('[0m', 'clear.reset', 'Disable all previously set ANSI escape sequences (reset to default style, etc.)', [], ansi.clear.reset);
	addSeq('[2J', 'clear.screen', 'Clear the whole screen', [], ansi.clear.screen);
	addSeq('[3J', 'clear.buffer', 'Clear the scrollbar buffer (*not* the screen)', [], ansi.clear.buffer);
	addSeq('[0J', 'clear.below', '(TODO)', [], ansi.clear.below);
	addSeq('[1J', 'clear.above', '(TODO)', [], ansi.clear.above);
	addSeq('[2K', 'clear.line', '(TODO)', [], ansi.clear.line);
	addSeq('[0K', 'clear.line.end', '(TODO)', [], ansi.clear.line.end);
	addSeq('[1K', 'clear.line.start', '(TODO)', [], ansi.clear.line.start);
	addSeq('[1m', 'style.bold', '(TODO)', [], ansi.style.bold);
	addSeq('[2m', 'style.faint', '(TODO)', [], ansi.style.faint);
	addSeq('[3m', 'style.italic', '(TODO)', [], ansi.style.italic);
	addSeq('[4m', 'style.underline', '(TODO)', [], ansi.style.underline);
	addSeq('[5m', 'style.slow', '(TODO)', [], ansi.style.slow);
	addSeq('[6m', 'style.fast', '(TODO)', [], ansi.style.fast);
	addSeq('[7m', 'style.inverse', '(TODO)', [], ansi.style.inverse);
	addSeq('[8m', 'style.conceal', '(TODO)', [], ansi.style.conceal);
	addSeq('[9m', 'style.strike', '(TODO)', [], ansi.style.strike);
	addSeq('[?5h', 'flash.on', '(TODO)', [], ansi.flash.on);
	addSeq('[?5l', 'flash.off', '(TODO)', [], ansi.flash.off);
	addSeq('[%S', 'scroll.up', '(TODO)', [], ansi.scroll.up);
	addSeq('[%T', 'scroll.down', '(TODO)', [], ansi.scroll.down);
	addSeq('[%;%H', 'cursor.move', '(TODO)', [], ansi.cursor.move);
	addSeq('[?25h', 'cursor.show', '(TODO)', [], ansi.cursor.show);
	addSeq('[?25l', 'cursor.hide', '(TODO)', [], ansi.cursor.hide);
	addSeq('[H', 'cursor.home', '(TODO)', [], ansi.cursor.home);//'cursor.end'!???
	addSeq('[s', 'cursor.save', '(TODO)', [], ansi.cursor.save);
	addSeq('[u', 'cursor.load', '(TODO)', [], ansi.cursor.load);
	addSeq('[%G', 'cursor.column', '(TODO)', [], ansi.cursor.column);
	addSeq('[%A', 'cursor.up', '(TODO)', [], ansi.cursor.up);
	addSeq('[%B', 'cursor.down', '(TODO)', [], ansi.cursor.down);
	addSeq('[%C', 'cursor.right', '(TODO)', [], ansi.cursor.right);
	addSeq('[%D', 'cursor.left', '(TODO)', [], ansi.cursor.left);
	addSeq('[%E', 'cursor.next', '(TODO)', [], ansi.cursor.next);
	addSeq('[%F', 'cursor.prev', '(TODO)', [], ansi.cursor.prev);
	addSeq('[38;2;%;%;%m', 'color.fg.24', '(TODO)', [], ansi.color24.fg);
	addSeq('[48;2;%;%;%m', 'color.bg.24', '(TODO)', [], ansi.color24.bg);
	addSeq('[38;5;%m', 'color.fg.8', '(TODO)', [], ansi.color8.fg);
	addSeq('[48;5;%m', 'color.bg.8', '(TODO)', [], ansi.color8.bg);
	addSeq('[30m', 'color.fg.4.black', '(TODO)', [], null);//TODO/ab hier noch funktionen einsetzsen..!!!
	addSeq('[40m', 'color.bg.4.black', '(TODO)', [], null);
	addSeq('[31m', 'color.fg.4.red', '(TODO)', [], null);
	addSeq('[41m', 'color.bg.4.red', '(TODO)', [], null);
	addSeq('[32m', 'color.fg.4.green', '(TODO)', [], null);
	addSeq('[42m', 'color.bg.4.green', '(TODO)', [], null);
	addSeq('[33m', 'color.fg.4.yellow', '(TODO)', [], null);
	addSeq('[43m', 'color.bg.4.yellow', '(TODO)', [], null);
	addSeq('[34m', 'color.fg.4.blue', '(TODO)', [], null);
	addSeq('[44m', 'color.bg.4.blue', '(TODO)', [], null);
	addSeq('[35m', 'color.fg.4.magenta', '(TODO)', [], null);
	addSeq('[45m', 'color.bg.4.magenta', '(TODO)', [], null);
	addSeq('[36m', 'color.fg.4.cyan', '(TODO)', [], null);
	addSeq('[46m', 'color.bg.4.cyan', '(TODO)', [], null);
	addSeq('[37m', 'color.fg.4.white', '(TODO)', [], null);
	addSeq('[47m', 'color.bg.4.white', '(TODO)', [], null);
	addSeq('[90m', 'color.fg.4.black.bright', '(TODO)', [], null);
	addSeq('[100m', 'color.bg.4.black.bright', '(TODO)', [], null);
	addSeq('[91m', 'color.fg.4.red.bright', '(TODO)', [], null);
	addSeq('[101m', 'color.bg.4.red.bright', '(TODO)', [], null);
	addSeq('[92m', 'color.fg.4.green.bright', '(TODO)', [], null);
	addSeq('[102m', 'color.bg.4.green.bright', '(TODO)', [], null);
	addSeq('[93m', 'color.fg.4.yellow.bright', '(TODO)', [], null);
	addSeq('[103m', 'color.bg.4.yellow.bright', '(TODO)', [], null);
	addSeq('[94m', 'color.fg.4.blue.bright', '(TODO)', [], null);
	addSeq('[104m', 'color.bg.4.blue.bright', '(TODO)', [], null);
	addSeq('[95m', 'color.fg.4.magenta.bright', '(TODO)', [], null);
	addSeq('[105m', 'color.bg.4.magenta.bright', '(TODO)', [], null);
	addSeq('[96m', 'color.fg.4.cyan.bright', '(TODO)', [], null);
	addSeq('[106m', 'color.bg.4.cyan.bright', '(TODO)', [], null);
	addSeq('[97m', 'color.fg.4.white.bright', '(TODO)', [], null);
	addSeq('[107m', 'color.bg.4.white.bright', '(TODO)', [], null);
	addSeq(']0;%<BEL>', 'text.title', '(TODO)', [], ansi.text.title);
	//TODO/..addSeq('', 'text.link', '(TODO)', [], ansi.text.link);

	//

})();
