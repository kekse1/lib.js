__STRING_ANSI = (function()
{
	//
	if(typeof __STRING_ANSI === 'number')
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
	Object.defineProperty(String.prototype, 'ansiHigh', { value: function(_escape_type = 'iso', _escape_all = false)
	{
		if(typeof _escape_all !== 'boolean')
		{
			_escape_all = false;
		}

		if(typeof _escape_type === 'string')
		{
			switch(_escape_type.toLowerCase())
			{
				case 'hex':
					_escape_type = 'escapeHex';
					break;
				case 'c':
					_escape_type = 'escapeC';
					break;
				case 'iso':
					_escape_type = 'escapeISO';
					break;
				case 'ctrl':
					_escape_type = 'escapeCTRL';
					break;
				default:
					_escape_type = null;
					break;
			}
		}
		else
		{
			_escape_type = null;
		}

		if(! _escape_type)
		{
			return x('Invalid % argument (should be one of [ %, %, %, % ])', null, '_escape_type', 'hex', 'c', 'iso', 'ctrl');
		}

		const escape = (_string) => {
			if(_escape_type)
			{
				return _string[_escape_type](false);
			}

			return _string;
		};

		var result = '';
		var open = '';
		var c;

		for(var i = 0; i < this.length; ++i)
		{
			if(open.length > 0)
			{
				open += (c = this.at(i));

				if(c === NUL)
				{
					result += escape(open).high;
					open = '';
				}
			}
			else if(this.at(i) === ESC)
			{
				open = ESC;
			}
			else
			{
				result += (_escape_all ? escape(this.at(i)) : this.at(i));
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'ansiLess', { get: function()
	{
		return ansi.remove(this.valueOf(), false);
	}});

	Object.defineProperty(String.prototype, 'ansiLength', { get: function()
	{
		return ansi.stringLength(this.valueOf());
	}});

	Object.defineProperty(String, 'ansi', { value: function(_type, ... _args)
	{
		return ansi.render(_type, ... _args);
	}});

	Object.defineProperty(String.prototype, 'ansi', { value: function(_type, ... _args)
	{
		return (String.ansi(_type, ... _args) + this.valueOf() + (ESC + '[0m' + NUL));
	}});

	Object.defineProperty(String.prototype, 'ansiIndexOf', { value: function(_search, _offset, _case_sensitive = true)
	{
throw new Error('TODO');
	}});

	Object.defineProperty(String.prototype, 'ansiLastIndexOf', { value: function(_search, _offset, _case_sensitive = true)
	{
throw new Error('TODO');
	}});

	Object.defineProperty(String.prototype, 'ansiIndicesOf', { value: function(_search, _case_sensitive = true)
	{
throw new Error('TODO');
	}});
	
	//
	Object.defineProperty(String.prototype, 'ansiSubstr', { value: function(_start, _length)
	{
		const textLength = this.ansiLength;

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
		var open = false;
		var start = 0;
		var realStart = null;

		for(var i = 0; i < this.length; ++i)
		{
			if(open)
			{
				result += this.at(i);

				if(this.at(i) === NUL)
				{
					open = false;
				}
			}
			else if(this.at(i) === ESC)
			{
				result += this.at(i);
				open = true;
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

		var rest = null;

		for(var i = realStart, j = 0; i < this.length; ++i)
		{
			if(open)
			{
				result += this.at(i);

				if(this.at(i) === NUL)
				{
					open = false;
				}
			}
			else if(this.at(i) === ESC)
			{
				result += this.at(i);
				open = true;
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
	
	Object.defineProperty(String.prototype, 'ansiSubstring', { value: function(_start, _stop)
	{
		return this.ansiSubstr(_start, _stop - _start);
	}});

	//
	//TODO/reguläre string-implementation sollte sich darum schon gut kümmern.. eh?! ^_^
	Object.defineProperty(String.prototype, 'ansiAt', { value: function(_offset, _needle, _case_sensitive = true)
	{
		const textLength = this.ansiLength;

		if(! Number.isNumber(_offset))
		{
			return x('Invalid _offset (expecting -/+ Integer)');
		}
		else if(_offset < 0)
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
				if(this[i] === NUL)
				{
					open = false;
				}
			}
			else if(this[i] === ESC)
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
						var subOpen = open;
						var sub = '';

						for(var k = i; k < this.length; k++)
						{
							if(subOpen)
							{
								if(this[k] === NUL)
								{
									subOpen = false;
								}
							}
							else if(this[k] === ESC)
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
	if(typeof __STRING_ANSI === 'number' || typeof __STRING_HTML === 'number')
	{
		return Date.now();
	}

	//
	Object.defineProperty(String.prototype, 'size', { value: function()
	{
		return this.valueOf();
	}});

	Object.defineProperty(String.prototype, 'none', { get: function()
	{
		return (ESC + '[0m' + NUL + this.valueOf());
	}});

	//
	Object.defineProperty(String.prototype, 'rainbow', { value: function(_force = false, _2nd_color = false)
	{
		return ansi.rainbow(this.valueOf(), _force, _2nd_color);
	}});

	Object.defineProperty(String.prototype, 'rainbowFG', { value: function(_force = false, _2nd_color = false)
	{
		return ansi.rainbow.fg(this.valueOf(), _force, _2nd_color);
	}});

	Object.defineProperty(String.prototype, 'rainbowBG', { value: function(_force = false, _2nd_color = false)
	{
		return ansi.rainbow.bg(this.valueOf(), _force, _2nd_color);
	}});

	Object.defineProperty(String.prototype, 'colorize', { value: function(_force = false, _2nd_color = false)
	{
		return ansi.colorize(this.valueOf(), _force, _2nd_color);
	}});

	Object.defineProperty(String.prototype, 'colorizeFG', { value: function(_force = false, _2nd_color = false)
	{
		return ansi.colorize.fg(this.valueOf(), _force, _2nd_color);
	}});

	Object.defineProperty(String.prototype, 'colorizeBG', { value: function(_force = false, _2nd_color = false)
	{
		return ansi.colorize.bg(this.valueOf(), _force, _2nd_color);
	}});

	Object.defineProperty(String.prototype, 'randomColor', { value: function(_fg = true, _bg = false)
	{
		if(_fg === true)
		{
			_fg = color();
		}
		else if(typeof _fg === 'number')
		{
			_fg = color('random' + _fg);
		}
		else if(typeof _fg === 'string')
		{
			_fg = color(_fg);
		}
		else
		{
			_fg = null;
		}

		if(_bg === true)
		{
			_bg = color();
		}
		else if(typeof _bg === 'number')
		{
			_bg = color('random' + _bg);
		}
		else if(typeof _bg === 'string')
		{
			_bg = color(_bg);
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

	Object.defineProperty(String.prototype, 'randomGray', { value: function(_fg = true, _bg = false)
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
		for(var i = 0; i < ansi.styles.length; i++)
		{
			const style = ansi.styles[i];

			Object.defineProperty(String.prototype, style, { get: function()
			{
				return ansi.style[style](this.valueOf(), null, true);
			}});
		}
	})();

	(function()
	{
		(function()
		{
			for(var idx in ansi.stream)
			{
				const stream = idx;

				Object.defineProperty(String.prototype, stream, { get: function()
				{
					return ansi.stream[stream](this.valueOf(), null, true);
				}});

				Object.defineProperty(String.prototype, stream + 'FG', { get: function()
				{
					return ansi.stream[stream].fg(this.valueOf(), null, true);
				}});

				Object.defineProperty(String.prototype, stream + 'BG', { get: function()
				{
					return ansi.stream[stream].bg(this.valueOf(), null, true);
				}});
			}
		})();

		//
		Object.defineProperty(String.prototype, 'high', { get: function()
		{
			return ansi.high(this.valueOf(), null, true);
		}});

		Object.defineProperty(String.prototype, 'highFG', { get: function()
		{
			return ansi.high.fg(this.valueOf(), null, true);
		}});

		Object.defineProperty(String.prototype, 'highBG', { get: function()
		{
			return ansi.high.bg(this.valueOf(), null, true);
		}});

		Object.defineProperty(String.prototype, 'colorFG', { value: function(_color = false, _end = true)
		{
			return this.color(_color, false, _end);
		}});

		Object.defineProperty(String.prototype, 'colorBG', { value: function(_color = false, _end = true)
		{
			return this.color(false, _color, _end);
		}});
		
		Object.defineProperty(String.prototype, 'color', { value: function(_fg = false, _bg = false, _end = true)
		{
			if(! ansi.isColor(_fg))
			{
				_fg = false;
			}

			if(! ansi.isColor(_bg))
			{
				_bg = false;
			}

			if(! (_fg || _bg))
			{
				return this.valueOf();
			}

			return ansi.color(_fg, _bg, this.valueOf(), _end);
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
						const func = (variantPrefix[j] === 'bright'
							? (variantSuffix[k] === ''
								? ansi[color].bright
							 	: (variantSuffix[k] === 'FG'
									? ansi[color].bright.fg
									: ansi[color].bright.bg))
							: (variantSuffix[k] === ''
								? ansi[color]
								: (variantSuffix[k] === 'FG'
									? ansi[color].fg
									: ansi[color].bg)));

						Object.defineProperty(String.prototype, key, { get: function()
						{
							return func(this.valueOf(), null, true);
						}});
					}
				}
			}
		})();
	})();

	//
	return Date.now();
})();

