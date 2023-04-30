(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_UNREF = false;
	const DEFAULT_FPS = 60;
	const DEFAULT_TYPE = 'psin';
	const DEFAULT_SPEED = true;

	//
	if(typeof uuid === 'undefined')
	{
		require('utility/id');
	}

	if(typeof EVENT === 'undefined')
	{
		require('core/event');
	}

	//
	//TODO/events... see also bottom of this file.
	//
	Animation = animation = EVENT.create();

	//
	var UNREF = DEFAULT_UNREF;
	var PAUSE = false;

	//
	Object.defineProperty(Animation, 'unref', {
		get: function()
		{
			return UNREF;
		},
		set: function(_value)
		{
			if(typeof _value === 'boolean')
			{
				return UNREF = _value;
			}

			return UNREF;
		}
	});

	Object.defineProperty(Animation, 'ref', {
		get: function()
		{
			return !UNREF;
		},
		set: function(_value)
		{
			if(typeof _value === 'boolean')
			{
				return UNREF = !_value;
			}

			return !UNREF;
		}
	});

	Object.defineProperty(Animation, 'pause', {
		get: function()
		{
			return PAUSE;
		},
		set: function(_value)
		{
			if(typeof _value === 'boolean')
			{
				if(_value)
				{
					Animation.pauseAll();
				}
				else
				{
					Animation.resumeAll();
				}

				return PAUSE = _value;
			}

			return PAUSE;
		}
	});

	//
	const LIST = [];
	var MAP = Object.create(null);

	Object.defineProperty(Animation, 'LIST', { get: function()
	{
		return [ ... LIST ];
	}});

	Object.defineProperty(Animation, 'MAP', { get: function()
	{
		return Object.null(MAP);
	}});

	Object.defineProperty(Animation, 'running', { get: function()
	{
		var result = 0;

		for(var i = 0; i < LIST.length; ++i)
		{
			if(! LIST[i].PAUSE)
			{
				++result;
			}
		}

		return result;
	}});

	Object.defineProperty(Animation, 'paused', { get: function()
	{
		var result = 0;

		for(var i = 0; i < LIST.length; ++i)
		{
			if(LIST[i].PAUSE)
			{
				++result;
			}
		}

		return result;
	}});

	Object.defineProperty(Animation, 'active', { get: function()
	{
		if(Animation.pause)
		{
			return false;
		}
		else if(Animation.running === 0)
		{
			return false;
		}

		return true;
	}});

	Object.defineProperty(Animation, 'canRequest', { get: function()
	{
		if(Animation.FRAME.active)
		{
			return false;
		}
		else if(! Animation.active)
		{
			return false;
		}
		else if(Animation.REQUEST !== null)
		{
			return false;
		}

		return true;
	}})

	//
	Animation.REQUEST = null;

	Animation.request = function(_throw = DEFAULT_THROW)
	{
		if(! Animation.canRequest)
		{
			return false;
		}
		else if(BROWSER && typeof window.requestAnimationFrame === 'function')
		{
			Animation.REQUEST = window.requestAnimationFrame(Animation.FRAME);
		}
		else if(Object.isObject(Animation.REQUEST = setTimeout(Animation.FRAME, (1000 / DEFAULT_FPS))))
		{
			if(UNREF)
			{
				Animation.REQUEST.unref();
			}
			else
			{
				Animation.REQUEST.ref();
			}
		}
		else if(_throw)
		{
			return x('Couldn\'t %, and also % wasn\'t possible', null, 'requestAnimationFrame()', 'setTimeout()');
		}
		else
		{
			return false;
		}

		return true;
	}

	Animation.unrequest = function()
	{
		if(Animation.REQUEST === null)
		{
			return false;
		}
		else if(BROWSER && typeof window.cancelAnimationFrame === 'function' && Number.isInt(Animation.REQUEST))
		{
			window.cancelAnimationFrame(Animation.REQUEST);
		}
		else
		{
			clearTimeout(Animation.REQUEST);
		}

		Animation.REQUEST = null;
		return true;
	}

	const callCallbacks = (_item) => {
		for(var i = 0; i < _item.callback.length; ++i)
		{
			_item.callback[i](Object.null(_item), Animation);
		}

		return _item.callback.length;
	};

	Animation.FRAME = (function()
	{
		//
		Animation.FRAME.active = true;
		Animation.unrequest();

		//
		Animation.FRAME.now = Date.now();

		if(Animation.FRAME.last !== null)
		{
			Animation.FRAME.delta = (Animation.FRAME.now - Animation.FRAME.last);
		}
		else
		{
			Animation.FRAME.delta = 0;
		}

		Animation.FRAME.last = Animation.FRAME.now;

		//
		++Animation.FRAME.count;

		//
		for(var i = 0; i < LIST.length; ++i)
		{
			var STOPPED = false;

			LIST[i].stop = () => {
				STOPPED = true;
				return LIST[i]._stop();
			};

			if(! LIST[i].PAUSE)
			{
				//
				++LIST[i].count;

				//
				LIST[i].delta = Animation.FRAME.delta;
				LIST[i].milliseconds += LIST[i].delta;

				LIST[i].now = Animation.FRAME.now;
				LIST[i].last = Animation.FRAME.last;

				LIST[i].global = Animation.GLOBAL;

				var configSpeed;

				if(DEFAULT_SPEED)
				{
					if(Number.isNumber(SPEED) && SPEED !== 0)
					{
						configSpeed = SPEED;
					}
					else
					{
						configSpeed = 1;
					}
				}
				else
				{
					configSpeed = 1;
				}

				//
				var value;

				switch(LIST[i].type)
				{
					case 'psin':
						value = LIST[i].value = Math.psin(LIST[i].seconds * LIST[i].speed * configSpeed);
						break;
					case 'sin':
						value = LIST[i].value = Math.sin(LIST[i].seconds * LIST[i].speed * configSpeed);
						break;
					case 'ms':
						var ms = LIST[i].milliseconds;

						if(ms > LIST[i].speed)
						{
							ms %= LIST[i].speed;
						}

						value = LIST[i].value = (ms / LIST[i].speed * configSpeed);
						break;
				}

				//
				if(LIST[i].backward)
				{
					if(LIST[i].type === 'ms')
					{
						value = LIST[i].value = (1 - value);
					}

					if(value <= (LIST[i].type === 'sin' ? -1 : 0) && !LIST[i].fin)
					{
						value = LIST[i].value = (LIST[i].type === 'sin' ? -1 : 0);
						LIST[i].fin = true;
						++LIST[i].fins;
						LIST[i].backward = false;
					}
					else if(LIST[i].lastValue !== null && value >= LIST[i].lastValue && !LIST[i].fin)
					{
						LIST[i].value = 0;
						LIST[i].fin = true;
						++LIST[i].fins;
						LIST[i].backward = false;

						callCallbacks(LIST[i]);

						if(STOPPED)
						{
							--i;
							continue;
						}

						LIST[i].value = value;
					}
					else
					{
						LIST[i].fin = false;
					}
				}
				else
				{
					if(value >= 1 && !LIST[i].fin)
					{
						value = LIST[i].value = 1;
						LIST[i].fin = true;
						++LIST[i].fins;
						LIST[i].backward = true;
					}
					else if(LIST[i].lastValue !== null && value <= LIST[i].lastValue && !LIST[i].fin)
					{
						LIST[i].value = 1;
						LIST[i].fin = true;
						++LIST[i].fins;
						LIST[i].backward = true;

						callCallbacks(LIST[i]);

						if(STOPPED)
						{
							--i;
							continue;
						}

						LIST[i].value = value;
					}
					else
					{
						LIST[i].fin = false;
					}
				}

				//
				callCallbacks(LIST[i]);

				//
				if(STOPPED)
				{
					--i;
				}
				else
				{
					LIST[i].lastValue = value;
				}
			}
		}

		//
		Animation.FRAME.active = false;

		if(Animation.canRequest)
		{
			Animation.request(true);
		}
	}).bind(Animation);

	//
	Animation.FRAME.active = false;
	Animation.FRAME.now = null;
	Animation.FRAME.last = null;
	Animation.FRAME.milliseconds = 0;
	Animation.FRAME.delta = 0;
	Animation.FRAME.count = 0n;

	Object.defineProperty(Animation, 'GLOBAL', { get: function()
	{
		const result = Object.create(null);

		result.now = Animation.FRAME.now;
		result.last = Animation.FRAME.last;
		result.milliseconds = Animation.FRAME.milliseconds;
		result.delta = Animation.FRAME.delta;
		result.count = Animation.FRAME.count;

		Object.defineProperty(result, 'seconds', { get: function()
		{
			return (result.milliseconds / 1000);
		}});

		return result;
	}});

	Object.defineProperty(Animation.FRAME, 'seconds', {
		get: function()
		{
			return (Animation.FRAME.milliseconds / 1000);
		},
		set: function(_value)
		{
			if(Number.isInt(_value) && _value >= 0)
			{
				Animation.FRAME.milliseconds = Math.round(_value * 1000);
			}

			return (Animation.FRAME.milliseconds / 1000);
		}
	});

	//
	Animation.scale = function(_value, _max, _min, _int = false)
	{
		const result = ((_value * (_max - _min)) + _min);

		if(_int)
		{
			return result.int;
		}

		return result;
	}

	//
	Object.defineProperty(Animation, 'type', { get: function()
	{
		return [ 'ms', 'psin', 'sin' ];
	}});

	Animation.isAnimation = function(_object)
	{
		if(Object.isObject(_object))
		{
			if(_object.isAnimation)
			{
				return true;
			}
		}

		return false;
	}

	const createUUID = () => {
		var result;

		do
		{
			result = uuid();
		}
		while(result in MAP);

		return result;
	};

	Animation.create = function(_callback, _speed, _type = DEFAULT_TYPE, _throw = DEFAULT_THROW)
	{
		const callback = [];

		if(typeof _callback === 'function')
		{
			callback[0] = _callback;
		}
		else if(Array.isArray(_callback, false)) for(var i = 0, j = 0; i < _callback.length; ++i)
		{
			if(typeof _callback[i] === 'function')
			{
				callback[j++] = _callback[i];
			}
			else if(_throw)
			{
				return x('The %[%] is not a %', null, '_callback', i, 'Function');
			}
		}
		else if(_throw)
		{
			return x('Invalid % argument (neither a % nor an % of %s)', null, '_callback', 'Function', 'Array', 'Function');
		}
		else
		{
			return null;
		}

		if(callback.length === 0)
		{
			return x('No %(s) available (argue with a % or an % of %s)', null, 'callback', 'Function', 'Array', 'Function');
		}

		if(! Number.isNumber(_speed))
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting a %)', null, '_speed', 'Number');
			}

			return null;
		}
		else if(_speed <= 0)
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting a % greater than %)', null, '_speed', 'Number', 0);
			}

			return null;
		}

		if(String.isString(_type)) switch(_type = _type.toLowerCase())
		{
			case 'milliseconds':
			case 'millisecond':
			case 'ms':
			case 'm':
				_type = 'ms';
				break;
			case 'psin':
			case 'p':
				_type = 'psin';
				break;
			case 'sin':
			case 's':
				_type = 'sin';
				break;
			default:
				_type = null;
				break;
		}
		else
		{
			_type = null;
		}

		if(! _type)
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting one of [ %, %, % ])', null, '_type', 'ms', 'psin', 'sin');
			}

			return null;
		}
		else switch(_type)
		{
			case 'ms':
				if(CONVERT) switch(CONVERT.toLowerCase())
				{
					case 'ms':
						break;
					case 'sin':
						_speed = Animation.convert.ms2sin(_speed);
						_type = 'sin';
						break;
					case 'psin':
						_speed = Animation.convert.ms2psin(_speed);
						_type = 'psin';
						break;
				}
				break;
			case 'sin':
				if(CONVERT) switch(CONVERT.toLowerCase())
				{
					case 'ms':
						_speed = Animation.convert.sin2ms(_speed);
						_type = 'ms';
						break;
					case 'sin':
						break;
					case 'psin':
						_speed = Animation.convert.sin2psin(_speed);
						_type = 'psin';
						break;
				}
				break;
			case 'psin':
				if(CONVERT) switch(CONVERT.toLowerCase())
				{
					case 'ms':
						_speed = Animation.convert.psin2ms(_speed);
						_type = 'ms';
						break;
					case 'sin':
						_speed = Animation.convert.psin2sin(_speed);
						_type = 'sin';
						break;
					case 'psin':
						break;
				}
				break;
		}

		const result = Object.create(null);

		Object.defineProperty(result, 'speed', { enumerable: true, get: function()
		{
			return _speed;
		}});

		Object.defineProperty(result, 'type', { enumerable: true, get: function()
		{
			return _type;
		}});

		Object.defineProperty(result, 'isAnimation', { enumerable: true, get: function()
		{
			return true;
		}});

		//
		const UUID = createUUID();

		Object.defineProperty(result, 'uuid', { enumerable: true, get: function()
		{
			return UUID;
		}});

		Object.defineProperty(result, 'callback', { enumerable: true, get: function()
		{
			return callback;
		}});

		//
		result._PAUSE = false;
		result._STOPPED = false;

		Object.defineProperty(result, 'PAUSE', { enumerable: true,
			get: function()
			{
				return result._PAUSE;
			},
			set: function(_value)
			{
				if(typeof _value === 'boolean')
				{
					if(_value)
					{
						Animation.pause(result)
					}
					else
					{
						Animation.resume(result);
					}

					return result._PAUSE = _value;
				}

				return result._PAUSE;
			}
		});

		Object.defineProperty(result, '_PAUSE', { enumerable: true,
			get: function()
			{
				return Animation.pause;
			},
			set: function(_value)
			{
				return Animation.pause = _value;
			}
		});

		//
		result.scale = (_value, _max, _min, _int = false) => {
			return Animation.scale(_value, _max, _min, _int);
		};

		//
		result._stop = () => {
			return Animation.stop(result);
		};

		result.stopAll = () => {
			return Animation.stopAll();
		};

		result.pause = () => {
			return Animation.pause(result);
		};

		result.pauseAll = () => {
			return Animation.pauseAll();
		};

		result.resume = () => {
			return Animation.resume(result);
		};

		result.resumeAll = () => {
			return Animation.resumeAll();
		};

		result.reset = (_full_reset = false, _resume = true) => {
			if(_full_reset)
			{
				return Animation.reset(result, _resume);
			}

			result.milliseconds = 0;
			result.backward = false;
			result.fin = false;

			return ++result.resets;
		};

		result.resetAll = (_resume = true) => {
			return Animation.resetAll(_resume);
		};

		//
		result.global = null;
		result.count = 0n;

		result.lastValue = null;
		result.value = 0;
		result.delta = 0;
		result.milliseconds = 0;
		result.fin = false;
		result.fins = 0;
		result.resets = 0;
		result.backward = false;

		Object.defineProperty(result, 'seconds', { enumerable: true,
			get: function()
			{
				return (result.milliseconds / 1000);
			},
			set: function(_value)
			{
				if(Number.isNumber(_value) && _value >= 0)
				{
					result.milliseconds = Math.round(_value * 1000);
				}

				return (result.milliseconds / 1000);
			}
		});

		Object.defineProperty(result, 'animation', { enumerable: true, get: function()
		{
			return Animation;
		}});

		//
		return result;
	}

	Animation.convert = {};

	Animation.convert.ms2sin = function(_ms)
	{
		return (1600 / _ms);
	}

	Animation.convert.ms2psin = function(_ms)
	{
		return (3200 / _ms);
	}

	Animation.convert.sin2psin = function(_sin)
	{
		return (_sin);
	}

	Animation.convert.psin2sin = function(_psin)
	{
		return (_psin);
	}

	Animation.convert.sin2ms = function(_sin)
	{
		return Math.round(3200 / _sin);
	}

	Animation.convert.psin2ms = function(_psin)
	{
		return Math.round(1600 / _psin);
	}

	Animation.start = function(_callback, _speed, _type = DEFAULT_TYPE, _throw = DEFAULT_THROW)
	{
		//
		const result = Animation.create(_callback, _speed, _type, _throw);

		if(result === null)
		{
			return null;
		}

		//
		MAP[result.uuid] = result;
		LIST.push(result);

		//
		if(! Animation.FRAME.active)
		{
			Animation.request(_throw);
		}

		//
		return result;
	}

	Animation.stop = function(_id, _throw = DEFAULT_THROW)
	{
		if((_id = Animation.find(_id)) === null)
		{
			if(_throw)
			{
				return x('No match');
			}

			return null;
		}
		else
		{
			LIST.remove(_id);
			delete MAP[_id.uuid];
		}

		if(! Animation.active)
		{
			Animation.unrequest();
		}

		return true;
	}

	Animation.stopAll = function()
	{
		Animation.unrequest();
		Animation.reset(false);
	}

	Animation.pause = function(_id, _throw = DEFAULT_THROW)
	{
		//
		if((_id = Animation.find(_id)) === null)
		{
			if(_throw)
			{
				return x('No match');
			}

			return null;
		}
		else if(_id._PAUSE)
		{
			return false;
		}
		else
		{
			_id._PAUSE = true;
		}

		if(! Animation.active)
		{
			Animation.unrequest();
		}

		//
		return true;
	}

	Animation.pauseAll = function()
	{
		Animation.unrequest();

		if(PAUSE)
		{
			return false;
		}
		else
		{
			PAUSE = true;
		}

		Animation.unrequest();
		return true;
	}

	Animation.resume = function(_id, _throw = DEFAULT_THROW)
	{
		//
		if((_id = Animation.find(_id)) === null)
		{
			if(_throw)
			{
				return x('No match');
			}

			return null;
		}
		else if(! _id._PAUSE)
		{
			return false;
		}
		else
		{
			_id._PAUSE = false;
		}

		if(Animation.canRequest)
		{
			Animation.request(true);
		}

		//
		return true;
	}

	Animation.resumeAll = function()
	{
		if(! PAUSE)
		{
			return false;
		}
		else
		{
			PAUSE = false;
		}

		if(Animation.canRequest)
		{
			Animation.request(true);
		}

		return true;
	}

	Animation.reset = function(_id, _resume = true, _throw = DEFAULT_THROW)
	{
		if((_id = Animation.find(_id)) === null)
		{
			if(_throw)
			{
				return x('No match');
			}

			return null;
		}
		else
		{
			_id.global = null;
			_id.count = 0n;

			_id.lastValue = null;
			_id.value = 0;
			_id.delta = 0;
			_id.milliseconds = 0;
			_id.fin = false;
			_id.fins = 0;
			_id.backward = false;

			++_id.resets;
		}

		if(_resume)
		{
			_id.resume();
		}

		return _id;
	}

	Animation.resetAll = function(_resume = true)
	{
		//
		/*propagate('reset', {
			map: Animation.MAP,
			list: Animation.LIST
		});*/

		//
		const result = LIST.length;

		//
		MAP = Object.create(null);
		LIST.length = 0;

		//
		Animation.FRAME.last = null;
		Animation.FRAME.milliseconds = 0;
		Animation.FRAME.delta = 0;
		Animation.FRAME.count = 0n;

		//
		if(_resume)
		{
			PAUSE = false;
		}

		//
		return result;
	}

	Animation.find = function(_id, _throw = DEFAULT_THROW)
	{
		if(Animation.isAnimation(_id))
		{
			return _id;
		}
		else if(String.isString(_id))
		{
			if(_id in MAP)
			{
				return MAP[_id];
			}

			return null;
		}
		else if(Number.isInt(_id))
		{
			if(LIST.length === 0)
			{
				return null;
			}

			return LIST[_id = LIST.getIndex(_id)];
		}
		else if(_throw)
		{
			return x('No animation which matches your % could be found', null, '_id');
		}

		return null;
	}

	//
	/*
	const prepare = (_event, _type = _event.type) => {
		//
		if(! Object.isObject(_event))
		{
			_event = {};
		}

		if(String.isString(_type) && _type !== _event.type)
		{
			_event.type = _type;
		}

		//

		//
		return _event;
	};

	const propagate = (_type, _event) => {
		emitEvent(_type, _event);
		callCallbacks(_event, _type);
	};

	const emitEvent = (_type, _event) => {
		return Animation.emit(_type, _event = prepare(_event, _type));
	}

	const callCallbacks = (_event, _type) => {
		const event = prepare(_event, _type);

		for(var i = 0; i < LIST.length; ++i)
		{
			LIST[i].callback(_event);
		}

		return LIST.length;
	}*/

	//

})();
