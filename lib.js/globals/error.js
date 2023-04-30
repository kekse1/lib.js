(function()
{

	//
	const DEFAULT_TO_STRING_MESSAGE_LENGTH = 30;

	const DEFAULT_TRIM_UNIFORM = true;
	const DEFAULT_WITH_MESSAGE = false;

	const DEFAULT_MOVEMENT = true;
	const DEFAULT_COLOR = true;
	const DEFAULT_COLORS = [ '#fc0000', '#fc7100', '#fcc100' ];
	const DEFAULT_COLOR_COLON =  '#aaa';

	//
	Object.defineProperty(Error, 'isError', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else try
		{
			for(var i = 0; i < _args.length; ++i)
			{
				if(_args[i].constructor?.name !== 'Error')
				{
					return false;
				}
			}
		}
		catch(_error)
		{
			return false;
		}

		return true;
	}});

	//
	if(typeof color === 'undefined')
	{
		color = require('utility/color');
	}

	//
	const getErrorColors = (_colors) => {
		var result;
		
		if(! hasColors())
		{
			result = [ false ];
		}
		else if(typeof _colors === 'boolean')
		{
			result = [ _colors ];
		}
		else if(Array.isArray(_colors, false))
		{
			result = [ ... _colors ];
		}
		else if(typeof DEFAULT_COLORS === 'boolean')
		{
			result = [ DEFAULT_COLORS ];
		}
		else if(Array.isArray(DEFAULT_COLORS, false))
		{
			result = [ ... DEFAULT_COLORS ];
		}
		else
		{
			result = [ '#fc0000', '#fc7100', '#fcc100' ];
		}

		for(var i = 0; i < result.length; ++i)
		{
			if(result[i] === null || result[i] === false)
			{
				result[i] = false;
			}
			else if(! color.isRandomColor(result[i]))
			{
				result[i] = color.hex(result[i], false);
			}
		}
		
		return result;
	};
	
	//
	const wordIsFile = (_word) => {
		if(_word.length === 0)
		{
			return null;
		}
		else if(_word.at(0, getPathSep()))
		{
			return true;
		}
		else if(_word.startsWith('node:'))
		{
			return true;
		}
		else if(_word.startsWith('http:') || _word.startsWith('https:') || _word.startsWith('file:'))
		{
			return true;
		}
		
		return false;
	};

	const getPathSep = () => {
		if(BROWSER)
		{
			return '/';
		}
		else if(typeof path !== 'undefined' && path.sep === 'string')
		{
			return path.sep;
		}
		
		return '/';
	};
	
	const hasColors = () => {
		return (typeof String.prototype.color === 'function' && !!DEFAULT_COLOR);
	};

	//
	Object.defineProperty(Error, 'extractNumbers', { value: function(_word)
	{
		if(typeof _word !== 'string')
		{
			return x('Invalid % argument (expecting a %)', null, '_word', 'String');
		}
		else if(_word.length === 0)
		{
			return { word: '', line: null, column: null };
		}

		const numbers = [ '', '' ];
		var word = '';
		var state = 1;
		
		for(var i = _word.length - 1; i >= 0; --i)
		{
			if(_word[i] === ':' && word.length > 0)
			{
				numbers[state--] = word;
				word = '';

				if(state < 0)
				{
					word = _word.substr(0, i);
					break;
				}
				else
				{
					word = '';
				}
			}
			//else if(_word[i].isInt())
			else if(! isNaN(_word[i]))
			{
				word = _word[i] + word;
			}
			else
			{
				word = _word.substr(0, i + 1) + word;
				break;
			}
		}
		
		if(numbers[1].length > 0 && numbers[0].length === 0)
		{
			[ numbers[0], numbers[1] ] = [ numbers[1], numbers[0] ];
		}
		
		if(numbers[0].length > 0)
		{
			numbers[0] = parseInt(numbers[0]);
		}
		else
		{
			numbers[0] = null;
		}
		
		if(numbers[1].length > 0)
		{
			numbers[1] = parseInt(numbers[1]);
		}
		else
		{
			numbers[1] = null;
		}
		
		return { word, line: numbers[0], column: numbers[1] };
	}});

	//
	const OPEN = [ '(', '<', '[', '{' ];
	const CLOSE = [ ')', '>', ']', '}' ];
	const BRACKETS = [ ... OPEN, ... CLOSE ];

	const extractLine = (_line, _add = 0, _colors = DEFAULT_COLOR) => {
		const isOpenBracket = (_char, _not = false) => {
			switch(_char)
			{
				case '(': return (_not ? ')' : '(');
				case '<': return (_not ? '>' : '<');
				case '[': return (_not ? ']' : '[');
				case '{': return (_not ? '}' : '{');
			}
			
			return '';
		}
		
		const isCloseBracket = (_char, _not = false) => {
			switch(_char)
			{
				case ')': return (_not ? '(' : ')');
				case '>': return (_not ? '<' : '>');
				case ']': return (_not ? '[' : ']');
				case '}': return (_not ? '{' : '}');
			}
			
			return '';
		};
		
		const isBracket = (_char, _not = false) => {
			var result = isOpenBracket(_char, _not);
			
			if(result.length === 0)
			{
				result = isCloseBracket(_char, _not);
			}
			
			return result;
		};
		
		//
		var tmp;
		
		while(tmp !== _line)
		{
			_line = _line.replaces(' (', '(').replaces(' <', '<').replaces(' [', '[').replaces(' {', '{');
			_line = _line.replaces('( ', '(').replaces('< ', '<').replaces('[ ', '[').replaces('{ ', '{');
			_line = _line.replaces(') ', ')').replaces('> ', '>').replaces('] ', ']').replaces('} ', '}');
			_line = _line.replaces(' )', ')').replaces(' >', '>').replaces(' ]', ']').replaces(' }', '}');
			
			tmp = _line;
		}

		//
		const res = [];
		var count = (DEFAULT_MOVEMENT ? _add : 0);
		var last = '';
		var add = 1;
		var openWithDot = false;
		var word = '';

		for(var i = 0, j = 0; i < _line.length; ++i)
		{
			if(_line[i] === ' ')
			{
				if(word.length > 0)
				{
					if(_colors)
					{
						res[j++] = [ count, word ];
					}
					else
					{
						res[j++] = word;
					}
					
					word = '';
				}

				if(_colors)
				{
					res[j++] = [ null, ' ' ];
				}
				else
				{
					res[j++] = ' ';
				}

				last = 'space';
			}
			else if(isOpenBracket(_line[i]).length > 0)
			{
				if(last === 'close')
				{
					++add;
				}
				else if(--add < 1)
				{
					add = 1;
				}

				count += add;
				
				if(word.length > 0)
				{
					if(_colors)
					{
						res[j++] = [ count - 1, word ];
					}
					else
					{
						res[j++] = word;
					}
					
					word = '';
				}

				if(i > 0 && _line[i - 1] === '.')
				{
					openWithDot = true;
				}
					
				if(_colors)
				{
					res[j++] = [ null, (openWithDot ? _line[i] : ' ' + _line[i] + ' ') ];
				}
				else
				{
					res[j++] = (openWithDot ? _line[i] : ' ' + _line[i] + ' ');
				}
				
				last = 'open';
			}
			else if(isCloseBracket(_line[i]).length > 0)
			{
				if(word.length > 0)
				{
					if(_colors)
					{
						res[j++] = [ count, word ];
					}
					else
					{
						res[j++] = word;
					}
					
					word = '';
				}

				if(_colors)
				{
					res[j++] = [ null, (openWithDot ? _line[i] : ' ' + _line[i] + ' ') ];
				}
				else
				{
					res[j++] = (openWithDot ? _line[i] : ' ' + _line[i] + ' ');
				}

				openWithDot = false;
				count -= add;
				last = 'close';
			}
			else
			{
				word += _line[i];
				last = '';
			}
		}
		
		if(word.length > 0)
		{
			if(_colors)
			{
				res.push([ count, word ]);
			}
			else
			{
				res.push(word);
			}
		}

		//
		var extracted, a, b;

		if(_colors)
		{
			for(var i = res.length - 1; i > 0; --i)
			{
				if(res[i][0] === null && res[i - 1][0] === null)
				{
					res[i - 1][1] += res.splice(i, 1)[0][1];
					res[i - 1][1] = res[i - 1][1].replaces('  ', ' ');
				}
			}

			for(var i = res.length - 1; i > 0; --i)
			{
				a = res[i][1].only(' ', ... BRACKETS);
				b = res[i - 1][1].only(' ', ... BRACKETS);
				
				if(a && b)
				{
					res[i - 1][1] += res.splice(i, 1)[0][1];
				}
			}
			
			for(var i = 0; i < res.length; ++i)
			{
				extracted = Error.extractNumbers(res[i][1]);
				res[i][1] = extracted.word;
				
				if(extracted.line !== null)
				{
					res[i].push(extracted.line);
				}
				
				if(extracted.column !== null)
				{
					if(extracted.line === null)
					{
						res[i].push(null);
					}
					
					res[i].push(extracted.column);
				}
			}
		}
		else
		{
			for(var i = res.length - 1; i > 0; --i)
			{
				a = res[i].only(' ', ... BRACKETS);
				b = res[i - 1].only(' ', ... BRACKETS);

				if(a && b)
				{
					res[i - 1] += res.splice(i, 1)[0];
					res[i - 1] = res[i - 1].replaces('  ', ' ');
				}
			}

			for(var i = 0; i < res.length; ++i)
			{
				extracted = Error.extractNumbers(res[i]);
				res[i] = [ extracted.word ];

				if(extracted.line !== null)
				{
					res[i].push(extracted.line);
				}

				if(extracted.column !== null)
				{
					if(extracted.line === null)
					{
						res[i].push(null);
					}
					
					res[i].push(extracted.column);
				}
			}
		}

		//
		return res;
	};

	//
	Object.defineProperty(Error, 'parseStack', { value: function(_stack, _name = null, _colors = DEFAULT_COLOR, _xml = false)
	{
		//
		if(typeof _stack !== 'string')
		{
			return x('Invalid % argument (expecting a %)', null, '_stack', 'String');
		}
		else if(_stack.length === 0)
		{
			return [];
		}
		
		if(typeof _name !== 'string' || _name.length === 0)
		{
			_name = null;
		}
		
		if(typeof _xml !== 'boolean')
		{
			_xml = false;
		}

		//
		if(! hasColors())
		{
			_colors = false;
		}
		else if(typeof _colors !== 'boolean')
		{
			_colors = DEFAULT_COLOR;
		}

		//
		const result = [];
		const lines = _stack.eol(EOL).split(EOL);
		var line, l;

		//
		for(var i = 0, j = 0, k = 0; i < lines.length; ++i)
		{
			l = lines[i].trim();
		
			if(l.startsWith('at '))
			{
				l = l.removeFirst(3);
			}
			else if(_name !== null && l.startsWith(_name + ': '))
			{
				result[j++] = null;
				continue;
			}
			else if(l.length === 0)
			{
				continue;
			}
			else if((BROWSER && (lines[i].startsWith('http:') || lines[i].startsWith('https:') || lines[i].startsWith('file:') || lines[i][0] === path.sep)) || lines[i][0] === path.sep)
			{
				const lastIdx = lines[i].lastIndexOf(':');

				if(lastIdx === -1)
				{
					result[j++] = [ [ null, lines[i].info ] ];
					continue;
				}

				var file = '';
				const loc = [];
				var sub = '';

				for(var k = lines[i].length - 1; k >= 0; --k)
				{
					if(!isNaN(lines[i][k]))
					{
						sub = lines[i][k] + sub;
					}
					else if(lines[i][k] === ':' && sub.length > 0)
					{
						loc.push(sub);
						sub = '';

						if(loc.length >= 2)
						{
							file = lines[i].substr(0, k);
							break;
						}
					}
					else
					{
						file = lines[i].substr(0, k + 1);
						break;
					}
				}

				if(sub.length > 0)
				{
					loc.push(sub);
				}

				var line, col;

				if(loc.length === 0)
				{
					result[j++] = [ [ null, (_colors ? lines[i].info : lines[i]) ] ];
					continue;
				}
				else if(loc.length === 1)
				{
					line = loc[0];

					if(_colors)
					{
						line = line.high.bold;
					}

					col = null;
				}
				else
				{
					line = loc[1];
					col = loc[0];

					if(_colors)
					{
						line = line.high.bold;
						col = col.high;
					}
				}

				const colon = (_colors ? ':'.colorFG(DEFAULT_COLOR_COLON) : ':');

				loc.length = 0;
				result[j++] = [ [ null, (_colors ? file.info : file) ], [ null, colon ], [ null, line ] ];

				if(col)
				{
					result[j - 1].push([ null, colon ], [ null, col ]);
				}

				continue;
			}
			else
			{
				result[j++] = [ [ null, (_colors ? lines[i].colorize() : lines[i]) ] ];
				continue;
			}
			
			result[j++] = extractLine(l, k++, _colors);
		}

		//
		return prepareParsedStack(result, _colors, _xml);
	}});
	
	Object.defineProperty(Error.prototype, 'parseStack', { value: function(_colors = DEFAULT_COLOR, _xml = false)
	{
		return Error.parseStack(this.stack, this.name, _colors, _xml);
	}});

	const getColor = (_index, _array, _return_index = false) => {
		if(color.isColor(DEFAULT_COLOR, false, false, false))
		{
			return color.hex(DEFAULT_COLOR);
		}
		else if(_array.length === 0)
		{
			return false;
		}
		else if(_index === null || _index === false)
		{
			return false;
		}
		else if(typeof _index === 'undefined' || _index === true || (typeof _index === 'string' && (_index.length === 0 || _index.startsWith('random'))))
		{
			return color.hex();
		}
		
		var result;
		
		if(isInt(_index))
		{
			if(_index < 0)
			{
				result = ((_array.length + (_index % _array.length)) % _array.length);
			}
			else
			{
				result = Math.abs(_index % _array.length);
			}
		}
		else
		{
			result = Math.floor(Math.random(false) * _array.length);
		}
		
		if(_return_index)
		{
			return result;
		}

		return color.hex(_array[result]);
	};

	const prepareParsedStack = (_stack, _colors = DEFAULT_COLOR, _xml = false) => {
		//
		if(! hasColors())
		{
			_colors = false;
		}
		else if(typeof _colors !== 'boolean')
		{
			_colors = DEFAULT_COLOR;
		}

		//
		const errorColors = (_colors ? getErrorColors() : null);

		//
		if(_colors)
		{
			var color;

			for(var i = 0; i < _stack.length; ++i)
			{
				if(_stack[i] === null)
				{
					continue;
				}

				for(var j = 0; j < _stack[i].length; ++j)
				{
					//
					if(_xml)
					{
						_stack[i][j][1] = _stack[i][j][1].escapeXML();
					}
					
					//
					color = getColor(_stack[i][j].shift(), errorColors, false);

					//
					if(RESPECT && wordIsFile(_stack[i][j][0]))
					{
						if(_stack[i][j][0].startsWith('node:'))
						{
							if(color)
							{
								_stack[i][j][0] = _stack[i][j][0].debug;
							}
						}
						else if(BROWSER && (_stack[i][j][0].startsWith('http:') || _stack[i][j][0].startsWith('https:') || _stack[i][j][0].startsWith('file:')))
						{
							if(DEFAULT_TRIM_UNIFORM)
							{
								if(typeof Uniform === 'undefined')
								{
									Uniform = require('network/uniform');
								}
								
								const uni = Uniform.create(_stack[i][j][0]);
								
								if(uni.host === location.host)
								{
									_stack[i][j][0] = '';
								}
								else
								{
									_stack[i][j][0] = uni.base;
								}
								
								_stack[i][j][0] += uni.pathname;
							}

							if(color)
							{
								_stack[i][j][0] = _stack[i][j][0].info;
							}
						}
						else
						{
							if(color)
							{
								_stack[i][j][0] = _stack[i][j][0].info;
							}
						}
					}
					else
					{
						_stack[i][j][0] = _stack[i][j][0].colorFG(color);
					}

					//
					if(Number.isInt(_stack[i][j][1]))
					{
						_stack[i][j][1] = _stack[i][j][1].toString();
						
						if(color)
						{
							if(RESPECT)
							{
								_stack[i][j][1] = _stack[i][j][1].high.bold;
								_stack[i][j][0] += ':'.colorFG(DEFAULT_COLOR_COLON);
							}
							else
							{
								_stack[i][j][1] = _stack[i][j][1].colorFG(color);
								_stack[i][j][0] += ':'.colorFG(color);
							}
						}
						else
						{
							_stack[i][j][0] += ':';
						}
						
						_stack[i][j][0] += _stack[i][j][1];
					}
					
					if(Number.isInt(_stack[i][j][2]))
					{
						_stack[i][j][2] = _stack[i][j][2].toString();
						
						if(color)
						{
							if(RESPECT)
							{
								_stack[i][j][2] = _stack[i][j][2].high;
								_stack[i][j][0] += ':'.colorFG(DEFAULT_COLOR_COLON);//brightWhite;
							}
							else
							{
								_stack[i][j][2] = _stack[i][j][2].colorFG(color);
								_stack[i][j][0] += ':'.colorFG(color);
							}
						}
						else
						{
							_stack[i][j][0] += ':';
						}
						
						_stack[i][j][0] += _stack[i][j][2];
					}
					
					//
					_stack[i][j] = _stack[i][j][0];
				}
			}
		}
		else
		{
			for(var i = 0; i < _stack.length; ++i)
			{
				if(_stack[i] === null)
				{
					continue;
				}
				
				for(var j = 0; j < _stack[i].length; ++j)
				{
					//
					if(_xml)
					{
						_stack[i][j][0] = _stack[i][j][0].escapeXML();
					}
					
					//
					if(Number.isInt(_stack[i][j][1]))
					{
						_stack[i][j][0] += ':' + _stack[i][j][1].toString();
					}
				
					if(Number.isInt(_stack[i][j][2]))
					{
						_stack[i][j][0] += ':' + _stack[i][j][2].toString();
					}
					
					//
					_stack[i][j] = _stack[i][j][0];
				}
			}
		}
		
		//
		var extraStart = -1;
		
		for(var i = 0; i < _stack.length; ++i)
		{
			if(_stack[i] === null)
			{
				extraStart = i;
			}
			else
			{
				_stack[i] = _stack[i].join('');
			}
		}
		
		for(var i = (extraStart === -1 ? 0 : extraStart + 1); i < _stack.length; ++i)
		{
			_stack[i] = _stack[i].trim();
		}
		
		//
		return _stack;
	};

	//
	Object.defineProperty(Error.prototype, 'toObject', { value: function(_colors = DEFAULT_COLOR, _xml = false)
	{
		//
		if(typeof _colors === 'object' && _colors !== null)
		{
			if(typeof _colors.xml === 'boolean')
			{
				_xml = _colors.xml;
			}

			if(typeof _colors.colors === 'boolean')
			{
				_colors = _colors.colors;
			}
		}

		//
		if(! hasColors())
		{
			_colors = false;
		}
		else if(typeof _colors !== 'boolean')
		{
			_colors = DEFAULT_COLOR;
		}
		
		if(typeof _xml !== 'boolean')
		{
			_xml = false;
		}

		//		
		const result = {};
		
		result.STACK = this.stack;
		result.message = this.message;
		result.name = this.name;
		result.items = [];
		result.extra = [];

		if(! isNumeric(result.type))
		{
			if(typeof result.type !== 'string' || result.type.length === 0)
			{
				result.type = result.name;
			}
		}
		else
		{
			result.type = result.type.toText({colors:_colors});
		}

		/*if(_xml)
		{
			result.message = result.message.toXML();
			result.name = result.name.toXML();
			result.type = result.type.toXML();
		}*/
		/*if(_xml)
		{
			result.message = result.message.escapeXML();
			result.name = result.name.escapeXML();
			result.type = result.type.escapeXML();
		}*/
		
		//
		const lines = this.parseStack(_colors, _xml);

		for(var i = 0; i < lines.length; ++i)
		{
			if(lines[i] === null)
			{
				for(var j = 0; j < i; ++j)
				{
					result.extra[j] = lines[j];

					/*if(_xml)
					{
						result.extra[j] = result.extra[j].toXML();
					}*/
				}

				lines.splice(0, i + 1);
				break;
			}
		}
		
		result.stack = (result.lines = lines).join(EOL);
		result.extraStack = result.extra.join(EOL);

		//
		const keys = Object.getOwnPropertyNames(this, false, false);

		/*if(keys.indexOf('_this') > -1 && keys.indexOf('sender') === -1 && typeof Object.was === 'function')
		{
			keys.pushUnique('sender');
			this.sender = Object.was(this._this);

			if(this.sender.length === 0)
			{
				this.sender = (typeof String.render === 'function' ? String.render(this, { colors: _colors }) : (typeof this));
			}
			else
			{
				this.sender = ((_colors && typeof String.colorize === 'function') ? String.colorize(this.sender.length) : this.sender.length) + ' [ ' + this.sender.join(', ') + ' ]';
			}
		}
		else
		{
			keys.remove('_this');
		}*/

		//
		if(typeof camel === 'undefined')
		{
			require('utility/camel');
		}

		keys.sort(true);
		var val, txt;

		for(var i = 0, j = 0; i < keys.length; i++)
		{
			switch(keys[i])
			{
				case 'name':
				case 'message':
				case 'stack':
				case 'extraStack':
				case 'lines':
				case 'items':
				case 'extra':
				case 'script':
					continue;
				case '_this':
					continue;
				case '_printf':
					if(! Array.isArray(this._printf) || this._printf.length === 0 || typeof String.printf !== 'function')
					{
						continue;
					}
					else if(result.message.length === 0)
					{
						result.message = String.repeat(this._printf.length, '% ').removeLast();
					}

					result.message = String.printf(_colors, result.message, ... this._printf);

					//
					/*if(_xml)
					{
						this[keys[i]] = this[keys[i]].toXML();
					}*/
					continue;
			}

			val = this[keys[i]];

			if(Array.isArray(val, true))
			{
				txt = '';

				for(const value of val)
				{
					txt += String.render(String.parse(value), { colors: _colors }) + ', ';
				}

				val = '[ ' + txt.removeLast(2) + ' ]';
			}
			else if(Object.isObject(val))
			{
				txt = '';

				for(const idx in val)
				{
					if(_colors)
					{
						txt += idx.colorizeAs('String') + ', ';
					}
					else
					{
						txt += idx + ', ';
					}
				}

				val = '{ ' + txt.removeLast(2) + ' }';
			}

			/*if(_xml)
			{
				val = val.toXML();
			}*/

			result[result.items[j++] = camel.disable(keys[i], ' ', true, true)] = val;
		}

		if(DEFAULT_WITH_MESSAGE)
		{
			result.items.unshift('message');
		}

		//
		return result;
	}});
	
	Object.defineProperty(Error.prototype, 'toText', { value: function(_colors = DEFAULT_COLOR, _xml = false, _double = true)
	{
		//
		if(! hasColors())
		{
			_colors = false;
		}
		else if(typeof _colors !== 'boolean')
		{
			_colors = DEFAULT_COLOR;
		}

		if(typeof _colors === 'object' && _colors !== null)
		{
			if(typeof _colors.xml === 'boolean')
			{
				_xml = _colors.xml;
			}

			if(typeof _colors.double === 'boolean')
			{
				_double = _colors.double;
			}

			if(typeof _colors.colors === 'boolean')
			{
				_colors = _colors.colors;
			}
		}
		
		//
		const object = this.toObject(_colors, _xml);

		const maxKeyLength = String.measure(object.items);
		var r = ('   ' + object.message + '   ');
		var result = object.name;

		if(_colors)
		{
			result = result.bold;
		}
		
		if(object.type !== object.name)
		{
			result += ' / ' + (_colors ? object.type.bold : object.type);
		}
		
		result = '     ' + result + '     ';
		
		if(_colors)
		{
			result = result.errorBG;
			r = r.brightBlackBG.brightWhite;
		}

		result = '  ' + result;
		result = r.toText({ prefix: result });

		result = EOL + result + eol(2);

		//
		if(object.items.length > 0)
		{
			var k, v, prefix;
			
			for(var i = 0; i < object.items.length; ++i)
			{
				v = object[object.items[i]];
				k = ' ' + object.items[i].pad(maxKeyLength) + ' ';
				
				if(_colors)
				{
					k = k.brightWhite;
					v = String.colorize(v);
				}
				else if(typeof String.render === 'function')
				{
					v = String.render(v, { colors: _colors });
				}
				else
				{
					v = v.toString();
				}

				prefix = TAB;

				if(_colors)
				{
					prefix += ('['.bold + k + ']'.bold);
				}
				else
				{
					prefix = ('[' + k + ']');
				}

				prefix += ' ';
				result += v.toText({ prefix, colors: _colors }) + EOL;
			}
			
			result += EOL;
		}
		
		//
		const stackLines = object.lines;
		const errorLine = object.message;

		var tmp;

		if(_colors)
		{
			tmp = '('.high + object.type.highBG + ')'.high;
		}
		else
		{
			tmp = '(' + object.type + ')';
		}

		tmp += ' ';
		
		tmp = tab(3) + tmp;
		tmp = errorLine.toText({ prefix: tmp, colors: _colors });

		if(_colors)
		{
			tmp = tmp.colorize();
		}
		
		if(_double)
		{
			result += tmp + eol(2);
		}

		//
		if(object.extraStack)
		{
			var prefix = (tab(3) + '~> ');

			if(_colors)
			{
				prefix = prefix.brightWhite;
			}

			result += object.extraStack.toText({ prefix, all: true, colors: _colors }) + eol(2);
		}

		//
		for(const line of stackLines)
		{
			result += line.toText({ prefix: ' ', colors: _colors }) + EOL;
		}
		
		//
		if(_xml)
		{
			result = result.toXML();
		}

		return result;
	}});

	Object.defineProperty(Error.prototype, 'toHTML', { value: function()
	{
		//
		const object = this.toObject(true, true);
		
		//
		var result = `<div class="error">` +
			`<div class="errorCaption">` +
			`<span class="errorBig">${'<b>' + object.name + '</b>' + ((object.name !== object.type) ? (' / <span style="font-size: 80%;">' + object.type + '</span>') : '')}</span>` +
			`<span class="errorTab"></span><span style="font-size: 90%;">${object.message.colorize()}</span></div><br />`;
		
		//
		if(object.items.length > 0)
		{
			result += '<table>';
			var isStr;
			
			for(var i = 0; i < object.items.length; i++)
			{
				isStr = (typeof object[object.items[i]] === 'string');
				result += (`<tr><td class="errorKey">${object.items[i]}</td>` +
					`<td class="errorValue">${isStr ? '' : '<b>'}${String.colorize(object[object.items[i]])}${isStr ? '' : '</b>'}</td></tr>`);
			}
		
			result += '</table>';
		}
		
		//
		result += '<br />';
		
		//
		if(object.extraStack)
		{
			result += '<ul>';
			
			for(const e of object.extra)
			{
				result += `<li class="errorLine">${e}</li>`;
			}
			
			result += '</ul><br />';
		}
		
		//
		const stackLines = object.lines;

		if(stackLines.length > 0)
		{
			result += '<ul>';
			
			for(const line of stackLines)
			{
				result += `<li class="errorLine">${line}</li>`;
			}
			
			result += '</ul><br />';
		}
		
		//
		result += '</div>';

		//
		if(object.script)
		{
			result += String.repeat(3, '<br />') + '<hr /><textarea style="font-size: 80%; width: 98%; margin-left: 10px; height: 500px; opacity: 0.5;">' + object.script + '</textarea>';
		}
		
		//
		return result;
	}});

	//
	const _toString = Error.prototype.toString;

	Object.defineProperty(Error.prototype, 'toString', { value: function(_colors = false)
	{
		if(typeof _colors === 'object' && _colors !== null)
		{
			if(typeof _colors.colors === 'boolean')
			{
				_colors = _colors.colors;
			}
		}

		const hasColors = (_colors && (('color' in String.prototype) && ('textLength' in String.prototype)));

		var name = this.name;
		var message = this.message;

		if(! String.isString(name))
		{
			name = 'Error';
		}

		const origMessageLength = (hasColors ? message.textLength : message.length);

		if(Number.isInt(DEFAULT_TO_STRING_MESSAGE_LENGTH))
		{
			message = message.substr(0, Math.abs(DEFAULT_TO_STRING_MESSAGE_LENGTH), true);
		}
		else if(Number.isInt(console.width) && console.width > 0)
		{
			message = message.substr(0, console.width - name.length - 2, true);
		}

		if(hasColors)
		{
			message = message.warn;
			name = name.error;

			if(message.textLength < origMessageLength)
			{
				message += ' ' + '...'.inverse;
			}
		}
		else if(message.length < origMessageLength)
		{
			message += ' ' + '[...]';
		}

		message = message.quote();

		return name + '(' + message + ')';
	}});

	//

})();

//
module.exports = Error;

