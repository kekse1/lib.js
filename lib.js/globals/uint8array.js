(function()
{

	//
	Object.defineProperty(Uint8Array.prototype, 'eol', { value: function(_eol = EOL)
	{
		if(typeof _eol === 'number')
		{
			_eol = String.fromCharCode(_eol.int % 256);
		}
		else if(typeof _eol !== 'string')
		{
			return x('Invalid _eol (expecting a Number or String)');
		}

		return String.fromUint8Array(this.valueOf()).eol(_eol).toUint8Array();
	}});

	Object.defineProperty(Uint8Array.prototype, 'isEOL', { value: function(_index)
	{
		if(typeof _index === 'number')
		{
			_index = this.getIndex(_index);
		}
		else
		{
			_index = 0;
		}

		if(this[_index] === 10)
		{
			if(_index < (this.byteLength - 1) && this[_index + 1] === 13)
			{
				return ++_index;
			}
			else
			{
				return _index;
			}
		}
		else if(this[_index] === 13)
		{
			if(_index < (this.byteLength - 1) && this[_index + 1] === 10)
			{
				return ++_index;
			}
			else
			{
				return _index;
			}
		}

		return null;
	}});

	//
	Object.defineProperty(Uint8Array.prototype, 'toBigInt', { value: function()
	{
		var result = 0n;

		for(var i = this.length - 1, mul = 1n; i >= 0; i--, mul *= 256n)
		{
			result += (BigInt.from(this[i]) * mul);
		}

		return result;
	}});

	Object.defineProperty(Uint8Array, 'fromBigInt', { value: function(_value = 0n)
	{
		if(typeof _value !== 'bigint')
		{
			return x('Invalid _value (not a BigInt)');
		}

		const string = String.fromBigInt(_value);
		const result = new Uint8Array(string.length);

		for(var i = 0; i < string.length; i++)
		{
			result[i] = string.charCodeAt(i);
		}

		return result;
	}});

	//
	Object.defineProperty(Uint8Array, 'fromString', { value: function(_string, _offset, _length, _encoding)
	{
		if(typeof _string !== 'string')
		{
			return x('Invalid % argument (expecting a %)', null, '_string', 'String');
		}
		else if(! String.isEncoding(_encoding, false, true, false, false))
		{
			_encoding = 'utf8';
		}
		else if(typeof _encoding === 'string' && _encoding.length === 0)
		{
			_encoding = 'utf8';
		}
		
		if(! Number.isInt(_offset))
		{
			_offset = 0;
		}
		else if(_offset >= _string.length)
		{
			return new Uint8Array(0);
		}
		else if(_offset < 0)
		{
			if((_offset = _string.length + _offset) < 0)
			{
				return new Uint8Array(0);
			}
		}

		if(! Number.isInt(_length))
		{
			if((_length = _string.length - _offset) <= 0)
			{
				return new Uint8Array(0);
			}
		}
		else if((_length + _offset) >= _string.length)
		{
			if((_length = (_string.length - _offset)) <= 0)
			{
				return new Uint8Array(0);
			}
		}
		else if(_length < 0)
		{
			if((_length = _string.length + _length) <= 0)
			{
				return new Uint8Array(0);
			}
		}

		var input;

		if(_encoding === 'utf8')
		{
			input = _string.decode(_encoding, true, false);
		}
		else
		{
			input = _string;
		}

		const result = new Uint8Array(_length);

		for(var i = _offset, j = 0; i < _string.length && j < _length; ++i, ++j)
		{
			result[j] = _string.codePointAt(i);
		}

		return result;
	}});

	//
	Object.defineProperty(Uint8Array, 'randomize', { value: function(_length)
	{
		if(Number.isInt(_length))
		{
			_length = Math.abs(_length);
		}
		else
		{
			return x('Invalid % argument (expecting an %)', null, '_length', 'Integer');
		}

		const result = new Uint8Array(_length);
		result.randomize();
		return result;
	}});

	Object.defineProperty(Uint8Array.prototype, 'randomize', { value: function(_max = 255, _min = 0, _crypto = CRYPTO)
	{
		if(typeof _crypto !== 'boolean')
		{
			_crypto = CRYPTO;
		}

		if(! Number.isInt(_max))
		{
			_max = 255;
		}
		else
		{
			_max = (Math.abs(_max) % 256);
		}

		if(! Number.isInt(_min))
		{
			_min = 0;
		}
		else
		{
			_min = (Math.abs(_min) % 256);
		}

		for(var i = 0; i < this.length; ++i)
		{
			this[i] = Math.random.byte(_max, _min, _crypto);
		}

		return this;
	}});

	//
	//TODO/with ALPHABET, too!! and so 'isRadix()'!!
	//
	Object.defineProperty(Uint8Array, 'format', { value: function(_length, _radix, _reverse = false)
	{
		if(! (Number.isInt(_radix) && _radix > 0 && _radix <= 256))
		{
			return x('Invalid % argument (expecting a % between % and %)', null, '_radix', 'Byte', 1, 256);
		}
		else if(Number.isInt(_length))
		{
			_length = Math.abs(_length);
		}
		else
		{
			return x('Invalid % argument (expecting an %)', null, '_length', 'Integer');
		}

		const result = new Uint8Array(_length);
		result.format(_radix, _reverse);
		return result;
	}});

	Object.defineProperty(Uint8Array.prototype, 'format', { value: function(_radix, _reverse = false)
	{
		if(! (Number.isInt(_radix) && _radix > 0 && _radix <= 256))
		{
			return x('Invalid % argument (expecting a % between % and %)', null, '_radix', 'Byte', 1, 256);
		}

		var index = 0;
		var length = 0;

		do
		{
			this[length++] = index;

			if(length > this.length)
			{
				break;
			}
			else if(_reverse)
			{
				if(--index < 0)
				{
					index = _radix;
				}
			}
			else if(++index === _radix)
			{
				index = 0;
			}
		}
		while(true);

		return this;
	}});

	Object.defineProperty(Uint8Array.prototype, 'toRadix', { value: function(_radix)
	{
		if(! isRadix(_radix))
		{
			return x('Invalid % argument (expecting an % or a %', null, '_radix', 'Integer', 'String');
		}

		return String.fromUint8Array(this.valueOf()).toRadix(_radix);
	}});

	//

})();

//
module.exports = Uint8Array;

