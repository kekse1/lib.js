(function()
{

	//
	const DEFAULT_RADIX = 10;

	const DEFAULT_MAX_FLOAT_LENGTH = 32;
	const DEFAULT_MAX_INT_LENGTH = 32;
	const DEFAULT_CUT = 8;

	const DEFAULT_STRICT_CHECK_TYPE = false;
	const DEFAULT_STRICT_CHECK_SIZE = true;

	const DEFAULT_BIGINT_SUFFIX = false;
	const DEFAULT_UNICODE = true;
	const DEFAULT_THROW = false;

	const DEFAULT_ALLOW_POINT_START = false;

	const DEFAULT_FILTER_STRING = false;

	const DEFAULT_SPLIT_REMOVE_DECIMALS = true;

	//
	numeric = module.exports = {};

	//
	const _parseInt = numeric._parseInt = Number.parseInt;
	const _parseFloat = numeric._parseFloat = Number.parseFloat;

	//
	Object.defineProperty(numeric, 'bigInt', { get: function()
	{
		return (typeof BigInt !== 'undefined' && BigInt !== null);
	}});

	Object.defineProperty(numeric, 'alphabet', { get: function()
	{
		if(typeof alphabet === 'undefined')
		{
			require('ext/alphabet');
		}

		return alphabet;
	}});

	//
	numberTooHigh = numeric.numberTooHigh = function(_number, _throw = DEFAULT_THROW)
	{
		if(Number.isNumber(_number))
		{
			return ((_number > Number.MAX_SAFE_INTEGER) || (_number < Number.MIN_SAFE_INTEGER));
		}
		else if(typeof _number === 'bigint')
		{
			return ((_number > BigInt.from(Number.MAX_SAFE_INTEGER)) || (_number < BigInt.from(Number.MIN_SAFE_INTEGER)));
		}
		else if(_throw)
		{
			return x('Invalid % parameter (expecting a % or a %)', null, '_number', 'Number', 'BigInt');
		}

		return null;
	}

	adaptNumber = numeric.adaptNumber = function(_number, _int = false, _throw = DEFAULT_THROW)
	{
		if(! isNumeric(_number))
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting a % or %)', null, '_number', 'Number', 'BigInt');
			}

			return null;
		}

		var result = numeric.numberTooHigh(_number);

		if(result)
		{
			if(typeof _number === 'bigint')
			{
				result = _number;
			}
			else
			{
				result = BigInt.from(_number);
			}
		}
		else
		{
			if(Number.isNumber(_number))
			{
				result = _number;
			}
			else
			{
				result = Number.from(_number);
			}
		}

		if(_int && typeof result === 'number' && result.isFloat)
		{
			result = result.int;
		}

		return result;
	}

	//
	numeric.getLanguage = function(_lang)
	{
		if(typeof _lang === 'string' && _lang.length > 0)
		{
			return _lang;
		}

		return LANGUAGE;
	}

	//
	numeric.features = function(_alphabet_radix, _alphabet_call = false, _throw = DEFAULT_THROW)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(_alphabet_call)
		{
			if((_alphabet_radix = alphabet(_alphabet_radix, true, _throw)) === null)
			{
				return x('Invalid % / % specified', null, 'radix', 'alphabet');
			}
		}

		if(! numeric.isRadix(_alphabet_radix))
		{
			if(_throw)
			{
				return x('Invalid % argument (see %.%)', null, '_alphabet_radix', 'numeric', 'isRadix()');
			}

			return null;
		}

		const result = Object.create(null);

		if(isInt(_alphabet_radix))
		{
			result.unicode = true;
			result.radix = result.code = _alphabet_radix;
			result.absolute = ((result.negative = (_alphabet_radix < 0)) ? (-1 - _alphabet_radix) : _alphabet_radix);
			result.alphabet = null;
			result.plus = null;
			result.minus = null;
			result.floats = null;
			result.lowerCase = null;
			result.upperCase = null;
			result.bigint = null;
			result.e = result.E = false;
		}
		else
		{
			result.unicode = false;
			result.radix = result.absolute = _alphabet_radix.length;
			result.negative = null;
			result.alphabet = result.code = _alphabet_radix;
			result.plus = (_alphabet_radix.indexOf('+') === -1);
			result.minus = (_alphabet_radix.indexOf('-') === -1);
			result.floats = (_alphabet_radix.indexOf('.') === -1);
			result.lowerCase = (_alphabet_radix.isLowerCase);
			result.upperCase = (_alphabet_radix.isUpperCase);
			result.bigint = (_alphabet_radix.indexOf('n') === -1);
			result.e = (result.radix === 10 && result.alphabet.indexOf('e') === -1);
			result.E = (result.radix === 10 && result.alphabet.indexOf('E') === -1);
		}

		if(typeof _alphabet_radix === 'string')
		{
			result.first = _alphabet_radix[0];
			result.last = _alphabet_radix[_alphabet_radix.length - 1];
		}
		else if(typeof _alphabet_radix === 'number')
		{
			if(_alphabet_radix >= 0)
			{
				result.first = String.fromCodePoint(0);
				result.last = String.fromCodePoint(_alphabet_radix - 1);
			}
			else
			{
				result.last = String.fromCodePoint(0);
				result.first = String.fromCodePoint(numeric.toPositiveRadix(_alphabet_radix) - 1);
			}
		}
		else
		{
			x("DEBUG");
		}

		return result;
	}

	numeric.checkRadix = function(_radix, _unicode = DEFAULT_UNICODE, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(! ((typeof _radix === 'string' && _radix.length >= 2) || isInt(_radix)))
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting either an % or a non-empty % (the alphabet)', null, '_radix', 'Integer', 'String');
			}

			return null;
		}

		if(typeof _unicode !== 'boolean')
		{
			_unicode = DEFAULT_UNICODE;
		}

		//
		return alphabet(_radix, _unicode, _throw);
	}

	numeric.checkSign = function(_string, _alphabet, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(isInt(_alphabet))
		{
			return [ _string, null ];
		}
		else if(typeof _string !== 'string' || typeof _alphabet !== 'string')
		{
			if(_throw)
			{
				return x('Invalid argument(s) (expecting only %s for % and %)', null, 'String', '_string', '_alphabet');
			}

			return [ null, null ];
		}
		else if(_alphabet.indexOf('-') > -1)
		{
			return [ _string, null ];
		}

		//
		const withPlus = (_alphabet.indexOf('+') === -1);
		const withMinus = (_alphabet.indexOf('-') === -1);

		if(! (withPlus || withMinus))
		{
			return [ _string, null ];
		}

		var negative = false;

		do
		{
			if(_string[0] === '-')
			{
				if(withMinus)
				{
					negative = !negative;
					_string = _string.substr(1);
				}
				else
				{
					break;
				}
			}
			else if(_string[0] === '+')
			{
				if(withPlus)
				{
					_string = _string.substr(1);
				}
				else
				{
					break;
				}
			}
			else
			{
				break;
			}
		}
		while(true);

		//
		return [ _string, negative ];
	}

	//
	const _number_toString = Number.prototype._toString;
	const _bigint_toString = (numeric.bigInt ? BigInt.prototype._toString : null);

	numeric.toString = function(_value, _radix = DEFAULT_RADIX, _bigint_suffix = DEFAULT_BIGINT_SUFFIX, _throw = DEFAULT_THROW)
	{
		//
		if(typeof __GLOBALS === 'undefined')
		{
			return _value._toString(_radix);
		}

		//
		if(typeof _value === 'bigint')
		{
			if(typeof _bigint_suffix !== 'string')
			{
				if(_bigint_suffix === true)
				{
					_bigint_suffix = 'n';
				}
				else if(_bigint_suffix === false)
				{
					_bigint_suffix = '';
				}
				else
				{
					if((_bigint_suffix = DEFAULT_BIGINT_SUFFIX) === true)
					{
						_bigint_suffix = 'n';
					}
					else if(typeof _bigint_suffix !== 'string')
					{
						_bigint_suffix = '';
					}
				}
			}
		}
		else
		{
			_bigint_suffix = '';
		}

		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(typeof _value !== 'number' && typeof _value !== 'bigint')
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting either a % or an %)', null, '_value', 'Number', 'BigInt');
			}

			return null;
		}

		//
		if(! isNumeric(_value))
		{
			if(_throw)
			{
				return _number_toString.call(_value, _radix);
			}
			else try
			{
				return _number_toString.call(_value, _radix);
			}
			catch(_error)
			{
				return null;
			}
		}

		//
		if((_radix = numeric.checkRadix(_radix, DEFAULT_UNICODE, _throw)) === null)
		{
			return null;
		}
		else if(typeof _radix === 'number' || _radix.indexOf('n') > -1)
		{
			_bigint_suffix = '';
		}

		//
		const features = numeric.features(_radix, false, _throw);

		if(features === null)
		{
			return null;
		}

		const radix = features.radix;
		const alpha = features.alphabet;

		const big = (typeof _value === 'bigint');
		const negative = (_value < (big ? 0n : 0));
		_value = Math.abs(_value);
		const floats = (big ? false : (features.unicode ? false : (features.floats ? isFloat(_value) : false)));

		//
		const getValue = (_value) => {
			if(typeof _value === 'bigint')
			{
				_value = Number(_value);
			}
			else if(isFloat(_value))
			{
				_value = Math.floor(_value);
			}
			else if(typeof _value === 'string' && _value.length > 0)
			{
				return _value[0];
			}
			else if(! _value.isInt)
			{
				return x('Invalid % argument (expecting a % value, and even a % / %)', null, '_value', 'numeric', 'string', 'character');
			}

			var res;

			if(alpha)
			{
				if(_value >= alpha.length)
				{
					return x('Your % (%) is above your %\'s .% (% is %)', null, '_value', _value, 'alphabet', 'length', 'radix', alpha.length);
				}

				res = alpha[_value];
			}
			else if(features.negative)
			{
				res = String.fromCodePoint(features.absolut - _value);
			}
			else
			{
				res = String.fromCodePoint(_value);
			}

			if(typeof res === 'undefined')
			{
				return x('UNEXPECTED (but exception leaved here for debugging!!');
			}

			return res;
		};

		//
		var int = '';
		var rest = _value;
		const rdx = (big ? BigInt(radix) : radix);

		//
		while(rest >= rdx)
		{
			if((int = getValue(rest % rdx) + int).length >= DEFAULT_MAX_INT_LENGTH && !big)
			{
				break;
			}
			else
			{
				rest /= rdx;
			}
		}

		//
		if(rest >= (big ? 1n : 1))
		{
			int = getValue(rest % rdx) + int;
		}

		//
		while(int[0] === features.first)
		{
			int = int.substr(1);
		}

		//
		const onlyZero = (_string) => {
			for(var i = 0; i < _string.length; ++i)
			{
				if(_string.at(i) !== features.first)
				{
					return false;
				}
			}

			return true;
		};

		if(int.length === 0 || onlyZero(int))
		{
			int = features.first;
		}

		if(negative)
		{
			int = '-' + int;
		}

		int += _bigint_suffix;

		if(! floats)
		{
			return int;
		}

		//
		rest = (_value % 1);
		var steps = 0;
		var startZeros = 0;
		var started = false;

		while(isFloat(rest) && (steps++ < DEFAULT_MAX_FLOAT_LENGTH))
		{
			rest *= rdx;

			if(!started && rest < 1)
			{
				++startZeros;
			}
			else
			{
				started = true;
			}
		}

		started = '';
		while(startZeros-- > 0)
		{
			started += features.first;
		}

		var float = started + numeric.toString(rest = rest.int, _radix, _bigint_suffix, _throw);

		while(float[float.length - 1] === features.first)
		{
			float = float.slice(0, -1);
		}

		//
		var repeat = 0;
		var last;

		for(var i = 0; i < float.length; ++i)
		{
			//
			if(float.at(i) === last)
			{
				if(++repeat >= DEFAULT_CUT)
				{
					float = float.substr(0, i - repeat + 1);
					break;
				}
			}
			else
			{
				last = float.at(i);
				repeat = 0;
			}
		}

		//
		while(float[float.length - 1] === features.first)
		{
			float = float.slice(0, -1);
		}

		//
		if(float.length === 0 || onlyZero(float))
		{
			return int;
		}

		//
		return (int + '.' + float);
	}

	numeric.toText = function(_value, _precision = null, _lang, _bigint_suffix = DEFAULT_BIGINT_SUFFIX, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _value === 'bigint')
		{
			if(typeof _bigint_suffix !== 'boolean')
			{
				_bigint_suffix = DEFAULT_BIGINT_SUFFIX;
			}
		}
		else if(typeof _value === 'number')
		{
			_bigint_suffix = null;

			if(! isNumber(_value))
			{
				if(_throw)
				{
					return _number_toString.call(_value);
				}
				else try
				{
					return _number_toString.call(_value);
				}
				catch(_error)
				{
					return null;
				}
			}
		}
		else if(typeof _value === 'string')
		{
			return _value;
		}
		else if(_throw)
		{
			return x('The % argument needs to be either a % or a %', null, '_value', 'Number', 'BigInt');
		}
		else
		{
			return null;
		}

		//
		const opts = {};

		if(typeof _value === 'number')
		{
			if(Object.isObject(_precision))
			{
				if(_precision.min !== null && !(Number.isInt(_precision.min) && _precision.min >= 0))
				{
					_precision.min = null;
				}

				if(_precision.max !== null && !(Number.isInt(_precision.max) && _precision.max >= 0))
				{
					_precision.max = null;
				}

				if(_precision.min !== null)
				{
					opts.minimumFractionDigits = _precision.min;
				}

				if(_precision.max !== null)
				{
					opts.maximumFractionDigits = _precision.max;
				}
			}
			else
			{
				if(_precision !== null && !(Number.isInt(_precision) && _precision >= 0))
				{
					_precision = null;
				}

				if(_precision !== null)
				{
					opts.minimumFractionDigits = _precision;
					opts.maximumFractionDigits = _precision;
				}
			}
		}

		var result = _value.toLocaleString(numeric.getLanguage(_lang), opts);

		if(typeof _value === 'bigint' && _bigint_suffix)
		{
			result += 'n';
		}

		return result;
	}

	//
	numeric.splitLocalized = function(_string, _remove_decimals = DEFAULT_SPLIT_REMOVE_DECIMALS, _lang, _with_sep = true)
	{
		return numeric.split(_string, _remove_decimals, _lang, _with_sep);
	}

	numeric.split = function(_string, _remove_decimals = DEFAULT_SPLIT_REMOVE_DECIMALS, _lang = null, _with_sep = true)
	{
		if(typeof _string !== 'string')
		{
			return x('Invalid % argument (expecting a %)', null, '_string', 'String');
		}
		else if(_string.length === 0)
		{
			return _string;
		}

		if(typeof _with_sep !== 'boolean')
		{
			_with_sep = true;
		}

		if(_remove_decimals === null || String.isString(_remove_decimals))
		{
			if(typeof _lang === 'boolean')
			{
				[ _remove_decimals, _lang ] = [ _lang, _remove_decimals ];
			}
			else
			{
				_lang = _remove_decimals;
			}
		}
		else if(typeof _lang === 'boolean')
		{
			if(_remove_decimals === null || String.isString(_remove_decimals))
			{
				[ _remove_decimals, _lang ] = [ _lang, _remove_decimals ];
			}
			else
			{
				_remove_decimals = _lang;
			}
		}

		var localizedFloat;

		if(_lang === null)
		{
			localizedFloat = '.';
		}
		else
		{
			localizedFloat = numeric.checkLocalization(_lang).float;
		}

		if(typeof _remove_decimals !== 'boolean')
		{
			_remove_decimals = DEFAULT_SPLIT_REMOVE_DECIMALS;
		}

		const result = [ _string, '' ];

		if(_string.indexOf(localizedFloat) > -1)
		{
			if((_string = _string._split(localizedFloat)).length !== 2)
			{
				return x('Invalid % argument (doesn\'t seem to be a valid numeric string - localized floating point \'%\' is not counted one time)', null, '_string', localizedFloat);
			}
			else
			{
				result[0] = _string[0];
				result[1] = _string[1];
			}
		}

		if(_remove_decimals)
		{
			if(localizedFloat === '.')
			{
				result[0] = result[0].remove(',');
			}
			else if(localizedFloat === ',')
			{
				result[0] = result[0].remove('.');
			}
		}

		if(_with_sep)
		{
			result[2] = localizedFloat;
		}

		return result;
	}

	numeric.checkLocalization = function(_lang)
	{
		var test = (16777216.1415);
		_lang = numeric.getLanguage(_lang);
		test = test.toLocaleString(_lang);

		if(test[2] !== test[6])
		{
			return x('Unexpected..');
		}

		const result = Object.create(null);

		result.decimal = test[10];
		result.float = test[2];

		if(! (String.isString(result.decimal) && String.isString(result.float)))
		{
			return x('Unexpected');
		}

		return result;
	}

	numeric.parseLocalized = function(_string, _lang, _type = 'number', _throw = DEFAULT_THROW)
	{
		return numeric.parse(numeric.removeLocalization(_string, _lang), 10, _type, _throw);
	}

	numeric.removeLocalization = function(_string, _lang, _throw = DEFAULT_THROW)
	{
		if(typeof _string !== 'string')
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting a %)', null, '_string', 'String');
			}

			return null;
		}
		else if(_string.length === 0)
		{
			return _string;
		}

		const localization = numeric.checkLocalization(_lang = numeric.getLanguage(_lang));

		_string = _string.remove(localization.decimal);
		_string = _string.replaces(localization.float, '.');

		return _string;
	}

	numeric.switchLocalization = function(_string, _lang_a, _lang_b, _throw = DEFAULT_THROW)
	{
		if(typeof _string !== 'string')
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting a %)', null, '_string', 'String');
			}

			return null;
		}
		else if(_string.length === 0)
		{
			return _string;
		}

		//
		_lang_a = numeric.checkLocalization(_lang_a);
		_lang_b = numeric.checkLocalization(_lang_b);

		if(Object.equal(_lang_a, _lang_b))
		{
			return _string;
		}

		var result = '';

		for(var i = 0; i < _string.length; ++i)
		{
			if(_string[i] === _lang_a.decimal)
			{
				result += _lang_b.decimal;
			}
			else if(_string[i] === _lang_b.decimal)
			{
				result += _lang_a.decimal;
			}
			else if(_string[i] === _lang_a.float)
			{
				result += _lang_b.float;
			}
			else if(_string[i] === _lang_b.float)
			{
				result += _lang_a.float;
			}
			else
			{
				result += _string[i];
			}
		}

		return result;
	}

	//
	numeric.fromExponential = function(_string, _features, _throw = true)
	{
		if(typeof _string === 'string')
		{
			if(_string.length === 0)
			{
				return '';
			}
		}
		else
		{
			return x('Invalid % argument (not a %)', null, '_string', 'String');
		}

		if(! Object.isObject(_features))
		{
			if((_features = numeric.features(10, true, _throw)) === null)
			{
				return _string;
			}
			else if(_features.unicode)
			{
				return _string;
			}
		}

		var none = 0;

		if(_features.e)
		{
			if(_string.indexOf('e') === -1)
			{
				++none;
			}
		}
		else
		{
			++none;
		}

		if(_features.E)
		{
			if(_string.indexOf('E') === -1)
			{
				++none;
			}
		}
		else
		{
			++none;
		}

		if(none === 2)
		{
			return _string;
		}

		//
		const len = _string.length;

		//
		var split;

		if(_features.e)
		{
			split = _string._split('e', 2);
		}
		else
		{
			split = [];
		}

		if(split.length === 1)
		{
			if(_features.E)
			{
				if((split = _string._split('E', 2)).length === 1)
				{
					return _string;
				}
			}
			else
			{
				return _string;
			}
		}

		if(split[0].length === 0)
		{
			split[0] = '0';
		}

		if(split[1].length === 0)
		{
			return _string;
		}

		var [ value, exponent ] = split;
		const valLen = value.length;
		const expLen = exponent.length;
		var valueSigns = 0;

		//
		var negativeValue = false;
		var negativeExp = false;

		for(var i = 0; i < valLen; ++i)
		{
			if(_features.minus && value.at(i) === '-')
			{
				negativeValue = !negativeValue;
				valueSigns++;
			}
			else if(_features.plus && value.at(i) === '+')
			{
				valueSigns++;
			}
			else
			{
				break;
			}
		}

		value = value.removeFirst(valueSigns);
		valueSigns = 0;

		for(var i = 0; i < expLen; ++i)
		{
			if(_features.minus && exponent.at(i) === '-')
			{
				valueSigns++;
				negativeExp = !negativeExp;
			}
			else if(_features.plus && exponent.at(i) === '+')
			{
				valueSigns++;
			}
			else
			{
				break;
			}
		}

		exponent = exponent.removeFirst(valueSigns);

		//
		split = value._split('.', 2);

		if(split.length === 2)
		{
			if(split[0].length === 0)
			{
				split[0] = '0';
			}
		}
		else if(split.length === 1)
		{
			split[1] = '';
		}

		var [ int, float ] = split;
		var exp;

		if(exponent.isInt())
		{
			exp = parseInt(exponent);
		}
		else
		{
			return _string;
		}

		if(exp === 0)
		{
			if(negativeValue)
			{
				int = '-' + int;
			}

			if(float.length > 0)
			{
				return int + '.' + float;
			}

			return int;
		}

		//
		var result = '';

		if(negativeExp)
		{
			const diff = (int.length - exp);

			if(float.length > 0)
			{
				if(diff > 0)
				{
					result = int.substr(0, diff);
					result += '.' + int.substr(diff) + float;
				}
				else if(diff <= 0)
				{
					result = _features.first + '.' + String.repeat(-diff, _features.first) + int + float;
				}
			}
			else
			{
				if(diff > 0)
				{
					result = int.substr(0, diff) + '.' + int.substr(diff);
				}
				else if(diff < 0)
				{
					result = _features.first + '.' + String.repeat(-diff, _features.first) + int.substr(-diff - exp);
				}
				else
				{
					result = _features.first + '.' + String.repeat(-diff, _features.first) + int;
				}
			}
		}
		else
		{
			result = int;
			var e = 0;

			if(float.length > 0)
			{
				for(; e < exp && e < float.length; ++e)
				{
					result += float[e];
				}

				float = float.removeFirst(e);
				exp -= e;

				if(float.length > 0)
				{
					result += '.' + float;
					exp -= float.length;
				}
				else
				{
					result += String.repeat(exp, _features.first);
				}
			}
			else
			{
				result += String.repeat(exp, _features.first);
			}
		}

		//
		if(negativeValue)
		{
			result = '-' + result;
		}

		//
		return result;
	}

	Object.defineProperty(Number, 'fromExponential', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return NaN;
		}

		const result = new Array(_args.length);

		for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] !== 'string')
			{
				return x('Invalid %[%] argument (not a %)', null, '..._args', i, 'String');
			}
			else
			{
				result[i] = numeric.fromExponential(_args[i]);
			}
		}

		if(_args.length === 1)
		{
			return result[0];
		}

		return result;
	}});

	numeric.toExponential = function(_value)
	{
		if(typeof _value === 'number')
		{
			return _value.toExponential();
		}

		return null;
	}

	//
	numeric.parse = function(_string, _radix = DEFAULT_RADIX, _type = 'number', _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _type === 'string' && _type.length > 0) switch(_type = _type.toLowerCase())
		{
			case 'number':
			case 'int':
			case 'float':
				break;
			case 'bigint':
				if(! numeric.bigInt)
				{
					if(_throw)
					{
						return x('Your machine doesn\'t support % types', null, 'BigInt');
					}

					return null;
				}
				break;
			default:
				if(_throw)
				{
					return x('Invalid % argument (expecting one of [ %, %, %, % ])', null, '_type', 'number', 'int', 'float', 'bigint');
				}

				return null;
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting a non-empty %)', null, '_type', 'String');
		}
		else
		{
			return null;
		}

		if(typeof _string === 'number' || typeof _string === 'bigint')
		{
			return _string;
		}
		else if(typeof _string === 'string')
		{
			if(_string.length === 0)
			{
				return (_type === 'bigint' ? 0n : 0);
			}
		}
		else
		{
			return x('The % argument needs to be a %', null, '_string', 'String');
		}

		//
		var negative;
		const originalRadix = _radix;

		if((_radix = numeric.checkRadix(_radix, DEFAULT_UNICODE, _throw)) === null)
		{
			return null;
		}
		else
		{
			[ _string, negative ] = numeric.checkSign(_string, _radix, _throw);
		}

		const features = numeric.features(_radix, false, _throw);

		if(features === null)
		{
			return null;
		}
		else
		{
			if((_string = numeric.fromExponential(_string, features, _throw)) === null)
			{
				if(_throw)
				{
					return x('Something went wrong while trying exponential converrsion');
				}

				return null;
			}

			if(_type === 'bigint')
			{
				if(features.bigint)
				{
					const once = _string.once('n');

					if(once === false)
					{
						if(_throw)
						{
							return x('You are trying to parse an %, but the \'%\' suffix is twice');
						}

						return null;
					}
					else if(once === true)
					{
						_string = _string.removeLast();
					}
				}
			}
			else if(features.bigint && _string[_string.length - 1] === 'n')
			{
				if(_throw)
				{
					return x('Your are NOT trying to parse an %, so your \'%\' suffix is not OK', null, 'BigInt', 'n');
				}

				return null;
			}

			const filterArgs = [];

			if(features.alphabet)
			{
				filterArgs.push(_radix[0]);

				if(features.minus)
				{
					filterArgs.push('-');
				}

				if(features.plus)
				{
					filterArgs.push('+');
				}

				if(features.floats)
				{
					filterArgs.push('.');
				}
			}
			else
			{
				filterArgs.push(0);
			}

			if(_string.only(... filterArgs))
			{
				return (_type === 'bigint' ? 0n : 0);
			}
			else if(features.alphabet)
			{
				_string = _string.removeStarting(_radix[0]);
			}
			else
			{
				_string = _string.removeStarting(0);
			}
		}

		//
		if(features.lowerCase)
		{
			_string = _string.toLowerCase();
		}
		else if(features.upperCase)
		{
			_string = _string.toUpperCase();
		}

		//
		if((_type === 'float' || _type === 'number') && _string.once('.') === false)
		{
			if(_throw)
			{
				return x('Your floating point string has more than one \'%\'', null, '.');
			}

			return null;
		}

		//
		var int, float;

		if(features.floats)
		{
			[ int, float ] = _string._split('.', 2);

			if(typeof float === 'undefined')
			{
				float = '';
			}

			if(_type === 'int' || _type === 'bigint')
			{
				if(float.length > 0)
				{
					if(DEFAULT_STRICT_CHECK_TYPE)
					{
						if(_throw)
						{
							return x('Your % contains an % number, but you requested an % type', null, '_string', 'floating point', (_type === 'bigint' ? 'BigInt' : 'Integer'));
						}

						return null;
					}
					else
					{
						float = '';
					}
				}
			}
			else if(_type === 'float')
			{
				if(float.length === 0)
				{
					if(DEFAULT_STRICT_CHECK_TYPE)
					{
						if(_throw)
						{
							return x('Your % contains an % number, but you requested an % type', null, '_string', 'Integer', 'floating point');
						}

						return null;
					}
				}
			}
		}
		else
		{
			if(_type === 'float')
			{
				if(_throw)
				{
					return x('You want a % number, but your alphabet also contains a \'%\'', null, 'floating point', '.');
				}

				return null;
			}
			else
			{
				int = _string;
				float = '';
			}
		}

		if(_type === 'bigint' || _type === 'int')
		{
			float = '';
		}

		//
		const getValue = (_code_point) => {
			//
			var res;

			//
			if(features.alphabet)
			{

				/*if((res = _radix.indexOfCodePoint(_code_point)) === -1)
				{
					if(_throw)
					{
						return x('Invalid input (code point % is not in your alphabet)', null, _code_point);
					}

					return null;
				}*/

				if((res = _radix.indexOf(String.fromCodePoint(_code_point))) === -1)
				{
					if(_throw)
					{
						return x('Invalid input (code point % is not in your alphabet)', null, _code_point);
					}

					return null;
				}
			}
			else //if(features.unicode)
			{
				if(_code_point >= features.absolute)
				{
					if(_throw)
					{
						return x('Invalid input (code point % > % (absolute radix))', null, _code_point, features.absolute);
					}

					return null;
				}

				if(features.negative)
				{
					res = ((features.absolute - 1) - _code_point);
				}
				else
				{
					res = _code_point;
				}
			}

			//
			if(big)
			{
				return BigInt.from(res);
			}

			return res;
		};

		//
		const big = (_type === 'bigint');
		const radix = (features.unicode ? (big ? BigInt.from(_radix) : _radix) : (big ? BigInt.from(_radix.length) : _radix.length));
		var result = (big ? 0n : 0);
		var value;

		for(var i = int.length - 1, mul = (big ? 1n : 1); i >= 0; i--)
		{
			if((value = getValue(int.codePointAt(i))) === null)
			{
				return null;
			}
			else
			{
				result += (mul * value);
			}

			if(DEFAULT_STRICT_CHECK_SIZE && !big && (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER))
			{
				if(_throw)
				{
					return x('Your number became too big (absolute value is > %.% (%))', null, 'Number', 'MAX_SAFE_INTEGER', Number.MAX_SAFE_INTEGER);
				}

				return Infinity;
			}
			else
			{
				mul *= radix;
			}
		}

		//
		if(float.length > 0)
		{
			for(var i = 0, mul = (1 / radix); i < float.length; i++)
			{
				if((value = getValue(float.codePointAt(i))) === null)
				{
					return null;
				}
				else
				{
					result += (mul * value);
					mul /= radix;
				}

				//
				//TODO/
				//
				/*if(DEFAULT_STRICT_CHECK_SIZE)
				{
					//TODO/maximum number of nachkommazahlen...
				}*/
			}
		}

		//
		if(negative)
		{
			result = -result;
		}

		//
		return result;
	}

	//
	const _toFixed = Number.prototype.toFixed;

	Object.defineProperty(Number.prototype, 'toString', { value: function(_radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
	{
		if(typeof _radix === 'boolean' || Object.isObject(_radix))
		{
			return String.render(this.valueOf(), _radix);
		}

		return numeric.toString(this.valueOf(), _radix, null, _throw);
	}});

	Object.defineProperty(Number.prototype, 'toText', { value: function(_precision = null, _lang, _throw = DEFAULT_THROW)
	{
		return numeric.toText(this.valueOf(), _precision, _lang, null, _throw);
	}});

	Object.defineProperty(Number, 'toText', { value: function(_value, _precision = null, _lang, _throw = DEFAULT_THROW)
	{
		if(typeof _value === 'number')
		{
			return _value.toText(_precision, _lang, _throw);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting a %)', null, '_value', 'Number');
		}

		return null;
	}});

	//
	Object.defineProperty(Number, 'parseInt', { value: function(_string, _radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
	{
		return numeric.parse(_string, _radix, 'int', _throw);
	}});

	Object.defineProperty(Number, 'parseLocaleInt', { value: function(_string, _lang, _throw = DEFAULT_THROW)
	{
		return Number.parseInt(numeric.removeLocalization(_string, _lang, _throw), 10, _throw);
	}});

	parseInt = Number.parseInt;
	parseLocaleInt = Number.parseLocaleInt;

	Object.defineProperty(Number, 'parseFloat', { value: function(_string, _radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
	{
		return numeric.parse(_string, _radix, 'float', _throw);
	}});

	Object.defineProperty(Number, 'parseLocaleFloat', { value: function(_string, _lang, _throw = DEFAULT_THROW)
	{
		return Number.parseFloat(numeric.removeLocalization(_string, _lang, _throw), 10, _throw);
	}});

	parseFloat = Number.parseFloat;
	parseLocaleFloat = Number.parseLocaleFloat;

	Object.defineProperty(Number, 'parseNumber', { value: function(_string, _radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
	{
		return numeric.parse(_string, _radix, 'number', _throw);
	}});

	Object.defineProperty(Number, 'parseLocaleNumber', { value: function(_string, _lang, _throw = DEFAULT_THROW)
	{
		return Number.parseNumber(numeric.removeLocalization(_string, _lang, _throw), 10, _throw);
	}});

	parseNumber = Number.parseNumber;
	parseLocaleNumber = Number.parseLocaleNumber;

	//
	if(numeric.bigInt)
	{
		//
		Object.defineProperty(BigInt.prototype, 'toString', { value: function(_radix = DEFAULT_RADIX, _suffix = DEFAULT_BIGINT_SUFFIX, _throw = DEFAULT_THROW)
		{
			if(typeof _radix === 'boolean' || Object.isObject(_radix))
			{
				return String.render(this.valueOf(), Object.assign({
					bigint: DEFAULT_BIGINT_SUFFIX }, _radix));
			}

			return numeric.toString(this.valueOf(), _radix, _suffix, _throw);
		}});

		Object.defineProperty(BigInt.prototype, 'toText', { value: function(_lang, _suffix = DEFAULT_BIGINT_SUFFIX, _throw = DEFAULT_THROW)
		{
			return numeric.toText(this.valueOf(), null, _lang, _suffix, _throw);
		}});

		Object.defineProperty(BigInt, 'toText', { value: function(_value, _lang, _suffix = DEFAULT_BIGINT_SUFFIX, _throw = DEFAULT_THROW)
		{
			if(typeof _value === 'bigint')
			{
				return _value.toText(null, _lang, _suffix, _throw);
			}
			else if(_throw)
			{
				return x('Invalid % argument (expecting a %)', null, '_value', 'BigInt');
			}

			return null;
		}});

		//
		Object.defineProperty(BigInt, 'parse', { value: function(_string, _radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
		{
			return numeric.parse(_string, _radix, 'bigint', _throw);
		}});

		Object.defineProperty(BigInt, 'parseLocale', { value: function(_string, _lang, _throw = DEFAULT_THROW)
		{
			return BigInt.parse(numeric.removeLocalization(_string, _lang, _throw), 10, _throw);
		}});

		parseBigInt = BigInt.parse;
		parseLocaleBigInt = BigInt.parseLocale;
	}

	//
	numeric.limited = function(... _args)
	{
		if(typeof alphabet === 'undefined')
		{
			require('ext/alphabet');
		}

		return alphabet.limited(... _args);
	}

	numeric.validCodePoint = function(... _args)
	{
		if(typeof alphabet === 'undefined')
		{
			require('ext/alphabet');
		}

		return alphabet.validCodePoint(... _args);
	}

	isRadix = numeric.isRadix = function(_value, _limited = false, _unicode = !_limited)
	{
		if(typeof _value === 'string')
		{
			if(_value.unique().length < 2)
			{
				return false;
			}

			return numeric.isAlphabet(_value, _limited);
		}
		else if(typeof _value !== 'number')
		{
			return null;
		}
		else if(! _value.isInt)
		{
			return false;
		}
		else if(_value < 0)
		{
			_value = numeric.toPositiveRadix(_value);
		}

		if(_value > 256)
		{
			if(_unicode)
			{
				return (_value <= alphabet.MAX_UNICODES + 1);
			}

			return false;
		}
		else if(_limited)
		{
			return numeric.limited(_value);
		}

		return (_value >= 0 && _value <= 256);
	}

	isAlphabet = numeric.isAlphabet = function(_value, _limited = false)
	{
		if(typeof _value === 'string' && (_value = _value.unique()).length >= 2)
		{
			if(_limited)
			{
				return numeric.limited(_value);
			}

			return true;
		}

		return false;
	}

	Object.defineProperty(numeric, 'negateRadix', { value: function(... _args)
	{
		return alphabet.negate(... _args);
	}});

	Object.defineProperty(numeric, 'toPositiveRadix', { value: function(... _args)
	{
		return alphabet.toPositive(... _args);
	}});

	Object.defineProperty(numeric, 'toNegativeRadix', { value: function(... _args)
	{
		return alphabet.toNegative(... _args);
	}});

	//
	isNumeric = numeric.isNumeric = function(_item, _radix = null)
	{
		if(_radix !== null)
		{
			if(typeof _radix === 'boolean')
			{
				_radix = (_radix ? DEFAULT_RADIX : null);
			}
			else if(! isRadix(_radix))
			{
				_radix = null;
			}
		}

		if(numeric.isNumber(_item, _radix))
		{
			return true;
		}
		else if(numeric.isBigInt(_item, _radix))
		{
			return true;
		}

		return false;
	}

	isBigInt = numeric.isBigInt = function(_value, _radix)
	{
		if(_radix === true)
		{
			_radix = DEFAULT_RADIX;
		}

		if(typeof _value === 'bigint')
		{
			return true;
		}
		else if(typeof _value === 'string' && _value.length > 0 && numeric.isRadix(_radix))
		{
			return _value.isBigInt(_radix);
		}

		return false;
	}

	isNumber = numeric.isNumber = function(_value, _radix)
	{
		if(_radix === true)
		{
			_radix = DEFAULT_RADIX;
		}

		if(typeof _value === 'number')
		{
			return _value.isNumber;
		}
		else if(typeof _value === 'string' && _value.length > 0 && numeric.isRadix(_radix))
		{
			return _value.isNumber(_radix);
		}

		return false;
	}

	isInt = numeric.isInt = function(_value, _radix)
	{
		if(_radix === true)
		{
			_radix = DEFAULT_RADIX;
		}

		if(typeof _value === 'number')
		{
			return _value.isInt;
		}
		else if(typeof _value === 'string' && _value.length > 0 && numeric.isRadix(_radix))
		{
			return _value.isInt(_radix);
		}

		return false;
	}

	isFloat = numeric.isFloat = function(_value, _radix)
	{
		if(_radix === true)
		{
			_radix = DEFAULT_RADIX;
		}

		if(typeof _value === 'number')
		{
			return _value.isFloat;
		}
		else if(typeof _value === 'string' && _value.length > 0 && numeric.isRadix(_radix))
		{
			return _value.isFloat(_radix);
		}

		return false;
	}

	isByte = numeric.isByte = function(_value, _radix)
	{
		if(isInt(_value, _radix))
		{
			if(typeof _value === 'string')
			{
				_value = parseInt(_value, _radix);
			}

			return (_value >= 0 && _value <= 255);
		}

		return false;
	}

	//
	numeric.prepareString = function(_string, _alphabet = null)
	{
		//
		var nul;

		if(typeof _alphabet === 'string')
		{
			nul = _alphabet[0];
		}
		else
		{
			nul = String.fromCharCode(0);
		}

		//
		_string = _string.removeStarting(nul);

		if(typeof _alphabet === 'string' && _alphabet.indexOf('.') === -1)
		{
			if(_string[0] === '.')
			{
				_string = nul + _string;
			}
		}

		//
		var removeLast = 0;

		if(_string.indexOf('.') > -1 && typeof _alphabet === 'string' && _alphabet.indexOf('.') === -1) for(var i = _string.length - 1; i >= 0; i--)
		{
			if(_string.at(i) === nul)
			{
				removeLast++;
			}
			else
			{
				break;
			}
		}

		_string = _string.removeLast(removeLast);

		if(_string[_string.length - 1] === '.')
		{
			_string = _string.removeLast();
		}

		//
		return _string;
	}

	numeric.prepareStringFunction = function(_string, _radix = DEFAULT_RADIX, _check_sign = true)
	{
		//
		const radix = alphabet(_radix, true);
		const features = numeric.features(radix, false);

		_string = numeric.prepareString(_string, features.alphabet);

		if(features === null)
		{
			return null;
		}
		else if(features.lowerCase)
		{
			_string = _string.toLowerCase();
		}
		else if(features.upperCase)
		{
			_string = _string.toUpperCase();
		}

		if(features.alphabet)
		{
			_string = _string.removeStarting(features.alphabet[0]);
		}
		else
		{
			_string = _string.removeStarting(String.fromCharCode(0));
		}

		var negative;

		if(features.negative)
		{
			if(_check_sign)
			{
				[ _string, negative ] = numeric.checkSign(_string, radix, false);
			}
			else
			{
				negative = undefined;
			}
		}
		else
		{
			negative = null;
		}

		//
		const result = features;
		result.string = _string;
		result.negative = negative;

		//
		return result;
	}

	numeric.checkStringForUnicodeMaximum = function(_string, _radix)
	{
		if(typeof _string !== 'string')
		{
			return x('Invalid % argument (expecting a %)', null, '_string', 'String');
		}
		else if(! (isInt(_radix) && (_radix > 256 || _radix < -257)))
		{
			return x('Invalid % argument (expecting an %)', null, '_radix', 'Integer');
		}
		else if(_string.length === 0)
		{
			return true;
		}
		else if(_radix < 0)
		{
			_radix = numeric.toPositiveRadix(_radix);
		}

		const len = [ ... _string.valueOf() ].length;

		for(var i = 0; i < len; i++)
		{
			if(_string.codePointAt(i) >= _radix)
			{
				return false;
			}
		}

		return true;
	}

	numeric.filterUnicodeMaximum = function(_string, _unicode_radix)
	{
		if(typeof _string !== 'string')
		{
			return x('Invalid % argument (expecting a %)', null, 'String');
		}
		else if(! isInt(_unicode_radix))
		{
			return x('Invalid % argument (expecting an %)', null, '_unicode_radix', 'Integer');
		}
		else if(_string.length === 0)
		{
			return '';
		}
		else if(_radix < 0)
		{
			_radix = (Math.abs(_radix) - 1);
		}

		var result = '';

		for(var i = 0; i < _string.length; i++)
		{
			if(_string.codePointAt(i) < _unicode_radix)
			{
				result += _string.at(i);
			}
		}

		return result;
	}

	numeric.filterAlphabet = function(_string, _alphabet, _floats, _allow_point_start = DEFAULT_ALLOW_POINT_START)
	{
		if(typeof _floats !== 'boolean')
		{
			return x('Invalid % argument (expecting a %)', null, '_floats', 'Boolean');
		}
		else if(typeof _string !== 'string')
		{
			return x('Invalid % argument (expecting %)', null, '_string', 'String');
		}
		else if(_string.length === 0)
		{
			return '0';
		}
		else if(typeof _alphabet !== 'string' || _alphabet.length < 2)
		{
			return x('Invalid % argument (expecting % with at least % characters)', null, '_alphabet', 'String', 2);
		}
		else if(_alphabet.indexOf('.') > -1)
		{
			_floats = null;
		}

		var result = '';
		var hadFloat = (_floats ? false : null);

		for(var i = 0; i < _string.length; ++i)
		{
			if(_alphabet.indexOf(_string.at(i)) > -1)
			{
				result += _string.at(i);
			}
			else if(_string.at(i) === '.')
			{
				if(hadFloat)
				{
					if(result[result.length - 1] !== '.')
					{
						break;
					}
				}
				else if(result.length === 0)
				{
					if(_allow_point_start)
					{
						result = '0.';
						hadFloat = true;
					}
				}
				else
				{
					result += '.';
					hadFloat = true;
				}
			}
			else if(result.length > 0 && result !== '0.')
			{
				break;
			}
		}

		if(result[result.length - 1] === '.')
		{
			result.removeLast();
		}

		return result;

		for(var i = 0; i < _string.length; i++)
		{
			if(_string.at(i) === '.')
			{
				if(! _floats && result.length > 0)
				{
					break;
				}
				else if(result.length === 0)
				{
					if(_allow_point_start && _floats)
					{
						result = '0.';
						hadFloat = true;
					}
				}
				else if(hadFloat === false)
				{
					result += '.';
					hadFloat = true;
				}
				else
				{
					break;
				}
			}
			else if(_alphabet.indexOf(_string.at(i)) > -1)
			{
				result += _string.at(i);
			}
			else if(result.length > 0)
			{
				break;
			}
		}

		return result;
	}

	numeric.filterString = function(_string, _radix_alphabet, _floats)
	{
		if(typeof _string !== 'string')
		{
			return x('Invalid % argument (expecting a %)', null, '_string', 'String');
		}
		else if(typeof _floats !== 'boolean' && _floats !== null)
		{
			return x('Invalid % argument (expecting a % or %)', null, '_floats', 'Boolean', null);
		}
		else if(typeof _radix_alphabet !== 'string' && !isInt(_radix_alphabet))
		{
			return x('Invalid % argument (expecting a % or an %)', null, '_radix_alphabet', 'String', 'Integer');
		}
		else if(_string.length === 0)
		{
			return '';
		}
		else if(isInt(_radix_alphabet) && _radix_alphabet < 0)
		{
			_radix_alphabet = (Math.abs(_radix_alphabet) - 1);
		}

		_string = _string.replaces('..', '.');

		var result = '';
		var started = false;
		var hadPoint = ((typeof _radix_alphabet === 'string' && _radix_alphabet.indexOf('.') === -1) ? false : null);

		for(var i = 0; i < _string.length; i++)
		{
			if(started)
			{
				if(typeof _radix_alphabet === 'string')
				{
					if(_string.at(i) === '.')
					{
						if(_floats && _radix_alphabet.indexOf('.') === -1)
						{
							if(hadPoint)
							{
								break;
							}
							else
							{
								result += '.';
								hadPoint = true;
							}
						}
						else if(_radix_alphabet.indexOf('.') > -1)
						{
							result += '.';
						}
						else
						{
							break;
						}
					}
					else if(_radix_alphabet.indexOf(_string.at(i)) === -1)
					{
						break;
					}
					else
					{
						result += _string.at(i);
					}
				}
				else if(_string.codePointAt(i) < _radix_alphabet)
				{
					result += _string.at(i);
				}
				else
				{
					break;
				}
			}
			else if(typeof _radix_alphabet === 'string')
			{
				if(_string.at(i) === '.')
				{
					if(_floats && _radix_alphabet.indexOf('.') === -1)
					{
						if(hadPoint)
						{
							break;
						}
						else
						{
							result += '.';
							hadPoint = true;
						}
					}
					else if(_radix_alphabet.indexOf('.') > -1)
					{
						result += '.';
					}
					else
					{
						break;
					}
				}
				else if(_radix_alphabet.indexOf(_string.at(i)) > -1)
				{
					started = true;
					result += _string.at(i);
				}
			}
			else if(_string.codePointAt(i) < _radix_alphabet)
			{
				started = true;
				result += _string.at(i);
			}
		}

		if(result[0] === '.')
		{
			result = ('0' + result);
		}

		return result;
	}

	numeric.filterSigns = (_string, _minus, _plus) => {
		var remove = 0;

		if(_minus || _plus) for(var i = 0; i < _string.length; ++i)
		{
			if(_minus && _string[i] === '-')
			{
				++remove;
			}
			else if(_plus && _string[i] === '+')
			{
				++remove;
			}
			else
			{
				break;
			}
		}

		return _string.substr(remove);
	};

	//
	Object.defineProperty(String.prototype, 'isNaN', { value: function(_radix = DEFAULT_RADIX)
	{
		if(this.length === 0)
		{
			return true;
		}

		return !this.isNumber(_radix);
	}});

	Object.defineProperty(String, 'isNaN', { value: function(_item, _radix = DEFAULT_RADIX)
	{
		if(typeof _item === 'string')
		{
			return _item.isNaN(_radix);
		}

		return null;
	}});

	//
	Object.defineProperty(String.prototype, 'isNumeric', { value: function(_radix = DEFAULT_RADIX)
	{
		return (this.isNumber(_radix) || this.isBigInt(_radix));
	}});

	Object.defineProperty(String.prototype, 'isLocaleNumeric', { value: function(_lang)
	{
		return numeric.removeLocalization(this.valueOf(), _lang, false).isNumeric(10);
	}});

	Object.defineProperty(String, 'isNumeric', { value: function(_item, _radix = DEFAULT_RADIX)
	{
		if(typeof _item === 'string')
		{
			return _item.isNumeric(_radix);
		}

		return null;
	}});

	Object.defineProperty(String, 'isLocaleNumeric', { value: function(_item, _lang)
	{
		if(typeof _item === 'string')
		{
			return numeric.removeLocalization(_item, _lang, false).isNumeric(10);
		}

		return null;
	}});

	Object.defineProperty(String.prototype, 'isNumber', { value: function(_radix = DEFAULT_RADIX)
	{
		if(this.length === 0)
		{
			return false;
		}
		else if(_radix === 256 || _radix === -257)
		{
			return true;
		}

		const res = numeric.prepareStringFunction(this.valueOf(), _radix);

		if(res === null)
		{
			return null;
		}
		else if(res.unicode)
		{
			return res.string.checkAlphabet(res.radix);
		}
		else if(res.alphabet)
		{
			if(res.floats && res.string.once('.') === false)
			{
				return false;
			}
			else if((res.string = numeric.filterSigns(res.string, res.minus, res.plus)).length === 0)
			{
				return false;
			}
			else if(res.e || res.E)
			{
				res.string = numeric.fromExponential(res.string);
			}
			
			return res.string.checkAlphabet(res.alphabet + '.');
		}
		
		return null;
	}});

	Object.defineProperty(String.prototype, 'isLocaleNumber', { value: function(_lang)
	{
		return numeric.removeLocalization(this.valueOf(), _lang, false).isNumber(10);
	}});

	Object.defineProperty(String, 'isNumber', { value: function(_item, _radix = DEFAULT_RADIX)
	{
		if(typeof _item === 'string')
		{
			return _item.isNumber(_radix);
		}

		return null;
	}});

	Object.defineProperty(String, 'isLocaleNumber', { value: function(_item, _lang)
	{
		if(typeof _item === 'string')
		{
			return numeric.removeLocalization(_item, _lang, false).isNumber(10);
		}

		return null;
	}});

	Object.defineProperty(String.prototype, 'isInt', { value: function(_radix = DEFAULT_RADIX)
	{
		if(this.length === 0)
		{
			return false;
		}
		else if(_radix === 256 || _radix === -257)
		{
			return true;
		}

		const res = numeric.prepareStringFunction(this.valueOf(), _radix);

		if(res === null)
		{
			return null;
		}
		else if(res.unicode)
		{
			return res.string.checkAlphabet(res.radix);
		}
		else if(res.floats && res.string.indexOf('.') > -1)
		{
			return false;
		}
		else if(res.alphabet)
		{
			if((res.string = numeric.filterSigns(res.string, res.minus, res.plus)).length === 0)
			{
				return false;
			}
			else if(res.e || res.E)
			{
				res.string = numeric.fromExponential(res.string);
			}
			
			return res.string.checkAlphabet(res.alphabet);
		}

		return null;
	}});

	Object.defineProperty(String, 'isInt', { value: function(_item, _radix = DEFAULT_RADIX)
	{
		if(typeof _item === 'string')
		{
			return _item.isInt(_radix);
		}

		return null;
	}});

	Object.defineProperty(String.prototype, 'isLocaleInt', { value: function(_lang)
	{
		return numeric.removeLocalization(this.valueOf(), _lang, false).isInt(10);
	}})

	Object.defineProperty(String, 'isLocaleInt', { value: function(_item, _lang)
	{
		if(typeof _item === 'string')
		{
			return numeric.removeLocalization(_item, _lang, false).isInt(10);
		}

		return null;
	}});

	Object.defineProperty(String.prototype, 'isByte', { value: function(_radix = DEFAULT_RADIX)
	{
		if(this.isInt(_radix))
		{
			const value = parseInt(this.valueOf(), _radix);

			if(Number.isInt(value))
			{
				if(value >= 0 && value <= 255)
				{
					return true;
				}
			}
		}

		return false;
	}});

	Object.defineProperty(String, 'isByte', { value: function(_item, _radix = DEFAULT_RADIX)
	{
		if(typeof _item === 'string')
		{
			return _item.isByte(_radix);
		}

		return null;
	}});

	Object.defineProperty(String.prototype, 'isFloat', { value: function(_radix = DEFAULT_RADIX)
	{
		if(this.length === 0)
		{
			return false;
		}
		else if(_radix === 256 || _radix === -257)
		{
			return false;
		}

		const res = numeric.prepareStringFunction(this.valueOf(), _radix);

		if(res === null)
		{
			return null;
		}
		else if(res.unicode)
		{
			return res.string.checkAlphabet(res.radix);
		}
		else if(res.alphabet)
		{
			if(res.floats && !res.string.once('.'))
			{
				return false;
			}
			else if((res.string = numeric.filterSigns(res.string, res.minus, res.plus)).length === 0)
			{
				return false;
			}
			else if(res.e || res.E)
			{
				res.string = numeric.fromExponential(res.string);
			}
			
			return res.string.checkAlphabet(res.alphabet + '.');
		}

		return null;
	}});

	Object.defineProperty(String, 'isFloat', { value: function(_item, _radix = DEFAULT_RADIX)
	{
		if(typeof _item === 'string')
		{
			return _item.isFloat(_radix);
		}

		return null;
	}});

	Object.defineProperty(String.prototype, 'isLocaleFloat', { value: function(_lang)
	{
		return numeric.removeLocalization(this.valueOf(), _lang, false).isFloat(10);
	}});

	Object.defineProperty(String, 'isLocaleFloat', { value: function(_item, _lang)
	{
		if(typeof _item === 'string')
		{
			return numeric.removeLocalization(_item, _lang, false).isFloat(10);
		}

		return null;
	}});

	if(numeric.bigInt)
	{
		Object.defineProperty(String.prototype, 'isBigInt', { value: function(_radix = DEFAULT_RADIX)
		{
			//
			if(! numeric.bigInt)
			{
				return undefined;
			}
			else if(this.length === 0)
			{
				return false;
			}
			else if(this.valueOf() === 'n')
			{
				return false;
			}
			else if(_radix === 256 || _radix === -257)
			{
				return true;
			}

			//
			const res = numeric.prepareStringFunction(this.valueOf(), _radix);

			if(res === null)
			{
				return null;
			}
			else if(res.unicode)
			{
				return res.string.checkAlphabet(res.radix);
			}
			else if(res.bigint !== false && res.string[res.string.length - 1] === 'n')
			{
				res.string = res.string.removeLast();
			}

			if(res.floats && res.string.indexOf('.') > -1)
			{
				return false;
			}

			if(res.alphabet)
			{
				if((res.string = numeric.filterSigns(res.string, res.minus, res.plus)).length === 0)
				{
					return false;
				}
				else if(res.e || res.E)
				{
					res.string = numeric.fromExponential(res.string);
				}
				
				return res.string.checkAlphabet(res.alphabet);
			}

			return null;
		}});

		Object.defineProperty(String, 'isBigInt', { value: function(_item, _radix = DEFAULT_RADIX)
		{
			if(typeof _item === 'string')
			{
				return _item.isBigInt(_radix);
			}

			return null;
		}});

		Object.defineProperty(String.prototype, 'isLocaleBigInt', { value: function(_lang)
		{
			return numeric.removeLocalization(this.valueOf(), _lang, false).isBigInt(10);
		}});

		Object.defineProperty(String, 'isLocaleBigInt', { value: function(_item, _Lang)
		{
			if(typeof _item === 'string')
			{
				return numeric.removeLocalization(_item, _lang, false).isBigInt(10);
			}

			return null;
		}});
	}

	//
	//TODO/alle folgenden string-funktionen arbeiten NICHT mit this[.valueOf()], sondern mit 'res.string'!!!!! ;-)
	//TODO/and don't forget the if(negative) am ende!!! [ps: echt hier? nicht dort? x);
	//
	Object.defineProperty(String.prototype, 'parseInt', { value: function(_radix = DEFAULT_RADIX, _filter = DEFAULT_FILTER_STRING, _throw = DEFAULT_THROW)
	{
		if(this.length === 0)
		{
			return 0;
		}

		const res = numeric.prepareStringFunction(this.valueOf(), _radix);

		if(res === null)
		{
			return null;
		}
		else if(res.alphabet)
		{
			if(_filter)
			{
				res.string = numeric.filterString(numeric.filterAlphabet(res.string, res.alphabet, false), res.alphabet, false);
			}

			if(res.negative)
			{
				res.string = ('-' + res.string);
			}
		}
		else if(_filter)
		{
			res.string = numeric.filterUnicodeMaximum(res.string, res.absolute);
		}

		return Number.parseInt(res.string, res.code, _throw);
	}});

	//
	Object.defineProperty(String.prototype, 'parseLocaleInt', { value: function(_lang, _filter = DEFAULT_FILTER_STRING, _throw = DEFAULT_THROW)
	{
		return numeric.removeLocalization(this.valueOf(), _lang, _throw).parseInt(10, _filter, _throw);
	}});

	Object.defineProperty(String.prototype, 'parseFloat', { value: function(_radix = DEFAULT_RADIX, _filter = DEFAULT_FILTER_STRING, _throw = DEFAULT_THROW)
	{
		if(this.length === 0)
		{
			return 0;
		}

		const res = numeric.prepareStringFunction(this.valueOf(), _radix);

		if(res === null)
		{
			return null;
		}
		else if(res.alphabet)
		{
			if(_filter)
			{
				res.string = numeric.filterString(numeric.filterAlphabet(res.string, res.alphabet, true), res.alphabet, true);
			}

			if(res.negative)
			{
				res.string = ('-' + res.string);
			}
		}
		else if(_throw)
		{
			return x('There\'s no alphabet defined, so we can\'t parse floating points');
		}
		else
		{
			return null;
		}

		return Number.parseFloat(res.string, res.code, _throw);
	}});

	Object.defineProperty(String.prototype, 'parseLocaleFloat', { value: function(_lang, _filter = DEFAULT_FILTER_STRING, _throw = DEFAULT_THROW)
	{
		return numeric.removeLocalization(this.valueOf(), _lang, _throw).parseFloat(10, _filter, _throw);
	}});

	Object.defineProperty(String.prototype, 'parseNumber', { value: function(_radix = DEFAULT_RADIX, _filter = DEFAULT_FILTER_STRING, _throw = DEFAULT_THROW)
	{
		if(this.length === 0)
		{
			return 0;
		}

		const res = numeric.prepareStringFunction(this.valueOf(), _radix);

		if(res === null)
		{
			return null;
		}
		else if(res.alphabet)
		{
			if(_filter)
			{
				res.string = numeric.filterString(numeric.filterAlphabet(res.string, res.alphabet, true), res.alphabet, true);
			}

			if(res.negative)
			{
				res.string = ('-' + res.string);
			}
		}
		else if(_filter)
		{
			res.string = numeric.filterUnicodeMaximum(res.string, res.absolute);
		}

		return Number.parseNumber(res.string, res.code, _throw);
	}});

	Object.defineProperty(String.prototype, 'parseLocaleNumber', { value: function(_lang, _filter = DEFAULT_FILTER_STRING, _throw = DEFAULT_THROW)
	{
		return numeric.removeLocalization(this.valueOf(), _lang, _throw).parseNumber(10, _filter, _throw);
	}});

	Object.defineProperty(String.prototype, 'parseBigInt', { value: function(_radix = DEFAULT_RADIX, _filter = DEFAULT_FILTER_STRING, _throw = DEFAULT_THROW)
	{
		//
		if(! numeric.bigInt)
		{
			return undefined;
		}
		else if(this.length === 0)
		{
			return 0n;
		}

		const res = numeric.prepareStringFunction(this.valueOf(), _radix);

		if(res === null)
		{
			return null;
		}
		else if(res.alphabet)
		{
			if(_filter)
			{
				res.string = numeric.filterString(numeric.filterAlphabet(res.string, res.alphabet, false), res.alphabet, false);
			}

			if(res.negative)
			{
				res.string = ('-' + res.string);
			}
		}
		else if(_filter)
		{
			res.string = numeric.filterUnicodeMaximum(res.string, res.absolute);
		}

		return BigInt.parse(res.string, res.code, _throw);
	}});

	//
	Object.defineProperty(String.prototype, 'parseLocaleBigInt', { value: function(_lang, _filter = DEFAULT_FILTER_STRING, _throw = DEFAULT_THROW)
	{
		return numeric.removeLocalization(this.valueOf(), _lang, _throw).parseBigInt(10, _filter, _throw);
	}});

	//

})();

//
//
//TODO/...
//
	//
	// .. bitte auch SIZE-check in sachen "valid numbers" vs. bigints...!!! oder!??
	//
	// ja, siehe 'DEFAULT_STRICT_CHECK_SIZE'..!! (@ parse is das bereits, fehlt noch beim rendern);
	//
	//
	// ... => 'numerTooHigh()' vs. 'adaptNumber()'
	//
	//
	//TODO/..
	//
	// bitte auch noch .. sowas wie check, ob 'features().minus|floats' gegen numeric _value...
	//
	// sprich, wenn es um eine negativ- oder flieszkomma-zahl geht, das alphabet das aber nicht supported, muss fehler/null... odeR?! ^_^
	//
	// EVTL.(?!) @ 'DEFAULT_STRICT_CHECK_TYPE' oder so!???
	//
	// ODER LAEUFT DAS SCHON SO!!??? //TODO/...
	//
	//
	//
//
