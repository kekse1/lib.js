//
(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_CHECK_DEEP = true;//!??

	//
	const DEFAULT_COMPLETION = true;
	const DEFAULT_LEVENSHTEIN = true;

	const DEFAULT_COMPLETION_FG = '#888';
	const DEFAULT_COMPLETION_BG = null;

	const DEFAULT_CLEAR = true;
	const DEFAULT_WIDTH = null;
	const DEFAULT_HEIGHT = null;
	const DEFAULT_X = null;
	const DEFAULT_Y = null;
	const DEFAULT_FG = '#ccc';
	const DEFAULT_BG = '#333';
	const DEFAULT_BORDER = '#888';
	const DEFAULT_FG_INPUT = '#000';
	const DEFAULT_BG_INPUT = '#fff';
	const DEFAULT_CENTER = true;
	const DEFAULT_PLAIN = true;

	const DEFAULT_HELP_FG = '#58a';
	const DEFAULT_HELP_BG = null;

	//
	const DEFAULT_RADIX = 10;
	const DEFAULT_ASTERISK = '*';
	const DEFAULT_CONCEAL = false;

	const DEFAULT_STEP = 1;
	const DEFAULT_STEP_BIG = 10;

	//

	//
	prompt = module.exports = EVENT.create();

	//
	if(typeof ansi === 'undefined')
	{
		require('tty/ansi');
	}

	if(typeof raw === 'undefined')
	{
		require('tty/raw/');
	}

	//
	//TODO/bedenke, dass alle items sowohl "name" als auch min. "value" haben...
	//wir sammeln alle "name" (mit check if defined multiple times (-> BAD!)) im result-object...
	//
	prompt.prompts = prompts = function(_vector_item, _throw = DEFAULT_THROW, _disable = true)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _disable !== 'boolean')
		{
			_disable = true;
		}

		if((_vector = prompt.checkVector(_vector, _throw)).length === 0 || _vector === null)
		{
			return null;
		}
		else if(! rawMode.enabled)
		{
			rawMode.enable(false);
		}

		const result = new Array(_vector.length);

		for(var i = 0; i < _vector.length; ++i)
		{
			result[i] = prompt.render(_vector[i], _vector, i);
			result[_vector[i].name] = result[i];
		}

		if(_disable)
		{
			rawMode.disable();
		}

		return result;
	}

	//
	const DEBUG = true;
	const rawEvents = {};

	rawEvents.resize = function(_size, _sequence, _stream)
	{
		if(DEBUG)
		{
			dir(_size, 'raw -> resize');
		}

		prompt.emit('resize', _size, _sequence, _stream);
	}

	rawEvents.key = function(_key, _sequence, _stream)
	{
		if(DEBUG)
		{
			dir(_key, 'raw -> key');
		}

		prompt.emit('key', _key, _sequence, _stream);
	}

	function rawMode(_disable = false)
	{
		if(rawMode.enabled || _disable)
		{
			//
			const result = RAW.disable({
				screen: (rawMode.screen !== null),
				key: (rawMode.key !== null),
				mouse: false
			}, true);

			//
			rawMode.screen = null;
			rawMode.key = null;

			//
			for(const idx in rawMode.events)
			{
				if(rawMode.events[idx] !== null)
				{
					RAW.off(rawMode.events[idx]);
				}

				rawMode.events[idx] = null;
			}

			//
			return result;
		}

		const result = RAW.enable({
			screen: (rawMode.screen === null),
			key: (rawMode.key === null),
			mouse: false
		});

		rawMode.assign(result);

		if(rawMode.screen && rawMode.events.resize === null)
		{
			rawMode.events.resize = RAW.on('resize', rawEvents.resize);
		}

		if(rawMode.key && rawMode.events.key === null)
		{
			rawMode.events.key = RAW.on('key', rawEvents.key);
		}

		return result;
	}

	rawMode.disable = function()
	{
		return rawMode(true);
	}

	rawMode.enable = function(_disable = false)
	{
		if(rawMode.enabled)
		{
			if(_disable)
			{
				rawMode(true);
			}
			else
			{
				return false;
			}
		}

		rawMode();
		return true;
	}

	rawMode.status = function()
	{
		return rawMode.allEnabled;
	}

	rawMode.screen = null;
	rawMode.key = null;

	rawMode.events = { resize: null, key: null };

	Object.defineProperty(rawMode, 'enabled', { get: function()
	{
		return (rawMode.screen !== null || rawMode.key !== null);
	}});

	Object.defineProperty(rawMode, 'allEnabled', { get: function()
	{
		return (rawMode.screen !== null && rawMode.key !== null);
	}});

	Object.defineProperty(rawMode, 'types', { get: function()
	{
		return Object.null({
			screen: rawMode.screen,
			key: rawMode.key
		});
	}});

	//
	prompt.render = function(_item, _vector, _index, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(! rawMode.enabled)
		{
			if(_throw)
			{
				return x('RAW mode is not yet enabled');
			}

			return null;
		}

		//
		if(! String.isString(_item.type))
		{
			return x('Invalid %.% (expecting a non-empty %, but we got \'%\')', null, '_item', 'type', 'String', Object.typeOf(_item.type));
		}

		const func = prompt.render[_item.type];
		const events = Object.create(null);

		if(typeof func !== 'function')
		{
			return x('Invalid %[%]: no %.%[%] function found)', null, '_item', 'type', 'prompt', 'render', _item.type.highBG);
		}

		const on = () => {
			if(! events.resize) events.resize = prompt.on('resize', (_size, _stream) => {
				return func(_item, _vector, _index, 'resize', _size, _stream);
			});

			if(! events.key) events.key = prompt.on('key', (_key, _stream) => {
				return func(_item, _vector, _index, 'key', _key, _stream);
			});
		};

		const off = () => {
			var res = 0;

			for(const idx in events)
			{
				if(events[idx])
				{
					prompt.off(events[idx]);
					++res;
				}

				events[idx] = null;
			}

			return res;
		};

		const has = () => {
			return rawMode.status();
		};

		//
		if(! has)
		{
			rawMode.enable();
		}

		//
		const result = func(_item, _vector, _index, null, null, null);

		//
		emit.render(_item, _vector, _index, result);

		//
		return result;
	}

	prompt.render.string = function(_item, _vector, _index, _event = null, _param, _streams)
	{
		//
		var result = '(string)';

		//

		//
		return result;
	}

	prompt.render.path = function(_item, _vector, _index, _event = null, _param, _streams)
	{
		//
		var result = '(path)';

		//

		//
		return result;
	}

	prompt.render.number = function(_item, _vector, _index, _event = null, _param, _streams)
	{
		//
		var result = '(number)';

		//

		//
		return result;
	}

	prompt.render.map = function(_item, _vector, _index, _event = null, _param, _streams)
	{
		//
		var result = '(map)';

		//

		//
		return result;
	}

	prompt.render.range = function(_item, _vector, _index, _event = null, _param, _streams)
	{
		//
		var result = '(range)';

		//

		//
		return result;
	}

	prompt.render.password = function(_item, _vector, _index, _event = null, _param, _streams)
	{
		//
		var result = '(password)';

		//

		//
		return result;
	}

	prompt.render.confirm = function(_item, _vector, _index, _event = null, _param, _streams)
	{
		//
		var result = '(confirm)';

		//

		//
		return result;
	}

	prompt.render.date = function(_item, _vector, _index, _event = null, _param, _streams)
	{
		//
		var result = '(date)';

		//

		//
		return result;
	}

	//
	const emit = {};

	function getEventParameter(_type, _item, _vector, _index, _params)
	{
		const result = {};

		result.type = _type;
		result.item = { ... _item };
		result.defined = [];

		for(const idx in _item)
		{
			if(typeof result.item[idx] !== 'undefined')
			{
				result.defined.push(idx);
			}
		}

		result.count = _vector.length;

		if(Number.isInt(_index))
		{
			result.index = _index;
		}
		else
		{
			result.index = null;
		}

		result.vector = [ ... _vector ];

		if(arguments.length > 4)
		{
			result.params = _params;
		}
		else
		{
			result.params = null;
		}

		//
		return result;
	}

	emit.enter = function(_item, _vector, _index, _params)
	{
		const event = getEventParameter('enter', _item, _vector, _index, _params);

		if(typeof _item.event.enter === 'function')
		{
			_item.event.enter(event);
		}

		prompt.emit('enter', event);
		emit.ready(_item, _vector, _index, _params);
	}

	emit.cancel = function(_item, _vector, _index, _params)
	{
		const event = getEventParameter('cancel', _item, _vector, _index, _params);

		if(typeof _item.event.cancel === 'function')
		{
			_item.event.cancel(event);
		}

		prompt.emit('cancel', event);
		emit.ready(_item, _vector, _index, _params);
	}

	emit.update = function(_item, _vector, _index, _params)
	{
		const event = getEventParameter('update', _item, _vector, _index, _params);

		if(typeof _item.event.update === 'function')
		{
			_item.event.update(event);
		}

		prompt.emit('update', event);
	}

	emit.render = function(_item, _vector, _index, _params)
	{
		const event = getEventParameter('render', _item, _vector, _index, _params);

		if(typeof _item.event.render === 'function')
		{
			_item.event.render(event);
		}

		prompt.emit('render', event);
	}

	emit.ready = function(_item, _vector, _index, _params)
	{
		const event = getEventParameter('ready', _item, _vector, _index, _params);

		if(typeof _item.event.ready === 'function')
		{
			_item.event.ready(event);
		}

		prompt.emit('ready', event);
	}

	emit.completion = function(_item, _vector, _index, _params)
	{
		const event = getEventParameter('completion', _item, _vector, _index, _params);

		if(typeof _item.event.completion === 'function')
		{
			_item.event.completion(event);
		}

		prompt.emit('completion', event);
	}

	//
	Object.defineProperty(prompt, 'types', { get: function()
	{
		return [
			'string',
			'path',
			'number',
			'map',
			'range',
			'password',
			'confirm',
			'date'
		].sort(true);
	}})

	Object.defineProperty(prompt, 'keys', { get: function()
	{
		//
		const remove = (_item, ... _keys) => {
			if(! Object.isObject(_item))
			{
				return x('Invalid % argument (expecting an %)', null, '_item', 'Object');
			}
			else if(_keys.length === 0)
			{
				return x('Missing % arguments (expecting non-empty %s)', null, '..._keys', 'String');
			}
			else for(var i = 0; i < _keys.length; ++i)
			{
				if(! String.isString(_keys[i]))
				{
					return x('Invalid %[%] argument (not a non-empty %)', null, '..._keys', i, 'String');
				}
			}

			const result = Object.create(null);

			for(const k of _keys)
			{
				if(k in _item)
				{
					result[k] = _item[k];
					delete _item[k];
				}
			}

			return result;
		};

		//
		const result = Object.create(null);
		const types = prompt.types;

		for(const t of types)
		{
			//
			result[t] = Object.create(null);

			//
			result[t]['name'] = Object.null({ typeOf: ['String'], optional: false });
			result[t]['type'] = Object.null({ typeOf: ['String'], optional: false });
			result[t]['value'] = Object.null({ typeOf: [], optional: false });
			result[t]['text'] = Object.null({ typeOf: ['String','Array'], optional: false });//array for 'printf()'-styles!! ;-)
			result[t]['help'] = Object.null({ typeOf: ['String','Array'], optional: true, default: '' });
			result[t]['helpFG'] = Object.null({ typeOf: ['String','Boolean','Null'], optional: true, default: DEFAULT_HELP_FG });
			result[t]['helpBG'] = Object.null({ typeOf: ['String','Boolean','Null'], optional: true, default: DEFAULT_HELP_BG });
			result[t]['event'] = Object.null({ typeOf: ['Object','Function','Null'], optional: true, default: null, keys: prompt.eventKeys });//"KEYS"!!
			result[t]['check'] = Object.null({ typeOf: ['Function','RegExp','Null'], optional: true, default: null });
			result[t]['clear'] = Object.null({ typeOf: ['Boolean'], optional: true, default: DEFAULT_CLEAR });
			result[t]['width'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: DEFAULT_WIDTH });
			result[t]['height'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: DEFAULT_HEIGHT });
			result[t]['x'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: DEFAULT_X });
			result[t]['y'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: DEFAULT_Y });
			result[t]['fg'] = Object.null({ typeOf: ['String','Boolean','Null'], optional: true, default: DEFAULT_FG });
			result[t]['bg'] = Object.null({ typeOf: ['String','Boolean','Null'], optional: true, default: DEFAULT_BG });
			result[t]['border'] = Object.null({ typeOf: ['String','Boolean','Null'], optional: true, default: DEFAULT_BORDER });
			result[t]['inputFG'] = Object.null({ typeOf: ['String','Boolean','Null'], optional: true, default: DEFAULT_FG_INPUT });
			result[t]['inputBG'] = Object.null({ typeOf: ['String','Boolean','Null'], optional: true, default: DEFAULT_BG_INPUT });
			result[t]['center'] = Object.null({ typeOf: ['Boolean'], optional: true, default: DEFAULT_CENTER });
			result[t]['plain'] = Object.null({ typeOf: ['Boolean'], optional: true, default: DEFAULT_PLAIN });
		}

		//
		remove(result.string, 'value');

		result.string['value'] = Object.null({ typeOf: ['String','Array'], optional: true, default: '' });
		result.string['max'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: null });
		result.string['min'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: null });
		result.string['include'] = Object.null({ typeOf: ['String','Array','Null'], optional: true, default: null });//'alphabet'.. ARRAY can ALSO(!) contain code-points bzw. char-codes.. and multi-char-strings! ;-)
		result.string['exclude'] = Object.null({ typeOf: ['String','Array','Null'], optional: true, default: null });
		result.string['levenshtein'] = Object.null({ typeOf: ['Boolean'], optional: true, default: DEFAULT_LEVENSHTEIN });
		result.string['completion'] = Object.null({ typeOf: ['Array','Null'], optional: true, default: DEFAULT_COMPLETION });
		result.string['completionFG'] = Object.null({ typeOf: ['String','Null'], optional: true, default: DEFAULT_COMPLETION_FG });
		result.string['completionBG'] = Object.null({ typeOf: ['String','Null'], optional: true, default: DEFAULT_COMPLETION_BG });
		result.string['list'] = Object.null({ typeOf: ['Array','Null'], optional: true, default: null, keys: prompt.itemKeys });
		result.string['multiple'] = Object.null({ typeof: ['Boolean'], optional: true, default: false });

		//
		remove(result.path, 'value');

		result.path['value'] = Object.null({ typeOf: ['String','Array'], optional: true, default: path.sep });
		result.path['completion'] = Object.null({ typeOf: ['Boolean','Array','String'], optional: true, default: DEFAULT_COMPLETION });//boolean allgemein, 'String' and 'Array' for specific types ['file','symlink','directory'];
		result.path['completionFG'] = Object.null({ typeOf: ['String','Null'], optional: true, default: DEFAULT_COMPLETION_FG });
		result.path['completionBG'] = Object.null({ typeOf: ['String','Null'], optional: true, default: DEFAULT_COMPLETION_BG });
		result.path['list'] = Object.null({ typeOf: ['Array','Null'], optional: true, default: null, keys: prompt.itemKeys });
		result.path['multiple'] = Object.null({ typeOf: ['Boolean','Null'], optional: true, default: null });//null is if not a .list

		//
		remove(result.number, 'value');

		result.number['value'] = Object.null({ typeOf: ['Number','Array'], optional: true, default: 0 });
		result.number['radix'] = Object.null({ typeOf: ['Number','String'], optional: false, default: DEFAULT_RADIX });
		result.number['step'] = Object.null({ typeOf: ['Number'], optional: false, default: DEFAULT_STEP });
		result.number['bigStep'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: DEFAULT_STEP_BIG })//'step' vs 'bigStep' @ <up/down> vs. <left/right> cursor keys... ;-)
		result.number['min'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: null });
		result.number['max'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: null });
		result.number['include'] = Object.null({ typeOf: ['Number','Array','Null'], optional: true, default: null });
		result.number['exclude'] = Object.null({ typeOf: ['Number','Array','Null'], optional: true, default: null });
		result.number['list'] = Object.null({ typeOf: ['Array','Null'], optional: true, default: null, keys: prompt.itemKeys });
		result.number['multiple'] = Object.null({ typeOf: ['Boolean','Null'], optional: true, default: null });//null is if not a .list

		//
		remove(result.map, 'value');

		//result.map['value'] = Object.null({ typeOf: ['Number','Array','Null'], optional: true, default: null });
		result.map['multiple'] = Object.null({ typeOf: ['Boolean','Number','Array'], optional: true });
		result.map['dimensions'] = Object.null({ typeOf: ['Array','Number'], optional: false });
		result.map['array'] = Object.null({ typeOf: ['Array','TypedArray'], optional: false });
		//result.map['list'] = Object.null({ typeOf: ['Array'], optional: false, keys: prompt.itemKeys });

		//
		remove(result.range, 'value');

		result.range['value'] = Object.null({ typeOf: ['Number'], optional: false });
		result.range['min'] = Object.null({ typeOf: ['Number'], optional: false });
		result.range['max'] = Object.null({ typeOf: ['Number'], optional: false });
		result.range['step'] = Object.null({ typeOf: ['Number'], optional: false, default: DEFAULT_STEP });
		result.range['bigStep'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: DEFAULT_STEP_BIG });
		result.range['include'] = Object.null({ typeOf: ['Number','Array','Null'], optional: true, default: null });
		result.range['exclude'] = Object.null({ typeOf: ['Number','Array','Null'], optional: true, default: null });

		//
		remove(result.password, 'value');

		result.password['value'] = Object.null({ typeOf: ['String'], optional: true });
		result.password['asterisk'] = Object.null({ typeOf: ['String','Null'], optional: false, default: DEFAULT_ASTERISK });
		result.password['conceal'] = Object.null({ typeOf: ['Boolean'], optional: true, default: DEFAULT_CONCEAL });
		result.password['min'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: null });
		result.password['max'] = Object.null({ typeOf: ['Number','Null'], optional: true, default: null });
		result.password['none'] = Object.null({ typeOf: ['Boolean'], optional: true, default: false });
		result.password['required'] = Object.null({ typeOf: ['Object','Array','Null'], optional: true, default: null });

		//
		remove(result.confirm, 'value');

		result.confirm['value'] = Object.null({ typeOf: ['Number'], optional: false, default: 0 });
		result.confirm['list'] = Object.null({ typeOf: ['Array'], optional: false, keys: prompt.itemKeys });

		//
		remove(result.date, 'value');

		result.date['value'] = Object.null({ typeOf: ['Date','Number'], optional: true, default: new Date() });
		result.date['format'] = Object.null({ typeOf: ['String'], optional: false });

		//
		//TODO/!???
		//

		//
		return result;
	}})

	prompt.date = date;

	Object.defineProperty(prompt.date, 'getFormat', { value: function(_which)
	{
		if(! String.isString(_which))
		{
			return x('Invalid % argument (expecting a non-empty %)', null, '_which', 'String');
		}

		const array = [];
		var format;
		var data;

		if(typeof date[_which.toUpperCase()] === 'string')
		{
			format = date[_which.toUpperCase()];
		}
		else
		{
			format = _which;
		}

		for(var i = 0, j = 0; i < format.length; ++i)
		{
			if(format[i] === '%')
			{
				if(data.length > 0)
				{
					array[j++] = data;
					data = '';
				}

				array[j++] = format[i] + format[++i];
			}
			else
			{
				data += format[i];
			}
		}

		if(data.length > 0)
		{
			array.push(data);
		}

		return array;
	}});

	Object.defineProperty(prompt.date, 'getTime', { value: function(_array_string, _date = new Date(), _join = false)
	{
		var array;

		if(String.isString(_array_string))
		{
			array = prompt.date.getFormat(_array_string);
		}
		else if(Array.isArray(_array_string))
		{
			array = [ ... _array_string ];
		}
		else
		{
			return x('Invalid % argument (expecting a non-empty % or a non-empty %)', null, '_array_string', 'Array', 'String')
		}

		if(Number.isInt(_date) && _date >= 0)
		{
			_date = new Date(_date);
		}
		else if(! Date.isDate(_date))
		{
			return x('Invalid % argument (expecting a % timestamp (%.%) or a % instance)', null, '_date', 'Integer', 'Date', 'getTime()'.bold, 'Date');
		}

		if(typeof _join !== 'boolean')
		{
			_join = false;
		}

		//hier wird das format-array (siehe 'getFormat()') durchlaufen, und die _date passenden values eingesetzt an stelle der '%*'..
		//
		//TODO/
		//.. bedenke weitere funktionen, um v.a. den (TYPE == date) mit ihrer 'mask' korrekt zu erfassen..!!
		//
	}});

	Object.defineProperty(prompt.date, 'getValue', { value: function(_modifier, _date = new Date(), _throw = DEFAULT_THROW)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(Number.isInt(_date) && _date >= 0)
		{
			_date = new Date(_date);
		}
		else if(! Date.isDate(_date))
		{
			return x('Invalid % argument (expecting an % timestamp or a % instance)', null, '_date', 'Integer', 'Date');
		}

		if(! String.isString(_modifier))
		{
			return x('Invalid % argument (expecting non-empty %)', null, '_modifier', 'String');
		}
		else if(_modifier[0] === '%')
		{
			_modifier = _modifier.removeFirst();
		}

		if(_modifier.length !== 1)
		{
			if(_throw)
			{
				return x('Your modifier \'%\' is invalid (limited to one character only)', null, _modifier);
			}

			return _modifier;
		}
		else if(! (_modifier in Date.format))
		{
			if(_throw)
			{
				return x('Unknown modifier \'%\'', null, _modifier);
			}

			return _modifier;
		}

		//
		//TODO/
		//.. bedenke weitere funktionen, um v.a. den (TYPE == date) mit ihrer 'mask' korrekt zu erfassen..!!
		//

		//
		return Date.format[_modifier](_date);
	}});

	Object.defineProperty(prompt, 'formats', { get: function()
	{
		return date.formats;
	}});

	Object.defineProperty(prompt, 'modifiers', { get: function()
	{
		return Date.modifiers;
	}});

	//
	Object.defineProperty(prompt, 'eventKeys', { get: function()
	{
		return [ 'render', 'enter', 'cancel', 'ready', 'update' ];
	}});

	Object.defineProperty(prompt, 'itemKeys', { get: function()
	{
		return Object.null({
			value: Object.null({ typeOf: [], optional: true, default: null }),
			enabled: Object.null({ typeOf: ['Boolean'], optional: true, default: true }),
			selectedFG: Object.null(),
			selectedBG: Object.null(),//wenn bereits selektirert
			activeFG: Object.null(),//wenn der zeiger hier ist
			activeBG: Object.null(),
			fg: Object.null(),//allgemeine text-color fuer jedes list-element
			bg: Object.null(),//allg. bg-color fuer alle list-items
			mark: Object.null(),//... bei NOT selected //e.g. char or unicode symbol.. or go further w/ another { keys: prompt.markKeys }, e.g..
			selectedMark: Object.null(),//unicode/char bei selected
			activeMark: Object.null(),//.. wenn der zeiger hier liegt
			plain: Object.null(),//reine text-form, ohne boxen,styles,colors..
			text: Object.null({ typeOf: ['String','Array'], optional: false }),//array for 'printf()'-styles!! ;-)
			help: Object.null({ typeOf: ['String','Array'], optional: true, default: '' }),
			helpFG: Object.null({ typeOf: ['String','Boolean','Null'], optional: true, default: DEFAULT_HELP_FG }),//hilfe-text-farbe
			helpBG: Object.null({ typeOf: ['String','Boolean','Null'], optional: true, default: DEFAULT_HELP_BG })//hilfe-bg-color
		});
	}});

	//
	prompt.checkVector = function(_vector, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		//TODO/not only to be checked whether all items w/ (optional == false) are set (and then and w/o it, also used 'default'),
		//	also ensure that all the 'name' attribs are not defined multiple times ACCROSS ONE VECTOR!!
		//TODO/...
		//
throw new Error('TODO');

		//
		const DEEP = false;

		if(! prompt.isValidVector(_vector, DEEP, _throw))
		{
			return null;
		}

		//
	}

	prompt.checkItem = function(_item, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
throw new Error('TODO');

		//
		const DEEP = false;

		if(! prompt.isValidItem(_item, DEEP, _throw))
		{
			return null;
		}

		//
	}

	prompt.checkItemList = function(_list, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
throw new Error('TODO');

		//
		if(! prompt.isValidItemList(_list, _throw))
		{
			return null;
		}

		//
	}

	prompt.checkItemListItem = function(_item, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
throw new Error('TODO');

		//
		if(! prompt.isValidItemListItem(_item, _throw))
		{
			return null;
		}

		//
	}

	//
	prompt.isValidVector = function(_vector, _deep = DEFAULT_CHECK_DEEP, _throw = DEFAULT_THROW)
	{
		//
		//_deep => will call 'prompt.isValidItem(_item, _deep = true)' (so _deep = true, THERE'll be called 'prompt.checkItemList()', too! ;-)
		if(typeof _deep !== 'boolean')
		{
			_deep = DEFAULT_CHECK_DEEP;
		}

		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(! Array.isArray(_vector, true))
		{
			if(_throw)
			{
				return x('Your % is not a real %, thus ' + 'not usable'.bold, null, '_vector', 'Array');
			}

			return false;
		}
		else if(_deep)
		{
			for(const i of _vector)
			{
				if(! prompt.isValidItem(i, _deep, _throw))
				{
					return false;
				}
			}
		}

		//
		//TODO/...!
		//

		//
		return true;
	}

	prompt.isValidItem = function(_item, _deep = DEFAULT_CHECK_DEEP, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _deep !== 'boolean')
		{
			_deep = DEFAULT_CHECK_DEEP;
		}

		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(! Object.isObject(_item))
		{
			if(_throw)
			{
				return x('Your % is not a real %, thus ' + 'not usable'.bold, null, '_item', 'Object');
			}

			return false;
		}
		else if(_deep && ('list' in _item))
		{
			if(! prompt.isValidItemList(_item.list, _deep, _throw))
			{
				return false;
			}
		}

		//
		//TODO/..!
		//

		//
		return true;
	}

	prompt.isValidItemList = function(_list, _deep = DEFAULT_CHECK_DEEP, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _deep !== 'boolean')
		{
			_deep = DEFAULT_CHECK_DEEP;
		}

		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(! Array.isArray(_list, true))
		{
			if(_throw)
			{
				return x('Your % is not a real %, thus ' + 'not usable'.bold, null, '_list', 'Array');
			}

			return false;
		}
		else if(_deep)
		{
			for(const i of _list)
			{
				if(! prompt.isValidItemListItem(i, _throw))
				{
					return false;
				}
			}
		}

		//
		//TODO/..
		//

		//
		return true;
	}

	prompt.isValidItemListItem = function(_item, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(! Object.isObject(_item))
		{
			if(_throw)
			{
				return x('Your % is not a real %, thus ' + 'not usable'.bold, null, '_item', 'Object');
			}

			return false;
		}

		//
		//TODO/..
		//

		//
		return true;
	}

	//

})();

/*

//
// < https://github.com/terkelg/prompts >
//



//
//todo/features...
//
// # MASSIV "EVENT"-NUTZUNG?!?!?!??!
// # ALLES SCHOEN MIT COLORS UND STYLES..!!! :-D
// # after some timeout changing ANYTHING should be possible... and on any change everything should can follow (callbacks, events, );..
// # choosing a stream... process.stdio[] vs. 'fs.create{Write,Read}Stream()' etc..!?
// # 'tty/raw/'!!!
// 	# screen: resizing...
// 	# key: WICHTIG!!! zur auswahl, etc..! (inkl. 'on.cancel' => ctrl+c, etc..)
//		# die jew. elemente (tasten, ..) am besten auch im prompt-vektor durch '.key{}' o.ae. items variabel halten..?!! ^_^
// # type=integer => bestimmte anzeigen je nach veraendertem wert (@ on.update z.b.);
// # on.enter() => z.b. umwandlung des string in ein uint8array moeglicherweise, ETC..
//	# ..allg. verifikation dabei, und je nachdem NICHT '.accept(), 'sondern '.reject()' (so dass erneute eingabe..); ETC.
// # type=number => neben regulaerer eingabe auch pfeil-tasten U.A./BSPW. moeglich... (w/ quick/fast/slow/ change??)
// # '.help' kann in jedem prompt-vector-item sein.. ein string, welcher eher versteckt als zusatz-hilfe angezeigt werden kann (grau zb),
//	# und - WIE JEDE OPTION EIGENTLICH - auch bei 'on.update()' etc. variabel ist... z.b. 'invalid mail address format', or 'two selections left', or 'you're to young', 'text/num is too high/long', ...
// # auto-completion feature evtl.. noch dazu.... wird wie die 'list' angezeigt... <tab> waehlt die korrektur, <enter> waehlt das ergebnis.. <escape> entfernt die wort-liste, etc. .. w/ '.limit' (max. woerter anzahl auf einmal..);
//	# in type=='string', waehrend folgendes:
// # (type == 'path') => ebenso *auto-completion* (by default!!), aber nur fuer existierende pfade.. ^_^
// # ALLERDINGS, NUR in 'string'-type wuerde ich 'util/levenshtein' nutzen.. dafuer aber endlich mal bitte. xD~



# prompt.checkList()
# prompt.checkMap()
# ...
# input-raw-key: alphabet vs. list-auto-fill und rest-list-chars... sowie type=='number' w/ numbers +'.' only.. etc. w/ pre-check zahl <> min/max... etc.
	.. somit: schreiben erst nach 'accept()' o.ae. bestaetigung..!! ;-)
# bedenke: item.{x,y} koennte gesetzt sein..(!) ^_^



//
//
// >> Pick a color:	// (this is the '.help')
//    Red	More infos..
//  [ Green ]	This is a description text
//    Blue	OPTIONAL this description..
//



// 'ready'-event o.ae.. ein globales also, neben den relativen der items..!!!
// .. damit ich u.a. 'off()' ausfuehre, etc..
// sprich, wenn eine eingabe 'enter' oder 'cancel' beendet wurde, dann werden
// zukuenftige basis-events hier nicht mehr 'render[...]()' o.ae. aufrufen!!!!


// unterschiede zwischen "RAW"-events sowie "PROMPT"-events..!!!!!!!!!! ^_^


// "const DEBUG = true;" .. GANZ WEG MACHEN @ raw-events... nur zum testen ATM... ^_^





// will ich das evtl mit "BOX"-styles verbinden? sprich, ansi-cursor und box-size, etc..!???







	ACHTUNG!

	type 'list' ist jetzt weg, damit wir aus string, number, min.. eigene listen machen koennen, falls es diese zur auswahl gibt

	das macht es moeglich, auch eine liste von nummern, etc... wo die 'list' bisher nur fuer strings galt. ;-)


		BEDENKE: eine liste kann entweder erst noch ENTSTEHEN/WACHSEN, ..
			ODER es liegt bereits eine menge an elementen vor, die wir nur "erfuellen" lassen muessten!!! xD~



*/
