(function()
{

	//
	const DEFAULT_MAX_LONG = 50;//?
	const DEFAULT_MAX_ENV = 50;//!????
	const DEFAULT_MAX_SHORT = 10;//..

	const DEFAULT_HELP = true;//will insert '--help' and '-?' automatically, if nothing LIKE THIS was defined before (these keys, or any ".call" w/ "help" or "help("..);

	const DEFAULT_AUTO_SHORT = true;//even if (false) here: settings (.short = null) will nevertheless auto-generate shorts. ^_^
	const DEFAULT_AUTO_SHORT_TWO = true;//this holds in every case.. feature to try .short with a maximum of two characters, if no single ones were free..

	const DEFAULT_PARSE = true;
	const DEFAULT_LAST = false;

	const DEFAULT_LIST = true;

	const DEFAULT_FILL = undefined;

	const DEFAULT_ENABLE_ASSIGN = true;
	const DEFAULT_ENABLE_EXPAND = true;
	const DEFAULT_ENABLE_LIST = true;
	const DEFAULT_ENABLE_CALL = true;
	const DEFAULT_ENABLE_EQUAL_SIGN = true;

	const DEFAULT_ASSIGN_ONLY_WITH_ARGS = true;//'=' and '-lde' etc... or  do we wish two const default_ for this!??

	const DEFAULT_CALL_HELP_STREAM = 1;
	const DEFAULT_CALL_HELP_COLORIZATION = true;
	const DEFAULT_CALL_HELP_ARRAY_DEPTH = 1;
	const DEFAULT_CALL_HELP_ARRAY_INDEX = false;
	const DEFAULT_CALL_EXIT_STRING = 'EXIT (%)!';

	const DEFAULT_ESCAPE = 'c';//'c', 'iso', 'ctrl', 'hex', ..!

	//
	const RESERVED = [ 'ARGV', 'KEY', 'INDEX', 'ITEM', 'GROUP', 'VECTOR', 'COUNT', 'CALL', 'RESULT', 'RESERVED' ];

	//
	getopt = module.exports = function(_vector, _last, _parse = DEFAULT_PARSE, _parse_argv = _parse, _list = DEFAULT_LIST, _list_argv = _list, _call_func, _argv, _prepare = false)
	{
		//
		if(! Object.isObject(_vector))
		{
			_vector = Object.create(null);
		}

		if(Array.isArray(_argv, true))
		{
			_argv = [ ... _argv ];
		}
		else
		{
			_argv = process.ARGV;
		}

		if(typeof _last !== 'boolean' && !Number.isInt(_last))
		{
			_last = DEFAULT_LAST;
		}

		if(typeof _parse !== 'boolean')
		{
			_parse = DEFAULT_PARSE;
		}

		if(typeof _parse_argv !== 'boolean')
		{
			_parse_argv = _parse;
		}

		if(typeof _list !== 'boolean')
		{
			_list = DEFAULT_LIST;
		}

		if(typeof _call_func !== 'function' && !(String.isString(_call_func) || Array.isArray(_call_func, false)))
		{
			_call_func = null;
		}

		if(typeof _prepare !== 'boolean' && _prepare !== null)
		{
			_prepare = false;
		}

		//
		const env = process.env;
		var vector = getopt.check(_vector, _last, _parse, _list, _call_func);

		//
		if(getopt.PENDING_VECTOR !== null)
		{
			vector = getopt.PENDING_VECTOR = Object.assign(getopt.PENDING_VECTOR, vector);
		}

		if(_prepare)
		{
			return vector;
		}
		else if(getopt.pending && _prepare !== null)
		{
			getopt.append(vector, _argv, _parse_argv, _list_argv);
			return getopt(vector, _last, _parse, getopt.PENDING_PARSE_ARGV, _list, getopt.PENDING_LIST_ARGV, _call_func, getopt.PENDING_ARGV, null);
		}
		else
		{
			if(DEFAULT_HELP)
			{
				const vectorContainsHelp = (_vec) => {
					if(! DEFAULT_HELP)
					{
						return null;
					}
					else if('help' in _vec)
					{
						return true;
					}
					else for(const idx in _vec)
					{
						if(_vec[idx].long === 'help')
						{
							return true;
						}
						else if(_vec[idx].short === '?')
						{
							return true;
						}
						else if(_vec[idx].call === 'help' || (typeof _vec[idx].call === 'string' && _vec[idx].call.startsWith('help(')))
						{
							return true;
						}
					}

					return false;
				};

				if(! vectorContainsHelp(vector))
				{
					vector.help = getopt.check({ help: { short: '?', call: 'help' } }, _last, _parse, _call_func).help;
				}
			}

			vector = getopt.check.check(vector);
		}

		//
		const ret = (_res) => {
			//
			getopt.reset();

			//
			return process.args = getopt.clean(_res, vector, env);
		};

		return ret(getopt.parse(vector, _argv, env, _parse_argv, _list_argv));
	}

	//
	Object.defineProperty(getopt, 'MAX_LONG', { get: function()
	{
		return DEFAULT_MAX_LONG;
	}});

	Object.defineProperty(getopt, 'MAX_SHORT', { get: function()
	{
		return DEFAULT_MAX_SHORT;
	}});

	Object.defineProperty(getopt, 'MAX_ENV', { get: function()
	{
		return DEFAULT_MAX_ENV;
	}});

	//
	function RESULT()
	{
		const result = Object.create(null);

		for(const idx in this.INDEX)
		{
			if(RESERVED.indexOf(idx) === -1)
			{
				result[idx] = this[idx];
			}
		}

		if(this.ARGV.length > 0)
		{
			result.ARGV = [];

			for(var i = 0; i < this.ARGV.length; ++i)
			{
				result.ARGV[i] = this.ARGV[i];
			}
		}

		return result;
	}

	//
	getopt.PENDING_VECTOR = null;
	getopt.PENDING_ARGV = null;
	getopt.PENDING_PARSE_ARGV = null;
	getopt.PENDING_LIST_ARGV = null;

	Object.defineProperty(getopt, 'pending', { get: function()
	{
		if(getopt.PENDING_VECTOR === null)
		{
			getopt.PENDING_VECTOR = getopt.PENDING_ARGV = getopt.PENDING_PARSE_ARGV = null;
			return false;
		}

		return true;
	}});

	getopt.append = function(_vector, _argv, _parse_argv, _list_argv)
	{
		const result = getopt.pending;

		if(Object.isObject(_vector))
		{
			getopt.PENDING_VECTOR = Object.assign(getopt.PENDING_VECTOR, _vector);
		}

		if(Array.isArray(_argv, true))
		{
			getopt.PENDING_ARGV = _argv;
		}

		if(typeof _parse_argv === 'boolean')
		{
			getopt.PENDING_PARSE_ARGV = _parse_argv;
		}

		if(typeof _list_argv === 'boolean')
		{
			getopt.PENDING_LIST_ARGV = _list_argv;
		}

		return result;
	}

	getopt.prepare = function(_vector, _last, _parse, _parse_argv, _list, _list_argv, _call_func, _argv)
	{
		return getopt.append(getopt(_vector, _last, _parse, _parse_argv, _list, _list_argv, _call_func, _argv, true), _argv, _parse_argv, _list_argv);
	}

	getopt.reset = function()
	{
		const result = getopt.pending;

		getopt.PENDING_VECTOR = null;
		getopt.PENDING_ARGV = null;
		getopt.PENDING_PARSE_ARGV = null;
		getopt.PENDING_LIST_ARGV = null;

		return result;
	}

	//
	function checkIndices(_string, _type, _throw = true)
	{
		if(typeof _throw !== 'boolean' && _throw !== null)
		{
			_throw = true;
		}

		if(typeof _string !== 'string')
		{
			return null;
		}
		else if(_string.length === 0)
		{
			if(_type !== 'long')
			{
				return true;
			}
			else if(_throw === null)
			{
				return false;
			}
			else if(_throw)
			{
				return x('Invalid getopt vector .% key (may not be %)', null, _type, 'empty');
			}

			return false;
		}
		else switch(_type)
		{
			case 'long':
				if(_string.length > DEFAULT_MAX_LONG)
				{
					if(_throw === null)
					{
						return false;
					}
					else if(_throw)
					{
						return x('A getopt vector .% key may only be % characters/bytes long (yours is %)', null, _type, DEFAULT_MAX_LONG, _string.length);
					}

					return false;
				}
				break;
			case 'short':
				if(_string.length > DEFAULT_MAX_SHORT)
				{
					if(_throw === null)
					{
						return false;
					}
					else if(_throw)
					{
						return x('A getopt vector .% key may only be % characters/bytes long (yours is %)', null, _type, DEFAULT_MAX_LONG, _string.length);
					}

					return false;
				}
				break;
			case 'env':
				if(_string.length > DEFAULT_MAX_ENV)
				{
					if(_throw === null)
					{
						return false;
					}
					else if(_throw)
					{
						return x('A getopt vector .% key may only be % characters/bytes long (yours is %)', null, _type, DEFAULT_MAX_LONG, _string.length);
					}

					return false;
				}
				break;
		}

		if(_string[0] === '=')
		{
			if(_throw === null)
			{
				return false;
			}
			else if(_throw)
			{
				return x('Invalid getopt vector .% key \'%\' (may not start with % \'%\')', null, _type, _string, 'equal sign', '=');
			}

			return false;
		}
		else if(_string[0] === '-')
		{
			if(_throw === null)
			{
				return false;
			}
			else if(_throw)
			{
				return x('Invalid getopt vector .% key \'%\' (may not start with a % \'%\')', null, _type, _string, 'dash', '-');
			}

			return false;
		}

		const msg = (!_throw ? null : 'Invalid getopt vector .% key \'%\' (' + 'byte'.bold + ' % == \'%\' is not allowed - only ' + 'bytes'.bold + ' between % and %)');
		var byte;

		for(var i = 0; i < _string.length; ++i)
		{
			if(_string[i] === ' ')
			{
				if(_throw === null)
				{
					return false;
				}
				else if(_throw)
				{
					return x('Invalid getopt .% key \'%\' (% are not allowed here)', null, _type, _string, 'spaces');
				}

				return false;
			}
			else if((byte = _string.charCodeAt(i)) < 33 || byte > 126)
			{
				if(_throw === null)
				{
					return false;
				}
				else if(_throw)
				{
					return x(msg, null, _type, _string, byte, _string[i], 33, 126);
				}

				return false;
			}
		}

		return true;
	};

	getopt.check = function(_vector, _last, _parse, _list, _call_func)
	{
		//
		const keys = Object.keys(_vector).sort(true);
		const result = Object.create(null);
		var key;

		//
		for(var i = 0; i < keys.length; ++i)
		{
			//
			if(RESERVED.indexOf(keys[i]) > -1)
			{
				return x('The getopt vector key \'%\' is %', null, keys[i], 'RESERVED'.bold);
			}
			else if((key = keys[i]) in result)
			{
				return x('Getopt vector already contains key \'%\'', null, key);
			}
			else if(key.length === 0)
			{
				return x('Getopt vector may not contain % keys', null, 'empty');
			}
			else if(! Object.isObject(_vector[key]))
			{
				return x('Getopt vector has no real % under it\'s key \'%\' (value type is: %)', null, 'Object', key, typeOf(_vector[key]));
			}
			else
			{
				result[key] = Object.create(null);
			}

			//
			if(String.isString(_vector[key].long))
			{
				result[key].long = _vector[key].long;
			}
			else
			{
				result[key].long = key;
			}

			checkIndices(result[key].long, 'long', true);

			//
			if(_vector[key].short === null)
			{
				//prepared for auto-short.. if set to (null), will be used even though "DEFAULT_AUTO_SHORT" is NOT defined.. ;-)
				result[key].short = null;
			}
			else if(typeof _vector[key].short === 'string')
			{
				result[key].short = _vector[key].short;
			}
			else if(Number.isInt(_vector[key].short) && _vector[key].short >= 0)
			{
				result[key].short = _vector[key].short.toString();
			}
			else if(DEFAULT_AUTO_SHORT)
			{
				result[key].short = null;
			}
			else
			{
				result[key].short = '';
			}

			checkIndices(result[key].short, 'short', true);

			//
			if(String.isString(_vector[key].env))
			{
				if((result[key].env = _vector[key].env)[0] === '=')
				{
					return x('Invalid getopt vector .% key \'%\' (may not start with equal sign)', null, 'env', result[key].env);
				}
				else if(result[key].env[0] === '-')
				{
					return x('Invalid getopt vector .% key \'%\' (may not start with a dash)', null, 'env', result[key].env);
				}
			}
			else
			{
				result[key].env = '';
			}

			checkIndices(result[key].env, 'env', true);

			//
			if(Number.isInt(_vector[key].args))
			{
				result[key].args = Math.abs(_vector[key].args);

				if(_vector[key].args < 0)
				{
					if(! ('last' in _vector[key]))
					{
						result[key].last = true;
					}
				}
			}
			else if(_vector[key].args === true)
			{
				result[key].args = 1;
			}
			else
			{
				result[key].args = 0;
			}

			//
			if('default' in _vector[key])
			{
				result[key].undefined = _vector[key].default;
				result[key].null = _vector[key].default;
			}
			else
			{
				if('undefined' in _vector[key])
				{
					result[key].undefined = _vector[key].undefined;
				}

				if('null' in _vector[key])
				{
					result[key].null = _vector[key].null;
				}
			}

			if(Array.isArray(result[key].undefined, true))
			{
				result[key].undefined = result[key].undefined.subarr(0, result[key].args);
			}

			if(Array.isArray(result[key].null, true))
			{
				result[key].null = result[key].null.subarr(0, result[key].args)
			}

			if(Array.isArray(result[key].undefined, true) && result[key].undefined.length === 0)
			{
				delete result[key].undefined;
			}

			if(Array.isArray(result[key].null, true) && result[key].null.length === 0)
			{
				delete result[key].null;
			}

			//
			if(String.isString(_vector[key].help))
			{
				result[key].help = _vector[key].help;
			}
			else if(Array.isArray(_vector[key].help, false))
			{
				result[key].help = [ ... _vector[key].help ];
			}
			else
			{
				result[key].help = '';
			}

			//
			if(typeof _vector[key].call === 'function' || String.isString(_vector[key].call) || (Array.isArray(_vector[key].call, false) && (String.isString(_vector[key].call[0]) || Array.isArray(_vector[key].call[0], false) || typeof _vector[key].call[0] === 'function')))
			{
				result[key].call = _vector[key].call;
			}
			else if(_call_func !== null)
			{
				result[key].call = _call_func;
			}
			else
			{
				result[key].call = null;
			}

			//
			if(typeof result[key].last !== 'boolean')
			{
				if(typeof _vector[key].last === 'boolean')
				{
					result[key].last = _vector[key].last;
				}
				else if(Number.isInt(_vector[key].last))
				{
					result[key].last = _vector[key].last;
				}
				else
				{
					result[key].last = _last;
				}
			}

			//
			if(typeof _vector[key].parse === 'boolean')
			{
				result[key].parse = _vector[key].parse;
			}
			else
			{
				result[key].parse = _parse;
			}

			//
			if(typeof _vector[key].unescapeHex === 'boolean')
			{
				result[key].unescapeHex = _vector[key].unescapeHex;
			}
			else if(typeof _vector[key].unescape === 'boolean')
			{
				result[key].unescapeHex = _vector[key].unescape;
			}
			else
			{
				result[key].unescapeHex = result[key].parse;
			}

			if(typeof _vector[key].unescapeCTRL === 'boolean')
			{
				result[key].unescapeCTRL = _vector[key].unescapeCTRL;
			}
			else if(typeof _vector[key].unescape === 'boolean')
			{
				result[key].unescapeCTRL = _vector[key].unescape;
			}
			else
			{
				result[key].unescapeCTRL = result[key].parse;
			}

			if(typeof _vector[key].unescapeISO === 'boolean')
			{
				result[key].unescapeISO = _vector[key].unescapeISO;
			}
			else if(typeof _vector[key].unescape === 'boolean')
			{
				result[key].unescapeISO = _vector[key].unescape;
			}
			else
			{
				result[key].unescapeISO = result[key].parse;
			}

			if(typeof _vector[key].unescapeC === 'boolean')
			{
				result[key].unescapeC = _vector[key].unescapeC;
			}
			else if(typeof _vector[key].unescape === 'boolean')
			{
				result[key].unescapeC = _vector[key].unescape;
			}
			else
			{
				result[key].unescapeC = result[key].parse;
			}

			//
			if(! DEFAULT_ENABLE_LIST)
			{
				result[key].list = false;
			}
			else if(typeof _vector[key].list === 'boolean')
			{
				result[key].list = _vector[key].list;
			}
			else if(typeof _list === 'boolean')
			{
				result[key].list = _list;
			}
			else if(typeof result[key].parse === 'boolean')
			{
				result[key].list = result[key].parse;
			}
			else
			{
				result[key].list = DEFAULT_LIST;
			}

			//
			if(String.isString(_vector[key].group))
			{
				result[key].group = _vector[key].group;
			}
			else
			{
				result[key].group = '';
			}
		}

		//
		return result;
	}

	getopt.check.check = function(_result)
	{
		//
		_result = ((_res) => {
			const list = [];
			const k = Object.keys(_res);

			for(var i = 0; i < k.length; ++i)
			{
				list[i] = [ k[i], _res[k[i]].long ];
			}

			list.sort(1, true);
			const res = Object.create(null);

			for(var i = 0; i < list.length; ++i)
			{
				res[list[i][0]] = _res[list[i][0]];
			}

			return res;
		})(_result);

		//
		(() => {
			const list = [];
			const shorts = [];

			for(const idx in _result)
			{
				if(_result[idx].short === null)
				{
					list.push(idx);
				}
				else if(_result[idx].short)
				{
					shorts.push(_result[idx].short);
				}
			}

			var key, long, short, original;

			for(var i = 0; i < list.length; ++i)
			{
				//
				long = (original = _result[key = list[i]].long).unique();

				//
				for(var j = 0; j < long.length; ++j)
				{
					if(! checkIndices(short = long[j], 'short', null))
					{
						short = '';
					}
					else if(shorts.indexOf(short) === -1)
					{
						break;
					}
					else
					{
						short = '';
					}
				}

				//
				if(short.length === 0 && DEFAULT_AUTO_SHORT_TWO)
				{
					var stop = false;

					for(var j = 0; j < original.length; ++j)
					{
						for(var k = j + 1; k < original.length; ++k)
						{
							if(! checkIndices(short = original[j] + original[k], 'short', null))
							{
								short = '';
							}
							else if(shorts.indexOf(short) === -1)
							{
								stop = true;
								break;
							}
							else
							{
								short = '';
							}
						}

						if(stop)
						{
							break;
						}
					}

					if(short.length === 0) for(var j = 0; j < original.length; ++j)
					{
						if(! checkIndices(short = original[j] + original[j], 'short', null))
						{
							short = '';
						}
						else if(shorts.indexOf(short) === -1)
						{
							break;
						}
						else
						{
							short = '';
						}
					}

					if(short.length === 0)
					{
						stop = false;

						for(var j = 1; j < original.length; ++j)
						{
							for(var k = j - 1; k >= 0; --k)
							{
								if(! checkIndices(short = original[j] + original[k], 'short', null))
								{
									short = '';
								}
								else if(shorts.indexOf(short) === -1)
								{
									stop = true;
									break;
								}
								else
								{
									short = '';
								}
							}

							if(stop)
							{
								break;
							}
						}
					}
				}

				//
				if(checkIndices(_result[key].short = short, 'short', false))
				{
					if(short.length > 0)
					{
						shorts.push(short);
					}
				}
				else
				{
					_result[key].short = short = '';
				}
			}
		})();

		//
		for(const idx1 in _result)
		{
			for(const idx2 in _result)
			{
				//
				if(idx1 === idx2)
				{
					continue;
				}

				//
				if(_result[idx1].long === _result[idx2].long)
				{
					return x('Getopt .% vector key \'%\' is defined multiple times', null, 'long', _result[idx1].long);
				}

				if(_result[idx1].short)
				{
					if(_result[idx1].short === _result[idx2].short)
					{
						return x('Getopt .% vector key \'%\' is defined multiple times', null, 'short', _result[idx1].short);
					}
				}

				if(_result[idx1].env)
				{
					if(_result[idx1].env === _result[idx2].env)
					{
						return x('Getopt .% vector key \'%\' is defined multiple times', null, 'env', _result[idx1].env);
					}
				}
			}
		}

		//
		return _result;
	}

	//
	const UNESCAPES = [ 'unescapeHex', 'unescapeCTRL', 'unescapeISO', 'unescapeC' ];

	const atLeastOneUnescape = (_unescape) => {
		if(_unescape === true)
		{
			return true;
		}
		else if(! Object.isObject(_unescape))
		{
			return null;
		}
		else for(const u of UNESCAPES)
		{
			if(_unescape[u] === true)
			{
				return true;
			}
		}

		return false;
	};

	const extractUnescapes = (_item) => {
		const result = {};

		for(const u of UNESCAPES)
		{
			result[u] = _item[u];
		}

		return result;
	};

	const unescape = (_value, _unescape) => {
		if(_unescape === true)
		{
			_unescape = {};

			for(const u of UNESCAPES)
			{
				_unescape[u] = true;
			}
		}
		else if(! Object.isObject(_unescape))
		{
			return _value;
		}
		else if(! String.isString(_value))
		{
			return _value;
		}

		for(const u of UNESCAPES)
		{
			if(_unescape[u] === true)
			{
				_value = _value[u]();
			}
		}

		return _value;
	};

	//
	getopt.parse = function(_vector, _argv, _env, _parse_argv = _parse, _list_argv = DEFAULT_LIST)
	{
		//
		if(typeof _list_argv !== 'boolean')
		{
			_list_argv = DEFAULT_LIST;
		}

		//TODO/is that necessary? changed my arguments...
		const _parse = _parse_argv;
		const _list = _list_argv;

		//
		const result = Object.null({
			'VECTOR': _vector,
			'ITEM': Object.keys(_vector),
			'KEY': Object.create(null),
			'INDEX': Object.create(null),
			'GROUP': Object.create(null),
			'ARGV': [],
			'COUNT': null,
			'CALL': 0
		});

		//
		Object.defineProperty(result, 'RESULT', { get: RESULT });

		Object.defineProperty(result, 'RESERVED', { get: function()
		{
			return [ ... RESERVED ];
		}})

		//
		const append = (_value, _parse = _parse_argv) => {
			if(_parse_argv && String.isString(_value))
			{
				_value = String.parse(_value, { unescape: true });
			}

			if(_list && String.isString(_value))
			{
				_value = getopt.parseList(_value, _parse, _parse);
			}

			return result.ARGV.push(_value);
		};

		const listShorts = (_only_with_args = false) => {
			//
			const SORT = 'short.length';
			const ASC = false;

			//
			if(typeof _only_with_args !== 'boolean')
			{
				_only_with_args = false;
			}

			const result = [];

			for(const idx in _vector)
			{
				if(_only_with_args && _vector[idx].args === 0)
				{
					continue;
				}
				else if(_vector[idx].short)
				{
					result.push({
						index: idx,
						short: _vector[idx].short,
						args: _vector[idx].args
					});
				}
			}

			return result.sort(SORT, ASC);
		};

		const findIndexByShort = (_short) => {
			for(const idx in _vector)
			{
				if(_vector[idx].short)
				{
					if(_vector[idx].short === _short)
					{
						return idx;
					}
				}
			}

			return null;
		};

		const findIndexByEnv = (_env) => {
			for(const idx in _vector)
			{
				if(_vector[idx].env)
				{
					if(_vector[idx].env === _env)
					{
						return idx;
					}
				}
			}

			return null;
		};

		const findIndex = (_key, _dashCount, _expand = true) => {
			if(! DEFAULT_ENABLE_EXPAND)
			{
				_expand = false;
			}

			var res = null;

			switch(_dashCount)
			{
				case 0:
					for(const idx in _vector)
					{
						if(_vector[idx].env === _key)
						{
							res = idx;
						}
					}
					break;
				case 1:
					for(const idx in _vector)
					{
						if(_vector[idx].short === _key)
						{
							res = idx;
						}
					}

					//
					if(res === null && _expand)
					{
						//
						const shorts = listShorts();
						const list = [];
						var found = 0;

						for(var i = 0, j = 0; i < _key.length; ++i)
						{
							for(var k = 0; k < shorts.length; ++k)
							{
								if(_key.at(i, shorts[k].short))
								{
									list[j++] = shorts[k].index;
									i += (shorts[k].short.length - 1);
									found += shorts[k].short.length;
								}
							}
						}

						if(found === _key.length && list.length > 0)
						{
							res = list;
						}
					}
					break;
				case 2:
					for(const idx in _vector)
					{
						if(_vector[idx].long === _key)
						{
							res = idx;
						}
					}
					break;
			}

			return res;
		};

		const set = (_value, _index, _key, _parse, _list) => {
			//
			if(typeof _parse !== 'boolean')
			{
				_parse = _vector[_index].parse
			}

			if(typeof _list !== 'boolean')
			{
				_list = _vector[_index].list;
			}

			//
			const unescapes = extractUnescapes(_vector[_index]);

			//
			var res;

			if(_index in result)
			{
				if(Array.isArray(result[_index], true))
				{
					res = result[_index];
				}
				else
				{
					res = [ result[_index] ];
				}
			}
			else
			{
				res = [];
			}

			//
			const oldLength = res.length;

			//
			if(typeof _value === 'string')
			{
				if(_parse)
				{
					_value = String.parse(_value, unescapes);
				}
				else if(atLeastOneUnescape(unescapes))
				{
					_value = unescape(_value, unescapes);
				}

				if(_list && String.isString(_value))
				{
					_value = getopt.parseList(_value, _parse, unescapes);
				}
			}

			//
			res.push(_value);

			//
			const newLength = res.length;

			//
			addIndices(_index, _key);

			//
			result[_index] = res;

			//
			return { oldLength, newLength, diffLength: (newLength - oldLength) };
		};

		const addIndices = (_index, _key) => {
			if(_index)
			{
				if(typeof result.INDEX[_index] === 'number')
				{
					++result.INDEX[_index];
				}
				else
				{
					result.INDEX[_index] = 1;
				}
			}

			if(_key)
			{
				if(typeof result.KEY[_key] === 'number')
				{
					++result.KEY[_key];
				}
				else
				{
					result.KEY[_key] = 1;
				}
			}
		};

		const tryToSplitByEqualSign = (_arg) => {
			if(_arg.length === 0)
			{
				return [ '', undefined ];
			}
			else if(_arg[0] === '=')
			{
				return [ undefined, _arg ];
			}

			const result = [ '' ];

			for(var i = 0; i < _arg.length; ++i)
			{
				if(_arg[i] === '\\')
				{
					if(i < (_arg.length - 1) && _arg[i + 1] === '=')
					{
						result[0] += '=';
						++i;
					}
					else
					{
						result[0] += '\\';
					}
				}
				else if(_arg[i] === '=')
				{
					result[1] = _arg.substr(i + 1);
					break;
				}
				else
				{
					result[0] += _arg[i];
				}
			}

			return result;
		};

		//
		const checkArg = (_arg, _i) => {
			var dashCount = 0;

			while(_arg[dashCount] === '-' && dashCount < 2)
			{
				++dashCount;
			}

			var arg = _arg.substr(dashCount);
			var key, value;

			if(DEFAULT_ENABLE_EQUAL_SIGN)
			{
				[ key, value ] = tryToSplitByEqualSign(arg);
			}
			else
			{
				key = arg;
				value = undefined;
			}

			var index = findIndex(key, dashCount, typeof value !== 'string');
			var args, vector;
			var assign = null;

			if(String.isString(index))
			{
				args = (vector = _vector[index]).args;

				if(DEFAULT_ASSIGN_ONLY_WITH_ARGS && args === 0 && typeof value === 'string')
				{
					index = null;
					args = null;
					vector = null;
					index = null;
					value = undefined;
				}
			}
			else if(index === null)
			{
				if(typeof value === 'string')
				{
					key += '=' + value;
					value = undefined;
				}

				arg = _argv[i];
				args = 0;
				vector = null;

				if(dashCount === 0)
				{
					key = null;
				}
				else if(dashCount === 1 && typeof value !== 'string')
				{
					if(DEFAULT_ENABLE_ASSIGN)
					{
						assign = checkAssignArgument(key, dashCount);

						if(assign)
						{
							key = assign[0];
							value = assign[1];
							assign = true;

							if(index = findIndexByShort(key))
							{
								args = (vector = _vector[index]).args;
							}
							else
							{
								return x('Unexpected!');
							}
						}
						else
						{
							assign = false;
						}
					}
				}
			}
			else if(! Array.isArray(index, false))
			{
				return x('Unexpected');
			}
			else
			{
				//
			}

			return { dashCount, assign, arg, key, value, index, vector, original: _argv[i], args, i: _i, next: nextArg() };
		};

		const checkAssignArgument = (_key, _dashCount) => {
			if(! DEFAULT_ENABLE_ASSIGN)
			{
				return null;
			}

			const list = [];
			var item;

			for(const idx in _vector)
			{
				if(DEFAULT_ASSIGN_ONLY_WITH_ARGS && _vector[idx].args === 0)
				{
					continue;
				}
				else if(_vector[idx].short)
				{
					if(item = String.sameStart(_vector[idx].short, _key))
					{
						list.push(item);
					}
				}
			}

			if(list.length === 0)
			{
				return null;
			}
			else
			{
				list.lengthSort(false);
			}

			return [ _key.substr(0, list[0].length), _key.substr(list[0].length) ];
		};

		const handleCheckedArg = (_checked) => {
			if(_checked.assign)
			{
				set(_checked.value, _checked.index, _checked.key, _checked.vector.parse, _checked.vector.list);
			}
			else if(_checked.index && _checked.key)
			{
				//
				var todoAt;

				while((todoAt = todo()) > -1)
				{
					const next = args[todoAt];
					const vec = _vector[next[0]];
					var v, p;

					if(vec.env && (vec.env in _env))
					{
						v = getopt.getEnv(vec.env, p = vec.parse, vec.list, extractUnescapes(vec));
					}
					else if('null' in vec)
					{
						v = vec.null;
						p = false;
					}
					else
					{
						v = true;
						p = false;
					}

					fill(todoAt, v, DEFAULT_FILL, _checked.key, p, vec.list);
				}

				//
				resetArgs();

				//
				if(typeof _checked.index === 'string')
				{
					var v, p;

					if(_checked.dashCount === 0 && _checked.vector.env && typeof _checked.value === 'string')
					{
						getopt.setEnv(_checked.vector.env, _checked.value);
						set(_checked.value, _checked.index, _checked.key, _checked.vector.parse, _checked.vector.list);
					}
					else if(typeof _checked.value === 'string')
					{
						set(_checked.value, _checked.index, _checked.key, _checked.vector.parse, _checked.vector.list);
					}
					else if(_checked.args === 0)
					{
						if(_checked.vector.env && (_checked.vector.env in _env))
						{
							v = getopt.getEnv(_checked.vector.env, p = _checked.vector.parse, _checked.vector.list, extractUnescapes(_checked.vector));
						}
						else if('null' in _checked.vector)
						{
							v = _checked.vector.null;
							p = false;
						}
						else
						{
							v = true;
							p = false;
						}

						set(v, _checked.index, _checked.key, p, _checked.vector.list);
					}
					else
					{
						pushArg(_checked.index, _checked.key, _checked.args);
					}
				}
				else if(Array.isArray(_checked.index))
				{
					var index, vector;

					for(var i = 0; i < _checked.index.length; ++i)
					{
						vector = _vector[index = _checked.index[i]];

						if(vector.args === 0)
						{
							var v, p;

							if(vector.env && (vector.env in _env))
							{
								v = getopt.getEnv(vector.env, p = vector.parse, vector.list, extractUnescapes(vector));
							}
							else if('null' in vector)
							{
								v = vector.null;
								p = false;
							}
							else
							{
								v = true;
								p = false;
							}

							set(v, index, _checked.key[i], p, vector.list);
						}
						else
						{
							pushArg(index, _checked.key[i]);
						}
					}
				}
				else
				{
					_checked.index = null;
					return false;
				}
			}
			else if(String.isString(_checked.key))
			{
				//
				if(typeof _checked.value === 'string')
				{
					append(_checked.original);
				}
				else if(hasArgs())
				{
					appendArg(_checked.arg, _checked.key, (_checked.vector ? _checked.vector.parse : null), (_checked.vector ? _checked.vector.list : null));
				}
				else
				{
					append(_checked.original);
				}
			}
			else if(hasArgs())
			{
				appendArg(_checked.arg, _checked.key, _vector[nextArg()[0]].parse, _vector[nextArg()[0]].list);
			}
			else
			{
				append(_checked.original);
			}

			return true;
		};

		//
		const pushArg = (_index, _key, _args = null) => {
			if(! (_index in _vector))
			{
				return undefined;
			}
			else if(! (Number.isInt(_args) && _args >= 0))
			{
				_args = _vector[_index].args;
			}

			if(_args === 0)
			{
				return null;
			}
			else if(! String.isString(_key))
			{
				_key = null;
			}

			return args.push([ _index, _args, 0, _key ]);
		};

		const resetArgs = () => {
			if(args.length === 0)
			{
				return false;
			}

			args.length = 0;
			return true;
		};

		const shiftArg = () => {
			if(args.length === 0)
			{
				return null;
			}

			const first = args.shift();

			if(first === null)
			{
				return null;
			}
			else if(first[1] === 0)
			{
				return shiftArg();
			}

			return first;
		};

		const nextArg = () => {
			if(args.length === 0)
			{
				return null;
			}

			const next = args.first();

			if(next === null)
			{
				return null;
			}
			else if(next[1] === 0)
			{
				shiftArg();
				return nextArg();
			}

			return next;
		};

		const validArg = (_index, _all = true) => {
			if(Number.isInt(_index))
			{
				return (_index >= 0 && (_index < args.length));
			}
			else if(! String.isString(_index))
			{
				return undefined;
			}
			else if(args.length === 0)
			{
				return null;
			}
			else if(! _all)
			{
				return true;
			}
			else for(var i = 0; i < args.length; ++i)
			{
				if(args[i][0] === _index)
				{
					return true;
				}
			}

			return false;
		};

		const hasArgs = (_index = null) => {
			const next = nextArg();

			if(next === null)
			{
				return false;
			}
			else if(next[1] === 0)
			{
				shiftArg();
				return hasArgs(_index);
			}
			else if(String.isString(_index))
			{
				return validArg(_index, true);
			}

			return true;
		};

		const countArg = (_lengths, _index) => {
			if(args.length === 0)
			{
				return null;
			}

			return countArgAt(0, _lengths, _index);
		};

		const countArgAt = (_at, _lengths, _index) => {
			if(args.length === 0)
			{
				return null;
			}
			else if(Number.isInt(_at))
			{
				_at = args.getIndex(_at);
			}
			else if(String.isString(_at))
			{
				for(var i = _args.length - 1; i >= 0; --i)
				{
					if(_args[i][0] === _at)
					{
						_at = i;
						break;
					}
				}

				if(typeof _at !== 'number')
				{
					return null;
				}
			}

			for(var i = _at; i < args.length; ++i)
			{
				if(args[_at][1] === 0)
				{
					args.splice(i--, 1);
				}
			}

			if(args.length === 0)
			{
				return null;
			}

			var elem = null;

			for(var i = _at; i < args.length; ++i)
			{
				if(args[i][1] > 0)
				{
					elem = args[i];
					break;
				}
			}

			if(elem === null)
			{
				return null;
			}
			else
			{
				--elem[1];
				++elem[2];
			}

			//
			if(elem[1] <= 0)
			{
				args.splice(_at, 1);
				return 0;
			}

			//
			return elem[1];
		};

		const appendArg = (_value, _key, _parse, _list) => {
			return appendArgAt(0, _value, _key, _parse, _list);
		};

		const appendArgAt = (_index, _value, _key, _parse, _list) => {
			if(args.length === 0)
			{
				append(_value, _parse);
			}
			if(args.length === 0)
			{
				return null;
			}
			else if(Number.isInt(_index))
			{
				_index = args.getIndex(_index);
			}
			else if(String.isString(_index))
			{
				for(var i = args.length - 1; i >= 0; --i)
				{
					if(args[i][0] === _index)
					{
						_index = i;
						break;
					}
				}

				if(typeof _index !== 'number')
				{
					return null;
				}
			}

			const elem = args[_index];
			const idx = elem[0];

			if(typeof _parse !== 'boolean')
			{
				_parse = _vector[idx].parse;
			}

			if(typeof _list !== 'boolean')
			{
				_list = _vector[idx].list;
			}

			return countArgAt(_index, set(_value, idx, _key, _parse, _list), idx);
		};

		const todo = () => {
			if(args.length === 0)
			{
				return -1;
			}

			for(var i = args.length - 1; i >= 0; --i)
			{
				if(args[i][1] === 0)
				{
					args.splice(i, 1);
				}
			}

			for(var i = 0; i < args.length; ++i)
			{
				if(args[i][1] > 0)
				{
					return i;
				}
			}

			return -1;
		};

		const fill = (_offset, _value, _value_rest = DEFAULT_FILL, _key = null, _parse, _list) => {
			const arg = args[_offset];

			if(! arg)
			{
				return x('Unexpected');
			}
			else if(arg[1] === 0)
			{
				args.splice(_offset, 1);
				return false;
			}

			if(! Array.isArray(_value, true))
			{
				_value = [ _value ];
			}
			else
			{
				_value = [ ... _value ];
			}

			var [ rest, done ] = [ arg[1], arg[2] ];

			for(var i = 0; i < done; ++i)
			{
				_value.shift();
			}

			if(done === 0)
			{
				appendArgAt(_offset, (_value.length === 0 ? _value_rest : _value.shift()), _key, _parse, _list);
				--rest;
				++done;
			}

			while(_value.length > 0)
			{
				appendArgAt(_offset, _value.shift(), _key, _parse, _list);

				++done;

				if(--rest <= 0)
				{
					break;
				}
			}

			while(rest-- > 0)
			{
				appendArgAt(_offset, _value_rest, _key, _parse, _list);
			}

			return true;
		};

		//
		var pause = false;
		const args = [];
		var checked;
		var last;

		for(var i = 0; i < _argv.length; ++i)
		{
			if(_argv[i] === '--')
			{
				pause = true;
				append('--');
			}
			else if(_argv[i] === '-')
			{
				pause = false;
				append('-');
			}
			else if(pause)
			{
				append(_argv[i]);
			}
			else if(! handleCheckedArg(last = checkArg(_argv[i], i)))
			{
				if(hasArgs())
				{
					appendArg(_argv[i]);
				}
				else
				{
					append(_argv[i]);
				}
			}
		}

		//
		var todoAt;

		while((todoAt = todo()) > -1)
		{
			var v, p;
			const next = args[todoAt];
			const vec = _vector[next[0]];

			if(vec.env && (vec.env in _env))
			{
				v = getopt.getEnv(vec.env, p = vec.parse, vec.list, extractUnescapes(vec));
			}
			else if('null' in vec)
			{
				v = vec.null;
				p = false;
			}
			else
			{
				v = true;
				p = false;
			}
//zzzzzzzzaaaaaaaaaabbbbbbbcccccc
			fill(todoAt, v, DEFAULT_FILL, null, p, vec.list);
		}

		//
		resetArgs();

		//
		return result;
	}

	//
	getopt.clean = function(_result, _vector, _env)
	{
		//
		const index = Object.keys(_result.INDEX);
		const key = Object.keys(_result.KEY);

		//
		const checkSum = (_res) => {
			var sum = 0;

			for(var i = 0; i < _res.length; ++i)
			{
				if(_res[i] === true)
				{
					++sum;
				}
				else if(_res[i] === false)
				{
					--sum;
				}
				else
				{
					sum = null;
					break;
				}
			}

			if(sum !== null)
			{
				if(sum < 0)
				{
					sum = 0;
				}

				_res = sum;
			}

			return _res;
		}

		const checkArray = (_res, _vec) => {
			if(! Array.isArray(_res, true))
			{
				return _res;
			}
			else if(_res.length === 0)
			{
				_res = 0;
			}
			else if(_res.length === 1)
			{
				_res = _res[0];
			}
			else if((_vec.last === true || Number.isInt(_vec.last)) && _vec.args > 0)
			{
				const args = _vec.args;
				const last = (_vec.last === true ? -1 : _vec.last);
				const index = (getIndex(last, (_res.length / args)) * args);

				const res = [];

				for(var i = index, j = 0; i < _res.length && j < args; ++i, ++j)
				{
					res[j] = _res[i];
				}

				if(res.length === 0)
				{
					res = res[0];
				}
				else
				{
					_res = res;
				}
			}

			return _res;
		};

		//
		for(const idx in _vector)
		{
			if(idx in _result)
			{
				if(! Array.isArray(_result[idx], true))
				{
					_result[idx] = [ _result[idx] ];
				}

				_result[idx] = checkArray(_result[idx], _vector[idx]);

				if(Array.isArray(_result[idx], 2))
				{
					_result[idx] = checkSum(_result[idx]);
				}
			}
			else
			{
				var v;
				var has;

				if(_vector[idx].env && (_vector[idx].env in _env))
				{
					v = getopt.getEnv(_vector[idx].env, _vector[idx].parse, _vector[idx].list, extractUnescapes(_vector[idx]));
					
					if(String.isString(v))
					{
						const unescapes = extractUnescapes(_vector[idx]);

						if(_vector[idx].parse)
						{
							v = String.parse(v, unescapes);
						}
						else if(atLeastOneUnescape(unescapes))
						{
							v = unescape(v, unescapes);
						}
					}

					has = true;
				}
				else if('undefined' in _vector[idx])
				{
					v = _vector[idx].undefined;
					has = true;
				}
				else
				{
					v = 0;
					has = false;
				}

				if(_vector[idx].args > 1)
				{
					if(! Array.isArray(v, true))
					{
						v = [ v ];
					}
					else
					{
						v = [ ... v ];
					}

					while(v.length < _vector[idx].args)
					{
						v.push(DEFAULT_FILL);
					}
				}

				v = checkArray(v, _vector[idx]);

				if(Array.isArray(v, 2))
				{
					v = checkSum(v);
				}

				_result[idx] = v;

				if(has && !index.includes(idx))
				{
					index.push(idx);
					_result.INDEX[idx] = v;
				}
			}
		}

		//
		for(const idx in _result)
		{
			if(typeof _result[idx] === 'boolean')
			{
				_result[idx] = (_result[idx] ? 1 : 0);
			}
		}

		//
		for(var i = 0; i < index.length; ++i)
		{
			if(_vector[index[i]].group)
			{
				if(index[i] in _result)
				{
					if(! (_vector[index[i]].group in _result.GROUP))
					{
						_result.GROUP[_vector[index[i]].group] = Object.create(null);
					}

					_result.GROUP[_vector[index[i]].group][index[i]] = _result[index[i]];
				}
			}
		}

		//
		for(const idx in _vector)
		{
			if(_vector[idx].env)
			{
				getopt.setEnv(_vector[idx].env, _result[idx]);
			}
		}

		//
		_result.COUNT = index.length;

		//
		if(DEFAULT_ENABLE_CALL && index.length > 0)
		{
			_result.CALL = tryCall(index, _vector, _result);
		}

		//
		for(var i = 0; i < index.length; ++i)
		{
			if(_vector[index[i]].group)
			{
				if(index[i] in _result)
				{
					if(! (_vector[index[i]].group in _result.GROUP))
					{
						_result.GROUP[_vector[index[i]].group] = Object.create(null);
					}

					_result.GROUP[_vector[index[i]].group][index[i]] = _result[index[i]];
				}
			}
		}

		//
		return _result;
	}

	//
	getopt.parseList = function(_value, _parse = true, _unescapes = _parse)
	{
		if(! DEFAULT_ENABLE_LIST)
		{
			return _value;
		}
		else if(typeof _value !== 'string' || _value.length === 0)
		{
			return _value;
		}

		var result;

		const list = [];
		var sub = '';

		for(var i = 0, j = 0; i < _value.length; ++i)
		{
			if(_value[i] === '\\')
			{
				if(i < (_value.length - 1) && _value[i + 1] === ',')
				{
					sub += ',';
					++i;
				}
				else
				{
					sub += '\\';
				}
			}
			else if(_value[i] === ',')
			{
				list[j++] = sub;
				sub = '';
			}
			else
			{
				sub += _value[i];
			}
		}

		if(sub.length > 0)
		{
			list.push(sub);
		}

		if(list.length > 1)
		{
			const unescapes = extractUnescapes(_unescapes);

			if(_parse) for(var i = 0; i < list.length; ++i)
			{
				list[i] = String.parse(list[i], unescapes);
			}
			else if(atLeastOneUnescape(unescapes)) for(var i = 0; i < list.length; ++i)
			{
				list[i] = unescape(list[i], unescapes);
			}

			result = list;
		}
		else
		{
			result = _value;
		}

		return result;
	}

	getopt.getEnv = function(_key, _parse = true, _list = _parse, _unescapes = true)
	{
		var result = process.getEnv(_key, _parse, false);
		const unescapes = extractUnescapes(_unescapes);

		if(String.isString(result) && atLeastOneUnescape(unescapes))
		{
			result = unescape(result, unescapes);
		}

		if(_list && typeof result === 'string')
		{
			result = getopt.parseList(result, _parse, unescapes);
		}

		return result;
	}

	//
	//TODO/escape{Hex,CTRL,ISO,C}();..!?!?!
	//
	getopt.setEnv = function(_key, _value, _list = false)
	{
		if(_list && Array.isArray(_value, true))
		{
			if(_value.length === 0)
			{
				_value = '';
			}
			else if(_value.length === 1)
			{
				_value = String.render(_value[0]);
			}
			else
			{
				var res = '';

				for(var i = 0; i < _value.length; ++i)
				{
					res += String.render(_value[i]) + ',';
				}

				_value = res.removeLast();
			}
		}

		try
		{
			process.setEnv(_key, _value, true, false, true);
		}
		catch(_error)
		{
			if(typeof _value !== 'string')
			{
				_value = String.render(_value);
			}

			process.env[_key] = _value;
		}

		return process.env[_key];
	};

	//
	function tryCall(_index, _vector, _result, _throw = false)
	{
		var result = 0;
		var r;

		for(var i = 0; i < _index.length; ++i)
		{
			if(_vector[_index[i]].call !== null)
			{
				r = getopt.call(_vector[_index[i]].call, _index[i], _result[_index[i]], _vector[_index[i]], _result, _vector, _throw)

				if(typeof r !== 'undefined')
				{
					_result[_index[i]] = r;
					++result;
				}
			}
		}

		return result;
	}

	getopt.call = function(_call, _index, _value, _vector_item, _result, _vector, _throw = false)
	{
		//
		const getCallEventArg = (_c) => {
			const result = {
				call: _c,
				string: String.render(_c),
				index: _index,
				value: _value,
				hasValue: (!!_value),
				itemVector: _vector_item,
				vector: _vector,
				original: _result,
				result: _result.RESULT,
				reserved: []
			};

			for(var i = 0; i < RESERVED.length; ++i)
			{
				result[RESERVED[i]] = _result[RESERVED[i]];
				result.reserved = RESERVED[i];
			}

			return result;
		};

		//
		if(typeof Utility === 'undefined')
		{
			require('ext/utility');
		}

		return Utility.tryCall(_call, [ getCallEventArg() ], [ getopt.call, global ], _vector_item.parse, false, true, false);
	}

	/*getopt.call.test = function(_event, ... _args)
	{
		return _args;
	}*/

	getopt.call.exit = function(_event, _string_code, _code_maybe)
	{
		var string, code;

		if(String.isString(_string_code))
		{
			string = _string_code;
		}
		else if(String.isString(DEFAULT_CALL_EXIT_STRING))
		{
			string = DEFAULT_CALL_EXIT_STRING;
		}
		else
		{
			string = null;
		}

		if(Number.isInt(_string_code))
		{
			code = (_string_code % 256);
		}
		else if(Number.isInt(_code_maybe))
		{
			code = (_code_maybe % 256);
		}
		else
		{
			code = Math.random.int(255);
		}

		if(string)
		{
			var str = '';

			for(var i = 0; i < string.length; ++i)
			{
				if(string[i] === '\\')
				{
					if(i < (string.length - 1) && string[i + 1] === '%')
					{
						str += '%';
						++i;
					}
					else
					{
						str += '\\';
					}
				}
				else if(string[i] === '%')
				{
					str += code.toString().colorizeAs('Number');
				}
				else
				{
					str += string[i];
				}
			}

			console.log(str);
		}

		return process.exit(code);
	}

	getopt.call.help = function(_event, _exit_code = 0, _throw = true)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = true;
		}

		//
		const maxLength = { long: 0, short: 0, env: 0 };

		for(const idx in _event.vector)
		{
			maxLength.long = Math._max(maxLength.long, _event.vector[idx].long.length);
			maxLength.short = Math._max(maxLength.short, _event.vector[idx].short.length);
			maxLength.env = Math._max(maxLength.env, _event.vector[idx].env.length + 1);
		}

		maxLength.long += 2;
		maxLength.short += 1;

		//
		const HELP_PREFIX = space(2) + '~ ';

		//
		var result = EOL;
		var nullString, undefinedString;
		var defaultsString;

		//
		const index = Object.keys(_event.vector);
		var help, nul, undef, def, s, idx;
		const sub = new Array(index.length);
		var left, right;
		const consoleWidth = console.width;
		var leftWidth = Math.floor(consoleWidth / 0.6);

		for(var i = 0; i < index.length; ++i)
		{
			//
			idx = index[i];

			//
			if(_event.vector[idx].args === 0)
			{
				s = '(' + '0'.colorizeAs('Number') + ')';
			}
			else
			{
				s = '(' + _event.vector[idx].args.toString().warn + ')';
			}

			s += '\t' + ('--' + _event.vector[idx].long).pad(maxLength.long).high;

			//
			if(_event.vector[idx].short)
			{
				s += '  /  ' + ('-' + _event.vector[idx].short).pad(-maxLength.short).high;
			}
			else
			{
				s += '  /  ' + ('-').pad(-maxLength.short);
			}

			//
			if(_event.vector[idx].env)
			{
				s += '  /  $' + (_event.vector[idx].env).pad(-maxLength.env).high;
			}
			else
			{
				s += '  /  ' + ('-').pad(-maxLength.env);
			}

			//
			sub[i] = s;
		}

		for(var i = 0; i < index.length; ++i)
		{
			//
			leftWidth = Math._min(leftWidth, sub[i].textLength + 8);

			//
			idx = index[i];

			//
			result += sub[i] + EOL;

			//
			if(_event.vector[idx].group)
			{
				right = _event.vector[idx].group.colorizeAs('String').quote().toText({ prefix: '    (' + 'Group'.bold + ') ', all: false });
			}
			else
			{
				right = '';
			}

			if(('null' in _event.vector[idx]) || ('undefined' in _event.vector[idx]))
			{
				//
				var nulIsArray = false;
				var undefIsArray = false;

				//
				if('null' in _event.vector[idx])
				{
					nul = _event.vector[idx].null;

					if(Array.isArray(nul, true))
					{
						nul = nul.toString(DEFAULT_CALL_HELP_ARRAY_DEPTH, true, DEFAULT_CALL_HELP_ARRAY_INDEX, true);
						nulIsArray = true;
					}
					else
					{
						nul = String.render(nul, { quote: true, colors: true, escape: DEFAULT_ESCAPE });
					}
				}
				else
				{
					nul = '';
				}

				if('undefined' in _event.vector[idx])
				{
					undef = _event.vector[idx].undefined;

					if(Array.isArray(undef, true))
					{
						undef = undef.toString(DEFAULT_CALL_HELP_ARRAY_DEPTH, true, DEFAULT_CALL_HELP_ARRAY_INDEX, true);
						undefIsArray = true;
					}
					else
					{
						undef = String.render(undef, { quote: true, colors: true, escape: DEFAULT_ESCAPE });
					}
				}
				else
				{
					undef = '';
				}

				//
				if(nul.length > 0 || undef.length > 0)
				{
					if(right.length > 0)
					{
						right += EOL;
					}

					if(nul === undef)
					{
						right += nul.toText({ prefix: '  (' + 'default' + ') ', all: false, morePrefix: ((nulIsArray || undefIsArray) ? 2 : 0) });
					}
					else
					{
						def = '';

						if(undef.length > 0)
						{
							right += undef.toText({ prefix: '(' + 'undefined' + ') ', all: false, morePrefix: (undefIsArray ? 2 : 0) });

							if(nul.length > 0)
							{
								right += EOL;
							}
						}

						if(nul.length > 0)
						{
							right += nul.toText({ prefix: '     (' + 'null' + ') ', all: false, morePrefix: (nulIsArray ? 2 : 0) });
						}
					}
				}
			}

			//
			if(String.isString(_event.vector[idx].help))
			{
				left = _event.vector[idx].help + EOL;
			}
			else if(Array.isArray(_event.vector[idx].help, false))
			{
				left = String.printf(... _event.vector[idx].help) + EOL;
			}
			else
			{
				left = '';
			}

			if(left.length > 0)
			{
				if(DEFAULT_CALL_HELP_COLORIZATION)
				{
					left = left.colorize();
				}

				result += EOL + String.align({ value: left, space: 0, width: leftWidth, fill: ' ', prefix: HELP_PREFIX, all: true }, { value: right, space: 2 }) + eol(2);
			}
			else
			{
				result += String.align(leftWidth + 2, { value: right }) + EOL;
			}
		}

		result = result.removeEnding('\n', '\r') + eol(2);

		if(result.length > 0 && DEFAULT_CALL_HELP_STREAM) try
		{
			const proc = process.getStream(DEFAULT_CALL_HELP_STREAM);

			if(proc && typeof proc.write === 'function')
			{
				proc.write(result);
			}
		}
		catch(_error)
		{
			if(_throw)
			{
				return x(_error);
			}

			return result;
		}

		//
		if(Number.isInt(_exit_code) && _exit_code >= 0)
		{
			return process.exit(_exit_code);
		}

		return result;
	}

	//
	//TODO/??
	//
	//getopt.call.something..

	//

})();
