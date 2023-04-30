__STRING_HTML = (function()
{
	//
	if(typeof __STRING_HTML === 'number')
	{
		return Date.now();
	}

	//
	if(typeof color === 'undefined')
	{
		color = require('utility/color');
	}

	if(typeof ansi === 'undefined')
	{
		ansi = require('tty/ansi');
	}

	//
	Object.defineProperty(String.prototype, 'htmlHigh', { value: function()
	{
		var result = '';
		var open = '';
		var sub = '';
		var c;

		for(var i = 0; i < this.length; ++i)
		{
			if(open.length > 0)
			{
				sub += (c = this.at(i));

				if(c === open)
				{
					sub = sub.escapeXML();
					result += sub.high;
					open = sub = '';
				}
			}
			else if(this.at(i) === '<')
			{
				sub = '<';
				open = '>';
			}
			else if(this.at(i) === '&')
			{
				sub = '&';
				open = ';';
			}
			else
			{
				result += this.at(i);
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'htmlLess', { get: function()
	{
		var result = '';
		var open = '';
		
		for(var i = 0; i < this.length; i++)
		{
			if(open.length > 0)
			{
				if(this[i] === open)
				{
					open = '';
				}
			}
			else if(this[i] === '\\')
			{
				if(i < (this.length - 1)) switch(this[i + 1])
				{
					case '<':
					case '>':
					case '&':
					case ';':
						result += this[++i];
						break;
					default:
						result += this[i];
						break;
				}
				else
				{
					result += this[i];
				}
			}
			else if(this[i] === '<')
			{
				open = '>';
			}
			else if(this[i] === '&' && this.indexOf(';', i) > -1)
			{
				open = ';';
			}
			else
			{
				result += this[i];
			}
		}

		return result;
	}});
	
	Object.defineProperty(String.prototype, 'htmlLength', { get: function()
	{
		var result = 0;
		var open = '';
		
		for(var i = 0; i < this.length; i++)
		{
			if(open.length > 0)
			{
				if(this[i] === open)
				{
					open = '';
				}
			}
			else if(this[i] === '\\')
			{
				if(i < (this.length - 1)) switch(this[i + 1])
				{
					case '<':
					case '>':
					case '&':
					case ';':
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
			else if(this[i] === '<')
			{
				open = '>';
			}
			else if(this[i] === '&' && this.indexOf(';', i) > -1)
			{
				open = ';';
			}
			else
			{
				result++;
			}
		}
		
		return result;
	}});

	Object.defineProperty(String.prototype, 'htmlIndexOf', { value: function(_search, _offset, _case_sensitive = true)
	{
throw new Error('TODO');
	}});

	Object.defineProperty(String.prototype, 'htmlLastIndexOf', { value: function(_search, _offset, _case_sensitive = true)
	{
throw new Error('TODO');
	}});

	Object.defineProperty(String.prototype, 'htmlIndicesOf', { value: function(_search, _case_sensitive = true)
	{
throw new Error('TODO');
	}});

	//
	Object.defineProperty(String.prototype, 'htmlSubstr', { value: function(_start, _length)
	{
		const textLength = this.htmlLength;

		if(Number.isInt(_start))
		{
			if(_start < 0)
			{
				_start = textLength + _start;
			}
			
			if(_start < 0)
			{
				return '';
			}
			else if(_start >= textLength)
			{
				return '';
			}
		}
		else
		{
			_start = 0;
		}

		if(Number.isInt(_length))
		{
			if(_length <= 0)
			{
				return '';
			}
			else if((_start + _length) >= textLength)
			{
				_length = textLength - _start;
			}
		}
		else if((_length = (textLength - _start)) <= 0)
		{
			return '';
		}

		//
		var result = '';
		var open = '';
		var start = 0;
		var realStart = null;

		for(var i = 0; i < this.length; ++i)
		{
			if(open.length > 0)
			{
				result += this.at(i);

				if(this.at(i) === open)
				{
					open = '';
				}
			}
			else if(this.at(i) === '<')
			{
				result += this.at(i);
				open = '>';
			}
			else if(this.at(i) === '&' && this.indexOf(';', i) > -1)
			{
				result += this.at(i);
				open = ';';
			}
			else if(++start > _start)
			{
				realStart = i;
				break;
			}
		}

		if(realStart === null)
		{
			return '';
		}

		for(var i = realStart, j = 0; i < this.length; ++i)
		{
			if(open.length > 0)
			{
				result += this.at(i);

				if(this.at(i) === open)
				{
					open = '';
				}
			}
			else if(this.at(i) === '<')
			{
				result += this.at(i);
				open = '>';
			}
			else if(this.at(i) === '&' && this.indexOf(';', i) > -1)
			{
				result += this.at(i);
				open = ';';
			}
			else
			{
				if(++j <= _length)
				{
					result += this.at(i);
				}
				else
				{
					rest = i;
					break;
				}
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'htmlSubstring', { value: function(_start, _stop)
	{
		return this.htmlSubstr(_start, _stop - _start);
	}});

	//
	Object.defineProperty(String.prototype, 'htmlAt', { value: function(_offset, _needle, _case_sensitive = true)
	{
		const textLength = this.htmlLength;

		if(! Number.isNumber(_offset))
		{
			return x('Invalid % (expecting % %)', null, '_offset', '-/+', 'Integer');
		}
		else
		{
			_offset = getIndex(_offset, textLength);
		}

		if(! String.isString(_needle))
		{
			_needle = null;
		}
		else if(_needle.length > (textLength - _offset))
		{
			return false;
		}

		if(typeof _case_sensitive !== 'boolean')
		{
			_case_sensitive = true;
		}
		else if(! _case_sensitive && _needle !== null)
		{
			_needle = _needle.toLowerCase();
		}

		var open = false;

		for(var i = 0, j = 0; i < this.length; i++)
		{
			if(open)
			{
				if(this[i] === '>')
				{
					open = false;
				}
			}
			else if(this[i] === '<')
			{
				open = true;
			}
			else
			{
				if(j === _offset)
				{
					if(_needle === null)
					{
						return this[i];
					}
					else
					{
						var sub = '';
						var subOpen = open;
						
						for(var k = i; k < this.length; k++)
						{
							if(subOpen)
							{
								if(this[k] === '>')
								{
									subOpen = false;
								}
							}
							else if(this[k] === '<')
							{
								subOpen = true;
							}
							else if((sub += this[k]).length === _needle.length)
							{
								if(! _case_sensitive)
								{
									sub = sub.toLowerCase();
								}

								return (sub === _needle);
							}
						}
					}
				}

				j++;
			}
		}

		if(_needle === null)
		{
			return undefined;
		}

		return false;
	}});

	//
	if(typeof __STRING_HTML === 'number' || typeof __STRING_ANSI === 'number')
	{
		return Date.now();
	}

	//
	function rainbow(_string, _force = false, _background = false)
	{
		if(_force)
		{
throw new Error('TODO');
		}

		if(typeof _string !== 'string')
		{
			return x('Not a %', null, 'String');
		}
		else if(_string.length === 0)
		{
			return (_background ? _string.colorBG('random') : _string.colorFG('random'));
		}

		var result = '';
		var open = '';

		for(var i = 0; i < _string.length; i++)
		{
			if(open.length > 0)
			{
				if(_string[i] === open)
				{
					open = '';
				}

				result += _string[i];
			}
			else
			{
				if(_string[i] === '&')
				{
					open = ';';
					result += _string[i];
				}
				else if(_string[i] === '<')
				{
					open = '>';
					result += _string[i];
				}
				else
				{
					if(_background)
					{
						result += _string[i].colorBG('random');
					}
					else
					{
						result += _string[i].colorFG('random');
					}
				}
			}
		}

		return result;
	}

	function colorize(_string, _force = false, _background = false, _2nd_color = false)
	{
		if(! _force)
		{
//throw new Error('TODO');
		}

		if(typeof _string !== 'string')
		{
			return x('Not a %', null, 'String');
		}
		else if(_string.length === 0)
		{
			return (_background ? ''.colorBG(color.random.gray.hex()) : ''.colorFG(color.random.gray.hex()));
		}

		const fgColorString = '<span style="color:';
		const bgColorString = '<span style="background-color:';
		var result = '';
		var open = '';
		var openFG = false;
		var openBG = false;
		const last = [];

		for(var i = 0; i < _string.length; i++)
		{
			if(open.length > 0)
			{
				if(_string[i] === open)
				{
					open = '';
				}

				result += _string[i];
			}
			else
			{
				if(_string[i] === '&')
				{
					open = ';';
				}
				else if(_string[i] === '<')
				{
					open = '>';

					if(_string.at(i, fgColorString))
					{
						openFG = true;
						last.push('fg');
						result += fgColorString;
						i += (fgColorString.length - 1);
					}
					else if(_string.at(i, bgColorString))
					{
						openBG = true;
						last.push('bg');
						result += bgColorString;
						i += (bgColorString.length - 1);
					}
					else if(_string.at(i, '</span>'))
					{
						const l = last.pop();

						if(l === 'fg')
						{
							openFG = false;
						}
						else if(l === 'bg')
						{
							openBG = false;
						}

						for(var j = last.length - 1; j >= 0; j--)
						{
							if(last[j] === 'fg')
							{
								openFG = true;

								if(openFG && openBG)
								{
									break;
								}
							}
							else if(last[j] === 'bg')
							{
								openBG = true;

								if(openBG && openFG)
								{
									break;
								}
							}
						}

						open = '';
						result += '</span>';
						i += 6;
					}
					else
					{
						result += _string[i];
					}
				}
				else
				{
					if(_background && !openBG)
					{
						result += _string[i].colorBG(color.random.gray.hex());
					}
					else if(!_background && !openFG)
					{
						result += _string[i].colorFG(color.random.gray.hex());
					}
					else
					{
						result += _string[i];
					}
				}
			}
		}

		return result;
	}

	Object.defineProperty(String.prototype, 'colorize', { value: function(_force = false, _2nd_color = false)
	{
		return colorize(this.valueOf(), _force, false, _2nd_color);
	}});

	Object.defineProperty(String.prototype, 'colorizeFG', { value: String.prototype.colorize });

	Object.defineProperty(String.prototype, 'colorizeBG', { value: function(_force = false, _2nd_color = false)
	{
		return colorize(this.valueOf(), _force, true, _2nd_color);
	}});

	Object.defineProperty(String.prototype, 'rainbow', { value: function(_force = false, _2nd_color = false)
	{
		return rainbow(this.valueOf(), _force, false, _2nd_color);
	}});

	Object.defineProperty(String.prototype, 'rainbowFG', { value: String.prototype.rainbow });

	Object.defineProperty(String.prototype, 'rainbowBG', { value: function(_force = false, _2nd_color = false)
	{
		return rainbow(this.valueOf(), _force, true, _2nd_color);
	}});

	Object.defineProperty(String.prototype, 'randomColor', { value: function(_fg = true, _bg = true)
	{
		if(_fg === true)
		{
			_fg = color();
		}
		else
		{
			_fg = null;
		}

		if(_bg === true)
		{
			_bg = color();
		}
		else
		{
			_bg = null;
		}

		return this.color(_fg, _bg);
	}});

	Object.defineProperty(String.prototype, 'randomColorFG', { get: function()
	{
		return this.randomColor(true, false);
	}});

	Object.defineProperty(String.prototype, 'randomColorBG', { get: function()
	{
		return this.randomColor(false, true);
	}});

	Object.defineProperty(String.prototype, 'randomGray', { value: function(_fg = true, _bg = true)
	{
		if(_fg === true)
		{
			_fg = color.random.gray();
		}
		else
		{
			_fg = null;
		}

		if(_bg === true)
		{
			_bg = color.random.gray();
		}
		else
		{
			_bg = null;
		}

		return this.color(_fg, _bg);
	}});

	Object.defineProperty(String.prototype, 'randomGrayFG', { get: function()
	{
		return this.randomGray(true, false);
	}});

	Object.defineProperty(String.prototype, 'randomGrayBG', { get: function()
	{
		return this.randomGray(false, true);
	}});

	//
	(function()
	{
		for(var idx in ansi.stream)
		{
			const stream = idx;

			Object.defineProperty(String.prototype, stream, { get: function()
			{
				return this.color(global['COLOR_' + stream.toUpperCase()], global['COLOR_' + stream.toUpperCase() + '_C_HTML']);
			}});

			Object.defineProperty(String.prototype, stream + 'FG', { get: function()
			{
				return this.color(global['COLOR_' + stream.toUpperCase()], global['COLOR_' + stream.toUpperCase() + '_C_HTML']);
			}});

			Object.defineProperty(String.prototype, stream + 'BG', { get: function()
			{
				return this.color(global['COLOR_' + stream.toUpperCase() + '_C'], global['COLOR_' + stream.toUpperCase()]);
			}});
		}
	})();

	(function()
	{
		Object.defineProperty(String.prototype, 'size', { value: function(_size, _px_suffix = true)
		{
			if(_px_suffix && Number.isInt(_size))
			{
				_size += 'px';
			}
			else if(Number.isNumber(_size))
			{
				_size = _size.toString();
			}
			else if(! String.isString(_size))
			{
				return x('Invalid % argument (expecting % or %)', null, '_size', 'Number', 'String');
			}

			return `<span style="font-size: ${_size};">${this.valueOf()}</span>`;
		}});
	})();

	(function()
	{
		Object.defineProperty(String.prototype, 'none', { get: function()
		{
			return this.valueOf();
		}});

		Object.defineProperty(String.prototype, 'bold', { get: function()
		{
			return ('<b>' + this.valueOf() + '</b>');
		}});

		Object.defineProperty(String.prototype, 'faint', { get: function()
		{
			return ('<small>' + this.valueOf() + '</small>');
			//schwach/matt/undeutlich/..
throw new Error('TODO??? (vs. <small> ;-)');
		}});

		Object.defineProperty(String.prototype, 'italic', { get: function()
		{
			return ('<i>' + this.valueOf() + '</i>');
		}});

		Object.defineProperty(String.prototype, 'underline', { get: function()
		{
			return ('<u>' + this.valueOf() + '</u>');
		}});

		Object.defineProperty(String.prototype, 'slow', { get: function()
		{
			return this.blink;
		}});

		Object.defineProperty(String.prototype, 'fast', { get: function()
		{
			return this.blink;
		}});

		Object.defineProperty(String.prototype, 'blink', { get: function()
		{
			return ('<blink>' + this.valueOf() + '</blink>');
		}});

		Object.defineProperty(String.prototype, 'inverse', { get: function()
		{
throw new Error('TODO');
			return this.valueOf();
		}});

		Object.defineProperty(String.prototype, 'conceal', { get: function()
		{
			return ('<span style="display: none;">' + this.valueOf() + '</span>');
			//verdeckt (hidden passwd inputs, e.g.)
		}});

		Object.defineProperty(String.prototype, 'strike', { get: function()
		{
			return ('<s>' + this.valueOf() + '</s>');
		}});
	})();

	//
	(function()
	{
		Object.defineProperty(String.prototype, 'high', { get: function()
		{
			return this.color(COLOR_HIGH);
		}});

		Object.defineProperty(String.prototype, 'highFG', { get: function()
		{
			return this.high;
		}});

		Object.defineProperty(String.prototype, 'highBG', { get: function()
		{
			return this.color(COLOR_HIGH_C, COLOR_HIGH);
		}});

		Object.defineProperty(String.prototype, 'colorFG', { value: function(_color = false)
		{
			if(typeof _color === 'undefined' || _color === null || _color === false)
			{
				_color = null;
			}
			else if(typeof _color === 'string' && (_color.length === 0 || _color.toLowerCase().startsWith('random')))
			{
				_color = color.random.hex();
			}

			if(! _color)
			{
				return this.valueOf();
			}

			return this.color(_color, false);
		}});

		Object.defineProperty(String.prototype, 'colorBG', { value: function(_color = false)
		{
			if(typeof _color === 'undefined' || _color === null || _color === false)
			{
				_color = null;
			}
			else if(typeof _color === 'string' && (_color.length === 0 || _color.toLowerCase().startsWith('random')))
			{
				_color = color.random.hex();
			}

			if(! _color)
			{
				return this.valueOf();
			}

			return this.color(false, _color);
		}});

		Object.defineProperty(String.prototype, 'color', { value: function(_fg = false, _bg = false)
		{
			if(Array.isArray(_fg))
			{
				if(_fg.length >= 2)
				{
					return this.color.call(this, _fg[0], _fg[1]);
				}
				else if(_fg.length === 1)
				{
					return this.color.call(this, _fg[0], false);
				}
				else
				{
					return x('Color % is too short (expected two colors)', null, 'array');
				}
			}

			if(typeof _fg === 'undefined' || _fg === null || _fg === false)
			{
				_fg = null;
			}
			else if(typeof _fg === 'string' && (_fg.length === 0 || _fg.toLowerCase().startsWith('random')))
			{
				_fg = color.random.hex();
			}

			if(typeof _bg === 'undefined' || _bg === null || _bg === false)
			{
				_bg = null;
			}
			else if(typeof _bg === 'string' && (_bg.length === 0 || _bg.toLowerCase().startsWith('random')))
			{
				_bg = color.random.hex();
			}

			if(! (_fg || _bg))
			{
				return this.valueOf();
			}

			var result = '<span style="';

			if(_fg)
			{
				result += 'color: ' + _fg + ';';
			}

			if(_bg)
			{
				result += 'background-color: ' + _bg + ';';
			}

			return (result + '">' + this.valueOf() + '</span>');
		}});

		(function()
		{
			const variantPrefix = [ '', 'bright' ];
			const variantSuffix = [ '', 'FG', 'BG' ];

			for(var i = 0; i < ansi.colors.length; i++)
			{
				const color = ansi.colors[i];

				if(color.startsWith('bright'))
				{
					continue;
				}

				for(var j = 0; j < variantPrefix.length; j++)
				{
					for(var k = 0; k < variantSuffix.length; k++)
					{
						const key = (variantPrefix[j] === 'bright' ? ('bright' + color[0].toUpperCase() + color.substr(1)) : color) + variantSuffix[k];
						const realColor = (variantPrefix[j] === 'bright' ? ansi.color4.map.bright[color] : ansi.color4.map[color]);
						const fg = (variantSuffix[k] === 'BG' ? null : realColor);
						const bg = (variantSuffix[k] === 'BG' ? realColor : null);

						Object.defineProperty(String.prototype, key, { get: function()
						{
							return this.color(fg, bg);
						}});
					}
				}
			}
		})();
	})();

	//
	return Date.now();
})();

