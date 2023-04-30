(function()
{
	//
	const DEFAULT_UNICODE = true;
	const DEFAULT_UNICODE_LIMIT = true;

	//
	alphabet = module.exports = function(_radix = 10, _unicode = DEFAULT_UNICODE, _throw = true, _byte_code = false)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = true;
		}

		if(typeof _unicode !== 'boolean' && !isInt(_unicode))
		{
			_unicode = DEFAULT_UNICODE;
		}

		if(typeof _byte_code !== 'boolean')
		{
			_byte_code = false;
		}

		//
		if(_unicode === true)
		{
			_unicode = alphabet.MAX_UNICODES;
		}

		if(DEFAULT_UNICODE_LIMIT && (_unicode > alphabet.MAX_UNICODES))
		{
			if(_throw)
			{
				return x('Invalid % argument (needs to be lower than or equal to % (%.%)', null, '_unicode', alphabet.MAX_UNICODES, 'alphabet.MAX_UNICODES');
			}

			return undefined;
		}

		//
		var result;
		const original = _radix;

		//
		if(isNumber(_radix))
		{
			//
			const negative = (_radix < 0);
			_radix = Math.floor(Math.abs(_radix));

			if(negative)
			{
				--_radix;
			}

			//
			if(_radix <= alphabet.ALPHABET.length)
			{
				result = alphabet.getAlphabet(_radix, _byte_code, _throw);
			}
			else if(_radix <= 256)
			{
				result = alphabet.getAlphabet(_radix, true, _throw);
			}
			else if(isInt(_unicode))
			{
				if(_radix < (0 - _unicode - 1) || _radix > _unicode)
				{
					if(_throw)
					{
						return x('You exceeded ' + 'your'.bold + ' % maximum/minimum %/% %', null, '_unicode', '-', '+', _unicode);
					}

					return null;
				}

				result = _radix;
			}
			else if(_throw)
			{
				return x('Invalid % argument (as % is %)', null, '_radix', '_unicode', 'false');
			}
			else
			{
				return null;
			}

			//
			if(negative)
			{
				if(typeof result === 'string')
				{
					result = result.reverse();
				}
				else
				{
					result = (-1 - result);
				}
			}

			return result;
		}
		else if(typeof _radix === 'string' && _radix.length >= 2)
		{
			if(typeof alphabet[_radix.toUpperCase()] === 'string')
			{
				return alphabet[_radix.toUpperCase()];
			}
			else if((_radix = _radix.getAlphabet(null)).length >= 2)
			{
				return _radix;
			}
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting a % or a % with at least % characters (after .%)', null, '_radix', 'Number', 'String', 2, 'unique()');
		}
		else
		{
			return null;
		}

		return result;
	}

	Object.defineProperty(alphabet, 'isRadix', { value: function(... _args)
	{
		return numeric.isRadix(... _args);
	}});

	Object.defineProperty(alphabet, 'isAlphabet', { value: function(... _args)
	{
		return numeric.isAlphabet(... _args);
	}});

	alphabet.getUnicodeAlphabet = function(_unicode, _throw = true)
	{
		if(_radix < (-1 - alphabet.MAX_UNICODES) - 1 || _radix > alphabet.MAX_UNICODES + 1)
		{
			if(_throw)
			{
				return x('You exceeded the common % maximum/minimum (% / %)', null, '_unicode', alphabet.toNegative(alphabet.MAX_UNICODES), alphabet.toPositive(alphabet.MAX_UNICODES));
			}

			return null;
		}

		var result = '';
		const negative = (_unicode < 0);
		_unicode = alphabet.toPositive(_unicode);

		for(var i = 0; i < _unicode; ++i)
		{
			if(negative)
			{
				result = String.fromCodePoint(i) + result;
			}
			else
			{
				result += String.fromCodePoint(i);
			}
		}

		return result;
	}

	alphabet.toNegative = function(_value)
	{
		if(_value < 0)
		{
			return _value;
		}

		return (-1 - _value);
	}

	alphabet.toPositive = function(_value)
	{
		if(_value >= 0)
		{
			return _value;
		}

		return (Math.abs(_value) - 1);
	}

	alphabet.negate = function(_value)
	{
		if(_value < 0)
		{
			return alphabet.toPositive(_value);
		}

		return alphabet.toNegative(_value);
	}

	//
	alphabet.getAlphabet = function(_radix, _byte_code = true, _throw = true)
	{
		if(Number.isNumber(_radix))
		{
			const createAlphabet = (_r, _n) => {
				var not = 0;
				result = '';

				for(var i = 0; i < _r; i++)
				{
					if(PREFERENCE && _r < 256 && i >= 43 && i <= 45)
					{
						if(_r < 256)
						{
							if(i === 46)
							{
								not++;
								continue;
							}
						}

						if(_r < 255)
						{
							if(i === 45)
							{
								not++;
								continue;
							}
						}

						if(_r < 254)
						{
							if(i === 43)
							{
								not++;
								continue;
							}
						}
					}

					if(_n)
					{
						result = String.fromCharCode(i) + result;
					}
					else
					{
						result += String.fromCharCode(i);
					}
				}

				for(var i = 0; i < not; i++)
				{
					result += String.fromCharCode(_r + i);
				}

				return result;
			};

			if(_radix >= -257 && _radix <= 256)
			{
				const negative = (_radix < 0);
				_radix = Math.floor(Math.abs(_radix));

				if(negative)
				{
					--_radix;
				}

				var result;

				if(_radix === 0 || _radix === 1)
				{
					if(_byte_code)
					{
						if(_throw)
						{
							return x('You can\'t get % with % = %|%|%|%', null, '_byte_code'.bold, '_radix', 0, 1, -1, -2);
						}

						return null;
					}

					result = alphabet[_radix ? 'HALF' : 'FULL'];
				}
				else if(!_byte_code && _radix <= alphabet.ALPHABET.length)
				{
					result = alphabet.ALPHABET.substr(0, _radix);
				}
				else
				{
					return createAlphabet(_radix, negative);
				}

				if(negative)
				{
					return result.reverse();
				}

				return result;
			}
		}

		if(_throw)
		{
			return x('Invalid % argument (expecting a %)', null, '_radix', 'Number');
		}

		return null;
	}

	alphabet.getUnicodeAlphabet = function(_radix, _throw = true)
	{
		if(Number.isNumber(_radix))
		{
			const createAlphabet = (_r, _n) => {
				var result = '';

				for(var i = 0; i < _r; ++i)
				{
					if(_n)
					{
						result = String.fromCodePoint(i) + result;
					}
					else
					{
						result += String.fromCodePoint(i);
					}
				}

				return result;
			};

			const negative = (_radix < 0);
			_radix = Math.floor(Math.abs(_radix));

			if(negative)
			{
				--_radix;
			}

			if(_radix <= 256)
			{
				if(_throw)
				{
					return x('Invalid % argument (for % it needs to be greater than % or lower than %)', null, '_radix', 'UNICODE', 256, -257);
				}

				return null;
			}

			return createAlphabet(_radix, negative);
		}

		if(_throw)
		{
			return x('Invalid % argument (expecting a %, for % greater than % or lower than %)', null, '_radix', 'Number', 'UNICODE', 256, -257);
		}

		return null;
	}

	//
	Object.defineProperty(alphabet, 'numeric', { get: function()
	{
		if(typeof numeric === 'undefined')
		{
			require('ext/numeric');
		}

		return numeric;
	}});

	//
	alphabet.LOWER = ('abcdefghijklmnopqrstuvwxyz');
	alphabet.UPPER = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	alphabet.HALF = alphabet.LOWER;
	alphabet.FULL = (alphabet.LOWER + alphabet.UPPER);
	alphabet.ALPHA = ('0123456789' + alphabet.HALF);
	alphabet.ALPHABET = ('0123456789' + alphabet.FULL);
	alphabet.LOWER = 'abcdefghijklmnopqrstuvwxyz';
	alphabet.UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	alphabet.LETTER = alphabet.LOWER + alphabet.UPPER;
	alphabet.base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	//
	Object.defineProperty(alphabet, 'MAX_REGULAR', { get: function()
	{
		return alphabet.ALPHABET.length;
	}});

	// < https://www.johndcook.com/blog/2019/09/02/number-of-possible-unicode-characters/ >
	alphabet.MAX_UNICODES = 1114111;//1111998;

	//
	alphabet.letter = function(_string, _index)
	{
		if(typeof _string !== 'string' || _string.length === 0)
		{
			return x('Invalid argument (not a non-empty String)');
		}
		else if(typeof _index === 'number')
		{
			return (alphabet.LETTER.indexOf(_string[_string.getIndex(_index)]) > -1);
		}

		for(var i = 0; i < _string.length; i++)
		{
			if(alphabet.LETTER.indexOf(_string[i]) === -1)
			{
				return false;
			}
		}

		return true;
	}

	alphabet.limited = function(_string_int, _unicode = DEFAULT_UNICODE)
	{
		if(typeof _string_int === 'number')
		{
			if(! _string_int.isInt)
			{
				return false;
			}
			else if(_string_int < 0)
			{
				_string_int = alphabet.toPositive(_string_int);
			}

			if(_unicode)
			{
				if(_string_int >= 256 && _string_int <= alphabet.MAX_UNICODES - 1)
				{
					return true;
				}
			}

			return (_string_int >= 0 && _string_int <= alphabet.MAX_REGULAR);
		}
		else if(typeof _string_int !== 'string')
		{
			return null;
		}
		else
		{
			_string_int = _string_int.unique();
		}
		
		if(_string_int.length < 2)
		{
			return false;
		}

		var byte;

		for(var i = 0; i < _string_int.length; ++i)
		{
			if((byte = _string_int.charCodeAt(i)) <= 32 || byte === 127)
			{
				return false;
			}
			else if(_string_int[i] === '.' || _string_int[i] === '-' || _string_int[i] === '+')
			{
				return false;
			}
		}

		return true;
	}

	alphabet.validCodePoint = function(_int)
	{
		if(! Number.isInt(_int))
		{
			return null;
		}
		else if(_int < 0)
		{
			_int = alphabet.toPositive(_int);
		}

		if(_int >= 0 && _int <= alphabet.MAX_UNICODES + 1)
		{
			return true;
		}

		return false;
	}

	//

})();

