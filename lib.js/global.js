//
//LEITFADEN:
//you should avoid extended functions like 'String.isString()' etc.. in here (so use 'typeof string..');
//reason is simple: this implemention could be used before the rest library modules are loaded..! ^_^

//
(function()
{
	//
	const DEFAULT_FALLBACK_LANGUAGE = 'en';
	const DEFAULT_FALLBACK_FALLBACK = [ 'en', 'de' ];
	const DEFAULT_TRACE = 32;
	const DEFAULT_RADIX_INTERVAL = 4826;

	//
	const hasProcess = (_key) => {
		if(typeof process === 'undefined')
		{
			return false;
		}

		if(typeof _key !== 'string' || _key.length === 0)
		{
			return true;
		}
		
		return (_key in process);
	};

	const hasEnv = (_key, ... _args) => {
		if(hasProcess('hasEnv'))
		{
			return process.hasEnv(_key, ... _args);
		}

		return (_key.toUpperCase() in CONFIG);
	};
	
	const setEnv = (_key, _value, ... _args) => {
		if(hasProcess('setEnv'))
		{
			return process.setEnv(_key, _value, ... _args);
		}
		
		if((_key = _key.toUpperCase()) in CONFIG)
		{
			return CONFIG[_key] = _value;
		}
		
		return undefined;
	};
	
	const getEnv = (_key, ... _args) => {
		if(hasProcess('getEnv'))
		{
			return process.getEnv(_key, ... _args);
		}

		return CONFIG[_key.toUpperCase()];		
	};
	
	const unsetEnv = (_key, ... _args) => {
		if(hasProcess('unsetEnv'))
		{
			return process.unsetEnv(_key, ... _args);
		}
		
		var result;
		
		if((_key = _key.toUpperCase()) in CONFIG)
		{
			result = CONFIG[_key];
		}
		else
		{
			result = undefined;
		}
		
		delete CONFIG[_key];
		return result;
	};
	
	const inEnv = (_key) => {
		if(hasProcess('env'))
		{
			return (_key in process.env);
		}
		
		return (_key.toUpperCase() in CONFIG);
	};

	//
	Object.defineProperty(global, 'encoding', {
		get: function()
		{
			if((typeof ENCODING === 'string' && ENCODING.length > 0) || ENCODING === null)
			{
				return ENCODING;
			}
			
			return null;
		},
		set: function(_value)
		{
			if((typeof _value === 'string' && _value.length > 0) || _value === null)
			{
				return ENCODING = _value;
			}

			return ENCODING = null;
		}
	});

	Object.defineProperty(global, 'ENCODING', {
		get: function()
		{
			if(hasEnv('encoding'))
			{
				return getEnv('encoding');
			}

			return null;
		},
		set: function(_value)
		{
			const orig = ENCODING;
			
			if(typeof _value === 'string' && _value.length > 0)
			{
				setEnv('encoding', _value);
			}
			else if(_value === null)
			{
				setEnv('encoding', null, true);
			}
			else
			{
				unsetEnv('encoding');
				CONFIG.ENCODING = null;
			}
			
			const result = ENCODING;
			
			if(hasProcess('setEncoding') && result !== orig)
			{
				process.setEncoding(result);
			}
			
			return result;
		}
	});

	//
	Object.defineProperty(global, 'COLORS', {
		get: function()
		{
			if(typeof global.__COLORS === 'boolean')
			{
				return global.__COLORS;
			}

			return ( BROWSER || (!!global.ANSI || global.ANSI === '') || (!!global.FORCE || global.FORCE === '') );
		},
		set: function(_value)
		{
			if(typeof _value === 'boolean')
			{
				return global.__COLORS = _value;
			}
			else
			{
				delete global.__COLORS;
			}
			
			return global.COLORS;
		}
	});
	
	Object.defineProperty(global, 'ANSI', {
		get: function()
		{
			if(hasEnv('ansi'))
			{
				return getEnv('ansi');
			}

			return (BROWSER === false);
		},
		set: function(_value)
		{
			if(typeof _value === 'boolean' || typeof _value === 'string' || typeof _value === 'number')
			{
				if(_value === '')
				{
					_value = 'random';
				}

				setEnv('ansi', _value);
			}

			return ANSI;
		}
	});

	Object.defineProperty(global, 'FORCE', {
		get: function()
		{
			if(hasEnv('force'))
			{
				return getEnv('force');
			}

			return (BROWSER === false);
		},
		set: function(_value)
		{
			if(typeof _value === 'boolean' || typeof _value === 'string' || typeof _value === 'number')
			{
				if(_value === '')
				{
					_value = 'random';
				}

				setEnv('force', _value);
			}

			return FORCE;
		}
	});

	Object.defineProperty(global, 'LINE', {
		get: function()
		{
			if(inEnv('line'))
			{
				return getEnv('line', false, false);
			}

			return (CONFIG.LINE || '=');
		},
		set: function(_value)
		{
			if(typeof _value === 'number')
			{
				_value = _value.toString();
			}

			if(typeof _value === 'string')
			{
				return setEnv('line', _value);
			}

			return LINE;
		}
	});

	/*
	Object.defineProperty(global, 'CONSOLE', {
		get: function()
		{
			if(hasEnv('console'))
			{
				return getEnv('console');
			}

			return (BROWSER === true);
		},
		set: function(_value)
		{
			if(typeof _value === 'boolean')
			{
				if(_value === CONSOLE)
				{
					return _value;
				}
				else if(_value)
				{
					Console.createConsole();
				}
				else
				{
					Console.destroyConsole();
				}

				return setEnv('console', _value);
			}

			return CONSOLE;
		}
	});*/

	//
	const checkCode = (_code) => {
		if(typeof _code === 'number')
		{
			if(_code >= -257 && _code <= 256)
			{
				return _code;
			}
		}
		else if(typeof _code === 'string')
		{
			const unique = (_string) => {
				var result = '';

				for(var i = 0; i < _string.length; i++)
				{
					if(result.indexOf(_string[i]) === -1)
					{
						result += _string[i];
					}
				}

				return result;
			};

			if((_code = unique(_code)).length >= 2)
			{
				return _code;
			}
		}

		return null;
	};

	Object.defineProperty(global, 'CODE', {
		get: function()
		{
			if(hasEnv('code'))
			{
				const code = checkCode(getEnv('code'));

				if(code !== null)
				{
					return code;
				}
			}

			const code = checkCode(CONFIG.CODE);

			if(code === null)
			{
				return CONFIG.CODE;
			}

			return setEnv('code', code);
		},
		set: function(_value)
		{
			if(typeof _value !== 'number' && typeof _value !== 'string')
			{
				_value = checkCode(CODE);
			}

			if(_value === null)
			{
				return CONFIG.CODE;
			}

			return setEnv('code', _value);
		}
	});

	Object.defineProperty(global, 'OVERSCROLL', {
		get: function()
		{
			if(! BROWSER)
			{
				return null;
			}
			else if(typeof page === 'undefined')
			{
				return undefined;
			}

			return (page.getRootStyle('overscroll-behavior') !== 'none' && page.getBodyStyle('overscroll-behavior') !== 'none');
		},
		set: function(_value)
		{
			if(! BROWSER)
			{
				return null;
			}
			else if(typeof page === 'undefined')
			{
				return undefined;
			}
			else if(typeof _value === 'boolean')
			{
				if(_value)
				{
					page.setStyle('overscroll-behavior', 'auto');
				}
				else
				{
					page.setStyle('overscroll-behavior', 'none');
				}

				return _value;
			}

			return OVERSCROLL;
		}
	});

	Object.defineProperty(global, 'LANGUAGE', {
		get: function()
		{
			var result;
			
			if(BROWSER)
			{
				if(typeof navigator.language === 'string' && navigator.language.length > 0)
				{
					result = navigator.language;
				}
				else if(Array.isArray(navigator.languages))
				{
					result = navigator.languages[0];
				}
				else
				{
					result = null;
				}
			}
			else
			{
				if(hasEnv('language', false))
				{
					result = getEnv('language', false, false);
				}
				if(hasEnv('LANG', false))
				{
					result = getEnv('LANG', false, false);
				}
				else
				{
					result = null;
				}
			}
			
			if(result === null)
			{
				if(typeof CONFIG.LANGUAGE === 'string' && CONFIG.LANGUAGE.length > 0)
				{
					result = CONFIG.LANGUAGE;
				}
				else if(Array.isArray(CONFIG.LANGUAGE) && typeof CONFIG.LANGUAGE[0] === 'string' && CONFIG.LANGUAGE[0].length > 0)
				{
					result = CONFIG.LANGUAGE[0];
				}
				else if(typeof DEFAULT_FALLBACK_LANGUAGE === 'string' && DEFAULT_FALLBACK_LANGUAGE.length > 0)
				{
					result = DEFAULT_FALLBACK_LANGUAGE;
				}
				else
				{
					result = 'en';
				}
			}
			
			return result.substr(0, 2).toLowerCase();
		},
		set: function(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				setEnv('language', (_value = _value.substr(0, 2).toLowerCase()));
			}
			else if(Array.isArray(_value))
			{
				setEnv('language', _value);
			}
			else
			{
				return LANGUAGE;
			}
			
			return _value;
		}
	});

	Object.defineProperty(global, 'FALLBACK', {
		get: function()
		{
			const temp = [];
			
			if(BROWSER)
			{
				if(Array.isArray(navigator.languages))
				{
					temp.concat(navigator.languages);
				}
				else if(typeof navigator.language === 'string' && navigator.language.length > 0)
				{
					temp[0] = navigator.language;
				}
			}
			if(hasEnv('fallback', false))
			{
				const tmp = getEnv('fallback', true);
				
				if(typeof tmp === 'string' && tmp.length > 0)
				{
					temp[0] = tmp;
				}
				else if(Array.isArray(tmp))
				{
					temp.concat(tmp);
				}
			}
			
			if(typeof CONFIG.LANGUAGE === 'string' && CONFIG.LANGUAGE.length > 0)
			{
				temp.push(CONFIG.LANGUAGE);
			}
			else if(Array.isArray(CONFIG.LANGUAGE))
			{
				temp.concat(CONFIG.LANGUAGE);
			}

			if(Array.isArray(CONFIG.FALLBACK))
			{
				temp.concat(CONFIG.FALLBACK);
			}
			else if(typeof CONFIG.FALLBACK === 'string' && CONFIG.FALLBACK.length > 0)
			{
				temp.push(CONFIG.FALLBACK);
			}
			
			if(typeof DEFAULT_FALLBACK_LANGUAGE === 'string' && DEFAULT_FALLBACK_LANGUAGE.length > 0)
			{
				temp.push(DEFAULT_FALLBACK_LANGUAGE);
			}
			else if(Array.isArray(DEFAULT_FALLBACK_LANGUAGE))
			{
				temp.concat(DEFAULT_FALLBACK_LANGUAGE);
			}
			
			if(Array.isArray(DEFAULT_FALLBACK_FALLBACK))
			{
				temp.concat(DEFAULT_FALLBACK_FALLBACK);
			}
			else if(typeof DEFAULT_FALLBACK_FALLBACK === 'string' && DEFAULT_FALLBACK_FALLBACK.length > 0)
			{
				temp.push(DEFAULT_FALLBACK_FALLBACK);
			}

			//
			const lang = LANGUAGE;
			const result = [];
			var value;

			for(var i = 0, j = 0; i < temp.length; i++)
			{
				if(typeof temp[i] !== 'string')
				{
					continue;
				}
				else if(temp[i].length < 2)
				{
					continue;
				}
				
				value = temp[i].substr(0, 2).toLowerCase();

				if(value === lang)
				{
					continue;
				}
				else if(result.indexOf(value) > -1)
				{
					continue;
				}
				
				result[j++] = value;
			}
			
			if(result.length === 0)
			{
				if(lang === 'en')
				{
					result[0] = 'de';
				}
				else if(lang === 'de')
				{
					result[0] = 'en';
				}
				else
				{
					result[0] = 'en';
					result[1] = 'de';
				}
			}
			
			return result;
		},
		set: function(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				_value = [ _value.substr(0, 2).toLowerCase() ];
			}
			else if(Array.isArray(_value))
			{
				const tmp = [];
				var value;
				
				for(var i = 0, j = 0; i < _value.length; i++)
				{
					if(typeof _value[i] === 'string' && _value[i].length > 0)
					{
						value = _value[i].substr(0, 2).toLowerCase();
					
						if(tmp.indexOf(value) === -1)
						{
							tmp[j++] = value;
						}
					}
				}
				
				if(tmp.length === 0)
				{
					_value = null;
				}
				else
				{
					_value = tmp;
				}
			}
			else
			{
				_value = null;
			}
			
			if(_value === null)
			{
				_value = [ ... FALLBACK ];
			}
			else
			{
				setEnv('fallback', _value);
				
				if(BROWSER)
				{
					CONFIG.FALLBACK = _value;
				}
			}
			
			//
			return _value;
		}
	});
	
	Object.defineProperty(global, 'SIGNALS', {
		get: function()
		{
			if(hasEnv('signals'))
			{
				return getEnv('signals', true, true);
			}
			
			return null;
		},
		set: function(_value)
		{
			if(typeof _value === 'boolean')
			{
				setEnv('signals', _value, true, true);

				if(hasProcess('signals'))
				{
					process.signals(_value);
				}
			}
			
			return SIGNALS;
		}
	});

	//
	Object.defineProperty(global, 'TRACE', {
		get: function()
		{
			return Error.stackTraceLimit;
		},
		set: function(_value)
		{
			if(typeof _value === 'boolean')
			{
				if(_value)
				{
					_value = DEFAULT_TRACE;
				}
				else
				{
					_value = 0;
				}
			}

			if(typeof _value === 'number')
			{
				if(_value !== Infinity)
				{
					if(_value <= 0)
					{
						_value = 0;
					}
					else if(_value > 255)
					{
						_value = 255;
					}
				}

				return Error.stackTraceLimit = _value;
			}

			return TRACE;
		}
	});
	
	//
	Object.defineProperty(global, 'ERROR_COLORS', {
		get: function()
		{
			var result;
			
			if(hasEnv('error_colors', false))
			{
				result = getEnv('error_colors', true, false);
				
				if(! Array.isArray(result, false))
				{
					result = [ result ];
				}
			}
			else if(Array.isArray(CONFIG.ERROR_COLORS, false))
			{
				result = [ ... CONFIG.ERROR_COLORS ];
			}
			
			if(result === null && Array.isArray(CONFIG.ERROR_COLORS, false))
			{
				result = [ ... CONFIG.ERROR_COLORS ];
			}
			
			return result;
		},
		set: function(_value)
		{
			if(! Array.isArray(_value, false))
			{
				if(typeof _value === 'string')
				{
					if(_value.length === 0 || _value.startsWith('random'))
					{
						_value = [ true ];
					}
					else
					{
						_value = [ _value ];
					}
				}
				else if(typeof _value === 'boolean' || _value === null)
				{
					_value = [ _value ? true : null ];
				}
			}
			
			setEnv('error_colors', _value, true, true);
			return _value;
		}
	});
	
	//
	Object.defineProperty(global, 'RADIX_RANGE', {
		get: function()
		{
			var result = null;

			if(hasEnv('radix_range', false))
			{
				result = getEnv('radix_range', true, false);

				if(Array.isArray(result, false))
				{
					if(! isInt(result[0]))
					{
						result = null;
					}

					if(result && !isInt(result[1]))
					{
						result[1] = 0;
					}
				}
				else if(isInt(result))
				{
					result = [ result, 0 ];
				}
				else
				{
					result = null;
				}

				if(result)
				{
					setEnv('radix_range', result, true, false);
				}
			}

			if(result === null)
			{
				if(Array.isArray(CONFIG.RADIX_RANGE))
				{
					result = [ ... CONFIG.RADIX_RANGE ];

					if(! isInt(result[0]))
					{
						result = null;
					}

					if(result && ! isInt(result[1]))
					{
						result[1] = 0;
					}
				}
				else if(isInt(CONFIG.RADIX_RANGE))
				{
					result = [ CONFIG.RADIX_RANGE, 0 ];
				}
				else
				{
					result = null;
				}

				if(result)
				{
					CONFIG.RADIX_RANGE = result;
				}
			}

			if(result === null)
			{
				result = [ (typeof alphabet === 'undefined' ? 62 : alphabet.MAX_REGULAR), 0 ];
				CONFIG.RADIX_RANGE = result;
			}

			return result;
		},
		set: function(_value)
		{
			var result = [];

			if(Array.isArray(_value, false))
			{
				if(isInt(_value[0]))
				{
					result[0] = _value[0];
				}
				else
				{
					result[0] = (typeof alphabet === 'undefined' ? 62 : alphabet.MAX_REGULAR);
				}

				if(isInt(_value[1]))
				{
					result[1] = _value[1];
				}
				else
				{
					result[1] = 0;
				}
			}
			else if(isInt(_value))
			{
				result[0] = _value;
				result[1] = 0;
			}
			else
			{
				return RADIX_RANGE;
			}

			setEnv('radix_range', result, true, true);

			return result;
		}
	});

	//
	RADIX_INTERVAL_DEFAULT = DEFAULT_RADIX_INTERVAL;

	Object.defineProperty(global, 'RADIX_INTERVAL', {
		get: function()
		{
			var result;

			if(hasEnv('radix_interval'))
			{
				result = getEnv('radix_interval', true, false);

				if(result === true)
				{
					result = DEFAULT_RADIX_INTERVAL;
				}
				else if(result === false || result === null)
				{
					result = null;
				}
				else if(! (isInt(result) && result > 0))
				{
					result = undefined;
				}
			}
			else
			{
				result = undefined;
			}

			if(typeof result === 'undefined')
			{
				if(isInt(CONFIG.RADIX_INTERVAL) && CONFIG.RADIX_INTERVAL > 0)
				{
					result = CONFIG.RADIX_INTERVAL;
				}
				else if(CONFIG.RADIX_INTERVAL === true)
				{
					result = DEFAULT_RADIX_INTERVAL;
				}
				else if(CONFIG.RADIX_INTERVAL === false)
				{
					result = null;
				}
				else if(typeof CONFIG.RADIX_INTERVAL === 'undefined')
				{
					result = undefined;
				}
				else
				{
					result = null;
				}
			}

			if(typeof result === 'undefined')
			{
				return undefined;
			}

			setEnv('radix_interval', result, true);
			return CONFIG.RADIX_INTERVAL = result;
		},
		set: function(_value)
		{
			const orig = RADIX_INTERVAL;
			var result;

			if(isInt(_value) && _value > 0)
			{
				result = _value;
			}
			else if(_value === true)
			{
				if(isInt(orig) && orig > 0)
				{
					result = _value = orig;
				}
				else
				{
					result = _value = DEFAULT_RADIX_INTERVAL;
				}
			}
			else
			{
				result = null;
			}

			if(result === null)
			{
				unsetEnv('radix_interval', false);
			}
			else
			{
				setEnv('radix_interval', result, true, false);
			}

			if(typeof radix === 'undefined')
			{
				return CONFIG.RADIX_INTERVAL = result;
			}
			else
			{
				radix.start(result, true);
			}
			
			return result;
		}
	});
	
	//
	(function()
	{
		//
		for(var idx in CONFIG)
		{
			//
			const keyUpper = idx.toUpperCase();
			const keyLower = idx.toLowerCase();

			//
			if(keyUpper in global)
			{
				continue;
			}

			//
			Object.defineProperty(global, keyUpper, {
				get: function()
				{
					if(hasEnv(keyLower, false))
					{
						return getEnv(keyLower, true, false);
					}
					else if(keyUpper in CONFIG)
					{
						return CONFIG[keyUpper];
					}

					return null;
				},
				set: function(_value)
				{
					if(hasEnv(keyLower, false))
					{
						return setEnv(keyLower, _value, true, true);
					}
					else if(keyUpper in CONFIG)
					{
						return CONFIG[keyUpper] = _value;
					}
					
					return null;
				}
			});
		}
	})();

	if(BROWSER)
	{
		if(typeof CONFIG.TRACE === 'number')
		{
			if(CONFIG.TRACE === Infinity || (isInt(CONFIG.TRACE) && CONFIG.TRACE >= 0) || typeof CONFIG.TRACE === 'boolean')
			{
				TRACE = CONFIG.TRACE;
			}
		}
	}
	else if(hasProcess('env')) (function()
	{

		//
		(function()
		{
			const ansi = process.env.ansi;
			const force = process.env.force;

			if(ansi === '')
			{
				process.env.ansi = 'random';
			}

			if(force === '')
			{
				process.env.force = 'random';
			}
		})();

		(function()
		{
			var trace;

			if(! BROWSER && typeof __TRACE_DEFINED_BEFORE === 'number')
			{
				Error.stackTraceLimit = __TRACE_DEFINED_BEFORE;
				trace = null;
			}
			else if('trace' in process.env)
			{
				if(isNaN(process.env.trace))
				{
					if(isInt(CONFIG.TRACE))
					{
						trace = CONFIG.TRACE;
					}
				}
				else
				{
					trace = parseInt(process.env.trace);
				}
			}
			else if(isInt(CONFIG.TRACE))
			{
				trace = CONFIG.TRACE;
			}
			else
			{
				trace = null;
			}

			if(trace !== null)
			{
				delete CONFIG.TRACE;
				TRACE = trace;
			}
		})();

		(function()
		{
			var radixInterval;

			if(('radix_interval' in process.env) && process.env.radix_interval.length > 0)
			{
				try
				{
					if(! (isInt(radixInterval = parseInt(process.env.radix_interval, 10)) && (radixInterval % 1) === 0))
					{
						radixInterval = undefined;
					}
				}
				catch(_error)
				{
					radixInterval = undefined;
				}

				if(typeof radixInterval === 'undefined')
				{
					switch(process.env.radix_interval.toLowerCase())
					{
						case 'null':
						case '(null)':
							radixInterval = null;
							break;
						case 'true':
						case '(true)':
						case 'yes':
						case '(yes)':
						case 'on':
						case '(on)':
						case 'enabled':
						case '(enabled)':
							radixInterval = true;
							break;
						case 'false':
						case '(false)':
						case 'no':
						case '(no)':
						case 'off':
						case '(off)':
						case 'disabled':
						case '(disabled)':
							radixInterval = false;
							break;
					}
				}
			}
			else
			{
				radixInterval = undefined;
			}

			if(typeof radixInterval !== 'undefined')
			{
				CONFIG.RADIX_INTERVAL = radixInterval;
			}
		})();

		//

	})();

})();

