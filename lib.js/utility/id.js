(function()
{

	//
	const DEFAULT_UUID_UPPER_CASE = false;
	const DEFAULT_UUID_SEP = '-';
	const DEFAULT_ENTROPY_CACHE = false;
	const DEFAULT_COMPARE_MAX = 64;
	const DEFAULT_CRYPTO = false;
	const DEFAULT_CRYPTO_SHORT_UUID_RANDOMIZED = true;
	const DEFAULT_ID_RADIX = 36;
	const DEFAULT_ID_SEP = '/';

	//
	function randomInt(_max = ((2 ** 32) - 1), _min = 0, _crypto = true, _max_inclusive = true)
	{
		if(typeof Math.random.int === 'function')
		{
			return Math.random.int(_max, _min, _crypto, _max_inclusive);
		}

		return (Math.floor(Math.random(_crypto) * (_max - _min + (_max_inclusive ? 1 : 0))) + _min);
	}

	//
	id = module.exports = function(_radix_alphabet, _length, _length_min = 1, _crypto = CRYPTO)
	{
		const alpha = alphabet(_radix_alphabet);
		
		if(alpha === null)
		{
			return x('Invalid radix or alphabet');
		}
		
		if(typeof _length !== 'number')
		{
			return x('Invalid _length (expecting an Integer, positive or negative)');
		}
		else if(_length < 0)
		{
			if(typeof _length_min !== 'number')
			{
				return x('Invalid _length_min (expecting an Integer)');
			}
			else
			{
				_length_min = Math.abs(_length_min.int);
			}
			
			_length = randomInt(Math.round(Math.abs(_length)), _length_min, _crypto);
		}
		
		//
		var result = '';
		
		while(result.length < _length)
		{
			result += alpha[randomInt(alpha.length - 1, 0, _crypto)];
		}
		
		return result;
	}
	
	id.full = id[0] = function(_length = FULL, _length_min = 1, _crypto = CRYPTO)
	{
		return id(alphabet.FULL, _length, _length_min, _crypto);
	}
	
	id.half = id[1] = function(_length = HALF, _length_min = 1, _crypto = CRYPTO)
	{
		return id(alphabet.HALF, _length, _length_min, _crypto);
	}

	//
	id.randomID = randomID = (_crypto = DEFAULT_CRYPTO, _radix = DEFAULT_ID_RADIX, _sep = DEFAULT_ID_SEP) => {
		if(typeof _crypto !== 'boolean')
		{
			_crypto = DEFAULT_CRYPTO;
		}

		if(! isRadix(_radix, true, false))
		{
			_radix = DEFAULT_ID_RADIX;
		}

		if(typeof _sep !== 'string' || _sep.length !== 1)
		{
			_sep = DEFAULT_ID_SEP;
		}

		var result = id.uuid(null, false, DEFAULT_UUID_SEP, DEFAULT_UUID_UPPER_CASE, _crypto, DEFAULT_COMPARE_MAX);
		result += _sep + Date.now().toString(_radix);

		return result;
	};

	//
	id.uuid = uuid = randomUUID = function(_compare = null, _short = false, _sep = DEFAULT_UUID_SEP, _upper_case = DEFAULT_UUID_UPPER_CASE, _crypto = DEFAULT_CRYPTO, _max_compare = DEFAULT_COMPARE_MAX)
	{
		if(typeof _sep !== 'string' || _sep.length !== 1)
		{
			_sep = DEFAULT_UUID_SEP;
		}

		if(typeof _short !== 'boolean')
		{
			_short = false;
		}

		if(typeof _upper_case !== 'boolean')
		{
			_upper_case = DEFAULT_UUID_UPPER_CASE;
		}

		if(typeof _crypto !== 'boolean')
		{
			_crypto = DEFAULT_CRYPTO;
		}

		if(id.hasCrypto && _crypto)
		{
			return id.uuid.crypto(_compare, _short, _sep, _upper_case, DEFAULT_ENTROPY_CACHE, _max_compare);
		}
		else
		{
			_crypto = false;
		}

		if(! (isInt(_max_compare) && _max_compare >= 0))
		{
			_max_compare = DEFAULT_COMPARE_MAX;
		}

		//
		if(! Object.isObject(_compare, true, false, false))
		{
			_compare = null;
		}
		else if(! Array.isArray(_compare))
		{
			_compare = Object.getOwnPropertyNames(_compare, false, false);
		}

		const scheme = id.uuid.getScheme(_short);
		const alpha = alphabet(16);
		
		const create = () => {
			var res = '';
		
			for(var i = 0; i < scheme.length; ++i)
			{
				for(var j = 0; j < scheme[i]; ++j)
				{
					res += alpha[randomInt(alpha.length - 1)];
				}

				res += _sep;
			}
			
			return res.slice(0, -1);
		}
		
		var result;
		var compared = 0;
		
		do
		{
			if(++compared > _max_compare)
			{
				result = null;
				break;
			}

			result = create();
		}
		while(uuidExists(result, _compare));

		if(result !== null && _upper_case)
		{
			result = result.toUpperCase();
		}
		
		return result;
	}
	
	//
	//TODO/same for regular id's... ^_^
	//
	function uuidExists(_uuid, _compare = null)
	{
		if(typeof _uuid !== 'string' || _uuid.length === 0)
		{
			return null;
		}
		else if(_compare === null)
		{
			return false;
		}
		else if((_uuid = id.uuid.removeSeparators(_uuid)) === null)
		{
			return null;
		}

		var cmp;

		for(var i = 0; i < _compare.length; ++i)
		{
			if(_uuid.length === 32 || _uuid.length === 8)
			{
				if(_compare[i].toLowerCase() === _uuid)
				{
					return true;
				}
			}
			else if(_uuid.length === 36 || _uuid.length === 9)
			{
				if((cmp = id.uuid.removeSeparators(_compare[i])) !== null)
				{
					if(cmp.toLowerCase() === _uuid)
					{
						return true;
					}
				}
			}
		}

		return false;
	}
	
	Object.defineProperty(id.uuid, 'getScheme', { value: function(_short = false)
	{
		if(typeof _short !== 'boolean')
		{
			return x('Invalid % argument (not a %)', null, '_short', 'Boolean');
		}
		else if(_short)
		{
			return [ 4, 4 ];
		}
		
		return [ 8, 4, 4, 4, 12 ];
	}});

	Object.defineProperty(id, 'hasCrypto', { get: function()
	{
		return (typeof crypto === 'object' && crypto !== null && typeof crypto.randomUUID === 'function');
	}});

	id.uuid.crypto = function(_compare = null, _short = false, _sep = DEFAULT_UUID_SEP, _upper_case = DEFAULT_UUID_UPPER_CASE, _entropy_cache = DEFAULT_ENTROPY_CACHE, _max_compare = DEFAULT_COMPARE_MAX)
	{
		if(! id.hasCrypto)
		{
			return id.uuid(_compare, _short, _sep, _upper_case, false, _max_compare);
		}

		if(typeof _sep !== 'string' || _sep.length !== 1)
		{
			_sep = DEFAULT_UUID_SEP;
		}

		if(typeof _short !== 'boolean')
		{
			_short = false;
		}

		if(typeof _upper_case !== 'boolean')
		{
			_upper_case = DEFAULT_UUID_UPPER_CASE;
		}

		if(typeof _entropy_cache !== 'boolean')
		{
			_entropy_cache = DEFAULT_ENTROPY_CACHE;
		}
		
		if(! Object.isObject(_compare, true, false, false))
		{
			_compare = null;
		}
		else if(! Array.isArray(_compare))
		{
			_compare = Object.getOwnPropertyNames(_compare, false, false);
		}

		if(! (isInt(_max_compare) && _max_compare >= 0))
		{
			_max_compare = DEFAULT_COMPARE_MAX;
		}
		
		const create = () => {
			var res = crypto.randomUUID({ disableEntropyCache: !_entropy_cache });

			if(_short)
			{
				if(DEFAULT_CRYPTO_SHORT_UUID_RANDOMIZED && typeof String.prototype.getRandom === 'function')
				{
					const rnd = res.remove('-').getRandom(8);
					res = rnd.substr(0, 4) + _sep + rnd.substr(4, 4);
				}
				else
				{
					res = res.substr(0, 4) + _sep + res.substr(4, 4);
				}
			}
			else if(_sep !== '-')
			{
				res = res.replaces('-', _sep);
			}
			
			return res;
		};

		var result;
		var compared = 0;

		do
		{
			if(++compared > _max_compare)
			{
				result = null;
				break;
			}
			
			result = create();
		}
		while(uuidExists(result, _compare));
		
		if(result !== null && _upper_case)
		{
			result = result.toUpperCase();
		}

		return result;
	}

	id.uuid.short = function(_compare = null, _sep = DEFAULT_UUID_SEP, _upper_case = DEFAULT_UUID_UPPER_CASE, _crypto = DEFAULT_CRYPTO, _max_compare = DEFAULT_COMPARE_MAX)
	{
		return id.uuid(_compare, true, _sep, _upper_case, _crypto, _max_compare);
	}

	id.uuid.short.crypto = id.uuid.crypto.short = function(_compare = null, _sep = DEFAULT_UUID_SEP, _upper_case = DEFAULT_UUID_UPPER_CASE, _entropy_cache = DEFAULT_ENTROPY_CACHE, _max_compare = DEFAULT_COMPARE_MAX)
	{
		return id.uuid.crypto(_compare, true, _sep, _upper_case, _entropy_cache, _max_compare);
	}

	id.isID = isID = function(_string, _uuid = true)
	{
		if(typeof _string !== 'string')
		{
			return false;
		}
		else if(_uuid && _string.length < 36)
		{
			return false;
		}
		else if(!_uuid && _string.length <= 36)
		{
			return false;
		}

		return id.isUUID(_string.substr(0, 36));
	}

	id.isUUID = isUUID = id.uuid.isUUID = function(_string)
	{
		//
		if(typeof _string !== 'string')
		{
			return false;
		}
		else if(_string.length === 0)
		{
			return false;
		}
		
		const check = (_scheme) => {
			//
			const symbol = _string[_scheme[0]];

			if(!String.isString(symbol) || symbol.isInt(16))
			{
				return false;
			}

			for(var i = 1, mul = _scheme[0]; i < _scheme.length - 1; ++i)
			{
				if(_string[(mul += _scheme[i]) + i] !== symbol)
				{
					return false;
				}
			}

			var string = '';

			for(var i = 0, mul = 0; i < _scheme.length; ++i)
			{
				string += _string.substr(mul + i, _scheme[i]);
				mul += _scheme[i];
			}

			return string.checkAlphabet(16, false);
		};
		
		switch(_string.length)
		{
			case 9:
				return check(id.uuid.getScheme(true));
			case 36:
				return check(id.uuid.getScheme(false));
		}

		return false;
	}
	
	//
	id.uuid.extractSeparator = function(_string)
	{
		if(! String.isString(_string))
		{
			return x('Invalid % argument (not a non-empty %)', null, '_string', 'String');
		}
		
		const getSep = (_short) => {
			const scheme = id.uuid.getScheme(_short);
			var res = _string[scheme[0]];
			
			if(res.isInt(16))
			{
				return null;
			}
			else for(var i = 1, mul = scheme[0]; i < scheme.length - 1; ++i)
			{
				if(_string[(mul += scheme[i]) + i] !== res)
				{
					return null;
				}
			}
			
			return res;
		};

		if(_string.length === 36)
		{
			return getSep(false);
		}
		else if(_string.length === 9)
		{
			return getSep(true);
		}
		
		return null;
	}
	
	id.uuid.removeSeparators = function(_string, _sep = null)
	{
		if(! String.isString(_string))
		{
			return x('Invalid % argument (not a non-empty %)', null, '_string', 'String');
		}
		else if(typeof _sep !== 'string' || _sep.length !== 1)
		{
			if((_sep = id.uuid.extractSeparator(_string)) === null)
			{
				return null;
			}
		}
		
		return _string.remove(_sep);
	}

	//

})();
