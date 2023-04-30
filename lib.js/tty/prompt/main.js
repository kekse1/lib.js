(function()
{

	//
	const DEFAULT_THROW = true;

	// see more @ 'prompt.symbol(...)'! ^_^
	const DEFAULT_COLOR_ERROR = [ 'rgb(210, 45, 25)', false ];
	const DEFAULT_COLOR_SUCCESS = [ 'rgb(170, 230, 70)', false ];
	const DEFAULT_COLOR_QUESTION = [ 'rgb(30, 160, 210)', false ];

	//

	//
	if(typeof ansi === 'undefined')
	{
		require('tty/ansi');
	}

	if(typeof color === 'undefined')
	{
		require('utility/color');
	}

	if(typeof RAW === 'undefined')
	{
		require('tty/raw/');
	}

	//
	Prompt = module.exports = class Prompt extends NODE
	{
		constructor(_options)
		{
			super(_options);
		}

		static prompt(_vector, ... _args)
		{
			const result = this.create(_vector, ... _args);

			if(result === null)
			{
				return null;
			}
		}

		static create(_vector, ... _args)
		{
			const options = Object.assign({
				vector: (Array.isArray(_vector, false) ? _vector : [])
			}, ... arguments);

			for(var i = 0; i < arguments.length; ++i)
			{
				if(Array.isArray(arguments[i], false))
				{
					options.vector.concatUnique(arguments.splice(i--, 1)[0]);
				}
			}

			if(options.vector.length === 0)
			{
				return null;
			}
			else if((options.vector = Prompt.checkVector(... options.vector)).length === 0)
			{
				return null;
			}

			return new this(options);
		}

		get vector()
		{
			if(this.options.vector)
			{
				return this.options.vector;
			}

			return this.options.vector = [];
		}

		set vector(_value)
		{
			if(Array.isArray(_value, false))
			{
				return this.options.vector = Prompt.checkVector(... _value);
			}
			else
			{
				delete this.options.vector;
			}

			return this.vector;
		}

		static checkVector(... _items)
		{
			const result = [];

			if(_items.length === 0)
			{
				return result;
			}
			else for(var i = 0, j = 0; i < _items.length; ++i)
			{
				if(Prompt.isItem(_items[i]))
				{
					result[j++] = _items[i];
				}
			}

			return result;
		}

		static isItem(_item)
		{
			if(Object.isObject(_item))
			{
				return Prompt.isType(_item.type);
			}

			return null;
		}

		static isType(_type)
		{
			if(String.isString(_type))
			{
				_type = _type.toLowerCase();
				const t = Prompt.types;

				for(const type of t)
				{
					if(type.toLowerCase() === _type)
					{
						return true;
					}
				}

				return false;
			}

			return null;
		}

		static isEventType(_type)
		{
			if(String.isString(_type))
			{
				return (Prompt.events.indexOf(_type.toLowerCase()) > -1);
			}

			return null;
		}

		static createItem(_type, _options)
		{
			if(! Prompt.isType(_type))
			{
				return x('Invalid % argument (expecting a specific %)', null, '_type', 'String');
			}
			else
			{
				_options = Object.assign({
					type: _type
				}, _options);
			}

			if(! Prompt.isType(_options.type))
			{
				return x('Invalid % argument (not a %, and also not found in the %)', null, '_type', 'String', 'options');
			}

			//

			//
			return Object.null(_options);
		}

		//
		emitEvent(_type, ... _args)
		{
			if(Prompt.isItem(_type))
			{
				_type = _type.type;
			}
			else if(! Prompt.isEventType(_type))
			{
				return x('This event % argument, or such key is not available', null, '_type');
			}

			return this.emit(_type, ... _args);
		}

		static get events()
		{
			return [ 'cancel', 'destroy', 'enter', 'item', 'ready', 'render', 'update' ];
		}

		static get types()
		{
			return [ 'Confirm', 'Date', 'List', 'Field', 'Number', 'Password', 'Path', 'Progress', 'Range', 'Text' ];
		}

		static get keys()
		{
			return {
				name: {
					type: [ 'String' ],
					optional: false,
					default: uuid()
				},
				help: {
					type: [ 'String' ],
					optional: true,
					default: ''
				},
				value: {
					type: [],
					optional: false,
					default: null
				},
				validate: {
					type: [ 'Function' ],
					optional: true,
					default: null
				},
				check: {
					type: [ 'Function' ],
					optional: true,
					default: null
				}
			};
		}

		get name()
		{
			return this.options.name;
		}

		get help()
		{
			return this.options.help;
		}

		get value()
		{
			return this.options.value;
		}

		get validate()
		{
			return this.options.validate;
		}

		get check()
		{
			return this.options.check;
		}

		static items(_type)
		{
			var result = Prompt.keys;

			if(Prompt.isType(_type))
			{
				result = Object.assign(result, Prompt[_type.toLowerCase()].key);
			}

			return result;
		}

		static isType(_item)
		{
			if(Object.isObject(_item))
			{
				return String.isString(_item.name);
			}
		}

		static isColor(_value, _ansi = true)
		{
			if(_ansi)
			{
				return ansi.isColor(_value);
			}

			return color.isColor(_value, true, true, false, false, false, false);
		}

		static isRandomColor(_value)
		{
			return color.isRandomColor(_value, true);
		}

		static get colors()
		{
			return 'rgb';
		}

		static getColor(_value, _random = true)
		{
			if(Prompt.isRandomColor(_value))
			{
				if(_random)
				{
					return ansi.getRandomColor(_value);
				}

				return _value;
			}
			else if(Prompt.isColor(_value, false))
			{
				return color[Prompt.colors](_value);
			}

			return _value;
		}

		static areColors(... _args)
		{
			if(_args.length === 0)
			{
				return null;
			}

			var withAnsi = true;

			for(var i = 0; i < _args.length; ++i)
			{
				if(typeof _args[i] === 'boolean')
				{
					withAnsi = _args.splice(i--, 1)[0];
				}
			}

			var result = 0;

			for(var i = 0; i < _args.length; ++i)
			{
				if(Prompt.isColor(_args[i], withAnsi))
				{
					++result;
				}
			}

			return result;
		}

		static get symbol()
		{
			return {
				error: '✘',
				success: '✔',
				question: '❓'
				//, ...!?! ^_^
			};
		}

		static symbols(_color = COLORS, _color_bg = false)
		{
			const result = Prompt.symbol;
			const color = Prompt.color;

			if(_color === true)
			{
				for(const idx in result)
				{
					result[idx] = result[idx].color(... color[idx]);
				}

				return result;
			}

			if(Prompt.isRandomColor(_color))
			{
				//
			}
			else if(Prompt.isColor(_color))
			{
				//
			}
			else
			{
				_color = false;
			}

			if(Prompt.isRandomColor(_color_bg))
			{
				//
			}
			else if(Prompt.isColor(_color_bg))
			{
				//
			}
			else
			{
				_color_bg = false;
			}

			if(! Prompt.areColors(_color, _color_bg))
			{
				return result;
			}

			//
			for(const idx in result)
			{
				result[idx] = result[idx].color(Prompt.getColor(_color, true), Prompt.getColor(_color_bg, true));
			}

			//
			return result;
		}

		static get color()
		{
			return {
				error: [ ... DEFAULT_COLOR_ERROR ],
				success: [ ... DEFAULT_COLOR_SUCCESS ],
				question: [ ... DEFAULT_COLOR_QUESTION ]
			};
		}

		get raw()
		{
			if(this.options.raw)
			{
				return this.options.raw;
			}

			return null;
		}

		set raw(_value)
		{
			const orig = this.raw;

			if(Object.isObject(_value))
			{
				if(_value === orig)
				{
					return orig;
				}
				else if(orig)
				{
					this.disableRawMode();
				}

				delete this.options.raw;
				return this.options.raw = this.enableRawMode();
			}
			else
			{
				if(orig)
				{
					this.disableRawMode();
				}

				delete this.options.raw;
			}

			return this.raw;
		}

		enableRawMode(_throw = DEFAULT_THROW)
		{
			if(this.raw)
			{
				if(_throw)
				{
					return x('RAW mode is already active');
				}

				return false;
			}

			return this.options.raw = RAW.enable(true, this.rawCallback, null, _throw);
		}

		disableRawMode(_throw = DEFAULT_THROW)
		{
			const raw = this.raw;

			if(! raw)
			{
				if(_throw)
				{
					return x('RAW mode has not yet been initialized');
				}

				return false;
			}
			else
			{
				delete this.options.raw;
			}

			return RAW.disable(raw, _throw);
		}

		rawCallback(_event, _value)
		{
			return Prompt.rawCallback.call(this, _event, _value);
		}

		static rawCallback(_event, _value)
		{
			return console.debug('rawCallback(%)', arguments.length);
		}

		static onResize(_prompt, ... _args)
		{
		}

		static onByte(_prompt, ... _args)
		{
		}

		static onKey(_prompt, ... _args)
		{
		}

		static onMouse(_prompt, ... _args)
		{
		}

		cancel(_prompt, ... _args)
		{
		}

		destroy(_prompt, ... _args)
		{
		}

		enter(... _args)
		{
		}

		item(... _args)
		{
		}

		ready(... _args)
		{
		}

		render(... _args)
		{
		}

		update(... _args)
		{
		}
	}

	//
	prompt = Prompt.prompt;

	//
	(function()
	{
		const types = Prompt.types;

		for(const t of types)
		{
			const a = t;
			const b = t.toLowerCase();

			Prompt[a] = Prompt[b] = require('tty/prompt/' + b);
		}
	})();

	//

})();
