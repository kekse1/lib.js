(function()
{

	//
	const DEFAULT_EFFICIENT_LEAP_YEAR = true; //may be (true), (false) and (null) only!!!

	//
	(function()
	{

		//
		Object.defineProperty(Date.prototype, 'clone', { value: function()
		{
			return new Date(this.getTime());
		}});
	
		//
		Object.defineProperty(Date, 'isDate', { value: function(... _args)
		{
			if(_args.length === 0)
			{
				return null;
			}
			else try
			{
				for(var i = 0; i < _args.length; ++i)
				{
					if(_args[i].constructor?.name !== 'Date')
					{
						return false;
					}
				}
			}
			catch(_error)
			{
				return false;
			}

			return true;
		}});

		isDate = Date.isDate;

		//
		Object.defineProperty(Date, 'toRadix', { value: function(_radix = 2, _date = new Date())
		{
			return _date.getTime().toString(_radix);
		}});

		Object.defineProperty(Date.prototype, 'toRadix', { value: function(_radix = 2)
		{
			return this.getTime().toString(_radix);
		}});

		//
		Object.defineProperty(Date, 'unix', { value: function(_date = new Date())
		{
			return Math.round(_date.getTime() / 1000);
		}});

		Object.defineProperty(Date.prototype, 'unix', { get: function()
		{
			return Date.unix(this);
		}});

		unix = Date.unix;
		now = Date.now;

		//
		Object.defineProperty(Date, 'equal', { value: function(... _args)
		{
			if(_args.length === 0)
			{
				return null;
			}

			var same = 0;

			for(var i = 0; i < _args.length; ++i)
			{
				if(Date.isDate(_args[i]))
				{
					if(_args[i] === _args[0])
					{
						++same;
					}

					_args[i] = _args[i].getTime();
				}
				else if(! Number.isInt(_args[i]))
				{
					return x('Invalid %[%] argument (expecting only % or %)', null, '..._args', i, 'Date', 'Integer');
				}
			}

			if(same === _args.length)
			{
				return true;
			}
			else if(_args.length === 0)
			{
				return null;
			}
			else if(_args.length === 1)
			{
				return true;
			}
			else if(same > 1)
			{
				_args.uniq();
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
		const _now = Date.now;

		Object.defineProperty(Date, 'now', { value: function(_diff)
		{
			const now = _now.call(this);

			if(typeof _diff !== 'undefined' && _diff !== null)
			{
				if(typeof _diff === 'number')
				{
					return (now - _diff);
				}

				return x('Invalid _diff argument (not a Number)');
			}

			return now;
		}});

		//
		//todo/good?!??
		//temporary solution? nice because 'html'.. could be my standard (this adapted one..).
		Object.defineProperty(Date.prototype, 'render', { value: function(_type = 'html')
		{
			const html = (_type === 'html');
			const w = Date.WEEKDAY();

			const xxmap = {
				Sun: w[0],
				Mon: w[1],
				Tue: w[2],
				Wed: w[3],
				Thu: w[4],
				Fri: w[5],
				Sat: w[6]
			};

			//
			const split = this.toUTCString().split(' ');

			//
			if(html) return '<small><b>' + xxmap[split[0].removeLast()] + ',</b></small> ' + split[3] + '-' + split[2] + '-' + split[1] + ' <big>' + split[4] + '</big>';
			else return xxmap[split[0].removeLast()] + ', ' + split[3] + '-' + split[2] + '-' + split[1] + ' (' + split[4] + ')';
		}});

		//
		Object.defineProperty(Date, 'WEEKDAY', { value: function(_day, _short = false, _lang = [ LANGUAGE ])
		{
			if(typeof _short !== 'boolean')
			{
				return x('Invalid % argument (not a %)', null, '_short', 'Boolean');
			}
			else if(typeof _lang === 'string')
			{
				if(_lang.length === 0)
				{
					_lang = [ LANGUAGE ];
				}
				else
				{
					_lang = [ _lang ];
				}
			}
			else if(! Array.isArray(_lang))
			{
				_lang = [ LANGUAGE ];
			}

			if(Number.isNumber(_day))
			{
				//_day = Math.floor(_day) % 7;
				_day = getIndex(_day, 7);
			}
			else if(Date.isDate(_day))
			{
				_day = _day.getDay();
			}
			else if(_day !== null)
			{
				_day = new Date().getDay();
			}

			const dtf = intl(_lang, 'DateTimeFormat', { weekday: (_short ? 'short' : 'long') });

			if(_day !== null)
			{
				return dtf.format(new Date(86400000*(3+_day)));
			}

			const result = new Array(7);

			for(var i = 0, j = 3; i < 7; ++i, ++j)
			{
				result[i] = dtf.format(new Date(86400000 * j));
			}

			return result;
		}});

		Object.defineProperty(Date, 'MONTH', { value: function(_month, _short = false, _lang = [ LANGUAGE ])
		{
			if(typeof _short !== 'boolean')
			{
				return x('Invalid % argument (not a %)', null, '_short', 'Boolean');
			}
			else if(typeof _lang === 'string')
			{
				if(_lang.length === 0)
				{
					_lang = [ LANGUAGE ];
				}
				else
				{
					_lang = [ _lang ];
				}
			}
			else if(! Array.isArray(_lang))
			{
				_lang = [ LANGUAGE ];
			}

			if(Number.isNumber(_month))
			{
				//_month = Math.floor(_month) % 12;
				_month = getIndex(_month, 12);
			}
			else if(Date.isDate(_month))
			{
				_month = _month.getMonth();
			}
			else if(_month !== null)
			{
				_month = new Date().getMonth();
			}

			const dtf = intl(_lang, 'DateTimeFormat', { month: (_short ? 'short' : 'long') });

			if(_month !== null)
			{
				return dtf.format(new Date(2419200000*(_month+1)));
			}

			const result = new Array(12);

			for(var i = 0; i < 12; ++i)
			{
				result[i] = dtf.format(new Date(2419200000*(i+1)));
			}

			return result;
		}});

		Object.defineProperty(Date.prototype, 'toGMT', { value: function()
		{
			const ZONE = 'GMT';

			//
			const mins = (this.getTime() / 1000 / 60);
			const gmt = new Date(((this.getTime() / 1000 / 60) + this.getTimezoneOffset()) * 60 * 1000);

			return Date.WEEKDAY(gmt.getDay()) + ', '
				+ gmt.getDate().toString().padLeft(2, '0') + ' '
				+ Date.MONTH(gmt.getMonth()) + ' '
				+ gmt.getFullYear().toString() + ' '
				+ gmt.getHours().toString().padLeft(2, '0') + ':'
				+ gmt.getMinutes().toString().padLeft(2, '0') + ':'
				+ gmt.getSeconds().toString().padLeft(2, '0') + ' ' + ZONE;
		}});

		Object.defineProperty(Date, 'GMT', { value: function(_date = new Date())
		{
			try
			{
				return _date.toGMT();
			}
			catch(_error)
			{
				throw new Error('Invalid _date argument');
			}
			
			return null;
		}});

		//
		Object.defineProperty(Date, 'dayByYear', { value: function(_date = new Date())
		{ return _date.dayByYear; }});

		Object.defineProperty(Date.prototype, 'dayByYear', { get: function()
		{
			const start = new Date(this.getFullYear(), 0, 0);
			const diff = (this - start) + ((start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000);
			const oneDay = (1000 * 60 * 60 * 24);
			return (diff / oneDay);//Math.floor(diff / oneDay);//ohne nackomma siehe 'dayInYear' (w/ *In*!)!
		}});

		Object.defineProperty(Date, 'dayInYear', { value: function(_date = new Date())
		{ return Math.floor(_date.dayByYear); }});

		Object.defineProperty(Date.prototype, 'dayInYear', { get: function()
		{ return Math.floor(this.dayByYear); }});

		//
		Object.defineProperty(Date, 'daysInYear', { value: function(_date = new Date())
		{ return _date.daysInYear; }});

		Object.defineProperty(Date.prototype, 'daysInYear', { get: function()
		{
			if(this.isLeapYear)
			{
				return 366;
			}

			return 365;
		}});

		Object.defineProperty(Date, 'weekInYear', { value: function(_date = new Date())
		{
			const start = new Date(_date.getFullYear(), 0, 1);
			const today = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate());
			const dayInYear = ((today.getTime() - start.getTime() + 1) / 86400000);

			return Math.ceil(dayInYear / 7);
		}});

		Object.defineProperty(Date.prototype, 'weekInYear', { get: function()
		{
			return Date.weekInYear(this);
		}});

		Object.defineProperty(Date, 'daysInMonth', { value: function(_date = new Date())
		{
			const year = _date.getFullYear();
			const month = _date.getMonth();

			if(month === 1)
			{
				if(_date.isLeapYear)
				{
					return 29;
				}

				return 28;
			}

			const negate = (month >= 7);
			return ((month % 2) === 0 ? (negate ? 30 : 31) : (negate ? 31 : 30));
		}});

		Object.defineProperty(Date.prototype, 'daysInMonth', { get: function()
		{
			return Date.daysInMonth(this);
		}});

		Object.defineProperty(Date, 'isLeapYear', { value: function(_date = new Date())
		{
			//
			var year;

			if(Date.isDate(_date))
			{
				year = _date.getFullYear();
			}
			else if(Number.isInt(_date))
			{
				year = _date;
			}
			else if(BigInt.isBigInt(_date))
			{
				year = Number(_date);
			}
			else if(typeof _date === 'string' && _date.isInt())
			{
				year = parseInt(_date);
			}
			else
			{
				return x('Not a valid year or Date object');
			}

			//
			var result;

			if(DEFAULT_EFFICIENT_LEAP_YEAR === true)
			{
				result = (((year & 3) === 0) && (((year % 25) !== 0) || ((year & 15) === 0)));
			}
			else if(DEFAULT_EFFICIENT_LEAP_YEAR === false)
			{
				result = ((((year % 4) === 0) && ((year % 100) !== 0)) || (year % 400) === 0);
			}
			else if(DEFAULT_EFFICIENT_LEAP_YEAR === null)
			{
				return (new Date(year, 1, 29).getDate() === 29);
			}
			else
			{
				return x('Invalid % configuration (may only be %, % or %)', null, 'DEFAULT_EFFICIENT_LEAP_YEAR', true, false, null);
			}

			return result;
			/*** ORIGINAL version *** /
			if(year % 4 === 0)
			{
				if(year % 100 === 0)
				{
					if(year % 400 === 0)
					{
						return true;
					}

					return false;
				}

				return true;
			}

			return false;*/
		}});

		Object.defineProperty(Date.prototype, 'isLeapYear', { get: function()
		{
			return Date.isLeapYear(this);
		}});

		//
		Object.defineProperty(Date, 'yearPercent', { value: function(_date = new Date())
		{
			return (_date.year * 100);
		}});

		Object.defineProperty(Date.prototype, 'yearPercent', { get: function()
		{
			return (this.year * 100);
		}});

		Object.defineProperty(Date, 'years', { value: function(_date = new Date())
		{
			return _date.years;
		}});

		Object.defineProperty(Date.prototype, 'years', { get: function()
		{
			return (this.getFullYear() + this.year);
		}});

		Object.defineProperty(Date, 'year', { value: function(_date = new Date())
		{
			return _date.year;
		}});

		Object.defineProperty(Date.prototype, 'year', { get: function()
		{
			return ((this.months - 1) / 12);
		}});

		Object.defineProperty(Date, 'months', { value: function(_date = new Date())
		{
			return _date.months;
		}});

		Object.defineProperty(Date.prototype, 'months', { get: function()
		{
			return (this.getMonth() + 1 + this.month);
		}});

		Object.defineProperty(Date, 'month', { value: function(_date = new Date())
		{
			return _date.month;
		}});

		Object.defineProperty(Date.prototype, 'month', { get: function()
		{
			return (this.days / (this.daysInMonth + 1));
		}});

		Object.defineProperty(Date, 'days', { value: function(_date = new Date())
		{
			return _date.days;
		}});

		Object.defineProperty(Date.prototype, 'days', { get: function()
		{
			return (this.getDate() - 1 + this.day);
		}});

		Object.defineProperty(Date, 'day', { value: function(_date = new Date())
		{
			return _date.day;
		}});

		Object.defineProperty(Date.prototype, 'day', { get: function()
		{
			return (this.hours / 24);
		}});

		Object.defineProperty(Date, 'hours', { value: function(_date = new Date())
		{
			return _date.hours;
		}});

		Object.defineProperty(Date.prototype, 'hours', { get: function()
		{
			return (this.getHours() + this.hour);
		}});

		Object.defineProperty(Date, 'hour', { value: function(_date = new Date())
		{
			return _date.hour;
		}});

		Object.defineProperty(Date.prototype, 'hour', { get: function()
		{
			return (this.minutes / 60);
		}});

		Object.defineProperty(Date, 'minutes', { value: function(_date = new Date())
		{
			return _date.minutes;
		}});

		Object.defineProperty(Date.prototype, 'minutes', { get: function()
		{
			return (this.getMinutes() + this.minute);
		}});

		Object.defineProperty(Date, 'minute', { value: function(_date = new Date())
		{
			return _date.minute;
		}});

		Object.defineProperty(Date.prototype, 'minute', { get: function()
		{
			return (this.seconds / 60);
		}});

		Object.defineProperty(Date, 'seconds', { value: function(_date = new Date())
		{
			return _date.seconds;
		}});

		Object.defineProperty(Date.prototype, 'seconds', { get: function()
		{
			return (this.getSeconds() + this.second);
		}});

		Object.defineProperty(Date, 'second', { value: function(_date = new Date())
		{
			return _date.second;
		}});

		Object.defineProperty(Date.prototype, 'second', { get: function()
		{
			return (this.getMilliseconds() / 1000);
		}});

		Object.defineProperty(Date, 'milliseconds', { value: function(_date = new Date())
		{
			return _date.milliseconds;
		}});

		Object.defineProperty(Date.prototype, 'milliseconds', { get: function()
		{
			return this.getTime();
		}});

		Object.defineProperty(Date, 'millisecond', { value: function(_date = new Date())
		{
			return _date.millisecond;
		}});

		Object.defineProperty(Date.prototype, 'millisecond', { get: function()
		{
			return (this.getTime() % 1000);
		}});

		//
		Object.defineProperty(Date, 'modifiers', { get: function()
		{
			const modifiers = Object.keys(Date.format).sort(true);
			const result = [];

			for(var i = 0, j = 0; i < modifiers.length; i++)
			{
				if(modifiers[i].length === 1)
				{
					result[j++] = modifiers[i];
				}
			}

			return result;
		}});

		Object.defineProperty(Date.prototype, 'format', { value: function(_format = DATE)
		{
			if(typeof _format !== 'string')
			{
				return x('Invalid date _format string (not a String)');
			}
			else if(_format.length === 0)
			{
				return '';
			}

			//
			const formats = Date.modifiers;
			var result = '';

			for(var i = 0; i < _format.length; i++)
			{
				if(_format[i] === '\\')
				{
					if(i < (_format.length - 1) && _format[i + 1] === '%')
					{
						result += '%';
						i++;
					}
					else
					{
						result += '\\';
					}
				}
				else if(_format[i] === '%')
				{
					if(i < (_format.length - 1))
					{
						const f = _format[i + 1];

						if(formats.indexOf(f) > -1)
						{
							result += Date.format[f](this);
							i++;
						}
						else
						{
							result += '%';
						}
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

		Object.defineProperty(Date, 'format', { value: function(_format = DATE, _date = new Date())
		{
			try
			{
				return _date.format(_format);
			}
			catch(_error)
			{
				throw new Error('Invalid _date argument');
			}
			
			return null;
		}});

		Date.format['D'] = function(_date = new Date())
		{
			return Date.dayInYear(_date).toString();
		}

		Date.format['y'] = function(_date = new Date())
		{
			return _date.getFullYear().toString();
		}

		Date.format['m'] = function(_date = new Date())
		{
			return (_date.getMonth() + 1).toString().padLeft(2, '0');
		}

		Date.format['d'] = function(_date = new Date())
		{
			return _date.getDate().toString().padLeft(2, '0');
		}

		Date.format['k'] = function(_date = new Date())
		{
			return Date.weekInYear(_date).toString();
		}

		Date.format['H'] = function(_date = new Date())
		{
			return _date.getHours().toString().padLeft(2, '0');
		}

		Date.format['h'] = function(_date = new Date())
		{
			var twelve = _date.getHours() % 12;

			if(twelve === 0)
			{
				twelve = 12;
			}

			return twelve.toString().padLeft(2, '0');
		}

		Date.format['M'] = function(_date = new Date())
		{
			return _date.getMinutes().toString().padLeft(2, '0');
		}

		Date.format['S'] = function(_date = new Date())
		{
			return _date.getSeconds().toString().padLeft(2, '0');
		}

		Date.format['s'] = function(_date = new Date())
		{
			return _date.getMilliseconds().toString().padLeft(3, '0');
		}

		Date.format['X'] = function(_date = new Date())
		{
			return Math.round(_date.getTime() / 1000).toString();
		}

		Date.format['x'] = function(_date = new Date())
		{
			return _date.getTime().toString();
		}

		Date.format['t'] = function(_date = new Date())
		{
			if(_date.getHours() < 12)
			{
				return 'am';
			}
			else
			{
				return 'pm';
			}
		}

		Date.format['T'] = function(_date = new Date())
		{
			if(_date.getHours() < 12)
			{
				return 'AM';
			}
			else
			{
				return 'PM';
			}
		}

		Date.format['N'] = function(_date = new Date())
		{
			return Date.MONTH(_date, false);
		}

		Date.format['n'] = function(_date = new Date())
		{
			return Date.MONTH(_date, true);
		}

		Date.format['W'] = function(_date = new Date())
		{
			return Date.WEEKDAY(_date, false);
		}

		Date.format['w'] = function(_date = new Date())
		{
			return Date.WEEKDAY(_date, true);
		}

		//
		/*
		Object.defineProperty(Date, 'diff', { value: function(_current, _previous, _absolute = false)
		{
			if(typeof _round !== 'number')
			{
				_round = 0;
			}

			if(Date.isDate(_current))
			{
				_current = _current.getTime();
			}
			else if(! Number.isInt(_current))
			{
				return x('Invalid _current argument');
			}

			if(Date.isDate(_previous))
			{
				_previous = _previous.getTime();
			}
			else if(! Number.isInt(_previous))
			{
				return x('Invalid _previous argument');
			}
		
			//
			const units = Object.keys(Date.diff.units);
			const diff = (_current - _previous);
			const absolute = {};
			const relative = {};

			//
			var rest = diff;
			var sum = 1;

			for(var i = 0; i < units.length; i++)
			{
				const unit = units[i];
				const mul = Date.diff.units[unit];

				if(i < (units.length - 1))
				{
					relative[unit] = (rest % mul);
				}
				else
				{
					relative[unit] = rest;
				}

				rest /= mul;

				if(rest >= 1)
				{
					absolute[unit] = (diff / sum);
				}
				else
				{
					break;
				}

				sum *= mul;
			}

			if(_absolute)
			{
				return absolute;
			}

			return relative;
		}});

		Date.diff.units = { millisecond: 1000, second: 60, minute: 60, hour: 24, day: 1 };

		Date.diff.toString = function(_diff, _styles = false, _radix = 10, _show_radix = true, _chars = 0, _suffix = 's', _map, _remove = true, _space = (BROWSER ? false : true), _delim = true)
		{
			//
			const NULL = '0';

			//
			if(! Object.isObject(_diff))
			{
				return x('Invalid _diff argument (please call \'Date.diff()\' before)');
			}
			else
			{
				_diff = Date.diff.toObject(_diff.clone(), _styles, _radix, _chars, _suffix, _map, _remove);
			}

			//
			if(_space === true)
			{
				_space = ' ';
			}
			else if(typeof _space === 'number')
			{
				_space = space(_space);
			}
			else if(typeof _space !== 'string')
			{
				_space = (BROWSER ? '' : ' ');
			}
			
			if(_delim === false)
			{
				_delim = '';
			}
			else if(_delim === true || typeof _delim !== 'string')
			{
				_delim = ', ';
			}

			//		
			var result = '';
			
			for(var idx in _diff)
			{
				result += (_diff[idx].value + _space + _diff[idx].key) + _delim;
			}

			result = result.removeLast(_delim.length);

			if(_show_radix)
			{
				_show_radix = ('(' + _radix.toString() + ')');

				if(BROWSER)
				{
					_show_radix = '<span style="font-size: 105%;">' + _show_radix + '</span>';
				}

				result += (' ' + _show_radix);
			}

			//
			return result;
		}
		
		Date.diff.toHTML = function(_diff, _radix = 10, _suffix = 's', _map, _remove = false, _header)
		{
			if(! Object.isObject(_diff))
			{
				return x('No valid object specified');
			}
			else
			{
				_diff = Date.diff.toObject(_diff.clone(), true, _radix, 0, _suffix, _map, _remove);
			}
			
			//
			var result = '<table style="display: inline; width: 150px;">';

			if(typeof _header === 'string')
			{
				result += '<tr><td colspan="2" style="height: 40px; vertical-align: top; text-align: center; padding: 2px; width: 150px;">' + _header + '</td></tr>';
			}
			
			for(var idx in _diff)
			{
				result += '<tr><td style="text-align: right; padding: 2px; width: 75px;">' + _diff[idx].value + '</td>'
					+ '<td style="text-align: left; padding: 2px; vertical-align: middle; width: 75px;">' + _diff[idx].key + '</td></tr>';
			}
			
			return (result + '</table>');
		}

		// _suffix = 'en' in german, e.g. ..
		Date.diff.toObject = function(_object, _styles = true, _radix = 10, _chars = 0, _suffix = 's', _map, _remove = true)
		{
			if(! Object.isObject(_object))
			{
				return x('No valid object specified');
			}
			else
			{
				_object = _object.clone();
			}

			if(typeof _styles !== 'boolean')
			{
				_styles = true;
			}

			if(typeof _radix !== 'number' && typeof _radix !== 'string')
			{
				_radix = 10;
			}

			if(typeof _show_radix !== 'boolean')
			{
				_show_radix = true;
			}

			if(typeof _chars !== 'number')
			{
				_chars = 0;
			}

			if(typeof _suffix !== 'string')
			{
				_suffix = 's';
			}

			if(! Object.isObject(_map))
			{
				_map = {};
			}

			if(typeof _remove !== 'boolean')
			{
				_remove = true;
			}

			for(var idx in Date.diff.units)
			{
				if(typeof _map[idx] !== 'string')
				{
					_map[idx] = idx;
				}
			}

			//
			if(_remove)
			{
				var lastUnit = null;
				const units = Object.keys(Date.diff.units).reverse();

				for(var i = 0; i < units.length; i++)
				{
					if(typeof _map[units[i]] === 'string' && _map[units[i]].length === 0)
					{
						delete _object[units[i]];

						units.splice(i--, 1);
						continue;
					}

					if(_object[units[i]] === 0)
					{
						lastUnit = units[i];
						delete _object[units[i]];

						units.splice(i--, 1);
					}
					else
					{
						break;
					}
				}

				if(units.length === 0)
				{
					if(lastUnit)
					{
						_object[lastUnit] = 0;
					}
					else
					{
						_object.millisecond = 0;
					}
				}
			}

			//
			const result = {};
			var key, value;

			const units = Object.keys(_object).reverse();

			for(var i = 0; i < units.length; i++)
			{
				//
				const idx = units[i];

				//
				if(! (idx in Date.diff.units))
				{
					delete _object[idx];
					continue;
				}
				else if(idx in _map)
				{
					if(_map[idx].length === 0)
					{
						delete _object[idx];
						continue;
					}
					else
					{
						key = _map[idx];
					}
				}
				else
				{
					key = idx;
				}

				//
				value = _object[idx].toString(_radix);

				//
				if(_chars === 0)
				{
					if(value !== '1')
					{
						key += _suffix;
					}
				}
				else if(_chars > 0)
				{
					key = key.substr(0, _chars);
				}

				//
				if(_styles)
				{
					key = key.high;
					value = value.info;
				}

				if(BROWSER)
				{
					value = '<span style="font-size: 120%;">' + value + '</span>';
		t-size: 90%;">' + key + '</span>';
				}

				//
				result[idx] = { key, value };
			}

			//
			return result;
		}

		Object.defineProperty(Date.prototype, 'diff', { value: function(_previous)
		{
			if(Number.isInt(_previous)) return Date.diff(this.getTime(), _previous);
			else if(Date.isDate(_previous)) return Date.diff(this.getTime(), _previous.getTime());
		}});*/


		//
		Object.defineProperty(Date, 'units', { get: function()
		{
			return Math.time.units.clone();
		}});

		//
		Object.defineProperty(Date, 'age', { value: function(_year, _month, _day, _hour, _minute, _second, _millisecond)
		{
			if(typeof _month === 'number')
			{
				_month--;
			}

			const result = Object.create(null);

			const now = new Date();
			const bday = new Date(... arguments);
			var rest = false, oldRest = false;
			var diff;

			for(var i = 0; i < Date.age.units.length; i++)
			{
				const [ unit, base ] = Date.age.units[i];
				diff = (now[unit] - bday[unit]);

				/*if(diff < 0 && base !== 1)
				{
					diff = (base + diff);
				}*/

				result[unit] = diff;
			}

			return result;
		}});

		Date.age.units = [
			[ 'years', 1 ],
			[ 'months', 12 ],
			[ 'days', 1 ],
			[ 'hours', 24 ],
			[ 'minutes', 60 ],
			[ 'seconds', 60 ]
		];

		//

	})();

	//
	(function()
	{

		//
		const DEFAULT_FORMAT = ('DEFAULT' || 'BEST'); // see also 'config.css' @ '--date'! :)~

		//
		function getDateFormat(_format = 'DEFAULT')
		{
			if(typeof date[_format.toUpperCase()] === 'string')
			{
				return date[_format.toUpperCase()];
			}

			return _format;
		}

		//
		date = Date.date = function(_which = date.FORMAT, _date = new Date())
		{
			if(typeof _which !== 'string')
			{
				return x('Invalid date _format string (not a String)');
			}
			else if(Number.isInt(_date))
			{
				_date = new Date(_date);
			}
			else if(! Date.isDate(_date))
			{
				_date = new Date();
			}

			return _date.format(getDateFormat(_which));
		}

		//
		Object.defineProperty(date, 'FORMAT', { get: function()
		{
			if(typeof DATE === 'string' && DATE.length > 0)
			{
				return DATE;
			}

			return DEFAULT_FORMAT;
		}});

		//
		date.NOW = '%H:%M:%S.%s';
		date.TIME = '%H:%M:%S';
		date.DATE = '%y-%m-%d';
		date.DEFAULT = '%y-%m-%d (%H:%M:%S)';
		date.BEST = '%y-%m-%d (%H:%M:%S.%s)';
		date.CONSOLE = '%y-%m-%d %H:%M:%S.%s';
		date.FULL = '%W, %y-%m-%d (%H:%M:%S)';
		date.TEXT = '%W, %d. %N %y (%H:%M:%S)';
		date.FULLTEXT = '%W, %d. %N %y (%H:%M:%S.%s)';
		date.YEAR = '%D (%w)';
		date.MS = '%x';
		date.UNIX = '%X';
		//date.GMT = true;

		//
		Object.defineProperty(date, 'formats', { get: function()
		{
			const keys = Object.keys(date);
			const result = [];

			for(var i = 0, j = 0; i < keys.length; i++)
			{
				const key = keys[i];

				if(! key.isUpperCase)
				{
					continue;
				}

				result[j++] = key.toLowerCase();
			}

			return result;
		}});

		//
		(function()
		{
			const formats = date.formats;

			for(var i = 0; i < formats.length; i++)
			{
				const key = formats[i];

				date[key] = function(_date = new Date())
				{
					return Date.format(date[key.toUpperCase()], _date);
				}
			}

			date['gmt'] = function(_date = new Date())
			{
				return _date.toGMT();
			}
		})();

		//
		
	})();

	//
	
})();

module.exports = Date;

