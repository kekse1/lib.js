if(typeof __GLOBALS === 'undefined') __GLOBALS = (function()
{

	(function()
	{

		//
		sleep = function(_duration = 0)
		{
			if(typeof _duration === 'number')
			{
				_duration = Math.floor(Math.abs(_duration));
			}
			else
			{
				return x('Invalid _duration (expecting Integer)');
			}

			const end = (Date.now() + _duration);
			while(Date.now() < end) {};
			return end;
		}

		//
		if(typeof setImmediate === 'undefined') Object.defineProperty(global, 'setImmediate', { value: function(_func, ... _args)
		{
			if(typeof _func !== 'function')
			{
				return x('Invalid _function');
			}

			setTimeout(() => { _func(... _args); }, 0);
		}});

		//
		keyLength = function(_string, _throw = false)
		{
			if(! (Number.isInt(KEYS) && KEYS >= 0))
			{
				return x('Invalid %[%] variable (not an % >= %)', null, 'CONFIG', 'KEYS', 'Integer', 0);
			}
			else if(typeof _string !== 'string')
			{
				if(_throw)
				{
					return x('Invalid % (not a %)', null, 'key', 'String');
				}

				return null;
			}
			else if(_string.length < KEYS)
			{
				if(_throw)
				{
					return x('Invalid % (it needs a minimum of % chars)', null, 'key', KEYS);
				}

				return false;
			}

			return true;
		}

		//
		getLength = function(_length, _length_total, _offset = 0, _return = null, _throw = true)
		{
			if(_length === 0 || _length_total === 0)
			{
				return 0;
			}
			else if(Number.isNumber(_length))
			{
				_length = Math.floor(Math.abs(_length));
			}
			else if(_throw)
			{
				return x('Invalid _offset (not an Integer or BigInt)');
			}
			else
			{
				return _return;
			}

			if(Number.isNumber(_length_total))
			{
				_length_total = Math.floor(Math.abs(_length_total));
			}
			else if(_throw)
			{
				return x('Invalid _length (not an Integer or BigInt)');
			}
			else
			{
				return _return;
			}

			if(Number.isNumber(_offset))
			{
				_offset = getIndex(Math.floor(_offset), _length_total, _return, _throw);
			}
			else
			{
				_offset = 0;
			}

			//
			return Math._min(_length_total - _offset, _length);
		}

		getIndex = function(_index, _length, _return = null, _throw = true)
		{
			//
			var indexIsBigInt;
			var lengthIsBigInt;

			if(Number.isNumber(_index))
			{
				_index = _index.int;
				indexIsBigInt = false;
			}
			else if(typeof _index === 'bigint')
			{
				indexIsBigInt = true;
			}
			else if(_throw)
			{
				return x('Invalid % argument (expecting a % or %)', null, '_index', 'Number', 'BigInt');
			}
			else
			{
				return _return;
			}

			//
			if(Number.isNumber(_length))
			{
				_length = Math.abs(_length.int);
				lengthisBigInt = false;
			}
			else if(typeof _length === 'bigint')
			{
				_length = Math.abs(_length);
				lengthIsBigInt = true;
			}
			else if(_throw)
			{
				return x('Invalid % argument (expecting a % or % greater than %)', null, '_length', 'Number', 'BigInt', 'zero');
			}
			else
			{
				return _return;
			}

			//
			if(_length === 0)
			{
				if(_throw)
				{
					return x('The % argument may not be % (%)', null, '_length', 'zero', 0);
				}

				return _return;
			}

			//
			if(indexIsBigInt && !lengthIsBigInt)
			{
				_length = BigInt.from(_length);
			}
			else if(!indexIsBigInt && lengthIsBigInt)
			{
				_index = BigInt.from(_index);
			}

			//
			if((_index %= _length) < 0)
			{
				_index = (_length + _index % _length);
			}

			//
			return Math.abs(_index);
		}

		getNegativeIndex = function(_index, _length, _return = null, _throw = true)
		{
			//
			if(Number.isNumber(_length) && _length > 0)
			{
				_length = _length.int;
			}
			else if(_throw)
			{
				return x('Invalid % argument (expecting a % or % greater than %)', null, '_length', 'Number', 'BigInt', 'zero');
			}
			else
			{
				return _return;
			}

			if(Number.isNumber(_index))
			{
				if((_index = _index.int) >= _length)
				{
					if(_throw)
					{
						return x('Invalid % argument (must be lower than % argument)', null, '_index', '_length');
					}

					return _return;
				}
			}
			else if(_throw)
			{
				return x('Invalid % argument (expecting a % or % lower than % argument)', null, '_index', 'Number', 'BigInt', '_length');
			}
			else
			{
				return _return;
			}

			//
			if(_index < 0)
			{
				_index = (_length + _index % _length);
			}

			//
			return Math.abs(_index);
		}

		//
		const checkRadixRange = (_max = RADIX_RANGE[0], _min = RADIX_RANGE[1]) => {
			if(typeof alphabet === 'undefined')
			{
				if(_max < 2)
				{
					_max = 2;
				}
				else if(_max > 36)
				{
					_max = 36;
				}
				
				if(_min < 2)
				{
					_min = 2;
				}
				else if(_min > 36)
				{
					_min = 36;
				}

				return [ _max, _min ];
			}
			
			if(_max < 0)
			{
				_max = 0;
			}
			else if(_max > alphabet.MAX_REGULAR)
			{
				_max = alphabet.MAX_REGULAR;
			}

			if(_min < 0)
			{
				_min = 0;
			}
			else if(_min > alphabet.MAX_REGULAR)
			{
				_min = alphabet.MAX_REGULAR;
			}

			if(_min < 0)
			{
				_min = 0;
			}

			if(_max < 0)
			{
				_max = 0;
			}

			return [ _max, _min ];
		};

		const getValue = (_max, _min) => {
			var result;

			if(RADIX_RANDOM) do
			{
				result = Math.random.int(_max, _min, false);
			}
			while(result === radix.currentValue);
			else
			{
				if((result = (radix.currentValue + 1)) > _max)
				{
					result = _min;
				}
			}

			return result;
		};

		radix = (_set, _set_with_interval_update = true) => {
			//
			if(! radix._PAUSE)
			{
				radix.start(CONFIG.RADIX_INTERVAL, false);
			}

			//
			if(typeof _set !== 'boolean')
			{
				if(_set === null)
				{
					_set = !radix.enabled;
				}
				else if(! Number.isInt(_set))
				{
					_set = null;
				}
			}

			const [ max, min ] = checkRadixRange();
			const result = radix.currentValue;

			var change;

			if(_set === true)
			{
				change = getValue(max, min);
			}
			else if(Number.isInt(_set))
			{
				if(_set < min)
				{
					change = min;
				}
				else if(_set > max)
				{
					change = max;
				}
				else
				{
					change = _set;
				}
			}
			else
			{
				change = null;
			}

			if(change !== null)
			{
				radix.currentValue = change;

				if(_set_with_interval_update && !radix._PAUSE)
				{
					radix.start(undefined, true, false);
				}

				emit('radix', radix.currentValue, result);
			}

			return result;
		};

		radix._interval = null;
		radix._timer = null;
		radix._update = () => {
			return radix(true, false);
		};

		radix.start = radix.resume = (_interval, _force = true, _dec = true) => {
			if(radix._PAUSE && !_force)
			{
				return null;
			}
			else
			{
				radix._PAUSE = false;
			}

			if(radix.enabled)
			{
				if(_force)
				{
					radix.stop();
				}
				else
				{
					return null;
				}
			}

			if(typeof _interval === 'undefined')
			{
				if(radix._interval === null)
				{
					_interval = true;
				}
				else
				{
					_interval = radix._interval;
				}
			}
			
			if(_interval === true)
			{
				_interval = RADIX_INTERVAL_DEFAULT;
			}
			else if(! (Number.isInt(_interval) && _interval > 0))
			{
				if(CONFIG.RADIX_INTERVAL === true || (Number.isInt(CONFIG.RADIX_INTERVAL) && RADIX_INTERVAL > 0))
				{
					if((_interval = CONFIG.RADIX_INTERVAL) === true)
					{
						_interval = CONFIG.RADIX_INTERVAL = RADIX_INTERVAL_DEFAULT;
					}
				}
				else
				{
					_interval = null;
				}
			}
			
			if(_interval !== null)
			{
				radix._timer = setInterval(radix._update, radix._interval = _interval);

				if(! BROWSER)
				{
					radix._timer.unref();
				}
			}
			else
			{
				radix._timer = radix._interval = null;
			}

			if(! Number.isInt(radix.currentValue))
			{
				radix(10, false);
			}

			return _interval;
		};

		radix.stop = radix.pause = (_reset = true) => {
			radix._PAUSE = true;

			if(_reset)
			{
				radix(10, false);
			}

			if(radix._timer === null)
			{
				return false;
			}

			clearInterval(radix._timer);
			radix._timer = radix._interval = null;

			return true;
		};

		radix._PAUSE = false;

		Object.defineProperty(radix, 'PAUSE', { get: function()
		{
			return radix._PAUSE;
		}});

		Object.defineProperty(radix, 'enabled', {
			get: function()
			{
				return (radix._timer !== null);
			},
			set: function(_value)
			{
				if(_value === true)
				{
					_value = RADIX_INTERVAL_DEFAULT;
				}
				else if(! (Number.isInt(_value) && _value > 0))
				{
					_value = null;
				}

				return radix.start(_value, true);
			}
		});

		radix.currentValue = 10;

		//
		stopEvent = function(_event, _throw = true)
		{
			try
			{
				_event.stopPropagation();
				_event.preventDefault();
			}
			catch(_error)
			{
				if(_throw)
				{
					return x(_error);
				}
			}
			finally
			{
				return false;
			}
		}

		//

	})();

	//
	(function()
	{
		Object.defineProperty(global, 'EOL', { get: function()
		{
			if(BROWSER)
			{
				return '\r\n';
			}
			else if(typeof os !== 'undefined' && typeof os.EOL === 'string' && os.EOL.length > 0)
			{
				return os.EOL;
			}
			
			return '\n';
		}});
		
		Object.defineProperty(global, 'eol', { value: function(_amount = 1)
		{
			return String.repeat(Math.floor(Math.abs(_amount)), EOL);
		}});

		Object.defineProperty(global, 'SPACE', { get: function()
		{
			return String.fromCharCode(32);
		}});

		Object.defineProperty(global, 'space', { value: function(_amount = 1)
		{
			return String.repeat(Math.floor(Math.abs(_amount)), SPACE);
		}});

		Object.defineProperty(global, 'TAB', { get: function()
		{
			/*if(BROWSER)
			{
				return String.repeat(TABS * 2, '&nbsp;');
			}*/

			return String.fromCharCode(9);
		}});

		Object.defineProperty(global, 'tab', { value: function(_amount = 1)
		{
			return String.repeat(Math.floor(Math.abs(_amount)), TAB);
		}});

		Object.defineProperty(global, 'ESC', { get: function()
		{
			return String.fromCharCode(27);
		}});

		Object.defineProperty(global, 'esc', { value: function(_amount = 1)
		{
			return String.repeat(Math.floor(Math.abs(_amount)), ESC);
		}});

		Object.defineProperty(global, 'NUL', { get: function()
		{
			return String.fromCharCode(0);
		}});

		Object.defineProperty(global, 'nul', { value: function(_amount = 1)
		{
			return String.repeat(Math.floor(Math.abs(_amount)), NUL);
		}});

		Object.defineProperty(global, 'BEL', { get: function()
		{
			return String.fromCharCode(7);
		}});

		Object.defineProperty(global, 'bel', { value: function(_amount = 1)
		{
			return String.repeat(Math.floor(Math.abs(_amount)), BEL);
		}});
	})();

	//
	(function()
	{
		//
		GLOBALS = module.exports = {};
		
		//
		GLOBALS.object = require('globals/object');

		GLOBALS.proxy = require('globals/proxy');
		GLOBALS.arguments = require('globals/arguments');
		GLOBALS.reflect = require('globals/reflect');

		GLOBALS.math = require('globals/math');

		GLOBALS.number = require('globals/number');
		GLOBALS.bigint = require('globals/bigint');

		GLOBALS.typedarray = require('globals/typedarray');
		GLOBALS.dataview = require('globals/dataview');
		GLOBALS.array = require('globals/array');
		GLOBALS.uint8array = require('globals/uint8array');

		GLOBALS.regexp = require('globals/regexp');
		GLOBALS.string = require('globals/string');

		GLOBALS.error = require('globals/error');

		GLOBALS.boolean = require('globals/boolean');
		GLOBALS.function = require('globals/function');

		//
		GLOBALS.date = require('globals/date');

		//
		GLOBALS.map = require('globals/map');
		GLOBALS.set = require('globals/set');

		//

	})();

	//
	return Date.now();
	
})();

