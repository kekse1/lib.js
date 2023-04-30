(function()
{

	//
	const DEFAULT_PAD = ' ';//'˞';

	const DEFAULT_FORMAT_EMPTY_REPLACEMENT = false;//better leave (false) to originally show '%' after all _args..! :-) @ String.print{,f}();

	const DEFAULT_REPLACE_DOTS = true;//from '...' to '…' @ .toText().. ;-)
	const DEFAULT_REPLACE_TABS = true;//it's gooda! SHOULD NOT BE CHANGED .. FOR CLEAR (console) OUTPUT!! ;-)

	const DEFAULT_OWN_HASH_SIZE = 8;
	const DEFAULT_OWN_HASH_MOVE = false;
	const DEFAULT_OWN_HASH_INC = true;
	const DEFAULT_OWN_HASH_XOR = true;
	const DEFAULT_OWN_HASH_EXTEND = null;
	const DEFAULT_OWN_HASH_RADIX = null;
	const DEFAULT_OWN_HASH_ROUNDS = 128;

	const DEFAULT_RADIX = 10;

	const DEFAULT_RENDER_NULL = 'null';
	const DEFAULT_RENDER_UNDEFINED = 'undefined';
	const DEFAULT_RENDER_TYPEOF = false;
	const DEFAULT_RENDER_FRACTION = false;
	const DEFAULT_RENDER_QUOTE = true;
	const DEFAULT_RENDER_BIGINT = true;
	const DEFAULT_RENDER_ESCAPE = null;//'c';
	const DEFAULT_RENDER_SUBTRACT = false;
	const DEFAULT_RENDER_FALLBACKS = true;
	const DEFAULT_RENDER_PREFER_TO_TEXT_FALLBACK = true;
	const DEFAULT_RENDER_COLOR_OBJECT_INDICES_AS_NUMBER = false;
	const DEFAULT_RENDER_TRUE = 'yes';
	const DEFAULT_RENDER_FALSE = 'no';
	const DEFAULT_RENDER_ENCODING = 'utf8';
	const DEFAULT_RENDER_ENCODING_BEFORE_RADIX = false;
	const DEFAULT_RENDER_TEXT_RADIX = false;
	const DEFAULT_RENDER_REGEXP_MODIFIER_COLOR = true;

	const DEFAULT_PARSE_ZERO = '';
	const DEFAULT_PARSE_UNESCAPE_HEX = true;
	const DEFAULT_PARSE_UNESCAPE_CTRL = true;
	const DEFAULT_PARSE_UNESCAPE_ISO = true;
	const DEFAULT_PARSE_UNESCAPE_C = true;

	const DEFAULT_AUTO_CORRECT = true;

	const DEFAULT_QUOTE_ESCAPE = true;

	const DEFAULT_PRINT_F_FUNCTION_CALL = false;//if(true), a function argument will be called before using it's result.. (default = false!);

	const DEFAULT_TO_TEXT_THROW = true;
	const DEFAULT_TO_TEXT_LIMIT_WIDTH_TO_CONSOLE = true;
	const DEFAULT_SPACE_LEFT = 0;
	const DEFAULT_SPACE_RIGHT = 0;

	const DEFAULT_ALIGN = null;
	const DEFAULT_ALIGN_FILL = true;
	const DEFAULT_ALIGN_VERTICAL = null;

	const DEFAULT_OVERWRITE_OVER_LENGTH = false;
	const DEFAULT_OVERWRITE_TRANSPARENCY = 0;

	const DEFAULT_HASH_HASH_BROWSER = 'sha-512';
	const DEFAULT_HASH_HASH = 'sha3-512';
	const DEFAULT_HASH_DIGEST = 'hex';

	const DEFAULT_COUNT_MULTIPLY = true;

	const DEFAULT_UNICODE = true;

	const DEFAULT_COUNT_ONCE = false;

	//
	Object.defineProperty(String.prototype, 'isUpperCase', { get: function()
	{
		return (this.valueOf() === this.toUpperCase());
	}});

	Object.defineProperty(String.prototype, 'isLowerCase', { get: function()
	{
		return (this.valueOf() === this.toLowerCase());
	}});

	Object.defineProperty(String.prototype, 'oneCase', { get: function()
	{
		if(this.length === 0)
		{
			return null;
		}
		else if(this.isLowerCase || this.isUpperCase)
		{
			return true;
		}

		return false;
	}});

	//
	const _toLowerCase = String.prototype.toLowerCase;
	const _toUpperCase = String.prototype.toUpperCase;

	const toCase = (_string, _type, _ansi = false, _xml = false) => {
		const convert = (_char, _type) => {
			if(_type === null)
			{
				return convert(_char, Math.random.bool(false));
			}
			else if(_type)
			{
				return _toUpperCase.call(_char);
			}
			else
			{
				return _toLowerCase.call(_char);
			}
		};

		//
		if(typeof _ansi === 'object' && _ansi !== null)
		{
			_xml = (_ansi.xml === true);
			_ansi = (_ansi.ansi === true);
		}
		else
		{
			_xml = (_xml === true);
			_ansi = (_ansi === true);
		}

		//
		var result = '';
		var open = false;

		for(var i = 0; i < _string.length; i++)
		{
			if(open)
			{
				if(_string[i] === open)
				{
					open = false;
				}

				result += _string[i];
			}
			else
			{
				if(_ansi && _string[i] === ESC)
				{
					open = NUL;
				}
				else if(_xml && _string[i] === '<')
				{
					open = '>';
				}
				else if(_xml && _string[i] === '&')
				{
					open = ';';
				}

				if(open)
				{
					result += _string[i];
				}
				else
				{
					result += convert(_string[i], _type);
				}
			}
		}

		return result;
	};

	Object.defineProperty(String.prototype, 'toRandomCase', { value: function(_ansi = false, _xml = false)
	{
		return toCase(this.valueOf(), null, _ansi, _xml);
	}});

	Object.defineProperty(String.prototype, 'toLowerCase', { value: function(_ansi = false, _xml = false)
	{
		return toCase(this.valueOf(), false, _ansi, _xml);
	}});

	Object.defineProperty(String.prototype, 'toUpperCase', { value: function(_ansi = false, _xml = false)
	{
		return toCase(this.valueOf(), true, _ansi, _xml);
	}});

	//
	Object.defineProperty(String.prototype, 'unicodeLength', { get: function()
	{
		return [...this.valueOf()].length;
	}});

	//
	Object.defineProperty(String.prototype, 'divide', { value: function(_div = 1, _offset = 0)
	{
		if(! Number.isInt(_div))
		{
			_div = 1;
		}
		else if(_div === 0)
		{
			return x('Divide value needs to be non-zero');
		}
		else if(_div < 0)
		{
			return x('TODO');
		}

		_offset = this.getIndex(_offset);

		const result = [];

		for(var i = _offset, j = 0; i < this.length; i += _div, j++)
		{
			result[j] = this.substr(i, _div);
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'modulo', { value: function(_mod = 2, _count = 1, _offset = 0)
	{
		if(! Number.isInt(_count))
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return x('Invalid _count value.. needs to be non-zero');
		}

		const result = Array.fill(_mod, ['']);

		for(var x = _offset, t = 0; x < this.length;)
		{
			for(var y = 0; y < _mod; t++)
			{
				for(var z = 0; z < _count; z++, y++, x++)
				{
					if(x < this.length)
					{
						result[t % _mod] += this[x];
					}
					else
					{
						return result;
					}
				}
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'getUnicodeLength', { value: function(_length, _offset = 0)
	{
		return getLength(_length, this.unicodeLength, _offset);
	}});

	Object.defineProperty(String.prototype, 'getLength', { value: function(_length, _offset = 0)
	{
		return getLength(_length, this.length, _offset);
	}});

	Object.defineProperty(String.prototype, 'getComplexLength', { value: function(_length, _offset = 0)
	{
		return getLength(_length, this.textLength, _offset);
	}});

	//
	function testComplex(_complex, _item, _this, _undefined = undefined)
	{
		if(! _complex)
		{
			return _undefined;
		}
		else if(_complex === true)
		{
			_complex = (BROWSER ? 'html' : 'ansi');
		}
		else if(typeof _complex !== 'string')
		{
			return _undefined;
		}
		else
		{
			_complex = _complex.toLowerCase();
		}

		if(String.isString(_item))
		{
			_item = (_complex + _item);
		}
		else
		{
			return x('Invalid % argument (not a %)', null, '_item', 'String');
		}

		if(typeof _this === 'object' && typeof _this.valueOf() === 'string')
		{
			_this = _this.valueOf();
		}
		else if(typeof _this !== 'string')
		{
			return x('Invalid % argument (expecting a % object instance)', null, '_this', 'String');
		}

		if(typeof __STRING_ANSI !== 'number' && typeof __STRING_HTML !== 'number')
		{
			require('ext/string/' + (BROWSER ? 'html' : 'ansi'));
		}

		if(typeof global['__STRING_' + _complex.toUpperCase()] === 'undefined')
		{
			try
			{
				require('ext/string/' + _complex);

				if(typeof global['__STRING_' + _complex.toUpperCase()] === 'undefined')
				{
					global['__STRING_' + _complex.toUpperCase()] = Date.now();
				}
			}
			catch(_error)
			{
				global['__STRING_' + _complex.toUpperCase()] = -Date.now();
			}
		}

		const desc = Object.getOwnPropertyDescriptor(String.prototype, _item);

		if(typeof desc === 'undefined')
		{
			return x('Item \'%\' not available for complex \'%\'', null, _item, _complex);
		}
		else if(typeof desc.get === 'function')
		{
			return desc.get.bind(_this);
		}
		else if(typeof desc.value === 'function')
		{
			return desc.value.bind(_this);
		}

		return desc.value;
	}

	//
	const _substr = String.prototype.substr;
	const _substring = String.prototype.substring;

	Object.defineProperty(String.prototype, 'substr', { value: function(_start, _length, _complex = false)
	{
		const complex = testComplex(_complex, 'Substr', this);

		if(typeof complex === 'function')
		{
			return complex(_start, _length);
		}

		if(Number.isInt(_start))
		{
			if(_start < 0)
			{
				_start = this.length + _start;
			}

			if(_start < 0)
			{
				return '';
			}
			else if(_start >= this.length)
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
			else if((_start + _length) >= this.length)
			{
				_length = this.length - _start;
			}
		}
		else if((_length = (this.length - _start)) <= 0)
		{
			return '';
		}

		return _substr.call(this, _start, _length);
	}});

	Object.defineProperty(String.prototype, 'substring', { value: function(_start, _stop, _complex = false)
	{
		const complex = testComplex(_complex, 'Substring', this);

		if(typeof complex === 'function')
		{
			return complex(_start, _stop);
		}

		return _substring.call(this, _start, _stop);
	}});

	//
	Object.defineProperty(String, 'repeat', { value: function(_amount = 2, _string)
	{
		if(! String.isString(_string))
		{
			if(typeof _string === 'string')
			{
				return '';
			}
			else
			{
				return x('Invalid % argument (not a non-empty %)', null, '_string', 'String');
			}
		}

		if(Number.isNumber(_amount))
		{
			if((_amount = Math.abs(_amount.int)) === 0)
			{
				return '';
			}
		}
		else
		{
			return x('Invalid % argument (expecting a %)', null, '_amount', 'Number');
		}

		//
		var result = '';

		while(_amount-- > 0)
		{
			result += _string;
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'repeat', { value: function(_amount = 2)
	{
		return String.repeat(_amount, this.valueOf());
	}});

	//
	Object.defineProperty(String.prototype, 'has', { value: function(... _args)
	{
		const DEFAULT_CASE_SENSITIVE = false;

		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(! String.isString(_args[i]))
			{
				return x('Invalid %[%] argument (not a non-empty %)', null, '..._args', i, 'String');
			}
			else if(! DEFAULT_CASE_SENSITIVE)
			{
				_args[i] = _args[i].toLowerCase();
			}
		}

		if(this.length === 0)
		{
			return null;
		}

		const string = (DEFAULT_CASE_SENSITIVE ? this.valueOf() : this.toLowerCase());

		for(var i = 0; i < _args.length; ++i)
		{
			if(string.indexOf(_args[i]) === -1)
			{
				return false;
			}
		}

		return true;
	}});

	//
	Object.defineProperty(String.prototype, 'unique', { value: function(_count = 1, _extended_comparison = true)
	{
		//
		if(Number.isInt(_count))
		{
			if(_count === 1)
			{
				_extended_comparison = false;
			}
		}

		if(typeof _extended_comparison !== 'boolean')
		{
			_extended_comparison = true;
		}

		//
		var result = '';
		var sub;

		const exists = (_sub) => {
			if(! _extended_comparison)// || _count === 1)
			{
				return (result.indexOf(_sub) > -1);
			}
			else for(var i = 0; i < result.length; i += _count)
			{
				if(result.substr(i, _count) === _sub)
				{
					return true;
				}
			}

			return false;
		}

		for(var i = 0; i < this.length; i += _count)
		{
			sub = (_count === 1 ? this[i] : this.substr(i, _count));

			if(! exists(sub))
			{
				result += sub;
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'isUnique', { get: function()
	{
		return (this.length === this.unique().length);
	}});

	Object.defineProperty(String.prototype, 'sort', { value: function(_asc = true)
	{
		if(typeof _asc !== 'boolean')
		{
			return x('Invalid % argument (expecting a %)', null, '_asc', 'Boolean');
		}

		const array = new Array(this.length);

		for(var i = 0; i < this.length; i++)
		{
			array[i] = this.charCodeAt(i);
		}

		array.sort(_asc);
		var result = '';

		for(var i = 0; i < array.length; i++)
		{
			result += String.fromCodePoint(array[i]);
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'splice', { value: function(_start, _delete)
	{
		if(typeof _start === 'number')
		{
			_start = this.getIndex(_start);
		}
		else
		{
			_start = 0;
		}

		if(! Number.isInt(_delete))
		{
			_delete = 0;
		}

		var result = this.slice(0, _start);

		for(var i = 2; i < arguments.length; i++)
		{
			if(typeof arguments[i] !== 'string')
			{
				return x('Invalid argument[' + i + '] (not a String)');
			}

			result += arguments[i];
		}

		return (result + this.slice(_start + _delete));
	}});

	Object.defineProperty(String.prototype, 'getUnicodeIndex', { value: function(_index = -1, _length = this.unicodeLength, _return = null, _throw = false)
	{
		return this.getIndex(_index, _length, _return, _throw);
	}});

	Object.defineProperty(String.prototype, 'getNegativeUnicodeIndex', { value: function(_index = -1, _length = this.unicodeLength, _return = null, _throw = false)
	{
		return this.getNegativeIndex(_index, _length, _return, _throw);
	}});

	Object.defineProperty(String.prototype, 'getIndex', { value: function(_index = -1, _length = this.length, _return = null, _throw = false)
	{
		return getIndex(_index, _length, _return, _throw);
	}});

	Object.defineProperty(String.prototype, 'getNegativeIndex', { value: function(_index = -1, _length = this.length, _return = null, _throw = false)
	{
		return getNegativeIndex(_index, _length, _return, _throw);
	}});

	Object.defineProperty(String.prototype, 'getRandomIndex', { value: function(_crypto = CRYPTO)
	{
		return Math.random.int(this.length - 1, 0, _crypto);
	}});

	Object.defineProperty(String.prototype, 'getRandom', { value: function(_count = this.length, _repeat = false, _crypto = CRYPTO)
	{
		if(typeof _crypto !== 'boolean')
		{
			_crypto = CRYPTO;
		}

		if(! Number.isInt(_count))
		{
			_count = this.length;
		}
		else
		{
			_count = Math.abs(_count.int);
		}

		if(_count === 0)
		{
			return '';
		}
		else if(_count === 1)
		{
			return this[this.getRandomIndex(_crypto)];
		}
		else if(typeof _repeat !== 'boolean')
		{
			return x('Invalid % argument (expecting a %)', null, '_repeat', 'Boolean');
		}

		var result = '';

		if(_repeat) while(result.length < _count)
		{
			result += this[this.getRandomIndex(_crypto)];
		}
		else while(result.length < _count)
		{
			var copy = this.valueOf();
			var idx;

			while(copy.length > 0 && result.length < _count)
			{
				result += copy[idx = copy.getRandomIndex(_crypto)];
				copy = copy.substr(0, idx) + copy.substr(idx + 1);
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'reverse', { value: function(... _args)
	{
		if(this.length === 0)
		{
			return this.valueOf();
		}

		return this.split('').reverse(... _args).join('');
	}});

	//
	Object.defineProperty(String.prototype, 'removeFirst', { value: function(_count = 1, ... _args)
	{
		if(! Number.isInt(_count))
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return this.valueOf();
		}

		if(_count >= this.length)
		{
			return '';
		}

		var result;

		if(_args.length > 0)
		{
			//
			for(var i = 0; i < _args.length; i++)
			{
				if(! String.isString(_args[i]))
				{
					return x('The %[%] argument is not a non-empty %', null, '..._args', i, 'String');
				}
			}

			//
			_args.lengthSort(false);

			//
			result = '';
			var found;

			//
			for(var i = 0, j = 0; i < this.length; i++)
			{
				found = 0;

				for(var k = 0; k < _args.length; k++)
				{
					if(this.at(i, _args[k]))
					{
						found = _args[k].length;
						break;
					}
				}

				if(found === 0)
				{
					result += this[i];
				}
				else
				{
					i += (found - 1);

					if(++j >= _count)
					{
						result += this.substr(i + 1);
						break;
					}
				}
			}

			//
			return result;
		}

		result = this.substr(Math.abs(_count));

		if(_count < 0)
		{
			return result.reverse();
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'removeLast', { value: function(_count = 1, ... _args)
	{
		if(! Number.isInt(_count))
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return this.valueOf();
		}

		if(_count >= this.length)
		{
			return '';
		}

		var result;

		if(_args.length > 0)
		{
			//
			for(var i = 0; i < _args.length; i++)
			{
				if(! String.isString(_args[i]))
				{
					return x('The %[%] argument is not a non-empty %', null, '..._args', i, 'String');
				}
				else
				{
					_args[i] = _args[i].reverse();
				}
			}

			//
			return this.reverse().removeFirst(_count, ... _args).reverse();
		}

		result = this.substr(0, this.length - Math.abs(_count));

		if(_count < 0)
		{
			return result.reverse();
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'removeStarting', { value: function(... _args)
	{
		for(var i = _args.length - 1; i >= 0; i--)
		{
			if(typeof _args[i] === 'undefined' || _args[i] === null)
			{
				_args.splice(i, 1);
			}
			else if(! (String.isString(_args[i]) || (Number.isInt(_args[i]) && _args[i] >= 0)))
			{
				return x('Invalid %[%] (expecting only non-empty %s or positive % codepoints)', null, '..._args', i, 'String', 'Integer');
			}
		}

		if(_args.length === 0)
		{
			return this.valueOf();
		}

		return this.removeFirst(this.startsWith.apply(this, _args));
	}});

	Object.defineProperty(String.prototype, 'removeEnding', { value: function(... _args)
	{
		for(var i = _args.length - 1; i >= 0; i--)
		{
			if(typeof _args[i] === 'undefined' || _args[i] === null)
			{
				_args.splice(i, 1);
			}
			else if(! (String.isString(_args[i]) || (Number.isInt(_args[i]) && _args[i] >= 0)))
			{
				return x('Invalid %[%] (expecting only non-empty %s or positive % codepoints)', null, '..._args', i, 'String', 'Integer');
			}
		}

		if(_args.length === 0)
		{
			return this.valueOf();
		}

		return this.removeLast(this.endsWith.apply(this, _args));
	}});

	Object.defineProperty(String.prototype, 'startsWith', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return 0;
		}
		else for(var i = _args.length - 1; i >= 0; i--)
		{
			if(typeof _args[i] === 'undefined' || _args[i] === null)
			{
				_args.splice(i, 1);
			}
			else if(typeof _args[i] === 'string')
			{
				if(_args[i].length === 0)
				{
					return this.length;
				}
			}
			else if(! Number.isInt(_args[i]))
			{
				return x('Invalid %[%] (not a non-empty % or an % codepoint)', null, '..._args', i, 'String', 'Integer');
			}
		}

		if(_args.length === 0)
		{
			return 0;
		}
		else if(typeof Array.prototype.lengthSort === 'function')
		{
			_args.lengthSort(false);
		}

		var result = 0;
		var found;

		for(var i = 0; i < this.length; i++)
		{
			found = 0;

			for(var j = 0; j < _args.length; j++)
			{
				if(typeof _args[j] === 'string')
				{
					if(this.at(i, _args[j]))
					{
						found = _args[j].length;
						break;
					}
				}
				else if(this.codePointAt(i) === _args[j])
				{
					found = 1;
					break;
				}
				else if(this.charCodeAt(i) === _args[j])
				{
					found = 1;
					break;
				}
			}

			if(found > 0)
			{
				result += found;

				if(DEFAULT_COUNT_ONCE)
				{
					i += (found - 1);
				}
			}
			else
			{
				break;
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'endsWith', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return 0;
		}
		else for(var i = _args.length - 1; i >= 0; i--)
		{
			if(typeof _args[i] === 'undefined' || _args[i] === null)
			{
				_args.splice(i, 1);
			}
			else if(typeof _args[i] === 'string')
			{
				if(_args[i].length === 0)
				{
					return this.length;
				}
			}
			else if(! Number.isInt(_args[i]))
			{
				return x('Invalid %[%] (not a non-empty % or an % codepoint)', null, '..._args', i, 'String', 'Integer');
			}
		}

		if(_args.length === 0)
		{
			return 0;
		}
		else if(typeof Array.prototype.lengthSort === 'function')
		{
			_args.lengthSort(false);
		}

		var result = 0;
		var found;

		for(var i = this.length - 1; i >= 0; --i)
		{
			found = 0;

			for(var j = 0; j < _args.length; j++)
			{
				if(typeof _args[j] === 'string')
				{
					if(this.at(i - _args[j].length + 1, _args[j]))
					{
						found = _args[j].length;
						break;
					}
				}
				else if(this.codePointAt(i) === _args[j])
				{
					found = 1;
					break;
				}
				else if(this.charCodeAt(i) === _args[j])
				{
					found = 1;
					break;
				}
			}

			if(found > 0)
			{
				result += found;

				if(DEFAULT_COUNT_ONCE)
				{
					i -= (found - 1);
				}
			}
			else
			{
				break;
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'toBase64', { value: function(_buffered = false, _pad = true)
	{
		if(typeof btoa === 'function')
		{
			try
			{
				return btoa(String.fromCodePoint(... this.toUint8Array()));
			}
			catch(_error)
			{
				try
				{
					return btoa(String.fromCodePoint(... this.toUint8Array()));
				}
				catch(_error)
				{
					//
				}
			}
		}
		else if(_buffered && typeof Buffer !== 'undefined')
		{
			return Buffer.from(this.valueOf()).toString('base64');
		}

		//
		const alpha = alphabet.base64;
		const str = this.valueOf();
		var sub;
		var bits = '';
		var result = '';

		for(var i = 0, j = 0; i < str.length; ++i)
		{
			bits += str.charCodeAt(i).toString(2).padStart(8, '0');
		}

		while(bits.length > 0)
		{
			sub = bits.first(6);
			bits = bits.removeFirst(6);

			if(bits.length <= 12)
			{
				alert(sub + ' // ' + bits);
			}
//alert(sub + ' => ' + parseInt(sub, 2));
			result += alpha[parseInt(sub, 2)];
		}

		alert(result);
		return result;
	}});

	Object.defineProperty(String.prototype, 'fromBase64', { value: function(_buffered = false)
	{
		if(typeof atob === 'function')
		{
			return atob(this.valueOf());
			//return atob(String.fromCodePoint(... this.valueOf()));
		}
		else if(_buffered && typeof Buffer !== 'undefined')
		{
			return Buffer.from(this.valueOf(), 'base64').toString();
		}

throw new Error('TODO');
		/*
		 */
	}});

	Object.defineProperty(String.prototype, 'toHex', { value: function(_buffered = false)
	{
		if(_buffered && typeof Buffer !== 'undefined')
		{
			return Buffer.from(this.valueOf()).toString('hex');
		}

		return this.toRadix(16);
	}});

	Object.defineProperty(String.prototype, 'fromHex', { value: function(_buffered = false)
	{
		if(_buffered && typeof Buffer !== 'undefined')
		{
			return Buffer.from(this.valueOf(), 'hex').toString();
		}

		return this.fromRadix(16);
	}});

	//
	Object.defineProperty(String.prototype, 'first', { value: function(_count = 1)
	{
		if(! Number.isInt(_count))
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return '';
		}

		const result = this.substr(0, Math.abs(_count));

		if(_count < 0)
		{
			return result.reverse();
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'last', { value: function(_count = 1)
	{
		if(! Number.isInt(_count))
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return '';
		}

		const result = this.substr(this.length - Math.abs(_count));

		if(_count < 0)
		{
			return result.reverse();
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'textLength', { get: function()
	{
		if(BROWSER && ('htmlLength' in String.prototype))
		{
			return this.htmlLength;
		}
		else if(!BROWSER && ('ansiLength' in String.prototype))
		{
			return this.ansiLength;
		}

		return this.length;
	}});

	Object.defineProperty(String.prototype, 'less', { get: function()
	{
		if(BROWSER && ('htmlLess' in String.prototype))
		{
			return this.htmlLess;
		}
		else if(!BROWSER && ('ansiLess' in String.prototype))
		{
			return this.ansiLess;
		}

		return this.valueOf();
	}});

	Object.defineProperty(String.prototype, 'LESS', { get: function()
	{
		var result = '';
		var open = '';

		for(var i = 0; i < this.length; ++i)
		{
			if(open.length > 0)
			{
				if(open === this[i])
				{
					open = '';
				}
			}
			else if(this[i] === '\\')
			{
				if(i < (this.length - 1))
				{
					switch(this[i + 1])
					{
						case ESC:
						case '<':
						case '>':
						case '&':
						case ';':
						case NUL:
							result += this[++i];
							break
						default:
							result += this[i];
							break;
					}
				}
				else
				{
					result += this[i];
				}
			}
			else if(this[i] === ESC)
			{
				open = NUL;
			}
			else if(this[i] === '<')
			{
				open = '>';
			}
			else if(this[i] === '&')
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

	//
	Object.defineProperty(String, 'fill', { value: function(_length = 1, _pad = DEFAULT_PAD, _length_min = 1)
	{
		if(! Number.isInt(_length))
		{
			return x('Invalid % argument (not an %)', null, '_length', 'Integer');
		}
		else if(_length < 0)
		{
			if(! Number.isInt(_length_min))
			{
				return x('Invalid % argument (not an %)', null, '_length_min', 'Integer');
			}

			_length = Math.random.int(-_length, Math.abs(_length_min));
		}

		if(! String.isString(_pad))
		{
			return x('Invalid % argument (not a non-empty %)', null, '_pad', 'String');
		}

		var result = '';

		for(var i = 0, j = 0; i < _length; i++, j = (j + 1) % _pad.length)
		{
			result += _pad[j];
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'isEOL', { value: function(_index, _xml = BROWSER)
	{
		if(Number.isInt(_index))
		{
			_index = this.getIndex(_index);
		}
		else
		{
			_index = 0;
		}

		if(this[_index] === '\n')
		{
			if(_index < (this.length - 1) && this[_index + 1] === '\r')
			{
				return '\n\r';
			}

			return '\n';
		}
		else if(this[_index] === '\r')
		{
			if(_index < (this.length - 1) && this[_index + 1] === '\n')
			{
				return '\r\n';
			}

			return '\r';
		}
		else if(_xml)
		{
			if(this.at(_index, '<br />'))
			{
				return '<br />';
			}
			else if(this.at(_index, '<br>'))
			{
				return '<br>';
			}
		}

		return '';
	}});

	//
	Object.defineProperty(String.prototype, 'switch', { value: function(_a, _b)
	{
		if(typeof _a !== 'string' || _a.length === 0)
		{
			return x('Both arguments need to be non-empty Strings');
		}
		else if(typeof _b !== 'string' || _b.length === 0)
		{
			return x('Both arguments need to be non-empty Strings');
		}

		var result = '';

		for(var i = 0; i < this.length; i++)
		{
			if(this.substr(i, _a.length) === _a)
			{
				result += _b;
			}
			else if(this.substr(i, _b.length) === _b)
			{
				result += _a;
			}
			else
			{
				result += this[i];
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'toRadix', { value: function(_radix = DEFAULT_RADIX)
	{
		if(this.length === 0)
		{
			return '';
		}
		else if(typeof BigInt === 'undefined')
		{
			return x('TODO');
		}

		const result = parseBigInt(this.valueOf(), 256);

		if(result === null)
		{
			return null;
		}

		return result.toString(_radix);
	}});

	Object.defineProperty(String.prototype, 'fromRadix', { value: function(_radix = DEFAULT_RADIX)
	{
		if(this.length === 0)
		{
			return '';
		}
		else if(typeof BigInt === 'undefined')
		{
			return x('TODO');
		}

		const result = parseBigInt(this.valueOf(), _radix);

		if(result === null)
		{
			return null;
		}

		return result.toString(256);
	}});

	//
	Object.defineProperty(String.prototype, 'isLetter', { value: function(_offset = 0, _lower = true, _upper = true)
	{
		if(this.length === 0)
		{
			return null;
		}
		else if(typeof _offset === 'number')
		{
			_offset = this.getIndex(_offset);
		}
		else
		{
			return x('Invalid _offset (expecting Integer)');
		}

		//
		var alpha = '';

		if(_lower)
		{
			alpha += alphabet.LOWER;
		}

		if(_upper)
		{
			alpha += alphabet.UPPER;
		}

		if(alpha.length === 0)
		{
			return x('Either _lower or _upper or both are necessary (Boolean) arguments');
		}

		if(alpha.indexOf(this[_offset]) === -1)
		{
			return false;
		}

		return true;
	}});

	Object.defineProperty(String.prototype, 'areLetters', { value: function(_lower = true, _upper = true)
	{
		if(this.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < this.length; i++)
		{
			if(! this.isLetter(i, _lower, _upper))
			{
				return false;
			}
		}

		return true;
	}});

	//
	Object.defineProperty(String.prototype, 'isRegExp', { value: function()//_explicit = true)
	{
		if(true)//_explicit)
		{
			const modifier = RegExp.modifier;

			if(this.length < 2)
			{
				return false;
			}

			if(this[0] !== '/')
			{
				return false;
			}

			var slashes = 0;
			var mods = 0;

			for(var i = 1; i < this.length; i++)
			{
				if(this[i] === '\\')
				{
					if(i < (this.length - 1) && this[i + 1] === '/')
					{
						i++;
					}
				}
				else if(this[i] === '/')
				{
					if(++slashes > 2)
					{
						return false;
					}
				}
				else if(slashes === 2)
				{
					if(modifier.indexOf(this[i]) === -1)
					{
						return false;
					}
					else if(++mods > modifier.length)
					{
						return false;
					}
				}
			}
		}

		try
		{
			RegExp.parse(this.valueOf());
		}
		catch(_error)
		{
			return false;
		}

		return true;
	}});

	//
	Object.defineProperty(String.prototype, 'unescapeAll', { value: function(_hex = true)
	{
		var result = this.valueOf();

		if(_hex)
		{
			result = result.unescapeHex();
		}

		result = result.unescapeCTRL();
		result = result.unescapeISO();
		result = result.unescapeC();

		return result;
	}});

	//
	Object.defineProperty(String, 'parse', { value: function(_item, _radix = DEFAULT_RADIX, _zero = DEFAULT_PARSE_ZERO)
	{
		if(typeof _item !== 'string')
		{
			return _item;
		}

		const options = {};

		if(Object.isObject(_radix))
		{
			options.merge(_radix);
		}
		else if(isRadix(_radix))
		{
			options.radix = _radix;
		}

		if(Object.isObject(_zero))
		{
			options.merge(_zero);
		}
		else
		{
			options.zero = _zero;
		}

		if(typeof options.radix !== 'number')
		{
			options.radix = DEFAULT_RADIX;
		}

		if('language' in options)
		{
			options.lang = options.language;
			delete options.language;
		}

		if(options.lang !== null && typeof options.lang !== 'string')
		{
			options.lang = LANGUAGE;
		}

		if(! ('zero' in options))
		{
			options.zero = DEFAULT_PARSE_ZERO;
		}

		if(typeof options.unescapeHex !== 'boolean')
		{
			if(typeof options.unescape === 'boolean')
			{
				options.unescapeHex = options.unescape;
			}
			else
			{
				options.unescapeHex = DEFAULT_PARSE_UNESCAPE_HEX;
			}
		}

		if(typeof options.unescapeCTRL !== 'boolean')
		{
			if(typeof options.unescape === 'boolean')
			{
				options.unescapeCTRL = options.unescape;
			}
			else
			{
				options.unescapeCTRL = DEFAULT_PARSE_UNESCAPE_CTRL;
			}
		}

		if(typeof options.unescapeISO !== 'boolean')
		{
			if(typeof options.unescape === 'boolean')
			{
				options.unescapeISO = options.unescape;
			}
			else
			{
				options.unescapeISO = DEFAULT_PARSE_UNESCAPE_ISO;
			}
		}

		if(typeof options.unescapeC !== 'boolean')
		{
			if(typeof options.unescape === 'boolean')
			{
				options.unescapeC = options.unescape;
			}
			else
			{
				options.unescapeC = DEFAULT_PARSE_UNESCAPE_C;
			}
		}

		//
		if(_item.length === 0)
		{
			return options.zero;
		}

		//
		if(_item.isNumber(options.radix))
		{
			return parseNumber(_item, options.radix);
		}
		else if(typeof BigInt !== 'undefined' && _item.isBigInt(options.radix))
		{
			return parseBigInt(_item, options.lang);
		}
		else if(_item.isLocaleNumber(options.lang))
		{
			return parseLocaleNumber(_item, options.lang);
		}
		else if(typeof BigInt !== 'undefined' && _item.isLocaleBigInt(options.lang))
		{
			return parseLocaleBigInt(_item, options.lang);
		}
		else if(_item.isRegExp())
		{
			return RegExp.parse(_item);
		}

		//
		const lower = _item.toLowerCase();

		switch(lower)
		{
			case 'null':
			case '(null)':
				return null;
			case 'undefined':
			case '(undefined)':
				return undefined;
			case 'true':
			case '(true)':
			case 'yes':
			case '(yes)':
			case 'on':
			case '(on)':
			case 'enabled':
			case '(enabled)':
				return true;
			case 'false':
			case '(false)':
			case 'no':
			case '(no)':
			case 'off':
			case '(off)':
			case 'disabled':
			case '(disabled)':
				return false;
			case 'infinity':
			case '(infinity)':
				return Infinity;
			case 'nan':
			case '(nan)':
				return NaN;
		}

		//
		if(options.unescapeHex)
		{
			_item = _item.unescapeHex();
		}

		if(options.unescapeCTRL)
		{
			_item = _item.unescapeCTRL();
		}

		if(options.unescapeISO)
		{
			_item = _item.unescapeISO();
		}

		if(options.unescapeC)
		{
			_item = _item.unescapeC();
		}

		//
		return _item;
	}});

	Object.defineProperty(global, 'parse', { value: String.parse });

	Object.defineProperty(String, 'render', { value: function(_item, _options, _more)
	{
		//
		var explicitRadix = null;
		var explicitEncoding = null;

		//
		const options = Object.assign(_options);

		if(typeof isRadix === 'function')
		{
			if(isRadix(options.radix))
			{
				if('radix' in options)
				{
					explicitRadix = true;
				}
				else
				{
					explicitRadix = false;
				}
			}
			else
			{
				explicitRadix = false;

				if(isRadix(_options))
				{
					options.radix = _options;
				}
				else
				{
					options.radix = DEFAULT_RADIX;
				}
			}
		}
		else
		{
			explicitRadix = false;
			options.radix = DEFAULT_RADIX;
		}

		if(typeof String.isEncoding === 'function')
		{
			if(String.isEncoding(options.encoding))
			{
				if('encoding' in options)
				{
					explicitEncoding = true;
				}
				else
				{
					explicitEncoding = false;
				}
			}
			else
			{
				explicitEncoding = false;
				options.encoding = DEFAULT_RENDER_ENCODING;
			}
		}
		else
		{
			explicitEncoding = false;
			options.encoding = DEFAULT_RENDER_ENCODING;
		}

		if(typeof options.textRadix !== 'boolean')
		{
			options.textRadix = DEFAULT_RENDER_TEXT_RADIX;
		}

		if(! options.textRadix)
		{
			explicitRadix = false;
		}

		if(typeof options.encodingBeforeRadix !== 'boolean')
		{
			options.encodingBeforeRadix = DEFAULT_RENDER_ENCODING_BEFORE_RADIX;
		}

		if(typeof options.colors !== 'boolean')
		{
			if(typeof _options === 'boolean')
			{
				options.colors = _options;
			}
			else
			{
				options.colors = false;//COLORS;
			}
		}

		if(typeof options.regexpModifierColor !== 'boolean')
		{
			options.regexpModifierColor = DEFAULT_RENDER_REGEXP_MODIFIER_COLOR;
		}

		if(typeof options.fraction !== 'boolean')
		{
			if(typeof _more === 'boolean')
			{
				options.fraction = _more;
			}
			else
			{
				options.fraction = DEFAULT_RENDER_FRACTION;
			}
		}

		if(typeof options.quote === 'undefined' || options.quote === true)
		{
			options.quote = DEFAULT_RENDER_QUOTE;
		}
		else if(options.quote === false)
		{
			options.quote = '';
		}
		else if(typeof options.quote !== 'string')
		{
			options.quote = '';
		}

		if(typeof options.ansi !== 'boolean')
		{
			if(options.ansi = (BROWSER ? false : true))
			{
				if(typeof ansi === 'undefined')
				{
					ansi = require('tty/ansi');
				}
			}
		}

		if(typeof options.toText !== 'boolean')
		{
			options.toText = (options.radix === 10);
		}

		if(typeof options.typeOf !== 'boolean')
		{
			options.typeOf = DEFAULT_RENDER_TYPEOF;
		}

		if(typeof options.precision !== 'number')
		{
			options.precision = null;
		}
		else
		{
			options.precision = options.precision.int;
		}

		if(typeof options.undefined !== 'string')
		{
			options.undefined = DEFAULT_RENDER_UNDEFINED;
		}

		if(typeof options.null !== 'string')
		{
			options.null = DEFAULT_RENDER_NULL;
		}

		if(typeof options.bigint !== 'boolean')
		{
			options.bigint = DEFAULT_RENDER_BIGINT;
		}

		if(typeof options.true !== 'string' || options.true.length === 0)
		{
			options.true = DEFAULT_RENDER_TRUE;
		}

		if(typeof options.false !== 'string' || options.false.length === 0)
		{
			options.false = DEFAULT_RENDER_FALSE;
		}

		if(! String.isString(options.escape))
		{
			options.escape = DEFAULT_RENDER_ESCAPE
		}

		if(String.isString(options.escape))
		{
			switch(options.escape = options.escape.toLowerCase())
			{
				case 'hex':
				case 'escapehex':
					options.escape = 'escapeHex';
					break;
				case 'ctrl':
				case 'escapectrl':
					options.escape = 'escapeCTRL';
					break;
				case 'iso':
				case 'escapeiso':
					options.escape = 'escapeISO';
					break;
				case 'c':
				case 'escapec':
					options.escape = 'escapeC';
					break;
				default:
					options.escape = null;
					break;
			}
		}
		else
		{
			options.escape = null;
		}

		if(typeof options.escapeQuote !== 'boolean')
		{
			options.escapeQuote = DEFAULT_QUOTE_ESCAPE;
		}

		if(typeof options.subtract !== 'boolean')
		{
			options.subtract = DEFAULT_RENDER_SUBTRACT;
		}

		if(typeof options.stringColors !== 'boolean')
		{
			options.stringColors = true;
		}

		//
		const typeOf = Object.typeOf(_item);

		//
		var color;

		if(typeof String.colormap === 'undefined')
		{
			color = null;
		}
		else
		{
			color = String.colormap[typeOf];

			if(typeof ansi === 'undefined')
			{
				require('tty/ansi');
			}
		}

		//
		/*
		const VALUE_OF = false;

		if(VALUE_OF && typeof _item?.valueOf === 'function')
		{
			_item = _item.valueOf();
		}*/

		//
		const _typeOf = () => {
			if(! options.typeOf)
			{
				return '';
			}

			var res = typeOf;

			if(options.colors)
			{
				res = ('(' + res.debug + ')');//.italic;
			}
			else
			{
				res = ('(' + res + ')');
			}

			return res;
		};

		//
		const _color = (_string, ... _args) => {
			if(options.ansi)
			{
				return ansi.color(_args[0], _args[1], _string);
			}
			else if(typeof String.prototype.color === 'function')
			{
				return _string.color(... _args);
			}

			return _string;
		};

		if(typeof String.prototype.color === 'undefined')
		{
			color = [ false, false ];
		}
		else if(options.colors === false)
		{
			color = [ false, false ];
		}
		else if(typeof color === 'undefined' || color === null)
		{
			color = [ false, false ];
		}
		else if(color.length === 1)
		{
			color[1] = false;
		}

		//
		if(typeof _item === 'string')
		{
			if(! options.stringColors)
			{
				color.length = 0;
			}

			if(options.encodingBeforeRadix)
			{
				if(explicitEncoding)
				{
					_item = _item.encode(options.encoding);
				}

				if(explicitRadix)
				{
					_item = _item.toRadix(options.radix);
				}
			}
			else
			{
				if(explicitRadix)
				{
					_item = _item.toRadix(options.radix);
				}

				if(explicitEncoding)
				{
					_item = _item.encode(options.encoding);
				}
			}

			if(options.escape)
			{
				_item = _item[options.escape](options.colors);
			}

			_item = _color(_item, color[0], color[1]);

			//
			return _item.quote(options.quote, options.escapeQuote) + _typeOf();
		}
		else if(typeof _item === 'undefined')
		{
			return _color(options.undefined, color[0], color[1]);
		}
		else if(_item === null)
		{
			return _color(options.null, color[0], color[1]);
		}
		else if(typeof _item === 'number' || typeof _item === 'bigint')
		{
			const isNum = (typeof _item === 'number');
			const isBig = (typeof _item === 'big');

			if(isNum)
			{
				if(_item.isNaN)
				{
					return _color('NaN', color[0], color[1]) + _typeOf();
				}
				else if(_item.isInfinite)
				{
					return _color('Infinity', color[0], color[1]) + _typeOf();
				}
				else
				{
					if(typeof options.precision === 'number' && options.precision >= 0 && _item.isFloat)
					{
						_item = Math.round(_item, options.precision);
					}

					if(options.fraction && _item.isFloat)
					{
						_item = Math.fraction(_item, options.radix);
					}
				}
			}

			if(options.toText && typeof _item.toText === 'function')
			{
				if(typeof _item === 'number')
				{
					_item = _item.toText(null, true);
				}
				else
				{
					_item = _item.toText(null, options.bigint, true);
				}
			}
			else if(isNum)
			{
				_item = _item.toString(options.radix, true);
			}
			else
			{
				_item = _item.toString(options.radix, options.bigint, true);
			}

//
//TODO/!!!
			//"FIXME" ist der wert hier nicht bereits .to{Text|String}()??
			//sollte ich 'cut' noch als .to{Text/String}()-option??
			//jedenfalls gehts um printf() w/ NUMBER-PADDING! ...
			//
			//TODO/!!!!!!!!
			//
			/*try
			{
				if(options.cut === true && typeof options.precision === 'number')
				{
					_item = _item.cut(options.precision);
				}
				else if(typeof options.cut === 'number')
				{
					_item = _item.cut(options.cut);
				}
			}
			catch(_error)
			{
				_error.message = '(TODO) ' + _error.message;
				return x(_error);
			}*/

			var r;

			if(options.colors)
			{
				r = _item.colorizeAs(isNum ? 'Number' : 'BigInt');
			}
			else
			{
				r = _item;
			}

			if(options.typeOf)
			{
				r += '(';

				if(isNum)
				{
					r += (options.colors ? 'Number'.debug : 'Number');
				}
				else
				{
					r += (options.colors ? 'BigInt'.debug : 'BigInt');
				}

				r += ')';
			}

			return r;
		}
		else if(typeof _item === 'boolean')
		{
			return _color(_item.toString(options.false, options.true), color[0], color[1]) + _typeOf();
		}
		else if(typeof _item === 'function')
		{
			var withRealName;
			var text = _item.name;

			if(typeof text === 'string' && text.length > 0)
			{
				withRealName = true;
			}
			else
			{
				text = _item.constructor.name;
				withRealName = false;
			}

			if(withRealName)
			{
				text += '()' + _typeOf();
			}
			else
			{
				text = _color('Function', color[0], color[1]);
			}

			return _color(text, color[0], color[1]);
		}
		else if(Date.isDate(_item))
		{
			const format = (typeof _item.format === 'function' ? _item.format() : _item.getTime());
			return _color(format, color[0], color[1]) + _typeOf();
		}
		else if(RegExp.isRegExp(_item))
		{
			if(! options.regexpModifierColor)
			{
				return _color(_item._toString(), color[0], color[1]) + _typeOf();
			}

			var str = _item._toString();
			var slashes = 0;
			var mod = '';
			var r = '';

			for(var i = 0; i < str.length; ++i)
			{
				if(slashes === 2)
				{
					mod += str[i];
				}
				else if(slashes > 2)
				{
					return _color(_item._toString(), color[0], color[1]) + _typeOf();
				}
				else if(str[i] === '\\')
				{
					if(i < (str.length - 1) && str[i + 1] === '/')
					{
						r += '\\/';
						++i;
					}
					else
					{
						r += '\\';
					}
				}
				else if(str[i] === '/')
				{
					++slashes;
					r += '/';
				}
				else
				{
					r += str[i];
				}
			}

			if(options.colors)
			{
				r = r.colorizeAs('RegExp');

				if(mod.length > 0)
				{
					mod = mod.warn;
				}
			}

			//
			return r + mod + _typeOf();
		}
		else if(Error.isError(_item))
		{
			return _item.toString(options.colors) + _typeOf();
		}
		else if(Object.typeOf(_item) === 'Arguments')
		{
			return (_color('Arguments', color[0], color[1]) + '(' + _item.length.toString(options.radix).colorizeAs('Number').bold + ')');
		}
		else if(Array.isTypedArray(_item))
		{
			var r = _color(typeOf, color[0], color[1]);

			if(options.colors)
			{
				r += '(' + _item.length.toString(options.radix).warn.bold + ')';
			}
			else
			{
				r += '(' + _item.length.toString(options.radix) + ')';
			}

			if(options.typeOf)
			{
				r += '(';

				if(options.colors)
				{
					r += 'TypedArray'.debug;
				}
				else
				{
					r += 'TypedArray';
				}

				r += ')';
			}

			return r;
		}
		else if(typeof _item === 'object')
		{
			//
			var len = Object.LEN(_item);
			var length = Object.LENGTH(_item);

			const zeroLength = (len === 0 && length === 0);
			const isArray = Array.isArray(_item, true);

			if(options.subtract)
			{
				length -= len;
			}

			length = length.toString(options.radix);
			len = len.toString(options.radix);
			var arrLength;

			if(isArray)
			{
				arrLength = _item.length.toString(options.radix);

				if(options.colors)
				{
					arrLength = arrLength.bold;
				}
			}
			else
			{
				arrLength = '';
			}

			if(options.colors)
			{
				if(DEFAULT_RENDER_COLOR_OBJECT_INDICES_AS_NUMBER)
				{
					if(! (zeroLength && isArray))
					{
						length = length.colorizeAs('Number');
						len = len.colorizeAs('Number');
					}

					if(arrLength.length > 0)
					{
						arrLength = arrLength.colorizeAs('Number');
					}
				}
				else
				{
					if(! (zeroLength && isArray))
					{
						length = length.warn;
						len = len.warn;
					}

					if(arrLength.length > 0)
					{
						arrLength = arrLength.warn;
					}
				}
			}

			var lenStr = '(';

			if(arrLength.length > 0)
			{
				lenStr += arrLength;

				if(! (zeroLength && isArray))
				{
					lenStr += '/';
				}
			}

			if(! (zeroLength && isArray))
			{
				lenStr += length + '/' + len;
			}

			lenStr += ')';

			//
			if(Object.isNull(_item))
			{
				return _color('Object', color[0], color[1]) + '[' + (options.colors ? 'null'.info : 'null') + ']' + lenStr;
			}
			else if(Array.isArray(_item))
			{
				return _color('Array', color[0], color[1]) + lenStr;
			}
			else
			{
				return _color('Object', color[0], color[1]) + lenStr;
			}
		}
		else
		{
			var res;

			if(DEFAULT_RENDER_FALLBACKS)
			{
				const possibleRest = [];

				if(DEFAULT_RENDER_PREFER_TO_TEXT_FALLBACK)
				{
					if(typeof _item.toText === 'function')
					{
						possibleRest[0] = _item.toText;
					}

					if(typeof _item.toString === 'function')
					{
						possibleRest.push(_item.toString);
					}
				}
				else
				{
					if(typeof _item.toString === 'function')
					{
						possibleRest[0] = _item.toString;
					}

					if(typeof _item.toText === 'function')
					{
						possibleRest.push(_item.toText);
					}
				}

				const which = new Array(possibleRest.length);

				for(var i = 0; i < possibleRest.length; ++i)
				{
					possibleRest[i] = possibleRest[i].call(_item);
					which[i] = (typeof possibleRest[i] === 'string' ? possibleRest[i].length : 0);
				}

				if(which.length > 0)
				{
					which.lengthSort(false);

					if(which[0] > 0)
					{
						res = possibleRest[0];
					}
				}
				else
				{
					res = null;
				}
			}
			else
			{
				res = null;
			}

			//
			if(String.isString(res))
			{
				return _color(res, color[0], color[1]) + _typeOf();
			}

			//
			res = 'unknown';

			if(options.colors)
			{
				res = res.bold;
			}

			return ('(' + res + ')');
		}

		return x('Unknown object type.. can\'t render it');
	}});

	Object.defineProperty(global, 'render', { value: String.render });

	//
	Object.defineProperty(String.prototype, 'colorizeAs', { value: function(_asType, _recognizeType = true, _throw = true)
	{
		return String.colorizeAs(this.valueOf(), _asType, _recognizeType, _throw);
	}});

	Object.defineProperty(String, 'colorizeAs', { value: function(_item, _asType, _recognizeType = true, _throw = true)
	{
		if(typeof _item !== 'string')
		{
			_item = String.render(_item);
		}
		else if(_item.length === 0)
		{
			return _item;
		}

		if(! ('color' in String.prototype))
		{
			return _item;
		}
		else if(typeof _asType !== 'string')
		{
			if(_recognizeType)
			{
				_asType = Object.typeOf(_asType);
			}
			else
			{
				_asType = null;
			}
		}
		else if(! (_asType in String.colormap))
		{
			if(_recognizeType)
			{
				_asType = 'String';
			}
			else
			{
				_asType = null;
			}
		}

		if(! (_asType in String.colormap))
		{
			_asType = null;
		}

		if(_asType === null)
		{
			if(_throw)
			{
				return x('Invalid _asType parameter');
			}

			return _item;
		}

		const color = String.colormap[_asType];
		return _item.color(color[0], color[1]);
	}});

	Object.defineProperty(String, 'colorize', { value: function(... _items)
	{
		//
		const colorize = (_item) => {
			return String.render(_item, { colors: true });
		};

		//
		if(_items.length === 0)
		{
			return [];
		}
		else if(_items.length === 1)
		{
			return colorize(_items[0]);
		}
		else for(var i = 0; i < _items.length; i++)
		{
			_items[i] = colorize(_items[i]);
		}

		//
		return _items;
	}});

	//
	//TODO/see also 'docs/pdf/printf.pdf'..!! BUT IT'S *NOT* THIS FORMAT..!! xD~
	//
	Object.defineProperty(String, 'printf', { value: function(_format, ... _args)
	{
		//
		const colorMap = String.colormap;

		const findColorMapKey = (_string) => {
			if(typeof colorMap === 'undefined')
			{
				return null;
			}

			if(_string.toLowerCase() === 'integer' || _string.toLowerCase() === 'float')
			{
				_string = 'Number';
			}
			else if(_string.toLowerCase() === 'byte')
			{
				_string = 'Number';
			}
			else if(_string.startsWith('...'))
			{
				_string = 'Array';
			}
			else if(_string.endsWith('[]'))
			{
				_string = 'Array';
			}
			else if(_string.endsWith('{}'))
			{
				_string = 'Object';
			}

			if(_string in colorMap)
			{
				return [ ... colorMap[_string] ];
			}

			return null;
		};

		//
		const color = (_string, _fg, _bg = false) => {
			if(withAnsi)
			{
				return ansi.color(_fg, _bg, _string);
			}

			return _string.color(_fg, _bg);
		};

		const colorize = (_string, _type) => {
			if(! withColors)
			{
				return _string;
			}

			const colors = findColorMapKey(_type);

			if(colors === null)
			{
				return _string;
			}

			return color(_string, colors[0], colors[1]);
		};

		const getNextItem = (_modifier) => {
			//
			if(_args.length === 0)
			{
				return '';
			}

			//
			var item = _args.shift();
			const hasType = (typeof Object.typeOf === 'function');
			const type = (hasType ? Object.typeOf(item) : (typeof item));
			const orig = item;
			const hasModifiers = (typeof _modifier === 'object' && _modifier !== null);
			var int, float, string, radix, cut, localized, localizedNumber;
			var result, isNumeric = false;
			var colorization = null;

			if(hasModifiers)
			{
				int = _modifier.int;
				float = _modifier.float;
				string = _modifier.string;
				radix = _modifier.radix;
				cut = _modifier.cut;
				localized = _modifier.localized;
				localizedNumber = _modifier.localizedNumber;
			}
			else
			{
				int = null;
				float = null;
				string = null;
				radix = null;
				cut = null;
				localized = true;
				localizedNumber = true;
			}

			if(typeof item === 'string')
			{
				if(item.length === 0 && (int === null || int === 0))
				{
					return item;
				}
				else if(withColors && hasType)
				{
					colorization = findColorMapKey(item);
				}
				else
				{
					colorization = null;
				}

				if(radix !== null && localized === true)
				{
					result = item.toRadix(radix);
				}
				else
				{
					result = item;
				}
			}
			else if(isNumber(item) || typeof item === 'bigint')
			{
				isNumeric = true;

				if(float !== null)
				{
					item = Math.round(item, Math.abs(float + 1));
				}

				if(radix === null || radix === 10)
				{
					if(localizedNumber)
					{
						if(float === null)
						{
							result = item.toText();
						}
						else
						{
							result = item.toText(Math.abs(float));
						}
					}
					else
					{
						result = item.toString();
					}
				}
				else
				{
					if(radix === null)
					{
						result = item.toString();
					}
					else
					{
						result = item.toString(radix);
					}
				}

				if(int !== null || float !== null)
				{
					const split = numeric.split(result, false, (localizedNumber ? numeric.getLanguage() : null), true);

					const absInt = (int === null ? null : Math.abs(int));
					const absFloat = (float === null ? null : Math.abs(float));

					if(string === null || string.length === 0)
					{
						string = ' ';
					}

					if(int !== null)
					{
						if(split[0].length < absInt)
						{
							const diff = (absInt - split[0].length);

							if(int < 0)
							{
								split[0] = String.fill(diff, string) + split[0];
							}
							else
							{
								split[0] += String.fill(diff, string);
							}
						}
						else if(cut && split[0].length > absInt)
						{
							if(int < 0)
							{
								split[0] = split[0].substr(split[0].length - absInt);
							}
							else
							{
								split[0] = split[0].substr(0, absInt);
							}
						}
					}

					if(float !== null && split[1].length > 0)
					{
						if(split[1].length < absFloat)
						{
							const diff = (absFloat - split[1].length);

							if(float < 0)
							{
								split[1] = String.fill(diff, string) + split[1];
							}
							else
							{
								split[1] += String.fill(diff, string);
							}
						}
						else if(split[1].length > absFloat)
						{
							if(float < 0)
							{
								split[1] = split[1].substr(split[1].length - absFloat);
							}
							else
							{
								split[1] = split[1].substr(0, absFloat);
							}
						}
					}

					if(split[1].length === 0)
					{
						split.splice(1, 1);
					}

					result = split.join(split.pop());
				}
			}
			else if(typeof String.render === 'function')
			{
				result = String.render(item, { colors: false, quote: false });
			}
			else if(typeof item.toText === 'function')
			{
				result = item.toText(false);
			}
			else if(typeof item.toString === 'function')
			{
				result = item.toString();
			}
			else
			{
				return x('No method available to render item as %', null, 'String');
			}

			if(int !== null && !isNumeric)
			{
				const abs = Math.abs(int);

				if(string === null || string.length === 0)
				{
					string = ' ';
				}

				if(result.textLength < abs)
				{
					const diff = (abs - result.textLength);

					if(int < 0)
					{
						result = String.fill(diff, string) + result;
					}
					else
					{
						result += String.fill(diff, string);
					}
				}
				else if(result.textLength > abs && cut)
				{
					if(int < 0)
					{
						result = result.substr(result.textLength - abs);
					}
					else
					{
						result = result.substr(0, abs);
					}
				}
			}

			if(!cut && float !== null && !isNumeric && result.textLength > Math.abs(float))
			{
				if(string === null || string.length === 0)
				{
					string = ' ';
				}

				if(float < 0)
				{
					result = result.substr(result.textLength + float);
				}
				else
				{
					result = result.substr(0, float);
				}
			}

			//
			if(withColors && hasType)
			{
				if(! colorization)
				{
					colorization = findColorMapKey(type);
				}

				if(colorization)
				{
					result = color(result, colorization[0], colorization[1]);
				}
			}

			//
			return result;
		};

		const hasItemsLeft = () => {
			return (_args.length > 0);
		}

		const parseString = (_start, _stop) => {
			//
			var substr = _format.substring(_start, _stop).removeFirst(2).removeLast();
			var int = '', float = '', string = '', radix = '', state = 'int';
			var cut, localized;

			if(substr[0] === '!' && substr.length > 1)
			{
				cut = true;
				substr = substr.removeFirst();
			}
			else
			{
				cut = false;
			}

			if(substr[substr.length - 1] === '!')
			{
				localized = false;
				substr = substr.removeLast();
			}
			else
			{
				localized = true;
			}

			const append = (_char) => {
				switch(state)
				{
					case 'int':
						int += _char;
						break;
					case 'float':
						float += _char;
						break;
					case 'string':
						string += _char;
						break;
					case 'radix':
						radix += _char;
						break;
				}

				return state;
			};

			const switchState = (_state) => {
				switch(_state)
				{
					case 'int':
						return x('Invalid state switch (can\'t change to \'%\')', null, 'int');
					case 'float':
						if(state === 'int')
						{
							state = 'float';
						}
						else
						{
							return x('Invalid state switch (can\'t change from \'%\' to \'%\')', null, state, 'float');
						}
						break;
					case 'string':
						if(state === 'int' || state === 'float')
						{
							state = 'string';
						}
						else
						{
							return x('Invalid state switch (can\'t change from \'%\' to \'%\')', null, state, 'string');
						}
						break;
					case 'radix':
						if(state === 'int' || state === 'float' || state === 'string')
						{
							state = 'radix';
						}
						else
						{
							return x('Invalid state switch (can\'t change from \'%\' to \'%\')', null, state, 'radix');
						}
						break;
				}

				return state;
			};

			for(var i = 0; i < substr.length; ++i)
			{
				if(substr[i] === '\\')
				{
					if(i < (substr.length - 1))
					{
						switch(substr[i + 1])
						{
							case '}':
								sub += '}';
								++i;
								break;
							case '{':
								sub += '{';
								++i;
								break;
							case ' ':
								sub += ' ';
								++i;
								break;
							case '/':
								sub += '/';
								++i;
								break;
							default:
								sub += '\\';
								break;
						}
					}
					else
					{
						sub += '\\';
					}
				}
				else if(substr[i] === ' ')
				{
					if(state === 'string')
					{
						append(' ');
					}
					else
					{
						switchState('string');
					}
				}
				else if(substr[i] === '/')
				{
					if(state === 'radix')
					{
						append('/');
					}
					else
					{
						switchState('radix');
					}
				}
				else if(substr[i] === '.' || substr[i] === ',')
				{
					if(state === 'string')
					{
						append(substr[i]);
					}
					else
					{
						switchState('float');
					}
				}
				else
				{
					append(substr[i]);
				}
			}

			//
			if(int.length === 0)
			{
				int = null;
			}
			else if(int.isInt())
			{
				int = int.parseInt();
			}
			else
			{
				return x('Invalid % modifier (can\'t parse % with radix %)', null, 'int', 'Integer', 10);
			}

			if(float.length === 0)
			{
				float = null;
			}
			else if(float.isInt())
			{
				float = float.parseInt();
			}
			else
			{
				return x('Invalid % modifier (can\'t parse % with radix %)', null, 'float', 'Integer', 10);
			}

			if(int === null)
			{
				string = null;
			}
			else if(string.length === 0)
			{
				string = ' ';
			}

			if(radix.length === 0)
			{
				radix = null;
			}
			else if(radix.isInt())
			{
				radix = radix.parseInt();
			}
			else
			{
				return x('Invalid % modifier (can\'t parse % with radix %)', null, 'radix', 'Integer', 10);
			}

			if(radix === 256)
			{
				radix = null;
			}
			else if(radix !== null && !isRadix(radix, true))
			{
				return x('Invalid % modifier (isn\'t a valid radix)', null, 'radix');
			}

			if(int === null)
			{
				cut = null;
			}

			//
			const result = Object.create(null);

			result.int = int;
			result.float = float;
			result.string = string;
			result.radix = radix;
			result.cut = cut;
			result.localized = localized;

			if(radix === null || radix === 10)
			{
				result.localizedNumber = localized;
			}
			else
			{
				result.localizedNumber = false;
			}

			return result;
		};

		//
		var withColors = COLORS;
		var withAnsi = !BROWSER;

		if(typeof _format === 'object' && _format !== null)
		{
			if(typeof _format.colors === 'boolean')
			{
				withColors = _format.colors;
			}

			if(typeof _format.ansi === 'boolean')
			{
				withAnsi = _format.ansi;
			}

			if(typeof _format.value === 'string')
			{
				_format = _format.value;
			}
			else if(typeof _format.string === 'string')
			{
				_format = _format.string;
			}
			else
			{
				_format = null;
			}
		}
		else if(typeof _format === 'boolean')
		{
			if(! (withColors = _format))
			{
				withAnsi = null;
			}

			if(typeof _args[0] === 'string')
			{
				_format = _args.shift();
			}
		}
		else if(_format === null)
		{
			withColors = withAnsi = true;

			if(typeof _args[0] === 'string')
			{
				_format = _args.shift();
			}
		}

		if(typeof String.prototype.color !== 'function')
		{
			withColors = false;
		}

		//
		if(typeof _format !== 'string')
		{
			if(typeof String.repeat === 'function')
			{
				_format = String.repeat(_args.length, '% ').removeLast();
			}
			else
			{
				return x('Your % % is not a %', null, '_format', 'String', 'String');
			}
		}
		else if(_format.length === 0)
		{
			return _format;
		}

		//
		var result = '';
		var item, idx;

		for(var i = 0; i < _format.length; ++i)
		{
			if(_format[i] === '\\')
			{
				if(i < (_format.length - 1) && _format[i + 1] === '%')
				{
					result += _format[i];
					++i;
				}
				else
				{
					result += _format[i];
				}
			}
			else if(_format[i] === '%')
			{
				if(i < (_format.length - 2) && _format[i + 1] === '{' && (idx = _format.indexOf('}', i + 2)) > -1)
				{
					if(hasItemsLeft())
					{
						result += getNextItem(parseString(i, ++idx));
						i = idx - 1;
					}
					else
					{
						result += _format[i];
					}
				}
				else if(hasItemsLeft())
				{
					result += getNextItem();
				}
				else
				{
					result += _format[i];
				}
			}
			else
			{
				result += _format[i];
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'printf', { value: function(... _args)
	{
		return String.printf(this.valueOf(), ... _args);
	}});

	Object.defineProperty(String, 'print', { value: function(_format, ... _objects)
	{
throw new Error('TODO');
		const object = Object.assign(... _objects);
	}});

	Object.defineProperty(String.prototype, 'print', { value: function(... _objects)
	{
		return String.print(this.valueOf(), ... _objects);
	}});

	printf = String.printf;
	print = String.print;

	/*Object.defineProperty(String, 'printf', { value: function(_format, ... _args)
	{
		//
		var colors, ansi;

		if(typeof _format === 'boolean' && typeof _args[0] === 'string')
		{
			colors = _format;
			ansi = !BROWSER;
			_format = _args.shift();
		}
		else if(_format === null && typeof _args[0] === 'string')
		{
			colors = ansi = true;
			_format = _args.shift();
		}
		else
		{
			colors = COLORS;
			ansi = !BROWSER;
		}

		//
		if(typeof _format !== 'string')
		{
			_args.unshift(_format);
			_format = String.repeat(_args.length, '% ').removeLast();
		}
		else if(_format.length === 0)
		{
			return _format;
		}
		else if(_format.indexOf('%') === -1)
		{
			return _format;
		}

		//
		var result = '';
		var start, stop, length;
		var idxStart, idxStop;
		var modifiers;
		var key;
		var replace;
		var radix, mod;

		for(var i = 0; i < _format.length; i++)
		{
			if(_format[i] === '\\')
			{
				if(i === (_format.length - 1))
				{
					result += '\\';
				}
				else
				{
					result += _format[++i];
				}
			}
			else if(_format[i] === '%')
			{
				var withRadix = false;
				start = i;
				modifiers = '';

				if(i < (_format.length - 2))
				{
					idxStart = (_format[i + 1] === '{' ? (i + 1) : -1);
					idxStop = (idxStart > -1 ? _format.indexOf('}', idxStart + 1) : -1);

					if(idxStart > -1)
					{
						if(idxStop === -1)
						{
							result += _format.substr(i);
							break;
						}
						else
						{
							modifiers = _format.substring(idxStart + 1, idxStop);
							stop = idxStop;
						}
					}
					else
					{
						stop = start;
					}
				}
				else
				{
					stop = start;
				}

				if(modifiers.length > 0)
				{
					const slash = modifiers.split('/');

					if(slash.length === 2)
					{
						if(slash[1].isInt())
						{
							radix = parseInt(slash[1]);
						}
						else if(slash[1].length >= 2)
						{
							radix = alphabet(slash[1]);
						}
						else
						{
							radix = null;
						}

						if(isRadix(radix, true))
						{
							withRadix = true;
						}
						else
						{
							radix = false;
							withRadix = false;
						}
					}
					else
					{
						withRadix = false;
					}

					mod = slash[0].split('.');

					for(var j = 0; j < mod.length; j++)
					{
						if(mod[j].isInt())
						{
							mod[j] = parseInt(mod[j]);
						}
						else
						{
							mod[j] = null;
						}
					}
				}
				else
				{
					withRadix = false;
					radix = null;
					mod = [ null, null ];
				}

				length = (start - stop + 1);
				key = _format.substring(start, stop + 1);

				if(_args.length > 0)
				{
					replace = _args.shift();

					if(typeof replace === 'function' && DEFAULT_PRINT_F_FUNCTION_CALL) try
					{
						replace = replace();
					}
					catch(_error)
					{
					}

					const opts = { colors, ansi };

					if(typeof replace === 'number' && typeof mod[1] === 'number')
					{
						opts.precision = mod[1];
					}

					if(typeof mod[0] === 'number')
					{
						opts.pad = mod[0];
					}
					else if(typeof mod[1] === 'number')
					{
						opts.cut = mod[1];
					}

					if(isRadix(radix, true))
					{
						if(typeof replace === 'string')
						{
							replace = replace.toRadix(radix);
						}
					}
					else
					{
						radix = DEFAULT_RADIX;
					}

					//
					if(withRadix)
					{
						opts.radix = radix;
					}

					opts.quote = false;
//
//"FIXME".. see also '.render()'
//jedenfalls numeric round vs padding (wohl durch '.cut' modifier ;-)
//
					//
					replace = String.render(replace, opts);
				}
				else if(DEFAULT_FORMAT_EMPTY_REPLACEMENT)
				{
					replace = '';
				}
				else
				{
					replace = key;
				}

				result += replace;
				i += key.length - 1;
			}
			else
			{
				result += _format[i];
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'printf', { value: function(... _args)
	{
		return String.printf(this.valueOf(), ... _args);
	}});

	Object.defineProperty(String, 'print', { value: function(_format, ... _objects)
	{
		//
		var colors, ansi;

		if(typeof _format === 'boolean' && typeof _objects[0] === 'string')
		{
			colors = _format;
			_format = _objects.shift();
			ansi = !BROWSER;
		}
		else if(_format === null && typeof _objects[0] === 'string')
		{
			colors = ansi = true;
			_format = _objects.shift();
		}
		else
		{
			colors = COLORS;
			ansi = !BROWSER;
		}

		//
		if(typeof _format !== 'string')
		{
			return x('Invalid _format (not a String)');
		}
		else if(_format.length === 0)
		{
			return _format;
		}
		else if(_format.indexOf('%') === -1)
		{
			return _format;
		}

		//
		const context = Object.merge(... _objects);

		//
		var result = '';
		var item, radix;
		var start, stop;

		for(var i = 0; i < _format.length; i++)
		{
			if(_format[i] === '\\')
			{
				if(i === (_format.length - 1))
				{
					result += '\\';
				}
				else
				{
					result += _format[++i];
				}
			}
			else if(_format[i] === '%')
			{
				if(i < (_format.length - 1) && _format[i + 1] === '{')
				{
					start = i;
					stop = _format.indexOf('}', i + 2);

					if(stop === -1)
					{
						result += '%{' + _format.substr(i + 2);
						break;
					}

					var key = _format.substring(start + 2, stop).split('/', 2, true);
					const whole = _format.substring(start, stop + 1);
					i += whole.length - 1;

					if(key.length === 0)
					{
						if(! DEFAULT_FORMAT_EMPTY_REPLACEMENT)
						{
							result += whole;
						}

						continue;
					}
					else if(key.length === 1)
					{
						if(key[0].length === 0)
						{
							if(! DEFAULT_FORMAT_EMPTY_REPLACEMENT)
							{
								result += whole;
							}

							continue;
						}

						radix = null;
					}
					else
					{
						if(key[1].length === 0)
						{
							radix = 0;
						}
						else if(key[1].isInt())
						{
							radix = parseInt(key[1]);
						}
						else if(key[1].length >= 2)
						{
							radix = alphabet(key[1]);
						}
						else
						{
							radix = null;
						}

						key.splice(1, 1);
					}

					key = key.join('/');

					if(Object.has(key, context))
					{
						//
						item = Object.get(key, context);

						if(typeof item === 'function' && DEFAULT_PRINT_F_FUNCTION_CALL) try
						{
							item = item();
						}
						catch(_error)
						{
						}

						//
						const opts = { colors, ansi };
						item = Object.get(key, context);

						if(isRadix(radix, true))
						{
							if(typeof item === 'string')
							{
								item = item.toRadix(radix);
							}
						}
						else
						{
							radix = DEFAULT_RADIX;
						}

						//
						opts.radix = radix;

						//
						item = String.render(item, opts);
					}
					else if(DEFAULT_FORMAT_EMPTY_REPLACEMENT)
					{
						item = '';
					}
					else
					{
						item = _format.substring(start, stop + 1);
					}

					//
					result += item;
				}
				else
				{
					result += '%';
				}
			}
			else
			{
				result += _format[i];
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'print', { value: function(... _objects)
	{
		if(typeof _objects[0] === 'boolean')
		{
			return String.print(_objects.shift(), this.valueOf(), ... _objects);
		}

		return String.print(this.valueOf(), ... _objects);
	}});*/

	//
	Object.defineProperty(String, 'COLORMAP', { value: {
		'TypedArray': [ '#758726', false ],
		'Object': [ '#67aad6', false ],
		'Array': [ '#7fad09', false ],
		'String': [ '#ccb129', false ],//#dec549
		'Number': [ '#d651c0', false ],
		'BigInt': [ '#ad56e3', false ],
		'Boolean': [ '#ab3737', false ],
		'Date': [ '#8441a3', false ],
		'Function': [ '#87ad6c', false ],
		'Error': [ '#c91414', false ],
		'RegExp': [ '#5c89bd', false ],
		'Undefined': [ '#669473', false ],
		'Null': [ '#669491', false ],
		'Arguments': [ '#779143', false ]
	}});

	Object.defineProperty(String, 'colormap', { get: function()
	{
		const result = Object.create(null);
		const map = String.COLORMAP;
		const ta = Array.typedArrays;

		for(const idx in map)
		{
			result[idx] = [ ... map[idx] ];
		}

		if('TypedArray' in map) for(const t of ta)
		{
			if(! (t in result))
			{
				result[t] = [ ... map.TypedArray ];
			}
		}

		return result;
	}});

	//
	const _at = String.prototype.at;

	Object.defineProperty(String.prototype, 'at', { value: function(_offset, _needle, _case_sensitive = true, _complex = false)
	{
		//
		const complex = testComplex(_complex, 'At', this);

		if(typeof complex === 'function')
		{
			return complex(_offset, _needle, _case_sensitive);
		}

		//
		if(isNumber(_offset))
		{
			_offset = this.getIndex(_offset);
		}
		else
		{
			return x('Invalid % argument (expecting a %)', null, '_offset', 'Number');
		}

		if(typeof _needle !== 'string' || _needle.length === 0)
		{
			return _at.call(this, _offset);
		}

		var here = this.substr(_offset, _needle.length);

		if(! _case_sensitive)
		{
			here = here.toLowerCase();
			_needle = _needle.toLowerCase();
		}

		//
		return (_needle === here);
		//todo/utf-16 support!??!?
	}});

	//
	Object.defineProperty(String.prototype, 'capitalize', { value: function(_sep = ' ')
	{
		if(typeof _sep !== 'string' || _sep.length === 0)
		{
			return (this[0].toUpperCase() + this.substr(1));
		}

		const split = this.split(_sep);

		for(var i = 0; i < split.length; i++)
		{
			split[i] = split[i][0].toUpperCase() + split[i].substr(1);
		}

		return split.join(_sep);
	}});

	//
	function colorHighlight(_string, _color = true)
	{
		if(typeof _string !== 'string' || _string.length === 0)
		{
			return '';
		}
		else if(_color === true)
		{
			return _string.high;
		}
		else if(typeof _color === 'string')
		{
			return _string.color(_color);
		}
		else if(Array.isArray(_color))
		{
			return _string.color(_color[0], _color[1]);
		}

		return _string;
	}

	Object.defineProperty(String.prototype, 'escapeHex', { value: function(_color = false)
	{
		var result = '';
		var code;

		for(var i = 0; i < this.length; i++)
		{
			code = this.charCodeAt(i);

			if(code < 32 || code === 127)
			{
				code = '\\x' + code.toString(16).padStart(2, '0').toUpperCase();

				if(_color)
				{
					code = colorHighlight(code, _color);
				}

				result += code;
			}
			else
			{
				result += String.fromCharCode(code);
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'unescapeHex', { value: function(_color = false)
	{
		var result = '';
		var code;

		for(var i = 0; i < this.length; i++)
		{
			if(this[i] === '\\' && i < (this.length - 3) && this[i + 1] === 'x')
			{
				code = parseInt(this.substr(i += 2, 2), 16);

				if(_color)
				{
throw new Error('TODO');
				}

				result += String.fromCharCode(code);
				i++;
			}
			else
			{
				result += this[i];
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'escapeC', { value: function(_color = false)
	{
		var result = '';
		var sub, byte;

		for(var i = 0; i < this.length; i++)
		{
			switch(byte = this.charCodeAt(i))
			{
				case 0:
					sub = '\\0';
					break;
				case 7:
					sub = '\\a';
					break;
				case 8:
					sub = '\\b';
					break;
				case 9:
					sub = '\\t';
					break;
				case 10:
					sub = '\\n';
					break;
				case 11:
					sub = '\\v';
					break;
				case 12:
					sub = '\\f';
					break;
				case 13:
					sub = '\\r';
					break;
				case 27:
					sub = '\\e';
					break;
				default:
					sub = '';
					break;
			}

			if(sub.length > 0)
			{
				if(_color)
				{
					sub = colorHighlight(sub, _color);
				}
			}
			else
			{
				sub = String.fromCharCode(byte);
			}

			result += sub;
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'unescapeC', { value: function(_color = false)
	{
		var result = '';
		var sub, byte;

		for(var i = 0; i < this.length; i++)
		{
			if((cp = this.charCodeAt(i)) === 92)
			{
				if(i < (this.length - 1))
				{
					switch(this.charCodeAt(i + 1))
					{
						case 48:
							sub = String.fromCodePoint(0);
							break;
						case 97:
							sub = String.fromCodePoint(7);
							break;
						case 98:
							sub = String.fromCodePoint(8);
							break;
						case 101:
							sub = String.fromCodePoint(27);
							break;
						case 116:
							sub = String.fromCodePoint(9);
							break;
						case 110:
							sub = String.fromCodePoint(10);
							break;
						case 118:
							sub = String.fromCodePoint(11);
							break;
						case 102:
							sub = String.fromCodePoint(12);
							break;
						case 114:
							sub = String.fromCodePoint(13);
							break;
						default:
							sub = '';
							break;
					}

					if(sub.length > 0)
					{
						if(_color)
						{
throw new Error('TODO');
						}
					}
					else
					{
						sub = String.fromCodePoint(i + 1);
					}

					i++;
				}
				else
				{
					sub = '\\';
				}

				result += sub;
			}
			else
			{
				result += String.fromCodePoint(cp);
			}
		}

		return result;
	}});

	Object.defineProperty(String, 'CTRL', { value: [
		'@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
		'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_'
	] });

	Object.defineProperty(String, 'ISO', { value: [
		'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', 'HT', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI',
		'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US'
	] });

	Object.defineProperty(String.prototype, 'escapeCTRL', { value: function(_color = false)
	{
		var result = '';
		var sub, byte;

		for(var i = 0; i < this.length; i++)
		{
			if((byte = this.charCodeAt(i)) < String.CTRL.length)
			{
				sub = ('^' + String.CTRL[byte]);

				if(_color)
				{
					sub = colorHighlight(sub, _color);
				}

				result += sub;
			}
			else
			{
				result += String.fromCharCode(byte);
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'unescapeCTRL', { value: function(_color = false)
	{
		var result = '';
		var sub, byte, idx;

		for(var i = 0; i < this.length; i++)
		{
			if((byte = this.charCodeAt(i)) === 94)
			{
				if(i < (this.length - 1))
				{
					byte = this.charCodeAt(i + 1);
					sub = String.fromCharCode(byte);
					idx = String.CTRL.indexOf(sub);

					if(idx > -1)
					{
						sub = String.fromCharCode(idx);

						if(_color)
						{
throw new Error('TODO');
						}

						result += sub;
					}
					else
					{
						result += '^' + sub;
					}

					i++;
				}
				else
				{
					result += '^';
				}
			}
			else
			{
				result += String.fromCharCode(byte);
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'escapeISO', { value: function(_color = false)
	{
		var result = '';
		var sub, byte;

		for(var i = 0; i < this.length; i++)
		{
			if((byte = this.charCodeAt(i)) < String.ISO.length)
			{
				sub = ('<' + String.ISO[byte] + '>');
			}
			else if(byte === 127)
			{
				sub = '<DEL>';
			}
			else
			{
				sub = '';
			}

			if(sub.length > 0)
			{
				if(_color)
				{
					sub = colorHighlight(sub, _color);
				}
			}
			else
			{
				sub = String.fromCharCode(byte);
			}

			result += sub;
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'unescapeISO', { value: function(_color = false)
	{
		var result = '';
		var open = '';
		var byte, idx;

		for(var i = 0; i < this.length; i++)
		{
			byte = this.charCodeAt(i);

			if(open.length === 0)
			{
				if(byte === 60)
				{
					open += '<';
				}
				else
				{
					result += String.fromCharCode(byte);
				}
			}
			else
			{
				open += String.fromCharCode(byte);

				if(open.length > 5)
				{
					result += open;
					open = '';
				}
				else if(byte === 62)
				{
					idx = String.ISO.indexOf(open.substr(1, open.length - 2));

					if(idx > -1)
					{
						open = String.fromCodePoint(idx);

						if(_color)
						{
throw new Error('TODO');
						}
					}

					result += open;
					open = '';
				}
			}
		}

		return (result + open);
	}});

	//
	Object.defineProperty(String, 'fromBigInt', { value: function(_value = 0n)
	{
		if(typeof _value !== 'bigint')
		{
			return x('Invalid _value (not a BigInt)');
		}

		var result = '';
		var rest = _value;

		while(rest >= 256n)
		{
			result = String.fromCharCode(Number(rest % 256n)) + result;
			rest /= 256n;
		}

		if(rest > 0n)
		{
			result = String.fromCharCode(Number(rest)) + result;
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'toBigInt', { value: function()
	{
		var result = 0n;

		for(var i = this.length - 1, mul = 1n; i >= 0; i--, mul *= 256n)
		{
			result += (BigInt.from(this.charCodeAt(i)) * mul);
		}

		return result;
	}});

	//
	Object.defineProperty(String, 'fromUint8Array', { value: function(_uint8array, _encoding = encoding)
	{
		if(Uint8Array.isUint8Array(_uint8array))
		{
			return _uint8array.toString(_encoding);
		}

		return null;
	}});

	Object.defineProperty(String.prototype, 'toUint8Array', { value: function(_offset, _length, _encoding, _buffered = true)
	{
		return Uint8Array.fromString(this.valueOf(), _offset, _length, _encoding);
	}});

	//
	const _toString = String.prototype.toString;

	Object.defineProperty(String, 'encoding', { get: function()
	{
		if(typeof Buffer === 'undefined')
		{
			return [ 'hex', 'base64', 'utf', 'utf8', 'utf-8' ];
		}

		return Buffer.encoding;
	}});

	Object.defineProperty(String, 'isEncoding', { value: function(_value, _null = true, _numeric = false, _limited = _numeric, _unicode = !_limited)
	{
		if(typeof _value === 'string')
		{
			_value = _value.toLowerCase();
		}

		return checkEncoding(_value, _null, _numeric, _limited, _unicode);
	}});

	const checkBufferEncoding = (_encoding, _null = false) => {
		return String.isEncoding(_encoding, _null);
	};

	Object.defineProperty(String.prototype, 'toString', { value: function(... _args)
	{
		if(typeof _args[0] === 'boolean' || (typeof _args[0] === 'object' && _args[0] !== null))
		{
			return String.render(this.valueOf(), _args[0]);
		}

		if(_args.length > 0)
		{
			if(_args.length === 1)
			{
				if(_args[0] === null)
				{
					return this.toUint8Array();
				}
				else if(typeof _args[0] === 'string')
				{
					if(_args[0].length === 0)
					{
						return this.quote();
					}
					else if(String.isEncoding(_args[0], true, false))
					{
						return this.encode(_args[0]);
					}
					else if(isRadix(_args[0]))
					{
						return this.toRadix(_args[0]);
					}

					return this.quote();
				}
				else if(isRadix(_args[0]))
				{
					return this.toRadix(_args[0]);
				}
			}
			else if(_args.length === 2)
			{
				if(typeof _args[0] === 'string' && typeof _args[1] === 'string')
				{
					return (_args[0] + this.valueOf() + _args[1]);
				}
				else if((typeof _args[0] === 'string' || typeof _args[0] === 'boolean') && typeof _args[1] === 'boolean')
				{
					return this.quote(_args[0], _args[1]);
				}
			}
		}

		return _toString.call(this);
	}});

	Object.defineProperty(String.prototype, 'fromString', { value: function(... _args)
	{
		if(_args.length > 0)
		{
			if(_args.length === 1)
			{
				if(typeof _args[0] === 'string')
				{
					if(_args[0].length === 0)
					{
						_args[0] = 'utf8';
					}

					if(String.isEncoding(_args[0], false, false))
					{
						return this.decode(_args[0]);
					}
					else if(isRadix(_args[0]))
					{
						return this.fromRadix(_args[0]);
					}

					return this.valueOf();
				}
				else if(isRadix(_args[0]))
				{
					return this.fromRadix(_args[0]);
				}
			}
		}

		return this.valueOf();
	}});

	//
	Object.defineProperty(String.prototype, 'letter', { value: function(_index)
	{
		return alphabet.letter(this.valueOf(), _index);
	}});

	//
	Object.defineProperty(String.prototype, 'toXML', { value: function()
	{
		const text = this.eol('<br />', true);
		var result = '';
		var open = '';

		for(var i = 0; i < text.length; ++i)
		{
			if(open.length > 0)
			{
				result += text[i];

				if(text[i] === open)
				{
					open = '';
				}
			}
			else if(text[i] === '<')
			{
				open = '>';
				result += '<';
			}
			else if(text[i] === '&')
			{
				open = ';';
				result += '&';
			}
			else if(text[i] === ' ')
			{
				result += '&nbsp;';
			}
			else if(text[i] === '\t')
			{
				result += String.repeat(Math.round(TABS * 1.5), '&nbsp;');
			}
			else
			{
				result += text[i];
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'fromXML', { value: function()
	{
		return this.eol(EOL, true).replaces('&nbsp;', ' ');
	}});

	Object.defineProperty(String.prototype, 'escapeXML', { value: function(_hard = false, _hex = true)
	{
		var result;

		if(_hard)
		{
			var result = '';

			for(var i = 0; i < this.length; i++)
			{
				if(_hex)
				{
					result += ('&#x' + this.charCodeAt(i).toString(16).padStart(2, '0') + ';');
				}
				else
				{
					result += ('&#' + this.charCodeAt(i).toString(10).padStart(3, '0') + ';');
				}
			}
		}
		else
		{
			result = this.valueOf();

			result = result.replaces('&', '&amp;', 0).replaces(' ', '&nbsp;');
			result = result.replaces('"', '&quot;').replaces('\'', '&#39;');
			result = result.replaces('<', '&lt;').replaces('>', '&gt;');
			result = result.replaces('\t', '&nbsp;'.repeat(Math.round(TABS * 1.5))).eol('<br />');
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'unescapeXML', { value: function(_hard_too = true)
	{
		var result = this.valueOf();

		result = result.replaces('<br />', EOL).replaces('<br>', EOL);
		result = result.replaces('&quot;', '"').replaces('&#39;', '\'');
		result = result.replaces('&amp;', '&').replaces('&nbsp;', ' ', 0);
		result = result.replaces('&lt;', '<').replaces('&gt;', '>');

		if(_hard_too)
		{
			const temp = result;
			result = '';
			var idx, tmp;

			for(var i = 0; i < temp.length; i++)
			{
				if(temp.substr(i, 3) === '&#x')
				{
					idx = temp.indexOf(';', i + 3);

					if(idx === -1)
					{
						result += temp[i];
						continue;
					}

					tmp = temp.substring(i + 3, idx);
					tmp = parseInt(tmp, 16);

					if(tmp.isInt)
					{
						i = idx;
					}
					else
					{
						result += temp[i];
						continue;
					}

					result += String.fromCharCode(tmp);
				}
				else if(temp.substr(i, 2) === '&#')
				{
					idx = temp.indexOf(';', i + 2);

					if(idx === -1)
					{
						result += temp[i];
						continue;
					}

					tmp = temp.substring(i + 2, idx);
					tmp = parseInt(tmp, 10);

					if(tmp.isInt)
					{
						i = idx;
					}
					else
					{
						result += temp[i];
						continue;
					}

					result += String.fromCharCode(tmp);
				}
				else
				{
					result += temp[i];
				}
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String, 'measure', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return 0;
		}
		else if(_args.length === 1 && Array.isArray(_args[0]))
		{
			_args = _args[0];
		}

		var result = 0;

		for(var i = 0; i < _args.length; i++)
		{
			if(typeof _args[i].length === 'number')
			{
				result = Math._max(result, _args[i].length);
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'prefix', { value: function(_prefix)
	{
		if(typeof _prefix !== 'string')
		{
			return x('Invalid _prefix (expecting a String)');
		}
		else if(_prefix.length === 0)
		{
			return this.valueOf();
		}

		//
		var result = ((this[0] === '\n' || this[0] === '\r') ? '' : _prefix);
		var end;

		//
		for(var i = 0; i < this.length; i++)
		{
			end = this.isEOL(i);

			if(end.length === 0)
			{
				result += this[i];
			}
			else
			{
				result += end + _prefix;
				i += (end.length - 1);
			}
		}

		//
		return result;
	}});

	Object.defineProperty(String.prototype, 'suffix', { value: function(_suffix)
	{
		if(typeof _suffix !== 'string')
		{
			return x('Invalid _suffix (expecting a String)');
		}
		else if(_suffix.length === 0)
		{
			return this.valueOf();
		}

		//
		var result = '';
		var lastWasChar;
		var end;

		//
		for(var i = 0; i < this.length; i++)
		{
			end = this.isEOL(i);

			if(end.length === 0)
			{
				result += this[i];
				lastWasChar = true;
			}
			else
			{
				result += _suffix + end;
				i += (end.length - 1);
				lastWasChar = false;
			}
		}

		//
		if(lastWasChar)
		{
			result += _suffix;
		}

		//
		return result;
	}});

	//
	//TODO/unicode-safeness ueberpruefen; ganz allgemein auch... omg.
	Object.defineProperty(String.prototype, 'eol', { value: function(_eol = EOL, _xml = BROWSER)
	{
		if(typeof _eol !== 'string')
		{
			_eol = EOL;
		}

		//
		var result = '';
		var end;

		for(var i = 0; i < this.length; i++)
		{
			end = this.isEOL(i, _xml);

			if(end.length === 0)
			{
				result += this[i];
			}
			else
			{
				result += _eol;
				i += (end.length - 1);
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'isChar', { value: function(_offset = null, _space = true)
	{
		if(this.length === 0)
		{
			return null;
		}
		else if(Number.isNumber(_offset))
		{
			_offset = this.getIndex(_offset);
		}
		else
		{
			_offset = null;
		}

		const checkCharCode = (_cp) => {
			if(_cp === 32)
			{
				return _space;
			}
			else if(_cp < 32)
			{
				return false;
			}
			else if(_cp === 127)
			{
				return false;
			}

			return true;
		};

		if(_offset === null)
		{
			for(var i = 0; i < this.length; i++)
			{
				if(! checkCharCode(this.charCodeAt(i)))
				{
					return false;
				}
			}

			return true;
		}

		return checkCharCode(this.charCodeAt(_offset));
	}});

	Object.defineProperty(String.prototype, 'isWhiteSpace', { value: function(_offset = null)
	{
		if(this.length === 0)
		{
			return null;
		}
		else if(Number.isNumber(_offset))
		{
			_offset = this.getIndex(_offset);
		}
		else
		{
			_offset = null;
		}

		const checkChar = (_char) => {
			switch(_char)
			{
				case ' ': return true;
				case '\t': return true;
				case '\n': return true;
				case '\r': return true;
				case '\v': return true;
			}

			return false;
		};

		if(_offset === null)
		{
			for(var i = 0; i < this.length; i++)
			{
				if(! checkChar(this[i]))
				{
					return false;
				}
			}

			return true;
		}

		return checkChar(this[_offset]);
	}});

	//
	const _trim = String.prototype.trim;

	Object.defineProperty(String.prototype, 'trim', { value: function(_options_or_both = false)
	{
		if(this.length === 0)
		{
			return this.valueOf();
		}

		const options = Object.assign(... arguments);

		if(typeof _options_or_both === 'boolean')
		{
			options.html = options.ansi = _options_or_both;
			_options_or_both = options;
		}
		else
		{
			if(typeof options.xml === 'boolean')
			{
				if(typeof options.html !== 'boolean')
				{
					options.html = options.xml;
				}

				delete options.xml;
			}

			if(typeof options.html !== 'boolean')
			{
				options.html = !!BROWSER;
			}

			if(typeof options.ansi !== 'boolean')
			{
				options.ansi = !BROWSER;
			}
		}

		var pos1 = 0, pos2 = 0;
		const ws = String.prototype.trim.whitespace;
		var partOne = '';
		var open = '';

		for(var i = 0; i < this.length; ++i)
		{
			if(open.length > 0)
			{
				if(this[i] === open)
				{
					open = '';
				}

				partOne += this[i];
			}
			else if(options.ansi && this[i] === ESC)
			{
				open = NUL;
				partOne += ESC;
			}
			else if(options.html && this[i] === '<')
			{
				open = '>';
				partOne += '<';
			}
			else if(options.html && this[i] === '&')
			{
				open = ';';
				partOne += '&';
			}
			else if(ws.indexOf(this[i]) === -1)
			{
				pos1 = i;
				break;
			}
		}

		if(open.length > 0) switch(open)
		{
			case NUL:
				open = ESC;
				break;
			case '>':
				open = '<';
				break;
			case ';':
				open = '&';
				break;
		}

		var partTwo = '';

		for(var i = this.length - 1; i >= pos1; --i)
		{
			if(open.length > 0)
			{
				if(this[i] === open)
				{
					open = '';
				}

				partTwo = this[i] + partTwo;
			}
			else if(options.ansi && this[i] === NUL)
			{
				open = ESC;
				partTwo = this[i] + partTwo;
			}
			/*else if(options.html && this.at(i, '<br />'))
			{
				//i += 5;
			}
			else if(options.html && this.at(i, '&nbsp;'))
			{
				//i += 5;
			}*/
			else if(options.html && this[i] === '>')
			{
				open = '<';
				partTwo = this[i] + partTwo;
			}
			else if(options.html && this[i] === ';')
			{
				open = '&';
				partTwo = this[i] + partTwo;
			}
			else if(ws.indexOf(this[i]) === -1)
			{
				pos2 = ++i;
				break;
			}
		}

		if(pos1 === pos2)
		{
			return (partOne + partTwo);
		}

		return (partOne + this.substring(pos1, pos2) + partTwo);
	}});

	Object.defineProperty(String.prototype.trim, 'whitespace', { get: function()
	{
		return [ ' ', '\t', '\r', '\n', String.fromCodePoint(160), String.fromCodePoint(65279) ];
	}});

	Object.defineProperty(String.prototype, 'onlyWhiteSpaces', { value: function(_options_or_both)
	{
		//
		const options = Object.assign(... arguments);

		if(typeof _options_or_both === 'boolean')
		{
			options.html = options.ansi = _options_or_both;
		}
		else
		{
			if(typeof options.xml === 'boolean')
			{
				if(typeof options.html !== 'boolean')
				{
					options.html = options.xml;
				}

				delete options.xml;
			}

			if(typeof options.html !== 'boolean')
			{
				options.html = !!BROWSER;
			}

			if(typeof options.ansi !== 'boolean')
			{
				options.ansi = !BROWSER;
			}
		}

		//
		const ws = String.prototype.trim.whitespace;
		var open = '';

		for(var i = 0; i < this.length; ++i)
		{
			if(open.length > 0)
			{
				if(this[i] === open)
				{
					open =  '';
				}
			}
			else if(options.ansi && this[i] === ESC)
			{
				open = NUL;
			}
			else if(options.html && this[i] === '<')
			{
				open = '>';
			}
			else if(options.html && this[i] === '&')
			{
				open = ';';
			}
			else if(ws.indexOf(this[i]) === -1)
			{
				return false;
			}
		}

		return true;
	}});

	//
	Object.defineProperty(String.prototype, 'extractInteger', { value: function(_radix = DEFAULT_RADIX, _parse = true)
	{
		if(! isRadix(_radix))
		{
			_radix = DEFAULT_RADIX;
		}

		const alpha = alphabet(_radix, null, false, false, true);

		if(typeof alpha !== 'string')
		{
			return x('Couldn\'t find an alphabet for _radix = ' + _radix);
		}

		const result = [];
		var sub = '';

		for(var i = 0, j = 0; i < this.length; i++)
		{
			if(alpha.indexOf(this[i]) > -1)
			{
				sub += this[i];
			}
			else if(sub.length > 0)
			{
				result[j++] = sub;
				sub = '';
			}
		}

		if(sub.length > 0)
		{
			result.push(sub);
		}

		if(_parse) for(var i = 0; i < result.length; i++)
		{
			result[i] = parseInt(result[i], _radix);
		}

		return result;
	}});

	//
	Object.defineProperty(String, 'equal', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}

		var caseSensitive = true;

		for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				caseSensitive = _args.splice(i--, 1)[0];
			}
			else if(typeof _args[i] !== 'string')
			{
				return x('Invalid %[%] argument (expecting only %s)', null, '...args', i, 'String');
			}
			else if(_args[i].length !== _args[0].length)
			{
				return false;
			}
		}

		if(_args.length === 0)
		{
			return null;
		}
		else if(_args.length === 1)
		{
			return true;
		}
		else if(! caseSensitive) for(var i = 0; i < _args.length; ++i)
		{
			_args[i] = _args[i].toLowerCase();
		}

		for(var i = 1; i < _args.length; ++i)
		{
			if(_args[i] !== _args[0])
			{
				return false;
			}
		}

		return true;
	}});

	//
	Object.defineProperty(String.prototype, 'setLength', { value: function(_length, _complex = false)
	{
		if(! Number.isInt(_length))
		{
			return x('Invalid _length (expecting -/+ Integer)');
		}
		else if(Math.abs(_length) >= this.length)
		{
			return this.valueOf();
		}
		else if(_length >= 0)
		{
			return this.substr(0, _length, _complex);
		}

		var textLength;
		const lengthComplex = testComplex(_complex, 'Length', this);

		if(typeof lengthComplex === 'function')
		{
			textLength = lengthComplex();
		}
		else
		{
			textLength = this.length;
		}

		return this.substr(textLength + _length, -_length, _complex);
	}});

	//
	Object.defineProperty(String.prototype, 'cut', { value: function(_min = 32, _max = 126)
	{
		var min, max;

		if(! Number.isInt(_min))
		{
			_min = 32;
		}

		if(! Number.isInt(_max))
		{
			_max = 126;
		}

		min = Math._min(_min, _max) % 256;
		max = Math._max(_max, _min) % 256;

		var result = '';

		for(var i = 0; i < this.length; i++)
		{
			if(this.charCodeAt(i) >= min && this.charCodeAt(i) <= max)
			{
				result += this[i];
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'map', { value: function(_from, _to)
	{
		if(this.length === 0)
		{
			return '';
		}

		var fromType, toType;

		if(typeof _from === 'string')
		{
			if(_from.length === 0)
			{
				return this.valueOf();
			}

			fromType = 'string';
		}
		else if(Uint8Array.isUint8Array(_from, true))
		{
			if(_from.length === 0)
			{
				return this.valueOf();
			}

			fromType = 'uint8array';
		}
		else if(Array.isArray(_from, true))
		{
			if(_from.length === 0)
			{
				return this.valueOf();
			}

			fromType = 'array';
		}
		else if(Object.isObject(_from))
		{
			if(_from.LEN === 0)
			{
				return this.valueOf();
			}

			fromType = 'object';
		}
		else
		{
			return x('Invalid _from argument (expecting Object, String, Array or Uint8Array)');
		}

		if(fromType === 'object')
		{
			toType = null;
		}
		else if(typeof _to === 'string')
		{
			if(_to.length === 0)
			{
				return this.valueOf();
			}

			toType = 'string';
		}
		else if(Uint8Array.isUint8Array(_to, true))
		{
			if(_to.length === 0)
			{
				return this.valueOf();
			}

			toType = 'uint8array';
		}
		else if(Array.isArray(_to, true))
		{
			if(_to.length === 0)
			{
				return this.valueOf();
			}

			toType = 'array';
		}
		else
		{
			return x('Invalid _to argument (expecting String, Array or Uint8Array)');
		}

		const map = Object.create(null);
		var defined = false;

		if(fromType === 'object')
		{
			for(var idx in _from)
			{
				if(idx.length === 0)
				{
					continue;
				}
				else if(String.isString(_from[idx]))
				{
					defined = true;
					map[idx] = _from[idx];
				}
				else if(Number.isInt(_from[idx]))
				{
					defined = true;
					map[idx] = String.fromCodePoint(_from[idx]);
				}
			}
		}
		else
		{
			var from;

			for(var i = 0; i < _from.length && i < _to.length; i++)
			{
				if(fromType === 'string')
				{
					from = _from[i];
				}
				else if(fromType === 'array')
				{
					if(String.isString(_from[i]))
					{
						from = _from[i];
					}
					else if(Number.isInt(_from[i]))
					{
						from = String.fromCodePoint(_from[i]);
					}
					else
					{
						continue;
					}
				}
				else
				{
					from = String.fromCodePoint(_from[i]);
				}

				if(toType === 'string')
				{
					defined = true;
					map[from] = _to[i];
				}
				else if(toType === 'array')
				{
					if(String.isString(_to[i]))
					{
						defined = true;
						map[from] = _to[i];
					}
					else if(Number.isInt(_to[i]))
					{
						defined = true;
						map[from] = String.fromCodePoint(_to[i]);
					}
				}
				else
				{
					defined = true;
					map[from] = String.fromCodePoint(_to[i]);
				}
			}
		}

		if(! defined)
		{
			return this.valueOf();
		}

		var result = '';
		var found;

		for(var i = 0; i < this.length; i++)
		{
			found = false;

			for(var idx in map)
			{
				if(this.substr(i, idx.length) === idx)
				{
					result += map[idx];
					found = true;
					i += (idx.length - 1);
					break;
				}
			}

			if(! found)
			{
				result += this[i];
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'countChars', { value: function(_max = 255, _min = 0)
	{
		if(! Number.isInt(_max))
		{
			_max = 255;
		}

		if(! Number.isInt(_min))
		{
			_min = 0;
		}

		const max = Math._max(_max % 256, _min % 256);
		const min = Math._min(_min % 256, _max % 256);
		const len = (max - min);

		const result = Array.fill(len, [0]);
		var code;

		for(var i = 0; i < this.length; i++)
		{
			code = this.charCodeAt(i);

			if(code >= min && code <= max)
			{
				result[code - min]++;
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String, 'table', { value: function(_string, _row = EOL, _column = '\t', _parse = true, _trim = false)
	{
		if(! String.isString(_row))
		{
			return x('Invalid _row argument (expecting non-empty String)');
		}
		else if(! String.isString(_column))
		{
			return x('Invalid _column argument (expecting non-empty String)');
		}
		else if(typeof _parse !== 'boolean')
		{
			return x('Invalid _parse argument (expecting Boolean)');
		}
		else if(! String.isString(_string))
		{
			return x('Not a valid String');
		}

		if(_string.startsWith(_column))
		{
			return String.table.object(_string, _row, _column, _parse, _trim);
		}

		return String.table.array(_string, _row, _column, _parse, _trim);
	}});

	Object.defineProperty(String.table, 'array', { value: function(_string, _row = EOL, _column = '\t', _parse = true, _trim = false)
	{
		//
		if(! String.isString(_row))
		{
			return x('Invalid _row argument (expecting non-empty String)');
		}
		else if(! String.isString(_column))
		{
			return x('Invalid _column argument (expecting non-empty String)');
		}
		else if(typeof _parse !== 'boolean')
		{
			return x('Invalid _parse argument (expecting Boolean)');
		}
		else if(typeof _string !== 'string')
		{
			return x('Not a valid String');
		}
		else if(_string.length === 0)
		{
			return [];
		}
		else if(_string.startsWith(_column))
		{
			return x('Array Table String may not begin with your _column separator (' + _column.escapeC() + ')');
		}

		//
		const result = [];
		var row = [];
		var str = '';

		const pushColumn = () => {
			if(_trim)
			{
				str = str.trim();
			}

			if(str.length > 0 && _parse)
			{
				str = String.parse(str);
			}

			row.push(str);
			str = '';

			return row.length;
		};

		const pushRow = () => {
			if(str.length > 0)
			{
				pushColumn();
			}

			result.push(row);
			row = [];

			return result.length;
		};

		for(var i = 0; i < _string.length; i++)
		{
			if(_string[i] === '\\')
			{
				if(i < (_string.length - 1))
				{
					if(_string.at(i + 1, _column))
					{
						str += _column;
						i += _column.length - 1;
					}
					else if(_string.at(i + 1, _row))
					{
						str += _row;
						i += _row.length - 1;
					}
					else
					{
						str += '\\';
					}
				}
				else
				{
					str += '\\';
				}
			}
			else if(_string.at(i, _column))
			{
				pushColumn();
				i += _column.length - 1;
				lastColumn = i;
			}
			else if(_string.at(i, _row))
			{
				pushRow();
				i += _row.length - 1;
			}
			else
			{
				str += _string[i];
			}
		}

		Object.defineProperty(result, 'toString', { value: function()
		{
			return _string;
		}});

		return result;
	}});

	Object.defineProperty(String.table, 'object', { value: function(_string, _row = EOL, _column = '\t', _parse = true, _trim = false)
	{
		//
		if(! String.isString(_row))
		{
			return x('Invalid _row argument (expecting non-empty String)');
		}
		else if(! String.isString(_column))
		{
			return x('Invalid _column argument (expecting non-empty String)');
		}
		else if(typeof _parse !== 'boolean')
		{
			return x('Invalid _parse argument (expecting Boolean)');
		}
		else if(typeof _string !== 'string')
		{
			return x('Not a valid String');
		}
		else if(_string.length === 0)
		{
			return Object.create(null);
		}
		else if(_string.startsWith(_column))
		{
			_string = _string.removeFirst(_column.length);
		}
		else
		{
			return x('Object Table String needs to begin with your _column separator (' + _column.escapeC() + ')');
		}

		//
		const keysX = [];
		const keysY = [];
		var column = 1;
		var line = 1;
		var str = '';
		var row = [];
		const rows = [];

		const pushKeyX = () => {
			if(! String.isString(str))
			{
				return x('Invalid X key (not a non-empty String)');
			}
			else if(keysX.indexOf(str) > -1)
			{
				return x('Ambiguous X key (\'' + str + '\')');
			}
			else if(_trim)
			{
				if((str = str.trim()).length === 0)
				{
					return x('Trimming your X key resulted in empty String');
				}
			}

			keysX.push(str);
			str = '';

			return keysX.length;
		};

		const pushKeyY = () => {
			if(! String.isString(str))
			{
				return x('Invalid Y key (not a non-empty String)')
			}
			else if(keysY.indexOf(str) > -1)
			{
				return x('Ambiguous Y key (\'' + str + '\')');
			}
			else if(_trim)
			{
				if((str = str.trim()).length === 0)
				{
					return x('Trimming your Y key resulted in empty String');
				}
			}

			keysY.push(str);
			str = '';

			return keysY.length;
		};

		const pushColumn = () => {
			if(_trim)
			{
				str = str.trim();
			}

			row.push(str);
			str = '';

			return row.length;
		};

		const pushRow = () => {
			if(str.length > 0)
			{
				pushColumn();
			}

			rows.push(row);
			row = [];

			return rows.length;
		};

		for(var i = 0; i < _string.length; i++)
		{
			if(_string[i] === '\\')
			{
				if(i < (_string.length - 1))
				{
					if(_string.at(i + 1, _column))
					{
						str += _column;
						i += _column.length - 1;
					}
					else if(_string.at(i + 1, _row))
					{
						str += _row;
						i += _row.length - 1;
					}
					else
					{
						str += '\\';
					}
				}
				else
				{
					str += '\\';
				}
			}
			else if(_string.at(i, _column))
			{
				if(line === 1)
				{
					pushKeyX();
				}
				else if(column === 1)
				{
					pushKeyY();
				}
				else
				{
					pushColumn();
				}

				column++;
			}
			else if(_string.at(i, _row))
			{
				if(line === 1 && str.length > 0)
				{
					pushKeyX();
				}
				else if(row.length > 0)
				{
					pushRow();
				}

				column = 1;
				line++;
			}
			else
			{
				str += _string[i];
			}
		}

		if(str.length > 0)
		{
			if(line === 1)
			{
				pushKeyX();
			}
			else
			{
				pushColumn();
			}

			if(row.length > 0)
			{
				pushRow();
			}
		}

		//
		const result = Object.null({ _x: Object.create(null), _y: Object.create(null) });

		for(var i = 0; i < keysX.length; i++)
		{
			result[keysX[i]] = result._x[keysX[i]] = Object.create(null);
		}

		for(var i = 0; i < keysY.length; i++)
		{
			result[keysY[i]] = result._y[keysY[i]] = Object.create(null);
		}

		//
		const setValue = (_keyX, _keyY, _value, _x, _y, _repair = true) => {
			if(! String.isString(_keyX))
			{
				if(_repair)
				{
					_keyX = (_x + 'x');

					if(typeof result[_keyX] === 'undefined' || typeof result._x[_keyX] === 'undefined')
					{
						result[_keyX] = result._x[_keyX] = Object.create(null);
					}
				}
				else
				{
					return x('Invalid _keyY (not a non-empty String)');
				}
			}

			if(! String.isString(_keyY))
			{
				if(_repair)
				{
					_keyY = (_y + 'y');

					if(typeof result[_keyY] === 'undefined' || typeof result._y[_keyY] === 'undefined')
					{
						result[_keyY] = result._y[_keyY] = Object.create(null);
					}
				}
				else
				{
					return x('Invalid _keyX (not a non-empty String)');
				}
			}

			if(_trim)
			{
				_value = _value.trim();
			}

			result[_keyX][_keyY] = result._x[_keyX][_keyY] = _value;
			result[_keyY][_keyX] = result._y[_keyY][_keyX] = _value;

			return _value;
		}

		//
		for(var y = 0; y < rows.length; y++)
		{
			for(var x = 0; x < rows[y].length; x++)
			{
				setValue(keysX[x], keysY[y], rows[y][x], x + 1, y + 1);
			}
		}

		//
		Object.defineProperty(result, 'toString', { value: function()
		{
			return (_column + _string);
		}});

		Object.defineProperty(result, 'toArray', { value: function()
		{
			return rows.clone();
		}});

		//
		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'getStarting', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return '';
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(! String.isString(_args[i]))
			{
				return x('Invalid argument[' + i + '] (expecting only non-empty Strings)');
			}
		}

		return this.first(this.startsWith.apply(this, _args.lengthSort(false)));
	}});

	Object.defineProperty(String.prototype, 'getEnding', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return '';
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(! String.isString(_args[i]))
			{
				return x('Invalid argument[' + i + '] (expecting only non-empty Strings)');
			}
		}

		return this.last(this.endsWith.apply(this, _args.lengthSort(false)));
	}});

	//
	Object.defineProperty(String.prototype, 'encode', { value: function(_radix_alphabet, _numeric = false, _limited = false, _fallback = false)
	{
		if(_radix_alphabet === null)
		{
			return this.toUint8Array();
		}
		else if(typeof _radix_alphabet === 'string' && String.isEncoding(_radix_alphabet, false, false))
		{
			if(_radix_alphabet.length === 0)
			{
				_radix_alphabet = 'utf8';
			}

			if(typeof Buffer === 'undefined') switch(_radix_alphabet)
			{
				case 'hex':
					return this.toHex();
				case 'base64':
					return this.toBase64();
				default:
					if(_fallback)
					{
						return this.valueOf();
					}

					return x('Invalid % argument (% is not available, and no own implementation found)', null, '_radix_alphabet', 'Buffer');
			}

			return Buffer.from(this.valueOf(), 'utf8').toString(_radix_alphabet);
		}
		else if(isRadix(_radix_alphabet, _limited))
		{
			if(_numeric)
			{
				return this.toRadix(_radix_alphabet);
			}

			return x('Your % argument is no real %, but a %.. but % = % argument disabled it', null, '_radix_alphabet', 'encoding', 'radix', '_numeric', false);
		}
		else if(! _fallback)
		{
			return x('Invalid % argument (neither an available %, nor a %)', null, '_radix_alphabet', 'encoding', 'radix');
		}

		return this.valueOf();
	}});

	Object.defineProperty(String.prototype, 'decode', { value: function(_radix_alphabet, _numeric = false, _limited = false, _fallback = false)
	{
		if(typeof _radix_alphabet === 'string' && String.isEncoding(_radix_alphabet, false, false))
		{
			if(_radix_alphabet.length === 0)
			{
				_radix_alphabet = 'utf8';
			}

			if(typeof Buffer === 'undefined') switch(_radix_alphabet)
			{
				case 'hex':
					return this.fromHex();
				case 'base64':
					return this.fromBase64();
				default:
					if(_fallback)
					{
						return this.valueOf();
					}

					return x('Invalid % argument (% is not available, and no own implementation found)', null, '_radix_alphabet', 'Buffer');
			}

			return Buffer.from(this.valueOf(), _radix_alphabet).toString('utf8');
		}
		else if(isRadix(_radix_alphabet, _limited))
		{
			if(_numeric)
			{
				return this.fromRadix(_radix_alphabet);
			}

			return x('Your % argument is no real %, but a %.. but % = % argument disabled it', null, '_radix_alphabet', 'encoding', 'radix', '_numeric', false);
		}
		else if(! _fallback)
		{
			return x('Invalid % argument (neither an available %, nor a %)', null, '_radix_alphabet', 'encoding', 'radix');
		}

		return this.valueOf();
	}});

	//
	Object.defineProperty(String.prototype, 'reduce', { value: function(... _args)
	{
		return this.remove(' ', '\t', '\n', '\r', ... _args);
	}});

	//
	Object.defineProperty(String.prototype, 'matches', { value: function(_regexp, _add_global_flag = true)
	{
		if(! RegExp.isRegExp(_regexp))
		{
			return x('Invalid _regexp argument (not a RegExp)');
		}
		else if(! _regexp.hasFlags('g'))
		{
			if(! _add_global_flag)
			{
				return x('_regexp needs to have the \'global\' flag (/g) for this .regexp() function');
			}

			_regexp = _regexp.addFlags('g');
		}

		return [ ... this.matchAll(_regexp) ];
	}});

	//
	Object.defineProperty(String.prototype, 'compress', { value: function(_throw = true)
	{
		const alpha = alphabet(this.valueOf());

		if(alpha.length >= 256)
		{
			if(_throw)
			{
				return x('No compression possible here (%.% >= %)', null, 'alphabet', 'length', 256);
			}

			return this.valueOf();
		}

		const result = this.fromRadix(alpha);
		const factor = (this.length / result.length);

		return { alphabet: alpha, string: result, factor, original: this.valueOf(), compressed: result.length, uncompressed: this.length };
	}});

	Object.defineProperty(String.prototype, 'decompress', { value: function(_alphabet)
	{
		if(String.isString(_alphabet))
		{
			_alphabet = alphabet(_alphabet);
		}
		else
		{
			return x('Invalid % argument (expecting a %)', null, '_alphabet', 'String');
		}

		return this.toRadix(_alphabet);
	}});

	//
	Object.defineProperty(String.prototype, 'filter', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return x('Missing arguments (expecting at least one non-empty % or an % codepoint)', null, 'String', 'Integer');
		}
		else for(var i = 0; i < _args.length; i++)
		{
			if(! (String.isString(_args[i]) || (Number.isInt(_args[i]) && _args[i] >= 0)))
			{
				return x('Invalid %[%] (expecting only non-empty %s or positive % codepoints)', null, '..._args', i, 'String', 'Integer');
			}
		}

		var result = '';

		for(var i = 0; i < this.length; i++)
		{
			for(var j = 0; j < _args.length; j++)
			{
				if(typeof _args[j] === 'string')
				{
					if(this.at(i, _args[j]))
					{
						result += this.substr(i, _args[j].length);
						i += (_args[j].length - 1);
						break;
					}
				}
				else if(this.codePointAt(i) === _args[j])
				{
					result += String.fromCodePoint(_args[j]);
					break;
				}
				else if(this.charCodeAt(i) === _args[j])
				{
					result += String.fromCharCode(_args[j]);
					break;
				}
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'once', { value: function(_needle)
	{
		if(! String.isString(_needle))
		{
			return x('Invalid % argument (expecting non-empty %)', null, '_needle', 'String');
		}
		else if(this.indexOf(_needle) === -1)
		{
			return null;
		}

		return (this.indexOf(_needle) === this.lastIndexOf(_needle));
	}});

	//
	Object.defineProperty(String.prototype, 'removeFrom', { value: function(... _args)
	{
		var start = 0;
		var backwards = false;

		if(_args.length === 0)
		{
			return this.valueOf();
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				backwards = _args[i];
				_args.splice(i--, 1);
			}
			else if(Number.isInt(_args[i]))
			{
				start = _args[i];
				_args.splice(i--, 1);
			}
			else if(! String.isString(_args[i]))
			{
				return x('Invalid %[%] argument (expecting only non-empty %s)', null, '..._args', i, 'String');
			}
		}

		start = this.getUnicodeIndex(start);

		if(backwards) for(var i = this.length - 1 - start; i >= 0; --i)
		{
			for(var j = 0; j < _args.length; ++j)
			{
				if(this.at(i, _args[j]))
				{
					return this.substr(i);
				}
			}
		}
		else for(var i = start; i < this.length; ++i)
		{
			for(var j = 0; j < _args.length; ++j)
			{
				if(this.at(i, _args[j]))
				{
					return this.substr(i);
				}
			}
		}

		return this.valueOf();
	}});

	Object.defineProperty(String.prototype, 'removeTo', { value: function(... _args)
	{
		var start = 0;
		var backwards = false;

		if(_args.length === 0)
		{
			return this.valueOf();
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				backwards = _args[i];
				_args.splice(i--, 1);
			}
			else if(Number.isInt(_args[i]))
			{
				start = _args[i];
				_args.splice(i--, 1);
			}
			else if(! String.isString(_args[i]))
			{
				return x('Invalid %[%] argument (expecting only non-empty %s)', null, '..._args', i, 'String');
			}
		}

		start = this.getUnicodeIndex(start);

		if(backwards) for(var i = this.length - 1 - start; i >= 0; --i)
		{
			for(var j = 0; j < _args.length; ++j)
			{
				if(this.at(i, _args[j]))
				{
					return this.substring(0, i + _args[j].length);
				}
			}
		}
		else for(var i = start; i < this.length; ++i)
		{
			for(var j = 0; j < _args.length; ++j)
			{
				if(this.at(i, _args[j]))
				{
					return this.substring(0, i + _args[j].length);
				}
			}
		}

		return this.valueOf();
	}});

	//
	Object.defineProperty(String, 'ownHash', { value: function(_value, _size, _move, _inc, _xor, _rounds, _extend, _radix)
	{
		if(typeof _value === 'string')
		{
			return _value.ownHash(_size, _move, _inc, _xor, _rounds, _extend, _radix);
		}

		return '';
	}});

	Object.defineProperty(String.prototype, 'ownHash', { value: function(_size, _move, _inc, _xor, _rounds, _extend, _radix)
	{
		if(Object.isObject(_size))
		{
			if('inc' in _size)
			{
				_inc = _size.inc;
			}

			if('move' in _size)
			{
				_move = _size.move;
			}

			if('rounds' in _size)
			{
				_rounds = _size.rounds;
			}

			if('xor' in _size)
			{
				_xor = _size.xor;
			}

			if('radix' in _size)
			{
				_radix = _size.radix;
			}

			if('extend' in _size)
			{
				_extend = _size.extend;
			}

			//!
			if('size' in _size)
			{
				_size = _size.size;
			}
		}

		if(_radix !== null && !String.isEncoding(_radix, false, true, false, false))
		{
			_radix = DEFAULT_OWN_HASH_RADIX;
		}

		if(typeof _move !== 'boolean')
		{
			_move = DEFAULT_OWN_HASH_MOVE;
		}

		if(typeof _inc !== 'boolean')
		{
			_inc = DEFAULT_OWN_HASH_INC;
		}

		if(typeof _xor !== 'boolean')
		{
			_xor = DEFAULT_OWN_HASH_XOR;
		}

		if(! (Number.isInt(_size) && _size >= 1))
		{
			_size = DEFAULT_OWN_HASH_SIZE;
		}

		if(! (Number.isInt(_rounds) && _rounds > 0))
		{
			_rounds = DEFAULT_OWN_HASH_ROUNDS;
		}

		if(! (Number.isInt(_extend) && _extend > _size))
		{
			_extend = DEFAULT_OWN_HASH_EXTEND;
		}
		else if(_extend > (Number.MAX_SAFE_INTEGER + 1))
		{
			return x('You wan\'t to extend the data, but the result would be to large (length limit is (%.% % %) = %)', null, 'Number', 'MAX_SAFE_INTEGER', '+', 1, (Number.MAX_SAFE_INTEGER + 1));
		}

		if(_rounds > 1 && !_inc)
		{
			return x('When % greater than %, you should set % to % (and maybe also %)', null, '_rounds', 1, '_inc', true, '_move');
		}

		if(_rounds >= 65536)
		{
			return x('I think % are way to much %', null, _rounds, '_rounds');
		}

		const array = Array.fill(_size, [0]);
		const extend = (_extend ? [] : null);
		var extendIndex = (extend ? 0 : null);

		for(var r = 0; r < _rounds; ++r)
		{
			var last = 0;
			var byte, pos, val;

			for(var i = 0; i < this.length; ++i)
			{
				//
				byte = this.charCodeAt(i);

				if(_move)
				{
					last += byte;
					byte = 0;
				}

				pos = ((last + byte) % _size);

				if(_inc)
				{
					val = array[pos];
				}
				else
				{
					val = 0;
				}

				if(_xor)
				{
					val = Math.abs(val ^ i);
				}
				else
				{
					val += i;
				}

				array[pos] = val;
			}

			if(extend)
			{
				for(var i = 0; i < array.length; ++i)
				{
					if(extendIndex >= _extend)
					{
						extendIndex = 0;
					}

					if(_inc)
					{
						val = extend[extendIndex];
					}
					else
					{
						val = 0;
					}

					if(_xor)
					{
						val = Math.abs(val ^ array[i]);
					}
					else
					{
						val += array[i];
					}

					extend[extendIndex++] = val;
				}
			}
		}

		//
		const res = extend || array;

		if(_radix === null)
		{
			return res;
		}

		var result = '';

		for(var i = 0; i < res.length; ++i)
		{
			result += String.fromCodePoint(res[i] % 256);
		}

		return result.encode(_radix, true, false, false);
	}});

	//
	Object.defineProperty(String, 'sameStart', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return '';
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] !== 'string')
			{
				return x('Invalid %[%] argument (not a non-empty %)', null, '..._args', i, 'String');
			}
		}

		_args.uniq();

		var result = 0;
		var same;

		for(var i = 0;; ++i)
		{
			same = true;

			if(i >= _args[0].length)
			{
				break;
			}
			else for(var j = 1; j < _args.length; ++j)
			{
				if(i >= _args[j].length)
				{
					break;
				}
				else if(_args[j][i] !== _args[0][i])
				{
					same = false;
					break;
				}
			}

			if(same)
			{
				++result;
			}
			else
			{
				break;
			}
		}

		return _args[0].substr(0, result);
	}});

	Object.defineProperty(String, 'sameEnd', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return '';
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'string')
			{
				if(_args[i].length > 0)
				{
					_args[i] = _args[i].reverse();
				}
			}
			else
			{
				return x('Invalid %[%] argument (not a non-empty %)', null, '..._args', i, 'String');
			}
		}

		return String.sameStart(... _args).reverse();
	}});

	//
	Object.defineProperty(String.prototype, 'replaces', { value: function(_from, _to, _repeat, _case_sensitive = true, _auto_correct = DEFAULT_AUTO_CORRECT)
	{
		//
		if(typeof _repeat === 'boolean')
		{
			if(typeof _case_sensitive === 'number' || _case_sensitive === null)
			{
				[ _repeat, _case_sensitive ] = [ _case_sensitive, _repeat ];
			}
			else
			{
				_case_sensitive = _repeat;
				_repeat = undefined;
			}
		}

		//
		if(! String.isString(_from) && !RegExp.isRegExp(_from))
		{
			return x('Invalid % argument (expecting non-empty % or %)', null, '_from', 'String', 'RegExp');
		}

		if(typeof _to !== 'string')
		{
			return x('Invalid % argument (expecting any %)', null, '_to', 'String');
		}

		if(RegExp.isRegExp(_from))
		{
			if(! (Number.isInt(_repeat) && _repeat >= 0))
			{
				_repeat = -1;
			}
			
			_case_sensitive = null;
			_auto_correct = null;
		}
		else
		{
			if(! ((Number.isInt(_repeat) && _repeat >= 0) || _repeat === null))
			{
				_repeat = 0;
			}

			if(typeof _case_sensitive !== 'boolean')
			{
				_case_sensitive = true;
			}

			if(typeof _auto_correct !== 'boolean')
			{
				_auto_correct = DEFAULT_AUTO_CORRECT;
			}

			//
			var f = _from;
			var t = _to;

			if(!_case_sensitive)
			{
				f = f.toLowerCase();
				t = t.toLowerCase();
			}

			if(f === t)
			{
				return this.valueOf();
			}
			else if(t.indexOf(f) > -1)
			{
				const m = '%'.bold + ' contains a part of ' + '%'.bold + ', so (% == %) would end up in ';

				if(_auto_correct === true)
				{
					_repeat = _auto_correct = 0;
				}
				else if(_repeat === null)
				{
					return x(m + 'an infinite process', null, '_to', '_from', '_repeat', null);
				}
				else if(_repeat > 0)
				{
					return x(m + 'repetitions of the ' + '%'.bold + ' string', null, '_to', '_from', '_repeat', _repeat, '_to');
				}
			}
		}
		
		//
		var compare = this.valueOf();
		var result;
		
		while(true)
		{
			//
			result = compare.replaceAll(_from, _to);
			
			//
			if(_repeat <= 0)
			{
				break;
			}
			else if(_repeat !== null && _repeat-- <= 0)
			{
				break;
			}
			else if(result === compare)
			{
				break;
			}
			else
			{
				compare = result;
			}
		}
		
		//
		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'remove', { value: function(... _args)
	{
		//
		if(_args.length === 0)
		{
			return this.valueOf();
		}

		var repeat = null;
		var caseSensitive = true;

		for(var i = 0; i < _args.length; ++i)
		{
			if(! String.isString(_args[i]))
			{
				if(_args[i] === null)
				{
					repeat = null;
				}
				else if(_args[i] === true)
				{
					caseSensitive = true;
				}
				else if(_args[i] === false)
				{
					caseSensitive = false;
				}
				else if(Number.isInt(_args[i]) && _args[i] >= 0)
				{
					repeat = _args[i];
				}
				else if(! (String.isString(_args[i]) || RegExp.isRegExp(_args[i])))
				{
					return x('Invalid %[%] argument (expecting only non-empty %s, % types or %)', null, '..._args', i, 'String', 'Boolean', null);
				}
				else
				{
					continue;
				}

				_args.splice(i--, 1);
			}
		}

		if(_args.length === 0)
		{
			return this.valueOf();
		}
		else if(_args.length > 1)
		{
			for(var i = 0; i < _args.length; ++i)
			{
				if(! String.isString(_args[i]))
				{
					return x('If using more than % argument, none of them may be a %', null, 1, 'RegExp');
				}
			}

			_args.lengthSort(false);
		}
		else if(RegExp.isRegExp(_args[0]))
		{
			if(! (Number.isInt(repeat) && repeat >= 0))
			{
				repeat = -1;
			}
		}

		//
		var processString;

		if(_args.length === 1 && RegExp.isRegExp(_args[0]))
		{
			processString = (_text) => {
				return _text.replaceAll(_args[0], '');
			};
		}
		else
		{
			processString = (_text) => {
				var result = '';
				var found;

				for(var i = 0; i < _text.length; ++i)
				{
					found = 0;

					for(var j = 0; j < _args.length; ++j)
					{
						if(_text.at(i, _args[j], caseSensitive))
						{
							found = _args[j].length;
							break;
						}
					}

					if(found > 0)
					{
						i += found - 1;
					}
					else
					{
						result += _text.at(i);
					}
				}

				return result;
			};
		};

		//
		var compare = this.valueOf();
		var result;

		while(true)
		{
			//
			result = processString(compare);

			//
			if(repeat <= 0)
			{
				break;
			}
			else if(repeat !== null && repeat-- <= 0)
			{
				break;
			}
			else if(result === compare)
			{
				break;
			}
			else
			{
				compare = result;
			}
		}

		//
		return result;
	}});

	//
	Object.defineProperty(String, 'quotes', { get: function()
	{
		return [ '`', '\'', '"' ];
	}});

	Object.defineProperty(String.prototype, 'quote', { value: function(_quote = true, _escape = DEFAULT_QUOTE_ESCAPE, _escape_only_not_escaped_if_escape = true)
	{
		if(_quote === false)
		{
			return this.valueOf();
		}

		const selectQuote = () => {
			const quotes = String.quotes;
			const orig = [ ... quotes ];

			for(var i = 0; i < quotes.length; ++i)
			{
				quotes[i] = [ quotes[i], this.indicesOf(quotes[i]).length ];
			}

			quotes.sort(1, true);
			const same = [ quotes[0][0] ];

			for(var i = 1; i < quotes.length; ++i)
			{
				if(quotes[i][1] === quotes[0][1])
				{
					same[i] = quotes[i][0];
				}
				else
				{
					break;
				}
			}

			var res;

			for(var i = 0; i < orig.length; ++i)
			{
				if(same.indexOf(orig[i]) > -1)
				{
					res = orig[i];
					break;
				}
			}

			return res;
		};

		if(typeof _escape !== 'boolean')
		{
			_escape = DEFAULT_QUOTE_ESCAPE;
		}

		if(typeof _escape_only_not_escaped_if_escape !== 'boolean')
		{
			_escape_only_not_escaped_if_escape = true;
		}

		var quote;

		if(typeof _quote === 'string')
		{
			if(_quote.length === 0)
			{
				return this.valueOf();
			}

			quote = _quote;
		}
		else
		{
			quote = null;
		}

		if(quote === null)
		{
			quote = selectQuote();
		}

		//
		var result;

		if(_escape)
		{
			result = '';

			for(var i = 0; i < this.length; ++i)
			{
				if(_escape_only_not_escaped_if_escape && this.at(i, '\\'))
				{
					if(i < (this.length - 1) && this.at(i + 1, quote))
					{
						result += '\\' + quote;
						++i;
					}
					else
					{
						result += '\\';
					}
				}
				else if(this.at(i, quote))
				{
					result += '\\' + this.at(i);
				}
				else
				{
					result += this.at(i);
				}
			}
		}
		else
		{
			result = this.valueOf();
		}

		return (quote + result + quote);
	}})

	//
	Object.defineProperty(String.prototype, 'padCenter', { value: function(_length, _pad = DEFAULT_PAD, _complex = false)
	{
		//
		if(! Number.isInt(_length))
		{
			return x('Invalid _length argument (expecting an Integer)');
		}

		if(typeof _pad !== 'string' || _pad.length === 0)
		{
			return x('Invalid _pad (expecting non-empty String)');
		}

		//
		var length;
		const lengthComplex = testComplex(_complex, 'Length', this);

		if(typeof lengthComplex === 'function')
		{
			length = lengthComplex();
		}
		else
		{
			length = this.length;
		}

		//
		const negative = (_length < 0);
		_length = Math.abs(_length);

		//
		if(_length <= length)
		{
			return this.valueOf();
		}

		const diff = (_length - length);
		const half = Math.round(diff / 2);
		const rest = Math.round(diff - half);

		return (String.fill(half, _pad) + this.valueOf() + String.fill(rest, _pad));
	}});

	//
	// positive _length => '(pad)(string)'
	// negative _length => '(string)(pad)'
	//
	Object.defineProperty(String.prototype, 'pad', { value: function(_length, _pad = DEFAULT_PAD, _complex = false)
	{
		//
		if(Number.isNumber(_length))
		{
			_length = _length.int;
		}
		else
		{
			return x('Invalid % argument (expecting a %)', null, '_length', 'Number');
		}

		if(! String.isString(_pad))
		{
			return x('Invalid % argument (expecting non-empty %)', null, '_pad', 'String');
		}

		//
		var length;
		const lengthComplex = testComplex(_complex, 'Length', this);

		if(typeof lengthComplex === 'function')
		{
			length = lengthComplex.call(this);
		}
		else
		{
			length = this.textLength;
		}

		//
		const negative = (_length < 0);
		_length = Math.abs(_length);

		//
		if(_length < length)
		{
			return this.valueOf();
		}

		const diff = (_length - length);

		if(negative)
		{
			return (this.valueOf() + String.fill(diff, _pad));
		}

		return (String.fill(diff, _pad) + this.valueOf());
	}});

	Object.defineProperty(String.prototype, 'padLeft', { value: function(_length, _pad = DEFAULT_PAD, _complex = false)
	{
		return this.pad(_length.toPositive(), _pad, _complex);
	}});

	Object.defineProperty(String.prototype, 'padRight', { value: function(_length, _pad = DEFAULT_PAD, _complex = false)
	{
		return this.pad(_length.toNegative(), _pad, _complex);
	}});

	//
	Object.defineProperty(String.prototype, 'all', { value: function(... _args)
	{
		var CASE_SENSITIVE = true;
		const strings = [];
		const codepoints = [];

		for(var i = 0, s = 0, c = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				CASE_SENSITIVE = _args.splice(i--, 1)[0];
			}
			else if(String.isString(_args[i]))
			{
				strings[s++] = _args[i];
			}
			else if(Number.isInt(_args[i]) && _args[i] >= 0)
			{
				codepoints[c++] = _args[i];
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s or positive % codepoints, or maybe % types)', null, '..._args', i, 'String', 'Integer', 'Boolean');
			}
		}

		if(strings.length === 0 && codepoints.length === 0)
		{
			return null;
		}
		else if(! CASE_SENSITIVE) for(var i = 0; i < strings.length; ++i)
		{
			strings[i] = strings[i].toLowerCase();
		}

		strings.uniq().lengthSort(false);
		codepoints.uniq().sort(false);

		//
		const text = (CASE_SENSITIVE ? this.valueOf() : this.toLowerCase());
		const end = (strings.length + codepoints.length);
		const found = [];
		var f;

		for(var i = 0; i < text.length; ++i)
		{
			f = false;

			for(var j = 0; j < strings.length; ++j)
			{
				if(text.at(i, strings[j]))
				{
					f = true;
					i += (strings[j].length - 1);
					found.pushUnique(strings[j]);
					break;
				}
			}

			if(!f) for(var j = 0; j < codepoints.length; ++j)
			{
				if(this.codePointAt(i) === codepoints[j] || this.charCodeAt(i) === codepoints[j])
				{
					f = true;
					i += (String.fromCodePoint(codepoints[j]).length - 1);
					found.pushUnique(codepoints[j]);
					break;
				}
			}

			if(found.length === end)
			{
				break;
			}
		}

		return (found.length === end);
	}});

	Object.defineProperty(String.prototype, 'only', { value: function(... _args)
	{
		var CASE_SENSITIVE = true;
		const strings = [];
		const codepoints = [];

		for(var i = 0, s = 0, c = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				CASE_SENSITIVE = _args.splice(i--, 1)[0];
			}
			else if(String.isString(_args[i]))
			{
				strings[s++] = _args[i];
			}
			else if(Number.isInt(_args[i]) && _args[i] >= 0)
			{
				codepoints[c++] = _args[i];
			}
			else
			{
				return x('Invalid %[%] (expecting only non-empty %s or positive % codepoints, or maybe % types)', null, '..._args', i, 'String', 'Integer', 'Boolean');
			}
		}

		if(strings.length === 0 && codepoints.length === 0)
		{
			return null;
		}
		else if(! CASE_SENSITIVE) for(var i = 0; i < strings.length; ++i)
		{
			strings[i] = strings[i].toLowerCase();
		}

		strings.uniq().lengthSort(false);
		codepoints.uniq().sort(false);

		//
		const text = (CASE_SENSITIVE ? this.valueOf() : this.toLowerCase());
		var found;

		for(var i = 0; i < text.length; i++)
		{
			found = null;

			for(var j = 0; j < strings.length; ++j)
			{
				if(text.at(i, strings[j]))
				{
					found = strings[j];
					break;
				}
			}

			if(! found) for(var j = 0; j < codepoints.length; ++j)
			{
				if(this.codePointAt(i) === codepoints[j] || this.charCodeAt(i) === codepoints[j])
				{
					found = String.fromCodePoint(codepoints[j]);
					break;
				}
			}

			if(found)
			{
				i += (found.length - 1);
			}
			else
			{
				return false;
			}
		}

		return true;
	}});

	Object.defineProperty(String.prototype, 'highlight', { value: function(... _args)
	{
		var HIGH_BG = false;
		var CASE_SENSITIVE = true;

		const strings = [];
		const codepoints = [];

		for(var i = 0, s = 0, c = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				CASE_SENSITIVE = _args.splice(i--, 1)[0];
			}
			else if(_args[i] === null)
			{
				HIGH_BG = true;
				_args.splice(i--, 1);
			}
			else if(String.isString(_args[i]))
			{
				strings[s++] = _args[i];
			}
			else if(Number.isInt(_args[i]) && _args[i] >= 0)
			{
				codepoints[c++] = _args[i];
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s, positive % codepoints or maybe % types)', null, '..._args', i, 'String', 'Integer', 'Boolean');
			}
		}

		if(strings.length === 0 && codepoints.length === 0)
		{
			return this.valueOf();
		}
		else if(! CASE_SENSITIVE) for(var i = 0; i < strings.length; ++i)
		{
			strings[i] = strings[i].toLowerCase();
		}

		strings.uniq().lengthSort(false);
		codepoints.uniq().sort(false);

		//
		const high = (_str_cp, _bg = HIGH_BG) => {
			if(typeof _str_cp === 'number')
			{
				_str_cp = String.fromCodePoint(_str_cp);
			}

			if(_bg)
			{
				return _str_cp.highBG;
			}

			return _str_cp.highFG;
		};

		const text = (CASE_SENSITIVE ? this.valueOf() : this.toLowerCase());
		var result = '';
		var found;

		for(var i = 0; i < text.length; ++i)
		{
			found = null;

			for(var j = 0; j < strings.length; ++j)
			{
				if(text.at(i, strings[j]))
				{
					found = strings[j];
					break;
				}
			}

			if(!found) for(var j = 0; j < codepoints.length; ++j)
			{
				if(this.codePointAt(i) === codepoints[j] || this.charCodeAt(i) === codepoints[j])
				{
					found = String.fromCodePoint(codepoints[j]);
					break;
				}
			}

			if(found)
			{
				result += high(this.substr(i, found.length));
				i += (found.length - 1);
			}
			else
			{
				result += this[i];
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'include', { value: function(... _args)
	{
		var CASE_SENSITIVE = true;
		const strings = [];
		const codepoints = [];

		for(var i = 0, s = 0, c = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				CASE_SENSITIVE = _args.splice(i--, 1)[0];
			}
			else if(String.isString(_args[i]))
			{
				strings[s++] = _args[i];
			}
			else if(Number.isInt(_args[i]) && _args[i] >= 0)
			{
				codepoints[c++] = _args[i];
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s or positive % codepoints, or maybe % types)', null, '..._args', i, 'String', 'Integer', 'Boolean');
			}
		}

		if(strings.length === 0 && codepoints.length === 0)
		{
			return '';
		}
		else if(! CASE_SENSITIVE) for(var i = 0; i < strings.length; ++i)
		{
			strings[i] = strings[i].toLowerCase();
		}

		strings.uniq().lengthSort(false);
		codepoints.uniq().sort(false);

		//
		const text = (CASE_SENSITIVE ? this.valueOf() : this.toLowerCase());
		var result = '';
		var found;

		for(var i = 0; i < text.length; ++i)
		{
			found = null;

			for(var j = 0; j < strings.length; ++j)
			{
				if(text.at(i, strings[j]))
				{
					found = strings[j];
					break;
				}
			}

			if(!found) for(var j = 0; j < codepoints.length; ++j)
			{
				if(this.codePointAt(i) === codepoints[j] || this.charCodeAt(i) === codepoints[j])
				{
					found = String.fromCodePoint(codepoints[j]);
					break;
				}
			}

			if(found)
			{
				result += this.substr(i, found.length);
				i += (found.length - 1);
			}
		}

		return result;
	}});

	Object.defineProperty(String.prototype, 'exclude', { value: function(... _args)
	{
		var CASE_SENSITIVE = true;
		const strings = [];
		const codepoints = [];

		for(var i = 0, s = 0, c = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				CASE_SENSITIVE = _args.splice(i--, 1)[0];
			}
			else if(String.isString(_args[i]))
			{
				strings[s++] = _args[i];
			}
			else if(Number.isNumber(_args[i]))
			{
				codepoints[c++] = _args[i];
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s or positive % codepoints, or maybe % types)', null, '..._args', i, 'String', 'Integer', 'Boolean');
			}
		}

		if(strings.length === 0 && codepoints.length === 0)
		{
			return this.valueOf();
		}
		else if(! CASE_SENSITIVE) for(var i = 0; i < strings.length; ++i)
		{
			strings[i] = strings[i].toLowerCase();
		}

		strings.uniq().lengthSort(false);
		codepoints.uniq().sort(false);

		//
		const text = (CASE_SENSITIVE ? this.valueOf() : this.toLowerCase());
		var result = '';
		var found;

		for(var i = 0; i < text.length; ++i)
		{
			found = null;

			for(var j = 0; j < strings.length; ++j)
			{
				if(text.at(i, strings[j]))
				{
					found = strings[j];
					break;
				}
			}

			if(!found) for(var j = 0; j < codepoints.length; ++j)
			{
				if(this.codePointAt(i) === codepoints[j] || this.charCodeAt(i) === codepoints[j])
				{
					found = String.fromCodePoint(codepoints[j]);
					break;
				}
			}

			if(! found)
			{
				result += this[i];
			}
			else
			{
				i += (found.length - 1);
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'overwrite', { value: function(_string, _offset = 0, _over_length = DEFAULT_OVERWRITE_OVER_LENGTH, _transparency = DEFAULT_OVERWRITE_TRANSPARENCY)
	{
		if(typeof _string === 'string')
		{
			if(_string.length === 0)
			{
				return this.valueOf();
			}
		}
		else
		{
			return x('Invalid % argument (expecting an %)', null, '_string', 'String');
		}

		if(Number.isInt(_offset))
		{
			_offset = this.getIndex(_offset);
		}
		else
		{
			_offset = 0;
		}

		if(typeof _over_length !== 'boolean')
		{
			_over_length = DEFAULT_OVERWRITE_OVER_LENGTH;
		}

		if(! (Number.isByte(_transparency) || String.isString(_transparency)))
		{
			_transparency = null;
		}
		else if(String.isString(_transparency))
		{
			_transparency = _transparency.charCodeAt(0);
		}

		var result = this.substr(0, _offset);

		for(var i = 0, j = _offset; i < _string.length; ++i, ++j)
		{
			//
			if(_transparency !== null && _string.charCodeAt(i) === _transparency)
			{
				result += this[j];
			}
			else
			{
				result += _string[i];
			}

			//
			if(! _over_length && j >= (this.length - 1))
			{
				break;
			}
		}

		if(result.length < this.length)
		{
			result += this.substr(result.length);
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'alignLeft', { value: function(_width_options, _trim, _throw = true)
	{
		const options = Object.assign(... arguments);

		if(typeof options.throw === 'boolean')
		{
			_throw = options.throw;
		}
		else if(typeof _throw !== 'boolean')
		{
			_throw = options.throw = true;
		}

		if(Object.isObject(_trim))
		{
			if(typeof _trim.xml === 'boolean')
			{
				if(typeof _trim.html !== 'boolean')
				{
					_trim.html = _trim.xml;
				}

				delete _trim.xml;
			}

			if(typeof _trim.html !== 'boolean')
			{
				_trim.html = !!BROWSER;
			}

			if(typeof _trim.ansi !== 'boolean')
			{
				_trim.ansi = !BROWSER;
			}
		}
		else if(Object.isObject(options.trim))
		{
			if(typeof options.xml === 'boolean')
			{
				if(typeof options.html !== 'boolean')
				{
					options.html = options.xml;
				}

				delete options.xml;
			}

			if(typeof options.html !== 'boolean')
			{
				options.html = !!BROWSER;
			}

			if(typeof options.ansi !== 'boolean')
			{
				options.ansi = !BROWSER;
			}
		}
		else if(typeof options.trim === 'boolean')
		{
			options.html = options.ansi = options.trim;
		}
		else if(typeof _trim !== 'boolean')
		{
			options.html = !!BROWSER;
			options.ansi = !BROWSER;
		}

		if(Number.isInt(options.width) && options.width > 0)
		{
			_width_options = options.width;
		}
		else if(! (Number.isInt(_width_options) && _width_options > 0))
		{
			if(BROWSER)
			{
				_width_options = null;
			}
			else if('width' in console)
			{
				_width_options = console.width;
			}
			else
			{
				_width_options = null;
			}
		}

		if(! (Number.isInt(_width_options) && _width_options > 0))
		{
			if(_throw)
			{
				return x('Missing or invalid % argument/option (expecting an % greater than zero)', null, 'width', 'Integer');
			}

			return null;
		}

		return this.toText(options.assign({ align: 'left', trim: (options.html || options.ansi), html: options.html, ansi: options.ansi }), false, _throw);
	}});


	Object.defineProperty(String.prototype, 'alignCenter', { value: function(_width_options, _trim, _throw = true)
	{
		const options = Object.assign(... arguments);

		if(typeof options.throw === 'boolean')
		{
			_throw = options.throw;
		}
		else if(typeof _throw !== 'boolean')
		{
			_throw = options.throw = true;
		}

		if(Object.isObject(_trim))
		{
			if(typeof _trim.xml === 'boolean')
			{
				if(typeof _trim.html !== 'boolean')
				{
					_trim.html = _trim.xml;
				}

				delete _trim.xml;
			}

			if(typeof _trim.html !== 'boolean')
			{
				_trim.html = !!BROWSER;
			}

			if(typeof _trim.ansi !== 'boolean')
			{
				_trim.ansi = !BROWSER;
			}
		}
		else if(Object.isObject(options.trim))
		{
			if(typeof options.xml === 'boolean')
			{
				if(typeof options.html !== 'boolean')
				{
					options.html = options.xml;
				}

				delete options.xml;
			}

			if(typeof options.html !== 'boolean')
			{
				options.html = !!BROWSER;
			}

			if(typeof options.ansi !== 'boolean')
			{
				options.ansi = !BROWSER;
			}
		}
		else if(typeof options.trim === 'boolean')
		{
			options.html = options.ansi = options.trim;
		}
		else if(typeof _trim !== 'boolean')
		{
			options.html = !!BROWSER;
			options.ansi = !BROWSER;
		}

		if(Number.isInt(options.width) && options.width > 0)
		{
			_width_options = options.width;
		}
		else if(! (Number.isInt(_width_options) && _width_options > 0))
		{
			if(BROWSER)
			{
				_width_options = null;
			}
			else if('width' in console)
			{
				_width_options = console.width;
			}
			else
			{
				_width_options = null;
			}
		}

		if(! (Number.isInt(_width_options) && _width_options > 0))
		{
			if(_throw)
			{
				return x('Missing or invalid % argument/option (expecting an % greater than zero)', null, 'width', 'Integer');
			}

			return null;
		}

		return this.toText(options.assign({ align: 'center', trim: (options.html || options.ansi), html: options.html, ansi: options.ansi }), false, _throw);
	}});


	Object.defineProperty(String.prototype, 'alignRight', { value: function(_width_options, _trim, _throw = true)
	{
		const options = Object.assign(... arguments);

		if(typeof options.throw === 'boolean')
		{
			_throw = options.throw;
		}
		else if(typeof _throw !== 'boolean')
		{
			_throw = options.throw = true;
		}

		if(Object.isObject(_trim))
		{
			if(typeof _trim.xml === 'boolean')
			{
				if(typeof _trim.html !== 'boolean')
				{
					_trim.html = _trim.xml;
				}

				delete _trim.xml;
			}

			if(typeof _trim.html !== 'boolean')
			{
				_trim.html = !!BROWSER;
			}

			if(typeof _trim.ansi !== 'boolean')
			{
				_trim.ansi = !BROWSER;
			}
		}
		else if(Object.isObject(options.trim))
		{
			if(typeof options.xml === 'boolean')
			{
				if(typeof options.html !== 'boolean')
				{
					options.html = options.xml;
				}

				delete options.xml;
			}

			if(typeof options.html !== 'boolean')
			{
				options.html = !!BROWSER;
			}

			if(typeof options.ansi !== 'boolean')
			{
				options.ansi = !BROWSER;
			}
		}
		else if(typeof options.trim === 'boolean')
		{
			options.html = options.ansi = options.trim;
		}
		else if(typeof _trim !== 'boolean')
		{
			options.html = !!BROWSER;
			options.ansi = !BROWSER;
		}

		if(Number.isInt(options.width) && options.width > 0)
		{
			_width_options = options.width;
		}
		else if(! (Number.isInt(_width_options) && _width_options > 0))
		{
			if(BROWSER)
			{
				_width_options = null;
			}
			else if('width' in console)
			{
				_width_options = console.width;
			}
			else
			{
				_width_options = null;
			}
		}

		if(! (Number.isInt(_width_options) && _width_options > 0))
		{
			if(_throw)
			{
				return x('Missing or invalid % argument/option (expecting an % greater than zero)', null, 'width', 'Integer');
			}

			return null;
		}

		return this.toText(options.assign({ align: 'right', trim: (options.html || options.ansi), html: options.html, ansi: options.ansi }), false, _throw);
	}});

	//
	Object.defineProperty(String.prototype, 'toText', { value: function(_options, _force_file = false, _throw = DEFAULT_TO_TEXT_THROW)
	{
		//
		var consoleWidth;

		if(BROWSER)
		{
			consoleWidth = 0;
		}
		else if('width' in console)
		{
			consoleWidth = console.width;
		}
		else if(process.stdout.columns)
		{
			consoleWidth = process.stdout.columns;
		}
		else if(process.stderr.columns)
		{
			consoleWidth = process.stderr.columns;
		}
		else
		{
			consoleWidth = 0;
		}

		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_TO_TEXT_THROW;
		}

		//
		if(! Object.isObject(_options))
		{
			_options = {};
		}

		//
		if(typeof _options.throw === 'boolean')
		{
			_throw = _options.throw;
		}

		delete _options.throw;

		if(typeof _force_file !== 'boolean')
		{
			if(typeof _options.forceFile === 'boolean')
			{
				_force_file = _options.forceFile;
			}
			else if(typeof _options.file === 'boolean')
			{
				_force_file = _options.file;
			}
			else
			{
				_force_file = !!BROWSER;
			}
		}

		delete _options.file;
		delete _options.forceFile;

		//
		if(_force_file)
		{
			_options.width = 0;
		}
		else if(Number.isInt(_options.width))
		{
			_options.width = String.getWidth(_options.width, consoleWidth, _force_file);
		}
		else
		{
			_options.width = consoleWidth;
		}

		if(consoleWidth > 0 && DEFAULT_TO_TEXT_LIMIT_WIDTH_TO_CONSOLE && _options.width > consoleWidth)
		{
			_options.width = consoleWidth;
		}

		if(typeof _options.ansi !== 'boolean')
		{
			_options.ansi = !BROWSER;
		}

		if(_options.ansi && typeof ansi === 'undefined')
		{
			require('tty/ansi');
		}

		if(typeof _options.xml === 'boolean')
		{
			if(typeof _options.html !== 'boolean')
			{
				_options.html = _options.xml;
			}

			delete _options.xml;
		}

		if(typeof _options.html !== 'boolean')
		{
			_options.html = !!BROWSER;
		}

		//
		if(typeof _options.colors !== 'boolean')
		{
			_options.colors = COLORS;
		}

		//
		if(Number.isInt(_options.prefix) && _options.prefix >= 0)
		{
			_options.prefix = space(_options.prefix);
		}
		else if(typeof _options.prefix !== 'string')
		{
			_options.prefix = '';
		}

		if(_options.width > 0 && _options.width <= _options.prefix.textLength)
		{
			if(consoleWidth > _options.prefix.textLength)
			{
				_options.width = consoleWidth;
			}
			else
			{
				_options.width = 0;
			}
		}

		//
		if(typeof _options.all !== 'boolean')
		{
			_options.all = false;
		}

		if(Number.isInt(_options.morePrefix) && _options.morePrefix >= 0)
		{
			_options.morePrefix = space(_options.morePrefix);
		}
		else if(typeof _options.morePrefix !== 'string')
		{
			_options.morePrefix = '';
		}

		//
		if(Number.isInt(_options.eol) && _options.eol >= 0)
		{
			_options.eol = eol(_options.eol);
		}
		else if(typeof _options.eol !== 'string')
		{
			_options.eol = EOL;
		}

		//
		if(_options.tabs === false)
		{
			_options.tabs = 1;
		}
		else if(_options.tabs === true)
		{
			_options.tabs = TABS;
		}
		else if(! (Number.isInt(_options.tabs) && _options.tabs >= 0))
		{
			_options.tabs = TABS;
		}

		//
		if(_options.align === true)
		{
			_options.align = DEFAULT_ALIGN;
		}
		else if(_options.align === false || _options.align === null)
		{
			_options.align = null;
		}
		else if(! String.isString(_options.align))
		{
			_options.align = DEFAULT_ALIGN;
		}

		if(String.isString(_options.align)) switch(_options.align = _options.align.toLowerCase())
		{
			case 'l':
			case 'left':
				_options.align = 'left';
				break;
			case 'c':
			case 'center':
				_options.align = 'center';
				break;
			case 'r':
			case 'right':
				_options.align = 'right';
				break;
			default:
				if(_throw)
				{
					return x('Invalid % option (expecting one of [ %, %, % ])', null, 'align', 'left', 'center', 'right');
				}

				_options.align = null;
				break;
		}
		else
		{
			_options.align = null;
		}

		if(typeof _options.fill === 'boolean')
		{
			_options.fill = (_options.fill ? ' ' : '');
		}
		else if(typeof _options.fill !== 'string')
		{
			if(_options.align)
			{
				_options.fill = DEFAULT_ALIGN_FILL;
			}
			else
			{
				_options.fill = '';
			}

			if(typeof _options.fill === 'boolean')
			{
				_options.fill = (_options.fill ? ' ' : '');
			}
		}

		if(typeof _options.fillLeft !== 'boolean')
		{
			_options.fillLeft = true;
		}

		if(typeof _options.trim !== 'boolean')
		{
			_options.trim = false;
		}

		if(typeof _options.array !== 'boolean')
		{
			_options.array = false;
		}

		//
		_options.width = String.getWidth(_options.width, consoleWidth);

		//
		if(Number.isInt(_options.realLeftSpace))
		{
			_options.leftSpace = _options.realLeftSpace + _options.prefix.textLength;
			delete _options.realLeftSpace;
		}

		if(Number.isInt(_options.leftSpace))
		{
			if(_options.width > 0)
			{
				_options.leftSpace %= (_options.width + 1);
			}

			if(_options.leftSpace < 0)
			{
				if(_options.width > 0)
				{
					_options.leftSpace = ((_options.width + _options.leftSpace) % (_options.width + 1));
				}
				else if(_throw)
				{
					return x('%.% can\'t be negative if no real %.% is defined', null, '_options', 'leftSpace', '_options', 'width');
				}
				else
				{
					_options.leftSpace = Math.abs(_options.leftSpace);
				}
			}

			if((_options.leftSpace -= _options.prefix.textLength) <= 0)
			{
				_options.leftSpace = 0;
			}
		}
		else
		{
			_options.leftSpace = 0;
		}

		if(Number.isInt(_options.rightSpace))
		{
			if(_options.width > 0)
			{
				_options.rightSpace %= (_options.width + 1);
			}

			if(_options.rightSpace < 0)
			{
				if(_options.width > 0)
				{
					_options.rightSpace = ((_options.width + _options.rightSpace) % (_options.width + 1));
				}
				else if(_throw)
				{
					return x('%.% can\'t be negative if no real %.% is defined', null, '_options', 'rightSpace', '_options', 'width');
				}
				else
				{
					_options.rightSpace = Math.abs(_options.rightSpace);
				}
			}

			if(_options.rightSpace <= 0)
			{
				_options.rightSpace = 0;
			}
		}
		else
		{
			_options.rightSpace = 0;
		}

		//
		const printf = (Array.isArray(_options.format, false) ? [ ... _options.format ] : (Array.isArray(_options.printf, false) ? [ ... _options.printf ] : null));
		var string;

		if(printf !== null)
		{
			string = String.printf(_options.colors, this.valueOf(), ... printf);
		}
		else
		{
			string = this.valueOf();
		}

		if(DEFAULT_REPLACE_TABS && _options.tabs > 0)
		{
			string = string.replaces('\t', space(_options.tabs), null);
		}

		if(DEFAULT_REPLACE_DOTS)
		{
			string = string.replaces('...', '…', null);
		}

		string = string.eol(_options.eol);

		//
		var result = space(_options.leftSpace) + _options.prefix;

		/*if(string.length === 0 || string.onlyWhiteSpaces({ ansi: _options.ansi, html: _options.html }))
		{
			if(_options.all)
			{
				result = (string.split(_options.eol).join(_options.prefix));// + _options.eol);
			}
			else
			{
				result += string;
			}

			if(result.indexOf(ESC) > -1)
			{
				result += ansi.none;
			}

			if(_options.array)
			{
				return [ result ];
			}

			return result;
		}*/

		//
		result = [ result ];
		const sequence = [];
		const prefix = (_options.all ? _options.prefix : space(_options.prefix.textLength));
		const prefixLength = _options.prefix.textLength;
		const morePrefixLength = _options.morePrefix.textLength;
		const withCode = (_options.ansi || _options.html);
		var open = '';
		var seq = '';
		var restWidth = _options.width - prefixLength - _options.leftSpace;
		var currWidth = prefixLength + _options.leftSpace;

		//
		const reset = () => {
			restWidth = _options.width - prefixLength - morePrefixLength - _options.leftSpace;
			currWidth = prefixLength + morePrefixLength + _options.leftSpace;
		};

		const next = (_idx_string, _idx_result, _eol = false) => {
			//
			const escIdx = result[_idx_result].indexOf(ESC);
			const nulIdx = result[_idx_result].indexOf(NUL, escIdx + 1);

			if(_options.ansi && escIdx > -1 && nulIdx > -1)
			{
				result[_idx_result] += ansi.none;
			}

			//
			result[++_idx_result] = sequence.join('');

			//
			reset();

			//
			return _idx_result;
		};

		const write = (_str, _idx_string, _idx_result) => {
			if(_str === _options.eol)
			{
				return next(_idx_string, _idx_result, true);
			}
			else if(_str.length === 0)
			{
				return _idx_result;
			}
			else if(_options.width > 0 && restWidth <= _options.rightSpace)
			{
				_idx_result = next(_idx_string, _idx_result, false);
			}

			//
			result[_idx_result] += _str;
			const len = _str.textLength;

			restWidth -= len;
			currWidth += len;

			//
			return _idx_result;
		};

		const openSeq = (_open, _close, _idx_string, _idx_result) => {
			open = _close;
			seq = _open;
			return _idx_result;
		};

		const closeSeq = (_close, _idx_string, _idx_result) => {
			//
			result[_idx_result] += (seq += _close);

			//
			if(seq === ansi.none)
			{
				sequence.length = 0;
			}
			else
			{
				sequence.push(seq);
			}

			//
			seq = open = '';
			return _idx_result;
		};

		for(var i = 0, j = 0; i < string.length; ++i)
		{
			if(string.at(i, _options.eol))
			{
				j = next(i, j, true);
			}
			else if(withCode)
			{
				if(open.length > 0)
				{
					if(string[i] === open)
					{
						closeSeq(string[i], i, j);
					}
					else
					{
						seq += string[i];
					}
				}
				else if(string[i] === ESC && _options.ansi)
				{
					openSeq(ESC, NUL, i, j);
				}
				else if(string[i] === '<' && _options.html)
				{
					openSeq('<', '>', i, j);
					seq = '<';
				}
				else if(string[i] === '&' && _options.html && string.indexOf(';', i) > -1)
				{
					openSeq('&', ';', i, j);
					seq = '&';
				}
				else
				{
					j = write(string[i], i, j);
				}
			}
			else
			{
				j = write(string[i], i, j);
			}
		}

		//
		if(result.last().textLength === 0 && !string.endsWith(_options.eol))
		{
			result.pop();
		}

		//
		if(_options.trim) for(var i = 0; i < result.length; ++i)
		{
			result[i] = result[i].trim({ ansi: _options.ansi, html: _options.html });
		}

		//
		for(var i = 1; i < result.length; ++i)
		{
			result[i] = prefix + _options.morePrefix + space(_options.leftSpace) + result[i];
		}

		//
		var width;

		if(_options.width > 0)
		{
			width = _options.width;
		}
		else
		{
			var len;
			width = 0;

			for(var i = 0; i < result.length; ++i)
			{
				if((len = result[i].textLength) > width)
				{
					width = len;
				}
			}
		}

		if(typeof _options.align === 'string' && width > 0)
		{
			const fills = new Array(result.length);

			for(var i = 0; i < result.length; ++i)
			{
				if(_options.align === 'left')
				{
					fills[i] = 0;
				}
				else
				{
					fills[i] = (width - result[i].textLength);

					if(_options.align === 'center')
					{
						fills[i] = Math.round(fills[i] / 2);
					}
				}
			}

			var diff;

			for(var i = 0; i < result.length; ++i)
			{
				if(fills[i] > 0)
				{
					result[i] = (_options.fill.length > 0 && _options.fillLeft ? String.fill(fills[i], _options.fill) : space(fills[i])) + result[i];
				}
			}
		}

		if(_options.fill.length > 0 && width > 0) for(var i = 0; i < result.length; ++i)
		{
			diff = (width - result[i].textLength);

			if(diff > 0)
			{
				result[i] += String.fill(diff, _options.fill);
			}
		}

		//
		if(_options.array)
		{
			return result;
		}

		return result.join(_options.eol);
	}});

	//
	Object.defineProperty(String.prototype, 'firstOccurrence', { value: function(... _args)
	{
		var CASE_SENSITIVE = true;
		const strings = [];
		const codepoints = [];

		for(var i = 0, s = 0, c = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				CASE_SENSITIVE = _args.splice(i--, 1)[0];
			}
			else if(String.isString(_args[i]))
			{
				strings[s++] = _args[i];
			}
			else if(Number.isInt(_args[i]) && _args[i] >= 0)
			{
				codepoints[c++] = _args[i];
			}
			else
			{
				return x('Invalid %[%] argument (not a non-empty %, a positive % codepoint or a % type)', null, '..._args', i, 'String', 'Integer', 'Boolean');
			}
		}

		if(strings.length === 0 && codepoints.length === 0)
		{
			return null;
		}
		else if(! CASE_SENSITIVE) for(var i = 0; i < strings.length; ++i)
		{
			strings[i] = strings[i].toLowerCase();
		}

		strings.uniq().lengthSort(false);
		codepoints.uniq().sort(false);

		const text = (CASE_SENSITIVE ? this.valueOf() : this.toLowerCase());

		for(var i = 0; i < text.length; ++i)
		{
			for(var j = 0; j < strings.length; ++j)
			{
				if(text.at(i, strings[j]))
				{
					return i;
				}
			}

			for(var j = 0; j < codepoints.length; ++j)
			{
				if(this.codePointAt(i) === codepoints[j] || this.charCodeAt(i) === codepoints[j])
				{
					return i;
				}
			}
		}

		return -1;
	}});

	Object.defineProperty(String.prototype, 'lastOccurrence', { value: function(... _args)
	{
		var CASE_SENSITIVE = true;
		const strings = [];
		const codepoints = [];

		for(var i = 0, s = 0, c = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				CASE_SENSITIVE = _args.splice(i--, 1)[0];
			}
			else if(String.isString(_args[i]))
			{
				strings[s++] = _args[i];
			}
			else if(Number.isInt(_args[i]) && _args[i] >= 0)
			{
				codepoints[c++] = _args[i];
			}
			else
			{
				return x('Invalid %[%] argument (not a non-empty %, a positive % codepoint or a % type)', null, '..._args', i, 'String', 'Integer', 'Boolean');
			}
		}

		if(strings.length === 0 && codepoints.length === 0)
		{
			return null;
		}
		else if(! CASE_SENSITIVE) for(var i = 0; i < strings.length; ++i)
		{
			strings[i] = strings[i].toLowerCase();
		}

		strings.uniq().lengthSort(false);
		codepoints.uniq().sort(false);

		const text = (CASE_SENSITIVE ? this.valueOf() : this.toLowerCase());

		for(var i = text.length - 1; i >= 0; --i)
		{
			for(var j = 0; j < strings.length; ++j)
			{
				if(text.at(i, strings[j]))
				{
					return i;
				}
			}

			for(var j = 0; j < codepoints.length; ++j)
			{
				if(this.codePointAt(i) === codepoints[j] || this.charCodeAt(i) === codepoints[j])
				{
					return i;
				}
			}
		}

		return -1;
	}});

	//
	const _includes = String.prototype.includes;

	Object.defineProperty(String.prototype, 'includes', { value: function(_needle, _position = 0, _case_sensitive = true)
	{
		if(typeof _needle !== 'string')
		{
			return x('Invalid % argument (not a %)', null, '_needle', 'String');
		}
		else if(Number.isInt(_position))
		{
			_position = this.getIndex(_position);
		}
		else
		{
			_position = 0;
		}

		if(! _case_sensitive)
		{
			return _includes.call(this.toLowerCase(), _needle.toLowerCase(), _position);
		}

		return _includes.call(this.valueOf(), _needle, _position);
	}});

	//
	const _indexOf = String.prototype.indexOf;
	const _lastIndexOf = String.prototype.lastIndexOf;

	Object.defineProperty(String.prototype, 'indexOf', { value: function(_search, _offset, _case_sensitive = true, _complex = false)
	{
		if(Number.isInfinite(_offset))
		{
			_offset = 0;
		}
		else if(Number.isInt(_offset))
		{
			if(_offset >= this.length)
			{
				return -1;
			}
			else if(_offset < 0)
			{
				_offset = this.getIndex(_offset);
			}
		}
		else
		{
			_offset = 0;
		}

		if(typeof _case_sensitive !== 'boolean')
		{
			_case_sensitive = true;
		}

		const complex = testComplex(_complex, 'IndexOf', this);

		if(typeof complex === 'function')
		{
			return complex(_search, _offset, _case_sensitive)
		}
		else if(String.isString(_search))
		{
			if(_case_sensitive)
			{
				return _indexOf.call(this, _search, _offset);
			}

			_search = [ _search ];
		}
		else if(Number.isInt(_search) && _search >= 0)
		{
			_search = [ _search ];
		}
		else if(! Array.isArray(_search))
		{
			return x('Invalid % argument (expecting a non-empty % or a non-empty % of non-empty %s)', null, '_search', 'String', 'Array', 'String');
		}
		else if(_search.length === 1 && String.isString(_search[0]) && _case_sensitive !== false)
		{
			return _indexOf.call(this, _search[0], _offset);
		}

		const strings = [];
		const codepoints = [];

		for(var i = 0, s = 0, c = 0; i < _search.length; ++i)
		{
			if(typeof _search[i] === 'boolean')
			{
				_case_sensitive = _search.splice(i--, 1)[0];
			}
			else if(String.isString(_search[i]))
			{
				strings[s++] = _search[i];
			}
			else if(Number.isInt(_search[i]) && _search[i] >= 0)
			{
				codepoints[c++] = _search[i];
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s, positive % codepoints or maybe % types)', null, '_search', i, 'String', 'Integer', 'Boolean');
			}
		}

		if(strings.length === 0 && codepoints.length === 0)
		{
			return null;
		}
		else if(! _case_sensitive) for(var i = 0; i < strings.length; ++i)
		{
			strings[i] = strings[i].toLowerCase();
		}

		strings.uniq().lengthSort(false);
		codepoints.uniq().sort(false);

		const string = (_case_sensitive ? this.valueOf() : this.toLowerCase());

		for(var i = _offset; i < string.length; ++i)
		{
			for(var j = 0; j < strings.length; ++j)
			{
				if(string.at(i, strings[j]))
				{
					return i;
				}
			}

			for(var j = 0; j < codepoints.length; ++j)
			{
				if(this.codePointAt(i) === codepoints[j] || this.charCodeAt(i) === codepoints[j])
				{
					return i;
				}
			}
		}

		return -1;
	}});

	Object.defineProperty(String.prototype, 'lastIndexOf', { value: function(_search, _offset, _case_sensitive = true, _complex = false)
	{
		if(Number.isInfinite(_offset))
		{
			_offset = this.length - 1;
		}
		else if(Number.isInt(_offset))
		{
			if(_offset > this.length)
			{
				return -1;
			}
			else if(_offset < 0)
			{
				_offset = this.getIndex(_offset);
			}
		}
		else
		{
			_offset = this.length - 1;
		}

		if(typeof _case_sensitive !== 'boolean')
		{
			_case_sensitive = true;
		}

		const complex = testComplex(_complex, 'LastIndexOf', this);

		if(typeof complex === 'function')
		{
			return complex(_search, _offset, _case_sensitive)
		}
		else if(String.isString(_search))
		{
			if(_case_sensitive)
			{
				return _lastIndexOf.call(this, _search, _offset);
			}

			_search = [ _search ];
		}
		else if(Number.isInt(_search) && _search >= 0)
		{
			_search = [ _search ];
		}
		else if(! Array.isArray(_search))
		{
			return x('Invalid % argument (expecting a non-empty % or a non-empty % of non-empty %s)', null, '_search', 'String', 'Array', 'String');
		}
		else if(_search.length === 1 && String.isString(_search[0]) && _case_sensitive !== false)
		{
			return _lastIndexOf.call(this, _search[0], _offset);
		}

		const strings = [];
		const codepoints = [];

		for(var i = 0, s = 0, c = 0; i < _search.length; ++i)
		{
			if(typeof _search[i] === 'boolean')
			{
				_case_sensitive = _search.splice(i--, 1)[0];
			}
			else if(String.isString(_search[i]))
			{
				strings[s++] = _search[i];
			}
			else if(Number.isInt(_search[i]) && _search[i] >= 0)
			{
				codepoints[c++] = _search[i];
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s, positive % codepoints or maybe % types)', null, '_search', i, 'String', 'Integer', 'Boolean');
			}
		}

		if(strings.length === 0 && codepoints.length === 0)
		{
			return null;
		}
		else if(! _case_sensitive) for(var i = 0; i < strings.length; ++i)
		{
			strings[i] = strings[i].toLowerCase();
		}

		strings.uniq().lengthSort(false);
		codepoints.uniq().sort(false);

		const string = (_case_sensitive ? this.valueOf() : this.toLowerCase());

		for(var i = _offset; i >= 0; --i)
		{
			for(var j = 0; j < strings.length; ++j)
			{
				if(string.at(i, strings[j]))
				{
					return i;
				}
			}

			for(var j = 0; j < codepoints.length; ++j)
			{
				if(this.codePointAt(i) === codepoints[j] || this.charCodeAt(i) === codepoints[j])
				{
					return i;
				}
			}
		}

		return -1;
	}});

	Object.defineProperty(String.prototype, 'indicesOf', { value: function(_search, _case_sensitive = true, _complex = false)
	{
		const complex = testComplex(_complex, 'IndicesOf', this);

		if(typeof complex === 'function')
		{
			return complex(_search, _case_sensitive);
		}
		else if(String.isString(_search))
		{
			_search = [ _search ];
		}
		else if(Number.isInt(_search) && _search >= 0)
		{
			_search = [ _search ];
		}
		else if(! Array.isArray(_search))
		{
			return x('Invalid % argument (expecting a non-empty % or a non-empty % of non-empty %s)', null, '_search', 'String', 'Array', 'String');
		}
		else if(typeof _case_sensitive !== 'boolean')
		{
			_case_sensitive = true;
		}

		const strings = [];
		const codepoints = [];

		for(var i = 0, s = 0, c = 0; i < _search.length; ++i)
		{
			if(typeof _search[i] === 'boolean')
			{
				_case_sensitive = _search.splice(i--, 1)[0];
			}
			else if(String.isString(_search[i]))
			{
				strings[s++] = _search[i];
			}
			else if(Number.isInt(_search[i]) && _search[i] >= 0)
			{
				codepoints[c++] = _search[i];
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s, positive % codepoints or maybe % types)', null, '_search', i, 'String', 'Integer', 'Boolean');
			}
		}

		if(strings.length === 0 && codepoints.length === 0)
		{
			return null;
		}
		else if(! _case_sensitive) for(var i = 0; i < strings.length; ++i)
		{
			strings[i] = strings[i].toLowerCase();
		}

		strings.uniq().lengthSort(false);
		codepoints.uniq().sort(false);

		const string = (_case_sensitive ? this.valueOf() : this.toLowerCase());
		const result = [];
		var found;

		for(var i = 0, j = 0; i < string.length; ++i)
		{
			found = false;

			for(var k = 0; k < strings.length; ++k)
			{
				if(string.at(i, strings[k]))
				{
					result[j++] = i;
					i += (strings[k].length - 1);
					found = true;
					break;
				}
			}

			if(! found) for(var k = 0; k < codepoints.length; ++k)
			{
				if(this.codePointAt(i) === codepoints[k] || this.charCodeAt(i) === codepoints[k])
				{
					result[j++] = i;
					i += (String.fromCodePoint(codepoints[k]).length - 1);
					found = true;
					break;
				}
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String, 'getWidth', { value: function(_width, _console_width = console.width, _force_file = false, _fallback = 0, _throw = true)
	{
		return String.getSize('width', _width, _console_width, _force_file, _fallback, _throw);
	}});

	Object.defineProperty(String, 'getHeight', { value: function(_height, _console_height = console.height, _force_file = false, _fallback = 0, _throw = true)
	{
		return String.getSize('height', _height, _console_height, _force_file, _fallback, _throw);
	}});

	Object.defineProperty(String, 'getSize', { value: function(_type, _size, _console_size, _force_file = false, _fallback = 0, _throw = true)
	{
		//
		if(String.isString(_type)) switch(_type = _type.toLowerCase())
		{
			case 'width':
			case 'height':
				break;
			default:
				_type = null;
				break;
		}
		else
		{
			_type = null;
		}

		if(! _type)
		{
			return x('Invalid % argument (please use %.% or %.%)', null, '_type', 'String', 'getWidth', 'String', 'getHeight');
		}

		//
		if(typeof _throw !== 'boolean')
		{
			_throw = true;
		}

		if(typeof _force_file !== 'boolean')
		{
			_force_file = false;
		}

		if(_force_file || _console_size === null)
		{
			return _fallback;
		}
		else if(!Number.isInt(_console_size))
		{
			switch(_type)
			{
				case 'width':
					_console_size = console.width;
					break;
				case 'height':
					_console_size = console.height;
					break;
			}

			if(! Number.isInt(_console_size))
			{
				_console_size = 0;
			}
		}
		else if(_console_size <= 0)
		{
			_console_size = 0;
		}

		_console_size = Math.abs(_console_size.int);

		var size;
		var unit = '';

		if(Number.isNumber(_size))
		{
			size = _size;
		}
		else if(String.isString(_size))
		{
			if(_size.isNumber())
			{
				size = _size.parseNumber();
			}
			else
			{
				if(_size.endsWith('px'))
				{
					size = _size.removeLast(2);
				}
				else if(_size[_size.length - 1] === '%')
				{
					size = _size.removeLast();
					unit = '%';
				}
				else
				{
					size = null;
				}

				if(size === null || !size.isNumber())
				{
					if(_throw)
					{
						return x('Your % argument can\'t be parsed to a %', null, '_size', 'Number');
					}

					return _fallback;
				}
				else
				{
					size = size.parseNumber();
				}
			}
		}
		else if(_console_size > 0)
		{
			size = _console_size;
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting an %)', null, '_size', 'Integer');
		}
		else
		{
			return _fallback;
		}

		/*if(size === 0)
		{
			return _fallback;
		}
		else*/ if(! unit && (size > -1 && size < 1))
		{
			size *= 100;
			unit = '%';
		}

		size = size.int;

		//
		var result;

		if(unit === '%')
		{
			var neg;

			if(size < 0)
			{
				size = Math.abs(size);
				neg = true;
			}
			else
			{
				neg = false;
			}

			if(_console_size === 0)
			{
				if(_throw)
				{
					return x('Can\'t calculate percent due to missing % (%)', null, '_console_size', _console_size);
				}

				return _fallback;
			}

			size = (_console_size * size / 100).int;

			if(neg)
			{
				size = -size;
			}
		}

		if(_console_size === 0)
		{
			if(_throw)
			{
				return x('Can\'t calculate negative % due to missing % (%)', null, '_size', '_console_size', _console_size);
			}

			return _fallback;
		}
		else if(size > _console_size)
		{
			size = ((size % (_console_size + 1)) + 1);
			result = (_console_size - size);
		}
		else if(size < 0)
		{
			if((result = (size % (_console_size + 1))) < 0)
			{
				result = (_console_size + 1 + result % (_console_size + 1));
			}
		}
		else
		{
			result = size;
		}

		if(result === 0)
		{
			++result;
		}

		return result;
	}});

	Object.defineProperty(String, 'getX', { value: String.getWidth });
	Object.defineProperty(String, 'getY', { value: String.getHeight });
	Object.defineProperty(String, 'getPosition', { value: String.getSize });

	//
	Object.defineProperty(String, 'align', { value: function(... _args)
	{
		//
		const vector = [];
		var THROW = true;

		for(var i = 0, j = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				THROW = _args.splice(i--, 1)[0];
			}
			else if(Object.isObject(_args[i]))
			{
				vector[j++] = { ... _args[i] };
			}
			else if(String.isString(_args[i]))
			{
				vector[j++] = { value: _args[i] };
			}
			else if(Number.isInt(_args[i]))
			{
				vector[j++] = { value: '', width: _args[i], isGap: true };
			}
			else
			{
				return x('Invalid %[%] argument (neither a % nor an % nor a % nor a % type)', null, '..._args', i, 'String', 'Object', 'Array', 'Boolean');
			}
		}

		if(vector.length === 0)
		{
			return x('Insufficient argument count (please argue with %s and/or %s)', null, 'Object', 'Array');
		}

		const vectorApply = (_key, _value, _if_not = null) => {
			if(String.isString(_if_not))
			{
				_if_not = [ _if_not ];
			}
			else if(Array.isArray(_if_not))
			{
				_if_not.uniq();
			}

			var type, apply;

			for(var i = 0; i < vector.length; ++i)
			{
				type = Object.typeOf(vector[i][_key]);
				apply = true;

				if(Array.isArray(_if_not)) for(var j = 0; j < _if_not.length; ++j)
				{
					if(_if_not[j] === 'Array' && _if_not.length === 1)
					{
						apply = false;
						break;
					}
					else if(Object.typeOf(vector[i][_key]) === _if_not[j])
					{
						apply = false;
						break;
					}
				}

				if(! apply)
				{
					continue;
				}

				if(Array.isArray(_if_not) && _if_not[0] === 'Array' && Array.isArray(array[i][_key], true))
				{
					if(Array.isArray(_value, true))
					{
						vector[i][_key].concat(_value);
					}
					else
					{
						vector[i][_key].push(_value);
					}
				}
				else
				{
					vector[i][_key] = _value;
				}
			}
		};

		const options = {};

		for(var i = 0; i < vector.length; ++i)
		{
			if(typeof vector[i].value !== 'string')
			{
				options.assign(vector.splice(i--, 1)[0]);
			}
		}

		if(vector.length === 0)
		{
			return x('None of your vector objects contains a .% % attribute', null, 'value', 'String');
		}

		if(typeof options.forceFile !== 'boolean')
		{
			if(typeof options.file === 'boolean')
			{
				options.forceFile = options.file;
				delete options.file;
			}
			else
			{
				options.forceFile = !!BROWSER;
			}
		}

		if(options.forceFile)
		{
			options.width = 0;
		}
		else
		{
			options.width = String.getWidth(options.width);
		}

		//
		if(Number.isInt(options.realLeftSpace))
		{
			vectorApply('realLeftSpace', options.realLeftSpace, 'Number');
		}
		else if(Number.isInt(options.leftSpace))
		{
			vectorApply('leftSpace', options.leftSpace, 'Number');
		}

		if(Number.isInt(options.rightSpace))
		{
			vectorApply('rightSpace', options.rightSpace, 'Number');
		}

		//
		if(typeof options.array !== 'boolean')
		{
			options.array = false;
		}

		vectorApply('array', true);

		//
		if(Number.isInt(options.itemWidth) || String.isString(options.itemWidth))
		{
			options.itemWidth = String.getWidth(options.itemWidth);
		}

		vectorApply('width', options.itemWidth, [ 'Number', 'String']);

		//
		if(Number.isInt(options.prefix) && options.prefix >= 0)
		{
			options.prefix = space(options.prefix);
		}
		else if(typeof options.prefix !== 'string')
		{
			options.prefix = '';
		}

		vectorApply('prefix', options.prefix, [ 'String', 'Number' ]);

		//
		if(options.align === true)
		{
			options.align = DEFAULT_ALIGN;
		}
		else if(options.align === false || options.align === null)
		{
			options.align = null;
		}
		else if(! String.isString(options.align))
		{
			options.align = DEFAULT_ALIGN;
		}

		if(String.isString(options.align)) switch(options.align = options.align.toLowerCase())
		{
			case 'l':
			case 'left':
				options.align = 'left';
				break;
			case 'c':
			case 'center':
				options.align = 'center';
				break;
			case 'r':
			case 'right':
				options.align = 'right';
				break;
			default:
				if(_throw)
				{
					return x('Invalid % option (expecting one of [ %, %, % ])', null, 'align', 'left', 'center', 'right');
				}

				options.align = null;
				break;
		}
		else
		{
			options.align = null;
		}

		if(options.itemAlign === true)
		{
			options.itemAlign = DEFAULT_ALIGN;
		}
		else if(options.itemAlign === false || options.itemAlign === null)
		{
			options.itemAlign = null;
		}
		else if(! String.isString(options.itemAlign))
		{
			options.itemAlign = DEFAULT_ALIGN;
		}

		if(String.isString(options.itemAlign)) switch(options.itemAlign = options.itemAlign.toLowerCase())
		{
			case 'l':
			case 'left':
				options.itemAlign = 'left';
				break;
			case 'c':
			case 'center':
				options.itemAlign = 'center';
				break;
			case 'r':
			case 'right':
				options.itemAlign = 'right';
				break;
			default:
				if(_throw)
				{
					return x('Invalid % option (expecting one of [ %, %, % ])', null, 'align', 'left', 'center', 'right');
				}

				options.itemAlign = null;
				break;
		}
		else
		{
			options.itemAlign = null;
		}

		if(options.itemAlign)
		{
			vectorApply('align', options.itemAlign, [ 'String', 'Number', 'Boolean', 'Null' ]);
		}

		//
		if(typeof options.fill === 'boolean')
		{
			options.fill = (options.fill ? ' ' : '');
		}
		else if(typeof options.fill !== 'string')
		{
			if(options.align || options.itemAlign)
			{
				options.fill = DEFAULT_ALIGN_FILL;
			}
			else
			{
				options.fill = '';
			}

			if(typeof options.fill === 'boolean')
			{
				options.fill = (options.fill ? ' ' : '');
			}
		}

		vectorApply('fill', options.fill, [ 'Boolean', 'String' ]);

		if(typeof options.fillLeft === 'boolean')
		{
			vectorApply('fillLeft', options.fillLeft, 'Boolean');
		}

		if(typeof options.fullFill !== 'boolean')
		{
			options.fullFill = !!options.fill;
		}

		//
		if(options.verticalAlign === true)
		{
			options.verticalAlign = DEFAULT_ALIGN_VERTICAL;
		}
		else if(options.verticalAlign === false || options.verticalAlign === null)
		{
			options.verticalAlign = null;
		}
		else if(! String.isString(options.verticalAlign))
		{
			options.verticalAlign = DEFAULT_ALIGN_VERTICAL;
		}

		const valign = (_value) => {
			if(String.isString(_value)) switch(_value.toLowerCase())
			{
				case 't':
				case 'top':
					return 'top';
				case 'm':
				case 'middle':
					return 'middle';
				case 'b':
				case 'bottom':
					return 'bottom';
				default:
					if(THROW)
					{
						return x('Invalid % option (expecting one of [ %, %, % ])', null, 'verticalAlign', 'top', 'middle', 'bottom');
					}

					return null;
			}
			else
			{
				return null;
			}
		};

		options.verticalAlign = valign(options.verticalAlign);

		for(var i = 0; i < vector.length; ++i)
		{
			if('verticalAlign' in vector[i])
			{
				vector[i].verticalAlign = valign(vector[i].verticalAlign);
			}
			else
			{
				vector[i].verticalAlign = options.verticalAlign;
			}
		}

		//
		if(typeof options.xml === 'boolean')
		{
			if(typeof options.html !== 'boolean')
			{
				options.html = options.xml;
			}

			delete options.xml;
		}

		if(typeof options.html !== 'boolean')
		{
			options.html = !!BROWSER;
		}

		if(typeof options.ansi !== 'boolean')
		{
			options.ansi = !BROWSER;
		}

		vectorApply('html', options.html, 'Boolean');
		vectorApply('ansi', options.ansi, 'Boolean');

		//
		if(typeof options.colors !== 'boolean')
		{
			options.colors = !!COLORS
		}

		vectorApply('colors', options.colors, 'Boolean');

		//
		if(typeof options.all !== 'boolean')
		{
			options.all = false;
		}

		vectorApply('all', options.all, 'Boolean');

		//
		if(Number.isInt(options.morePrefix) && options.morePrefix >= 0)
		{
			options.morePrefix = space(options.morePrefix);
		}
		else if(typeof options.morePrefix !== 'string')
		{
			options.morePrefix = '';
		}

		vectorApply('morePrefix', options.morePrefix, [ 'String', 'Number' ]);

		//
		if(Number.isInt(options.eol) && options.eol >= 0)
		{
			options.eol = eol(options.eol);
		}
		else if(typeof options.eol !== 'string')
		{
			options.eol = EOL;
		}

		vectorApply('eol', options.eol, 'String');

		//
		if(options.tabs === false)
		{
			options.tabs = 1;
		}
		else if(options.tabs === true)
		{
			options.tabs = TABS;
		}
		else if(! (Number.isInt(options.tabs) && options.tabs >= 0))
		{
			options.tabs = TABS;
		}

		vectorApply('tabs', options.tabs, 'Number');

		//
		if(typeof options.trim !== 'boolean' && typeof options.trim !== 'string')
		{
			options.trim = ' ';
		}

		vectorApply('trim', options.trim, [ 'Boolean', 'String' ]);

		//
		if(Array.isArray(options.format))
		{
			vectorApply('format', options.format, 'Array');
		}
		else if(Array.isArray(options.printf))
		{
			vectorApply('printf', options.printf, 'Array');
		}

		//
		if(typeof options.rest !== 'boolean')
		{
			options.rest = true;
		}

		//
		if(Number.isInt(options.space))
		{
			options.space = Math.abs(options.space);

			if(options.width > 0)
			{
				if(options.space > 0)
				{
					options.space %= (options.width + 1);
				}
				else if(options.space < 0)
				{
					options.space = ((options.width + options.space) % (options.width + 1));
				}
			}

			options.space = space(options.space);
		}
		else if(typeof options.space === 'boolean')
		{
			options.space = (options.space ? space(1) : '');
		}
		else if(typeof options.space !== 'string')
		{
			options.space = space(1);
		}

		for(var i = 0; i < vector.length; ++i)
		{
			if(Number.isInt(vector[i].space))
			{
				vector[i].space = space(Math.abs(vector[i].space));
			}
			else if(typeof vector[i].space === 'boolean')
			{
				vector[i].space = (vector[i].space ? space(1) : '');
			}
			else if(typeof vector[i].space !== 'string')
			{
				vector[i].space = options.space;
			}
		}

		if(options.width > 0)
		{
			for(var i = 0; i < vector.length; ++i)
			{
				if((options.width -= vector[i].space.textLength) <= 0)
				{
throw new Error('TODO');
				}

				if(Number.isNumber(vector[i].width) || String.isString(vector[i].width))
				{
					vector[i].width = String.getWidth(vector[i].width, options.width);
				}
			}
		}

		for(var i = 0; i < vector.length; ++i)
		{
			if(vector[i].isGap)
			{
				if((vector[i].width -= (vector[i].space.textLength * 2)) <= 0)
				{
throw new Error('TODO');
				}
			}
		}

		//
		if(options.width === 0)
		{
			for(var i = 0; i < vector.length; ++i)
			{
				if(! Number.isInt(vector[i].width))
				{
					vector[i].width = 0;
				}
			}
		}
		else
		{
			for(var i = 0; i < vector.length; ++i)
			{
				if(Number.isNumber(vector[i].width) || String.isString(vector[i].width))
				{
					vector[i].width = String.getWidth(vector[i].width, options.width);
				}
			}

			var sum = 0;
			const not = [];

			for(var i = 0, j = 0; i < vector.length; ++i)
			{
				if(Number.isNumber(vector[i].width))
				{
					sum += vector[i].width;
				}
				else
				{
					not[j++] = i;
				}
			}

			if(not.length > 0)
			{
				var rest = (options.width - sum);
				const avg = Math.floor(rest / not.length);

				for(var i = 0; i < not.length; ++i)
				{
					if(options.rest)
					{
						if(i < (not.length - 1))
						{
							rest -= (vector[not[i]].width = avg - vector[not[i]].space.textLength);
						}
						else
						{
							rest -= (vector[not[i]].width = rest - vector[not[i]].space.textLength);
						}
					}
					else
					{
						rest -= (vector[not[i]].width = avg - vector[not[i]].space.textLength);
					}
				}
			}
		}

		//
		const widths = new Array(vector.length);
		const spaces = new Array(vector.length);
		const valigns = new Array(vector.length);

		for(var i = 0; i < vector.length; ++i)
		{
			widths[i] = vector[i].width;
			spaces[i] = vector[i].space;
			valigns[i] = vector[i].verticalAlign;
			vector[i] = vector[i].value.toText(vector[i], options.forceFile, THROW);
		}

		//
		const maxLines = Math.longest(... vector);
		const result = new Array(maxLines);

		for(var i = 0; i < vector.length; ++i)
		{
			for(var j = 0; j < vector[i].length; ++j)
			{
				vector[i][j] = spaces[i] + vector[i][j];
			}
		}

		const max = Math.longest(... vector);
		const fills = new Array(vector.length);
		var va, fill, f;

		if(options.fill.length > 0 && options.fullFill)
		{
			f = options.fill;
		}
		else
		{
			f = '';
		}

		for(var i = 0; i < vector.length; ++i)
		{
			//
			fill = spaces[i] + (f.length === 0 ? '' : String.fill(widths[i], f));

			//
			if(typeof valigns[i] === 'string')
			{
				va = valigns[i];
			}
			else if(typeof options.verticalAlign === 'string')
			{
				va = options.verticalAlign;
			}
			else
			{
				continue;
			}

			if(va === 'top')
			{
				fills[i] = 0;
			}
			else
			{
				fills[i] = (max - vector[i].length);

				if(va === 'middle')
				{
					fills[i] = Math.floor(fills[i] / 2);
				}
			}

			for(var j = 0; j < fills[i]; ++j)
			{
				vector[i].unshift(fill);
				//vector[i].unshift('');
			}
		}

		for(var i = 0; i < vector.length - 1; ++i)
		{
			if(widths[i] > 0)
			{
				for(var j = 0; j < vector[i].length; ++j)
				{
					vector[i][j] = vector[i][j].padEnd(widths[i] + spaces[i].textLength, ' ');
				}
			}
		}

		const fillFunc = (_j) => {
			if(options.fill.length === 0 || !options.fullFill)
			{
				return space(widths[_j] + spaces[_j].textLength);
			}

			return space(spaces[_j].textLength) + String.fill(widths[_j], options.fill);
		};

		for(var i = 0; i < maxLines; ++i)
		{
			result[i] = '';

			for(var j = 0; j < vector.length; ++j)
			{
				if(vector[j].length > i)
				{
					result[i] += vector[j][i];
				}
				else if(widths[j] > 0)
				{
					result[i] += fillFunc(j);
				}
			}
		}

		//
		if(Number.isNumber(options.height) || String.isString(options.height))
		{
			options.height = String.getHeight(options.height, console.height, false, true);
		}

		if(Number.isNumber(options.height) && options.height > result.length)
		{
			const diff = ((options.height = options.height.int) - result.length);

			if(options.verticalAlign && options.verticalAlign !== 'top')
			{
				if(options.verticalAlign === 'bottom')
				{
					for(var i = 0; i < diff; ++i)
					{
						result.unshift('');
					}
				}
				else
				{
					const top = Math.round(diff / 2);
					const bottom = (options.height - top);

					for(var i = 0; i < top; ++i)
					{
						result.unshift('');
					}

					for(var i = result.length, j = 0; j < bottom; ++i, ++j)
					{
						result[i] = '';
					}
				}
			}
			else for(var i = 0, j = result.length; i < diff; ++i, ++j)
			{
				result[j] = '';
			}
		}

		//
		if(options.align && options.align !== 'left' && options.width > 0)
		{
			const fills = new Array(result.length);

			for(var i = 0; i < result.length; ++i)
			{
				fills[i] = (options.width - result[i].textLength);

				if(options.align === 'center')
				{
					fills[i] = Math.round(fills[i] / 2);
				}
			}

			for(var i = 0; i < result.length; ++i)
			{
				if(fills[i] > 0)
				{
					result[i] = (String.fill(fills[i], ' ') + result[i]);
				}
			}
		}

		//
		if(options.array)
		{
			return result;
		}

		return result.join(options.eol);
	}});

	//
	Object.defineProperty(String.prototype, '_split', { value: String.prototype.split });

	Object.defineProperty(String.prototype, 'split', { value: function(_sep, _limit, _rest = false, _not)
	{
		//
		if(! Number.isInt(_limit))
		{
			_limit = null;
		}
		else if(_limit === 0)
		{
			return [];
		}

		if(typeof _rest !== 'boolean')
		{
			_rest = false;
		}

		//
		if(RegExp.isRegExp(_sep))
		{
			if(! (Number.isInt(_limit) && _limit >= 0))
			{
				_limit = undefined;
			}

			return this._split(_sep, _limit);
		}
		else if(typeof _sep === 'string')
		{
			_sep = [ _sep ];
		}
		else if(! Array.isArray(_sep))
		{
			return x('Invalid % argument (neither a % nor a non-empty %)', null, '_sep', 'String', 'Array');
		}

		if(String.isString(_not))
		{
			_not = [ _not ];
		}
		else if(! Array.isArray(_not))
		{
			_not = [];
		}

		//
		for(var i = 0; i < _sep.length; ++i)
		{
			if(typeof _sep[i] !== 'string')
			{
				return x('Invalid %[%] argument (not a %)', null, '_sep', i, 'String');
			}
		}

		for(var i = _not.length - 1; i >= 0; --i)
		{
			if(! String.isString(_not[i]))
			{
				_not.splice(i, 1);
			}
		}

		_sep.uniq().lengthSort(false);
		_not.uniq().lengthSort(false);

		//
		const result = [];
		var sub = '';
		var cont;
		var dat;

		if(_limit !== null && _limit < 0)
		{
			//
			_limit = -_limit;

			//
			for(var i = this.length - 1; i >= 0; --i)
			{
				cont = false;

				for(var j = 0; j < _not.length; ++j)
				{
					if(_not[j].length === 0 || this.at(i - _not[j].length, _not[j]))
					{
						dat = (_not[j].length === 0 ? this[i] : _not[j]);
						sub = this.substr(i - dat.length + 1, dat.length) + sub;
						i -= (dat.length - 1);
						cont = true;
						break;
					}
				}

				if(cont)
				{
					continue;
				}
				else for(var j = 0; j < _sep.length; ++j)
				{
					if(_sep[j].length === 0 || this.at(i - _sep[j].length + 1, _sep[j]))
					{
						dat = (_sep[j].length === 0 ? this[i] : _sep[j]);
						result.unshift(sub);
						i -= (dat.length - 1);
						sub = '';

						if(result.length >= _limit)
						{
							if(_rest && i > 0)
							{
								result[0] = this.substr(0, i + dat.length) + result[0];
							}

							return result;
						}

						cont = true;
						break;
					}
				}

				if(! cont)
				{
					sub = this[i] + sub;
				}
			}
		}
		else for(var i = 0, j = 0; i < this.length; ++i)
		{
			cont = false;

			for(var k = 0; k < _not.length; ++k)
			{
				if(_not[k].length === 0 || this.at(i, _not[k]))
				{
					dat = (_not[k].length === 0 ? this[i] : _not[k]);
					sub += this.substr(i, dat.length);
					i += (dat.length - 1);
					cont = true;
					break;
				}
			}

			if(cont)
			{
				continue;
			}
			else for(var k = 0; k < _sep.length; ++k)
			{
				if(_sep[k].length === 0 || this.at(i, _sep[k]))
				{
					if(_sep[k].length === 0 && sub.length === 0)
					{
						sub = this[i];
					}

					dat = (_sep[k].length === 0 ? this[i] : _sep[k]);
					result[j++] = sub;
					sub = '';
					i += (dat.length - 1);

					if(_limit !== null && result.length >= _limit)
					{
						if(_rest)
						{
							result[result.length - 1] += this.substr(i + dat.length);
						}

						return result;
					}

					cont = true;
					break;
				}
			}

			if(! cont)
			{
				sub += this[i];
			}
		}

		if(sub.length > 0)
		{
			if(_limit !== null && _limit < 0)
			{
				result.unshift(sub);
			}
			else
			{
				result.push(sub);
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'getLines', { value: function(_count, _rest = false, _max_length, _complex = false, _xml = BROWSER)
	{
		//
		if(! Number.isInt(_count))
		{
			_count = null;
		}
		else if(_count === 0)
		{
			return [];
		}

		if(typeof _rest !== 'boolean')
		{
			_rest = false;
		}

		if(! (Number.isInt(_max_length) && _max_length > 0))
		{
			_max_length = 0;
		}

		if(typeof _complex !== 'boolean')
		{
			_complex = false;
		}

		if(typeof _xml !== 'boolean')
		{
			_xml = BROWSER;
		}

		//
		const getLength = (_string) => {
			if(_complex)
			{
				return _string.textLength;
			}

			return _string.length;
		}

		//
		const result = [];
		var eol, add, line = '';
		var added;
		var open = (_complex ? false : null);

		if(_count !== null && _count < 0)
		{
			_count = -_count;

			for(var i = this.length - 1; i >= 0; --i)
			{
				if(open === true)
				{
					line += this[i];

					if(this[i] === NUL)
					{
						open = false;
					}
				}
				else if(_complex && this[i] === ESC)
				{
					open = true;
					line += this[i];
				}
				else if(this[i] === '\n')
				{
					add = 0;

					if(i > 0 && this[i - 1] === '\r')
					{
						--i;
						add = 1;
					}

					result.unshift(line);
					line = '';
				}
				else if(this[i] === '\r')
				{
					add = 0;

					if(i > 0 && this[i - 1] === '\n')
					{
						--i;
						add = 1;
					}

					result.unshift(line);
					line = '';
				}
				else
				{
					line = this[i] + line;

					if(_max_length > 0 && getLength(line) >= _max_length)
					{
						result.unshift(line);
						line = '';
					}
				}

				if(!open && line.length === 0 && getLength(result) >= _count)
				{
					if(_rest && i > 0)
					{
						result[0] = this.substr(0, i - add + 1) + result[0];
					}

					return result;
				}
			}
		}
		else for(var i = 0, j = 0; i < this.length; ++i)
		{
			if(open === true)
			{
				line += this[i];

				if(this[i] === NUL)
				{
					open = false;
				}
			}
			else if(_complex && this[i] === ESC)
			{
				line += this[i];
				open = true;
			}
			else if((eol = this.isEOL(i, _xml)).length === 0)
			{
				line += this[i];

				if(_max_length > 0 && getLength(line) >= _max_length)
				{
					result[j++] = line;
					line = '';
				}
			}
			else
			{
				result[j++] = line;
				line = '';
				i += (eol.length - 1);
			}

			if(!open && _count !== null && getLength(line) === 0 && getLength(result) >= _count)
			{
				if(_rest)
				{
					result[result.length - 1] += this.substr(i + eol.length - 1);
				}

				return result;
			}
		}

		if(line.length > 0)
		{
			if(_count !== null && _count < 0)
			{
				result.unshift(line);
			}
			else
			{
				result.push(line);
			}
		}

		const end = this.endsWith('\r', '\n');

		for(var i = 0; i < end; ++i)
		{
			if(_count !== null && _count < 0)
			{
				result.unshift('');
			}
			else
			{
				result.push('');
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'applyAlphabet', { value: function(_radix_alphabet = DEFAULT_RADIX)
	{
		if(_radix_alphabet === 256)
		{
			return this.valueOf();
		}
		else if(! isRadix(_radix_alphabet, false, true))
		{
			return x('Invalid % argument (not a % - neither a % nor a %)', null, '_radix_alphabet', 'RADIX', 'Integer', 'String');
		}

		const alpha = alphabet(_radix_alphabet, true);
		var result = '';

		if(typeof alpha === 'string') for(var i = 0; i < this.length; ++i)
		{
			if(alpha.indexOf(this[i]) > -1)
			{
				result += this[i];
			}
		}
		else if(Number.isInt(alpha)) for(var i = 0; i < this.unicodeLength; ++i)
		{
			if(this.codePointAt(i) < alpha)
			{
				result += this.at(i);
			}
		}
		else
		{
			return x('Unexpected (alphabet is neither % nor %)', null, 'String', 'Integer');
		}

		return result;
	}});

	//
	Object.defineProperty(String, 'hash', { get: function()
	{
		if(typeof crypto === 'undefined')
		{
			require('+crypto');
		}

		return [ crypto.getHashes() ];
	}});

	if(BROWSER) Object.defineProperty(String.prototype, 'hash', { value: /*async*/ function(_callback, _hash = DEFAULT_HASH_HASH_BROWSER)
	{
		if(typeof window.crypto === 'undefined' || typeof window.crypto.subtle === 'undefined' || typeof window.crypto.subtle.digest !== 'function')
		{
			return x('Not enough % support in your browser', null, 'crypto');
		}
		else if(! String.isString(_hash))
		{
			return x('Invalid % argument (not a non-empty %)', null, '_hash', 'String');
		}
		else if(typeof _callback !== 'function')
		{
			return x('Invalid % argument (not a %)', null, '_callback', 'Function');
		}

		var data, hash, string;

		try
		{
			data = new TextEncoder().encode(this.valueOf());

			hash = window.crypto.subtle.digest(_hash, data).then((_hash) => {
				return _callback(null, new TextDecoder().decode(_hash), _hash, data, this.valueOf());
			}).catch((_error) => {
				return _callback(_error, null, null, null, null);
			});

			return data;
		}
		catch(_error)
		{
			return _callback(_error, null, null, null, null);
		}

		return null;
	}}); else Object.defineProperty(String.prototype, 'hash', { value: function(_hash = DEFAULT_HASH_HASH, _digest = DEFAULT_HASH_DIGEST)
	{
		if(typeof Buffer === 'undefined')
		{
			return x('TODO (no "Buffer" available; todo @ BROWSER..)');
		}
		else if(! String.isString(_hash))
		{
			return x('Invalid % argument (not a %; see \'%.%\')', null, '_hash', 'String', 'String', 'hashes');
		}
		else if(! String.isString(_digest) && _digest !== null)
		{
			return x('Invalid % argument (not a %; see \'%.%\', and % is also possible)', null, '_digest', 'String', 'String', 'encoding', null);
		}
		else
		{
			_hash = _hash.toLowerCase();

			if(_digest !== null)
			{
				_digest = _digest.toLowerCase();
			}
		}

		const wasNull = (_digest === null);

		if(wasNull)
		{
			_digest = 'utf8';
		}

		const encodings = String.encoding;
		const hashes = String.hash;

		if(encodings.indexOf(_digest) === -1)
		{
			return x('Invalid % argument (get a list of supported encodings via \'%.%\')', null, '_digest', 'String', 'encoding');
		}
		else if(hashes.indexOf(_hash) === -1)
		{
			return x('Invalid % argument (get a list of supported hash algorithms via \'%.%\')', null, '_hash', 'String', 'hash');
		}

		//
		const hash = crypto.createHash(_hash);
		hash.update(this.valueOf());

		const result = hash.digest(_digest);

		if(wasNull)
		{
			return Uint8Array.fromString(result);
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'toArray', { value: function(_unicode = DEFAULT_UNICODE)
	{
		if(typeof _unicode !== 'boolean')
		{
			_numbers = DEFAULT_UNICODE;
		}

		const len = (_unicode ? this.unicodeLength : this.length);
		const result = new Array(len);

		for(var i = 0; i < len; ++i)
		{
			result[i] = this.codePointAt(i);
		}

		return result;
	}});

	//
	Object.defineProperty(String, 'specialCharacters', { get: function()
	{
		return ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
	}});

	//
	Object.defineProperty(String.prototype, 'lineMax', { value: function(_max, _complex = false, _eol = EOL)
	{
		if(! (Number.isInt(_max) && _max > 0))
		{
			return x('Invalid % argument (not an % above %)', null, '_max', 'Integer', 'zero');
		}
		else if(typeof _eol !== 'string')
		{
			_eol = EOL;
		}

		if(typeof _complex !== 'boolean')
		{
			_complex = false;
		}

		var result = '';
		var lineEnd, line = '';

		getLength = (_string) => {
			if(_complex)
			{
				return _string.textLength;
			}

			return _string.length;
		}

		for(var i = 0; i < this.length; ++i)
		{
			if((lineEnd = this.isEOL(i)).length === 0)
			{
				line += this[i];

				if(getLength(line) >= _max)
				{
					result += line + _eol;
					line = '';
				}
			}
			else
			{
				result += line + _eol;
				line = '';
				i += (lineEnd.length - 1);
			}
		}

		return result;
	}});

	Object.defineProperty(String, 'lineMax', { value: function(_array_string, _complex = false)
	{
		var string;

		if(Array.isArray(_array_string, true))
		{
			string = _array_string.join(EOL);
		}
		else if(typeof _array_string === 'string')
		{
			string = _array_string;
		}
		else
		{
			return x('Invalid % argument (neither an %, nor a %)', null, '_array_string', 'Array', 'String');
		}

		if(string.length === 0)
		{
			return 0;
		}

		if(typeof _complex !== 'boolean')
		{
			_complex = false;
		}

		const lines = string.getLines();
		var result = 0;

		for(const line of lines)
		{
			if(_complex)
			{
				if(line.textLength > result)
				{
					result = line.textLength;
				}
			}
			else if(line.length > result)
			{
				result = line.length;
			}
		}

		return result;
	}});

	Object.defineProperty(String, 'lineCount', { value: function(_array_string)
	{
		var string;

		if(Array.isArray(_array_string, true))
		{
			string = _array_string.join(EOL);
		}
		else if(typeof _array_string === 'string')
		{
			string = _array_string;
		}
		else
		{
			return x('Invalid % argument (neither an %, nor a %)', null, '_array_string', 'Array', 'String');
		}

		if(string.length === 0)
		{
			return 0;
		}

		return string.getLines().length;
	}});

	Object.defineProperty(String, 'getLines', { value: function(_array_string, _count, _rest = false, _max_length, _complex = false, _xml = BROWSER)
	{
		var string;

		if(Array.isArray(_array_string, true))
		{
			string = _array_string.join(EOL);
		}
		else if(typeof _array_string === 'string')
		{
			string = _array_string;
		}
		else
		{
			return x('Invalid % argument (neither an %, nor a %)', null, '_array_string', 'Array', 'String');
		}

		//
		if(string.length === 0)
		{
			return [];
		}

		return string.getLines(_count, _rest, _max_length, _complex, _xml);
	}});

	//
	Object.defineProperty(String.prototype, 'count', { value: function(... _args)
	{
		var MULTIPLY = DEFAULT_COUNT_MULTIPLY;

		for(var i = 0; i < _args.length; ++i)
		{
			if(! String.isString(_args[i]))
			{
				if(typeof _args[i] === 'boolean')
				{
					MULTIPLY = _args.splice(i--, 1)[0];
				}
				else
				{
					return x('Invalid %[%] argument (not a non-empty %)', null, '..._args', i, 'String');
				}
			}
		}

		if(_args.length === 0)
		{
			return null;
		}
		else if(! MULTIPLY)
		{
			_args.uniq();
		}

		const shortest = Math.shortest(_args);
		var result = 0;

		for(var i = 0, r = this.length; i < this.length; ++i, --r)
		{
			if(r < shortest)
			{
				break;
			}
			else for(var j = 0; j < _args.length && r > 0 && i < this.length; ++j)
			{
				if(this.substr(i, _args[j].length) === _args[j])//=== '.at()'
				{
					++result;

					if(! MULTIPLY)
					{
						i += (_args[j].length - 1);
						r -= (_args[j].length - 1);
						break;
					}
					else if(j === (_args.length - 1))
					{
						i += (_args[j].length - 1);
						r -= (_args[j].length - 1);
					}
				}
			}
		}

		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'removeAt', { value: function(... _args)
	{
		//
		var count = null;
		
		for(var i = 0; i < _args.length; ++i)
		{
			if(Number.isNumber(_args[i]))
			{
				_args[i] = this.getIndex(_args[i]);
			}
			else if(typeof _args[i] === 'bigint' && _args[i] >= 0n)
			{
				count = _args.splice(i--, 1)[0];
			}
			else
			{
				return x('Invalid %[%] argument (not a % or %)', null, '..._args', i, 'Number', 'BigInt');
			}
		}

		if(count !== null)
		{
			count = Number.from(count);
			
			if(count <= 0)
			{
				return this.valueOf();
			}
			else if(count > _args.length)
			{
				count = _args.length;
			}
			else
			{
				_args.length = count;
			}
		}		

		//
		_args.uniq();
		_args.sort(false);
		
		var result = this.valueOf();
		
		for(var i = 0; i < _args.length; ++i)
		{
			result = result.substr(0, _args[i]) + result.substr(_args[i] + 1, result.length - _args[i] - 1);
			
			if(count !== null && count-- <= 0)
			{
				break;
			}
		}
		
		return result;
	}});

	//
	Object.defineProperty(String.prototype, 'checkAlphabet', { value: function(_radix_alphabet = DEFAULT_RADIX, _case_sensitive)
	{
		if(! isRadix(_radix_alphabet, false, true))
		{
			return x('Invalid % argument (neither % nor %)', null, '_radix_alphabet', 'String', 'Integer');
		}
		else if(_radix_alphabet === 256)
		{
			return true;
		}
		
		var alpha = alphabet(_radix_alphabet);
		var isUnicode = false;

		if(typeof alpha !== 'string')
		{
			_case_sensitive = null;
			isUnicode = true;
		}
		else if(typeof _case_sensitive !== 'boolean')
		{
			if(alpha.isLowerCase ^ alpha.isUpperCase)
			{
				_case_sensitive = false;
			}
			else
			{
				_case_sensitive = true;
			}
		}

		if(_case_sensitive === false)
		{
			alpha = alpha.toLowerCase();
		}

		if(typeof alpha === 'number' && alpha < 0)
		{
			alpha = alphabet.toPositive(alpha);
		}
		
		const exists = (_char_cp) => {
			if(isUnicode)
			{
				return (_char_cp < alpha);
			}
			else if(_case_sensitive === false)
			{
				_char_cp = _char_cp.toLowerCase();
			}

			return (alpha.indexOf(_char_cp) > -1);
		};

		const len = (isUnicode ? this.unicodeLength : this.length);

		for(var i = 0; i < len; ++i)
		{
			if(isUnicode)
			{
				if(! exists(this.codePointAt(i)))
				{
					return false;
				}
			}
			else if(! exists(this[i]))
			{
				return false;
			}
		}

		return true;
	}});
	
	Object.defineProperty(String.prototype, 'getAlphabet', { value: function(_sort = null)
	{
		var result = '';
		
		for(var i = 0; i < this.length; ++i)
		{
			if(result.indexOf(this[i]) === -1)
			{
				result += this[i];
			}
		}
		
		if(typeof _sort === 'boolean')
		{
			result = result.sort(_sort);
		}
		
		return result;
	}});

	//
	Object.defineProperty(String, 'isString', { value: function(... _args)
	{
		var minimum = 1;
		
		for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				minimum = (_args.splice(i--, 1)[0] ? 0 : 1);
			}
			else if(Number.isNumber(_args[i]))
			{
				minimum = Math.int(_args.splice(i--, 1)[0]);
			}
		}
		
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'string')
			{
				if(_args[i].length < minimum)
				{
					return false;
				}
			}
			else
			{
				return false;
			}
		}
		
		return true;
	}});
	
	isString = String.isString;

	//

})();

//
module.exports = String;

