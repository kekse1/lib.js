//
// TODO / < https://nodejs.org/dist/latest/docs/api/events.html >
//
// TODO / warn EVERY (n) listeners...!
//		implement .checkLimits() FOR EVERY event(-name)
//		..AND 'this._warned' for EVERY (so array), and remove when again BELOW warn-limit.. ;-)
//
// TODO / 'removeListener()' and 'off()'... see < https://nodejs.org/dist/latest/docs/api/events.html#events_emitter_removelistener_eventname_listener >..
//	UND ZWAR *SOWOHL* via CALLBACK als *AUCH* VIA UUID (see '_callback.UUID' ;-)!!!!!
//

(function()
{

	//
	const DEFAULT = 'a-event';

	const DEFAULT_MAX_LISTENERS = 10;
	const DEFAULT_UNREF = true;
	const DEFAULT_ALLOW_INTERNAL_EVENTS = true;

	const DEFAULT_BUBBLES = true;
	const DEFAULT_CANCELABLE = true;
	const DEFAULT_COMPOSED = true;

	//
	if(typeof uuid !== 'function' && !BROWSER)
	{
		require('utility/id');
	}

	//
	EVENT = module.exports = class EVENT
	{
		constructor(... _args)
		{
			//
			//super(... _args);

			//
			this._prepare();

			//
			if(this.PROXY)
			{
				const PROXY = this.PROXY;
				delete this.PROXY;
				return PROXY;
			}
			else
			{
				delete this.PROXY;
			}
		}

		static create(... _args)
		{
			return new this(... _args);
		}
		
		_prepare()
		{
			//
			if(typeof ITEM === 'undefined' || !was(this, 'ITEM'))
			{
				this.reset();
			}

			//
			if(BROWSER)
			{
				return;
			}

			//
			if(HIDDEN_MEMBERS)
			{
				this.PROXY = new Proxy(this, EVENT.getProxyOptions(this));
			}
			else
			{
				this.PROXY = null;
			}

			//
			return this.PROXY;
		}

		static getProxyOptions(_this)
		{
			const result = {};

			result.ownKeys = (_target) => {
				const result = Object.getOwnPropertyNames(_target, false, false);

				for(var i = result.length - 1; i >= 0; --i)
				{
					if(result[i][0] === '_')
					{
						result.splice(i, 1);
					}
				}

				return result;
			};

			return result;
		}

		static get internalEvents()
		{
			return [
				'resetEvents', 'newListener', 'removeListener',
				'newSpecialListener', 'removeSpecialListener',
				'newSpecialEvent', 'removeSpecialEvent', 'clearSpecialEvents'
			];
		}

		static get defaultMaxListeners()
		{
			return DEFAULT_MAX_LISTENERS;
		}

		ref(_value, _apply = true)
		{
			if(BROWSER)
			{
				return -1;
			}
			else if(typeof _value !== 'boolean')
			{
				_value = this.timeoutRef;
			}
			else if(_apply)
			{
				this.timeoutRef = _value;
			}

			var result = 0;

			for(var i = 0; i < this._eventList.length; ++i)
			{
				if(this._eventList[i]._timeout !== null)
				{
					if(_value)
					{
						this._eventList[i]._timeout.ref();
					}
					else
					{
						this._eventList[i]._timeout.unref();
					}

					++result;
				}
			}

			return result;
		}

		unref(_value, _apply = true)
		{
			if(BROWSER)
			{
				return -1;
			}
			else if(typeof _value !== 'boolean')
			{
				_value = this.timeoutUnref;
			}
			else if(_apply)
			{
				this.timeoutUnref = _value;
			}

			var result = 0;

			for(var i = 0; i < this._eventList.length; ++i)
			{
				if(this._eventList[i]._timeout !== null)
				{

					if(_value)
					{
						this._eventList[i]._timeout.unref();
					}
					else
					{
						this._eventList[i]._timeout.ref();
					}

					++result;
				}
			}

			return result;
		}

		get timeoutRef()
		{
			return !this.timeoutUnref;
		}

		set timeoutRef(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.timeoutUnref = !_value;
			}

			return !this.timeoutUnref;
		}

		get timeoutUnref()
		{
			if(typeof this._unref === 'boolean')
			{
				return this._unref;
			}

			return this._unref = DEFAULT_UNREF;
		}

		set timeoutUnref(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this._unref = _value;
			}

			return this.timeoutUnref;
		}

		getMaxListeners()
		{
			return this._maxListeners;
		}

		emitWarning(_warn)
		{
			if(typeof _warn === 'undefined')
			{
				const listenerCount = this.listenerCount();
				const maxListeners = this._maxListeners;

				_warn = 'Maximum listener count ';

				if(listenerCount === maxListeners)
				{
					_warn += 'reached';
				}
				else
				{
					_warn += 'exceeded';
				}

				_warn += ' (' + listenerCount + ' / ' + maxListeners + ')';
			}

			return process.emitWarning(_warn);
		}

		setMaxListeners(_value)
		{
			if(Number.isInfinite(_value) || (Number.isInt(_value) && _value < 0))
			{
				_value = null;
			}

			if(_value === null)
			{
				return this._maxListeners = _value;
			}
			else if(Number.isInt(_value) && _value >= 0)
			{
				this._maxListeners = _value;

				if(this.listenerCount() >= _value)
				{
					process.emitWarning();
				}

				return _value;
			}

			return this._maxListeners = DEFAULT_MAX_LISTENERS;
		}

		eventNames()
		{
			const result = [];

			for(const idx in this._eventName)
			{
				result.push(idx);
			}

			return result;
		}

		listenerCount(_name)
		{
			if(typeof _name === 'function')
			{
				var result = 0;

				for(var i = 0, j = 0; i < this._eventList.length; ++i)
				{
					if(this._eventList[i].listener === _name)
					{
						++result;
					}
				}

				return result;
			}
			else if(String.isString(_name))
			{
				if(_name in this._eventName)
				{
					return this._eventName[_name].length;
				}

				return 0;
			}

			return this._totalEvents;
		}

		listeners(_name)
		{
			const result = this.events(_name);

			if(result === null)
			{
				return null;
			}

			return result.select('listener');
		}

		rawListeners(_name)
		{
			const result = this.events(_name);

			if(result === null)
			{
				return null;
			}

			return result.select('callback');
		}

		events(_name)
		{
			if(! String.isString(_name))
			{
				return [ ... this._eventList ];
			}
			else if(! (_name in this._eventName))
			{
				return [];
			}

			return [ ... this._eventName[_name] ];
		}

		removeAllListeners(_name = null)
		{
			if((_name = this.getEvents(_name)) === null)
			{
				return null;
			}

			const result = [];

			for(var i = 0; i < result.length; ++i)
			{
				result[i] = this.off(result[i]);
			}

			return [ ... result ];
		}

		emit(_name, ... _args)
		{
			var event;

			if((event = this.getEvents(_name)) === null)
			{
				return null;
			}

			const result = [];

			for(var i = 0, j = result.length; i < event.length; ++i)
			{
				result[j++] = event[i].callback(... _args);
			}

			return result;
		}

		static isEvent(_item)
		{
			if(Object.isObject(_item))
			{
				return (String.isString(_item.eventID) && typeof _item.callback === 'function' && typeof _item.listener === 'function');
			}

			return false;
		}

		isID(_string)
		{
			if(EVENT.isID(_string))
			{
				return ((_string = _string.toLowerCase()) in this._eventID);
			}

			return false;
		}

		static isID(_string)
		{
			if(typeof _string === 'string')
			{
				if(_string.isLowerCase)
				{
					return id.isID(_string, false);
				}

				return false;
			}

			return false;
		}

		getEvents(_event, _listener)
		{
			if(typeof _event === 'function')
			{
				if(typeof _listener !== 'function')
				{
					_listener = null;
				}

				const result = [];

				for(var i = 0, j = 0; i < this._eventList.length; ++i)
				{
					if(this._eventList[i].listener === _event)
					{
						result[j++] = this._eventList[i];
					}
					else if(_listener && this._eventList[i].callback === _listener)
					{
						result[j++] = this._eventList[i];
					}
				}

				if(result.length === 0)
				{
					return null;
				}

				return result;
			}
			else if(EVENT.isEvent(_event))
			{
				if(typeof _listener === 'function' && _event.listener !== _listener)
				{
					return null;
				}

				return [ _event ];
			}
			else if(String.isString(_event))
			{
				if(EVENT.isID(_event))
				{
					if(typeof this._eventID[_event] === 'undefined')
					{
						return null;
					}
					else if(typeof _listener === 'function' && this._eventID[_event].listener !== _listener)
					{
						return null;
					}

					return [ this._eventID[_event] ];
				}
				else if(_event in this._eventName)
				{
					const result = [];

					if(typeof _listener === 'function')
					{
						for(var i = 0, j = 0; i < this._eventName[_event].length; ++i)
						{
							if(this._eventName[_event][i].listener === _listener)
							{
								result[j++] = this._eventName[_event][i];
							}
						}

						if(result.length === 0)
						{
							return null;
						}
					}
					else
					{
						return [ ... this._eventName[_event] ];
					}

					return result;
				}

				return null;
			}

			return null;
		}

		on(_name, _listener, _count = 0, _timeout = null, _unique = false, _prepend = false)
		{
			//
			//TODO/...
			//
			//if(... this.maxListeners ...);

			//
			if(! String.isString(_name))
			{
				return x('Invalid % argument (not a non-empty %)', null, '_name', 'String');
			}
 			else if(!DEFAULT_ALLOW_INTERNAL_EVENTS && EVENT.internalEvents.indexOf(_name) > -1)
			{
				return x('The event \'%\' is an INTERNAL event, it can\'t be used outside the % class', null, _name, 'EVENT');
			}

			if(typeof _listener !== 'function')
			{
				return x('Invalid % argument (not a %)', null, '_listener', 'Function');
			}

			if(! (Number.isInt(_count) && _count >= 0))
			{
				_count = 0;
			}

			if(! (Number.isInt(_timeout) && _timeout >= 0))
			{
				_timeout = null;
			}

			if(typeof _prepend !== 'boolean')
			{
				_prepend = false;
			}

			//
			if(this.listenerCount() >= this._maxListeners)
			{
				this.emitWarning();
			}

			//
			var timeoutUnref = this.timeoutUnref;

			const result = {
				id: randomID(),
				name: _name,
				listener: _listener,
				destroyed: false,
				COUNT: _count,
				TIMEOUT: _timeout,
				_timeout: null,
				COUNTER: 0
			};

			Object.defineProperty(result, 'unref', { enumerable: true,
				get: function()
				{
					return timeoutUnref;
				},
				set: function(_value)
				{
					if(typeof _value !== 'boolean')
					{
						_value = timeoutUnref;
					}

					if(!BROWSER && result._timeout !== null)
					{
						if(_value)
						{
							result._timeout.unref();
						}
						else
						{
							result._timeout.ref();
						}
					}

					return timeoutUnref = _value;
				}
			});

			Object.defineProperty(result, 'ref', { enumerable: true,
				get: function()
				{
					return !timeoutUnref;
				},
				set: function(_value)
				{
					if(typeof _value !== 'boolean')
					{
						_value = !timeoutUnref;
					}

					if(!BROWSER && result._timeout !== null)
					{
						if(_value)
						{
							result._timeout.ref();
						}
						else
						{
							result._timeout.unref();
						}
					}

					return timeoutUnref = !_value;
				}
			});

			if(result.TIMEOUT !== null)
			{
				result._timeout = setTimeout(() => {
					return this.off(result);
				}, result.TIMEOUT);

				if(timeoutUnref)
				{
					result._timeout.unref();
				}
			}

			result.clear = () => {
				return this.clear(result);
			};

			result.off = () => {
				return this.off(result);
			};

			//
			result.callback = (... _args) => {
				//
				const res = result.listener(... _args);

				//
				if(++result.COUNTER >= result.COUNT && result.COUNT > 0)
				{
					this.off(result);
				}

				//
				return res;
			};

			Object.defineProperty(result, 'count', { enumerable: true,
				get: function()
				{
					return result.COUNT;
				},
				set: function(_value)
				{
					return this.setCount(result, _value);
				}
			});

			Object.defineProperty(result, 'counter', { enumerable: true,
				get: function()
				{
					return result.COUNTER;
				},
				set: function(_value)
				{
					return this.setCounter(result, _value);
				}
			});

			Object.defineProperty(result, 'timeout', { enumerable: true,
				get: function()
				{
					return result.TIMEOUT;
				},
				set: function(_value)
				{
					return this.setTimeout(result, _value);
				}
			});

			//
			++this._totalEvents;

			this._eventID[result.id] = result;

			if(_prepend)
			{
				this._eventList.unshift(result);
			}
			else
			{
				this._eventList.push(result);
			}

			if(typeof this._eventName[result.name] === 'undefined')
			{
				this._eventName[result.name] = [ result ];
			}
			else if(_prepend)
			{
				this._eventName[result.name].unshift(result);
			}
			else
			{
				this._eventName[result.name].push(result);
			}

			//
			this.emit.call(this, 'newListener', result);

			//
			if(this.hasSpecialEvent(result.name))
			{
				this.emit.call(this, 'newSpecialListener', result.name, [ ... this._specialEvents ]);
			}

			//
			return result.id;
		}

		once(_name, _listener, _timeout = null, _unique = false, _prepend = false)
		{
			return this.on(_name, _listener, 1, _timeout, _unique, _prepend);
		}

		set(_name, _listener, _count = 0, _timeout = null, _prepend = false)
		{
			return this.on(_name, _listener, _count, _timeout, true, _prepend);
		}

		prependOnceListener(_name, _listener, _timeout = null, _unique = false)
		{
			return this.once(_name, _listener, _timeout, _unique, true);
		}

		setListener(... _args)
		{
			return this.set(... _args);
		}

		setEventListener(... _args)
		{
			return this.set(... _args);
		}

		hasEvent(_event)
		{
			return (this.getEvent(_event) !== null);
		}

		getEvent(_event)
		{
			const result = this.getEvents(_event);

			if(result === null)
			{
				return null;
			}
			else if(result.length === 1)
			{
				return result[0];
			}

			return result;
		}

		off(_name, _listener)
		{
			//
			var event;

			//
			if((event = this.getEvents(_name, _listener)) === null)
			{
				return null;
			}

			//
			if(String.isString(_name))
			{
				if(this.hasSpecialEvent(_name))
				{
					this.emit.call('removeSpecialListener', _name, [ ... this._specialEvents ]);
				}
			}

			//
			for(var i = 0; i < event.length; ++i)
			{
				if(event[i].destroyed)
				{
					event.splice(i--, 1);
				}
				else
				{
					event[i].destroyed = true;
				}
			}

			if(event.length === 0)
			{
				return null;
			}
			else for(const e of event)
			{
				if(e._timeout !== null)
				{
					clearTimeout(e._timeout);
					e._timeout = null;
				}
			}

			//
			for(var i = 0; i < event.length; ++i)
			{
				if(typeof _listener === 'function')
				{
					for(var j = 0; j < this._eventName[event[i].name].length; ++j)
					{
						if(this._eventName[event[i].name][j] === _listener)
						{
							this._eventName[event[i].name].splice(j--, 1);
						}

						if(this._eventName[event[i].name].length === 0)
						{
							delete this._eventName[event[i].name];
							break;
						}
					}
				}
				else
				{
					delete this._eventName[event[i].name];
				}

				this._eventList.remove(event[i]);
				delete this._eventID[event[i].id];
			}

			//
			this._totalEvents -= event.length;

			//
			for(var i = 0; i < event.length; ++i)
			{
				this.emit.call(this, 'removeListener', event[i], i);
			}

			//
			//TODO/ist das korrekt so, oder was hat's mit 'this._eventName[]' auf isch nochmal!?
			//
			if(String.isString(_name) && this.hasSpecialEvent(_name))
			{
				this.emit.call('removeSpecialListener', _name, [ ... this._specialEvents ]);
			}

			//
			return event;
		}

		resetEvents()
		{
			if(this._totalEvents === 0)
			{
				return false;
			}

			this._eventID = {};
			this._eventName = {};
			this._eventList = [];
			this._totalEvents = 0;
			this._specialEvents = [];

			this.emit.call(this, 'resetEvents');

			return true;
		}

		addSpecialEvent(_name)
		{
			if(! String.isString(_name))
			{
				return x('Invalid % argument (not a non-empty %)', null, '_name', 'String');
			}
			else if(this._specialEvents.indexOf(_name) > -1)
			{
				return false;
			}
			else
			{
				this._specialEvents.push(_name);
				this.emit.call(this, 'newSpecialEvent', _name);
			}

			return true;
		}

		removeSpecialEvent(_name)
		{
			if(! String.isString(_name))
			{
				return x('Invalid % argument (not a non-empty %)', null, '_name', 'String');
			}

			const idx = this._specialEvents.indexOf(_name);

			if(idx === -1)
			{
				return false;
			}
			else
			{
				this._specialEvents.splice(idx, 1);
				this.emit.call(this, 'removeSpecialEvent', _name, idx);
			}

			return true;
		}

		clearSpecialEvents()
		{
			const result = this._specialEvents.length;
			this._specialEvents.length = 0;

			if(result > 0)
			{
				this.emit.call(this, 'clearSpecialEvents');
			}

			return result;
		}

		countSpecialEvents()
		{
			return this._specialEvents.length;
		}

		hasSpecialEvent(_name)
		{
			if(! String.isString(_name))
			{
				return x('Invalid % argument (not a non-empty %)', null, '_name', 'String');
			}

			return (this._specialEvents.indexOf(_name) > -1);
		}

		reset(... _args)
		{
			//
			this._unref = true;
			this._maxListeners = DEFAULT_MAX_LISTENERS;

			//
			this.resetEvents();

			//
			//return super.reset(... _args);
		}

		clear(_event)
		{
			if((_event = this.getEvents(_event)) === null)
			{
				return null;
			}
			else for(var i = 0; i < _event.length; ++i)
			{
				if(_event[i].destroyed)
				{
					_event.splice(i--, 1);
				}
				else
				{
					if(_event[i]._timeout !== null)
					{
						clearTimeout(_event[i]._timeout);
						_event[i]._timeout = null;
					}

					if(_event[i].TIMEOUT !== null)
					{
						_event[i]._timeout = setTimeout(() => {
							return this.off(_event[i]);
						}, _event[i].TIMEOUT);
					}

					_event[i].COUNTER = 0;
				}
			}

			if(_event.length === 0)
			{
				return null;
			}
			else
			{
				this.emit.call(this, 'clearEvents', _event);
			}

			return _event;
		}

		clearEvents(... _args)
		{
			return this.clear(... _args);
		}

		setCount(_event, _value = 0)
		{
			if(! (Number.isInt(_value) && _value >= 0))
			{
				_value = 0;
			}

			if((_event = this.getEvents(_event)) === null)
			{
				return null;
			}
			else for(var i = 0; i < _event.length; ++i)
			{
				if(_event[i].destroyed)
				{
					_event.splice(i--, 1);
				}
				else if(_event[i].COUNTER >= (_event[i].COUNT = _value) && _event[i].COUNT > 0)
				{
					this.off(_event[i]);
				}
			}

			if(_event.length === 0)
			{
				return null;
			}

			return _event;
		}

		setCounter(_event, _value = 0)
		{
			if(! (Number.isInt(_value) && _value >= 0))
			{
				_value = 0;
			}

			if((_event = this.getEvents(_event)) === null)
			{
				return null;
			}
			else for(var i = 0; i < _event.length; ++i)
			{
				if(_event[i].destroyed)
				{
					_event.splice(i--, 1);
				}
				else if((_event[i].COUNTER = _value) >= _event[i].COUNT && _event[i].COUNT > 0)
				{
					this.off(_event[i]);
				}
			}

			if(_event.length === 0)
			{
				return null;
			}

			return _event;
		}

		setTimeout(_event, _timeout = null)
		{
			if(! (Number.isInt(_timeout) && _timeout >= 0))
			{
				_timeout = null;
			}

			if((_event = this.getEvents(_event)) === null)
			{
				return null;
			}
			else for(var i = 0; i < _event.length; ++i)
			{
				if(_event[i].destroyed)
				{
					_event.splice(i--, 1);
				}
				else
				{
					if(_event[i]._timeout !== null)
					{
						clearTimeout(_event[i]._timeout);
						_event[i]._timeout = null;
					}

					if(_timeout !== null)
					{
						_event[i]._timeout = setTimeout(() => {
							return this.off(_event[i]);
						}, (_event[i].TIMEOUT = _timeout));
					}
					else
					{
						_event[i].TIMEOUT = null;
					}
				}
			}

			if(_event.length === 0)
			{
				return null;
			}

			return _event;
		}

		addEventListener(... _args)
		{
			return this.on(... _args);
		}

		addListener(... _args)
		{
			return this.on(... _args);
		}

		removeEventListener(... _args)
		{
			return this.off(... _args);
		}

		removeListener(... _args)
		{
			return this.off(... _args);
		}
		
		static createEvent(_name, _which, _options)
		{
			//
			if(! isString(_name, 1))
			{
				throw new Error('Invalid _name argument');
			}
			else
			{
				_name = _name.toLowerCase();
			}

			//
			if(! isObject(_options))
			{
				_options = {};
			}

			//
			if(typeof _options.bubbles !== 'boolean')
			{
				_options.bubbles = DEFAULT_BUBBLES;
			}

			if(typeof _options.cancelable !== 'boolean')
			{
				_options.cancelable = DEFAULT_CANCELABLE;
			}

			if(typeof _options.composed !== 'boolean')
			{
				_options.composed = DEFAULT_COMPOSED;
			}

			//
			if(typeof _which === 'undefined' || _which === null)
			{
				_which = Event;
			}
			else if(typeof _which === 'boolean')
			{
				_which = (_which ? CustomEvent : Event);
			}
			else if(typeof _which === 'string' && _which.length > 0)
			{
				if((_which in window) && window[_which].name.endsWith('Event'))
				{
					_which = window[_which];
				}
				else if(((_which.capitalize() + 'Event') in window) && window[_which.capitalize() + 'Event'].name.endsWith('Event'))
				{
					_which = window[_which.capitalize() + 'Event'];
				}
				else
				{
					throw new Error('Event not found');
					_which = CustomEvent;
				}
			}
			else if(! (_which && _which.name && (_which.name.endsWith('Event') || (_which.constructor && _which.constructor.name.endsWith('Event')))))
			{
				throw new Error('No matching _which (maybe \'Event\' or \'CustomEvent\'?)');
			}

			//
			const result = new _which(_name, _options);

			for(const idx in _options)
			{
				try
				{
					result[idx] = _options[idx];
				}
				catch(_error)
				{
					continue;
				}
			}

			return result;
		}

		static dispatch(_element = DEFAULT_ELEMENT, _event, _which, _options)
		{
			//
			if(! _element)
			{
				throw new Error('Invalid _element argument');
			}

			if(! isObject(_options))
			{
				_options = {};
			}

			if(typeof _event === 'string' && _event.length > 0)
			{
				_event = EVENT.createEvent(_event, _which, _options);
			}
			else if(isObject(_event) && _event.name.endsWith('Event'))
			{
				_event.assign(_options);
			}
			else
			{
				throw new Error('Invalid _event argument');
			}

			//
			return _element.dispatchEvent(_event);
		}
	}

	//
	Object.defineProperty(EVENT, 'INDEX', { get: function()
	{
		const result = [];

		for(var i = 0, j = 0; i < Box.INDEX.length; ++i)
		{
			if(was(Box.INDEX[i], 'EVENT'))
			{
				result[j++] = Box.INDEX[i];
			}
		}

		return result;
	}});

	//
	if(BROWSER)
	{
		Event.dispatch = EVENT.dispatch.bind(Event);
		Event.create = EVENT.createEvent.bind(Event);
	}

	//

})();

