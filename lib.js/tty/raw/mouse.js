(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_RADIX = 256;
	const DEFAULT_SIGNALS = true;
	const DEFAULT_LOOP_BACK = true;
	const DEFAULT_RESUME = true;
	const DEFAULT_HIGH_RESOLUTION = false;

	//
	if(typeof RAW === 'undefined')
	{
		return x('Please %(%) instead of only this % module \'%\'', null, 'require', 'tty/raw/'.quote(), 'Mouse', 'tty/raw/mouse');
	}

	//
	Mouse = module.exports = (require('core/event')).create();

	//
	if(typeof ansi === 'undefined')
	{
		require('tty/ansi');
	}

	//
	Mouse.STREAMS = [];

	Object.defineProperty(Mouse, 'streams', { get: function()
	{
		return [ ... Mouse.STREAMS ];
	}});

	Mouse.ID = Object.create(null);

	Object.defineProperty(Mouse, 'id', { get: function()
	{
		return Object.keys(Mouse.ID);
	}});

	Object.defineProperty(Mouse, 'isClean', { get: function()
	{
		return Mouse.STREAMS.length === 0;
	}});

	//
	Mouse.cleanUp = function(_throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(Mouse.STREAMS.length === 0)
		{
			return [];
		}

		//
		const result = new Array(Mouse.STREAMS.length);

		for(var i = Mouse.STREAMS.length - 1; i >= 0; --i)
		{
			result[i] = Mouse.disable((Mouse.STREAMS.splice(i, 1)[0]).rawID, _throw);
		}

		return result;
	}

	//
	Mouse.enable = function(_stream = process.stdio[0], _callback, _signals = DEFAULT_SIGNALS, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _signals !== 'boolean')
		{
			_signals = DEFAULT_SIGNALS;
		}

		if(typeof _callback !== 'function')
		{
			_callback = null;
		}

		//
		if(! Stream.isReadStream(_stream, true))
		{
			if(_stream === true)
			{
				_stream = process.stdio[0];
			}
			else if(_throw)
			{
				return x('Invalid % argument (not an instance of %)', null, '_stream', 'ReadStream');
			}
			else
			{
				return null;
			}
		}

		if(! String.isString(_stream.rawID))
		{
			_stream.rawID = null;
		}
		else if(RAW.rawType(_stream, 'mouse'))
		{
			if(_throw)
			{
				return x('Your % is already raw-enabled for RAW %', null, '_stream', 'Mouse');
			}

			return _stream.rawID;
		}

		//
		var result;

		if(_stream.rawID)
		{
			result = _stream.rawID;
		}
		else
		{
			const ids = RAW.id;

			do
			{
				result = uuid();
			}
			while(ids.indexOf(result) > -1);
		}

		//
		if(! Array.isArray(_stream.rawCallbacks, true))
		{
			_stream.rawCallbacks = [];
		}

		if(_callback)
		{
			_stream.rawCallbacks.push(_callback);
		}

		//
		_stream.mouseCallback = function(_data)
		{
			if(_stream.rawInfo.mouse.signals)
			{
				const byte = _data.charCodeAt(0);

				if(byte === 3)
				{
					return process.stop('SIGINT');
				}
				else if(byte === 4)
				{
					return process.stop('SIGQUIT');
				}
			}

			const result = Mouse.onMouse.call(_stream, _data);

			if(DEFAULT_LOOP_BACK && !result && _stream.rawType.indexOf('key') === -1)
			{
				if(_data === '\r')
				{
					_data = EOL;
				}

				_stream.write(_data);
			}

			return result;
		}

		_stream.on('data', _stream.mouseCallback);
		_stream.setRawMode(true);

		if(DEFAULT_RESUME)
		{
			_stream.resume();
		}

		_stream.write(ESC + '[?1006h' + NUL);
		_stream.write(ESC + '[?1003h' + NUL);

		//_stream.write(ESC + '[1000D' + NUL);

		//
		const info = { stream: _stream, RADIX: DEFAULT_RADIX, count: 0, sequence: [], signals: _signals, COUNT: 0, state: Object.null({
			button: [ false, false, false, false, false, false ],
			click: Object.null({ left: false, middle: false, right: false, up: false, down: false }),
			direction: Object.null({ left: false, right: false, up: false, down: false }),
			movement: Object.null({ left: 0, right: 0, up: 0, down: 0}),
			changed: Object.null({ x: false, y: false, any: false }),
			x: 0, y: 0
		}) };

		Object.defineProperty(info, 'radix', { enumerable: true,
			get: function()
			{
				return info.RADIX;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0 && _value <= 256)
				{
					if(_value === 0)
					{
						info.sequence.length = 0;
					}
					else if(_value !== info.RADIX)
					{
						info.sequence.applyLength(_value);
					}

					return info.RADIX = _value;
				}

				return info.RADIX;
			}
		});

		//
		RAW.addStream(_stream, result, 'mouse', info);

		//
		return (_stream.rawID = result);
	}

	Mouse.disable = function(_id, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(Mouse.id.length === 0)
		{
			if(_throw)
			{
				return x('There\'s currently no % RAW % defined', null, 'Mouse', 'Stream');
			}

			return null;
		}

		//
		var stream;

		if(Stream.isStream(_id, false))
		{
			stream = _id;
			_id = _id.rawID;
		}
		else
		{
			stream = null;
		}

		//
		if(! String.isString(_id))
		{
			if(_id === null || _id === true)
			{
				const ids = Mouse.id;
				const result = new Array(ids.length);

				for(var i = idx.length - 1; i >= 0; --i)
				{
					result[i] = Mouse.disable(ids[i], _throw);
				}

				return result;
			}
			else if(_throw)
			{
				return x('Please specify % argument (either the .% attribute of a %, or (%/%) to disable ALL streams', null, '_id', 'rawID', 'Stream', null, true);
			}

			return null;
		}
		else if(Mouse.id.indexOf(_id) === -1)
		{
			if(_throw)
			{
				return x('Invalid % argument (your % could not be found)', null, '_id', 'Mouse'.bold + '-ID');
			}

			return null;
		}

		//
		const result = (stream === null ? Mouse.ID[_id] : stream);

		//
		if(typeof result.mouseCallback === 'function')
		{
			result.off('data', result.mouseCallback);
		}

		//
		result.write(ESC + '[?1006l' + NUL);
		result.write(ESC + '[?1003l' + NUL);

		//
		var unsetRawMode = false;

		if(Array.isArray(result.rawType, false))
		{
			if(result.rawType.indexOf('key') === -1)
			{
				unsetRawMode = true;
			}
			else
			{
				unsetRawMode = false;
			}
		}
		else
		{
			unsetRawMode = true;
		}

		if(unsetRawMode)
		{
			result.setRawMode(false);
		}

		//
		delete result.rawCallbacks;

		//
		return RAW.removeStream(result, 'mouse', _throw);
	}

	//
	Mouse.onMouse = function(_data)
	{
		//
		const result = Mouse.decodeSequence(_data += NUL);

		if(result === null)
		{
			if(this.rawInfo.mouse.signals)
			{
				const byte = _data.charCodeAt(0);

				switch(byte)
				{
					case 3:
						return process.stop('SIGINT');
					case 4:
						return process.stop('SIGQUIT');
				}
			}

			return null;
		}

		//
		const state = Object.null(this.rawInfo.mouse.state = Mouse.checkState(result, this));

		if(! DEFAULT_HIGH_RESOLUTION && !state.changed.any)
		{
			return null;
		}

		//
		if(this.rawInfo.mouse.radix > 0)
		{
			this.rawInfo.mouse.sequence[this.rawInfo.mouse.count] = result;
		}
		else if(this.rawInfo.mouse.sequence.length > 0 || this.rawInfo.mouse.count > 0)
		{
			this.rawInfo.mouse.sequence.length = 0;
			this.rawInfo.mouse.count = 0;
		}

		//
		const self = this;
		const info = self.rawInfo.mouse;

		info.value = result;
		info.event = 'mouse';

		//
		Mouse.emitEvent.mouse(this, info, result, state);

		//
		++this.rawInfo.mouse.COUNT;

		if(this.rawInfo.mouse.radix > 0)
		{
			if(++this.rawInfo.mouse.count >= this.rawInfo.mouse.radix)
			{
				this.rawInfo.mouse.count = 0;
			}

			this.rawInfo.mouse.sequence.applyLength(-this.rawInfo.mouse.radix);
		}

		//
		return result;
	}

	//
	Mouse.emitEvent = {};

	Mouse.emitEvent.mouse = function(_this, ... _args)
	{
		var result = 0;

		if(_this.rawCallbacks) for(const cb of _this.rawCallbacks)
		{
			cb(... _args, _this);
			++result;
		}

		Mouse.emit('mouse', ... _args, _this.rawID, _this);
		RAW.emit('mouse', ... _args, _this.rawID, _this);

		return result;
	}

	//
	Mouse.checkState = function(_mouse, _stream)
	{
		//
		const state = _stream.rawInfo.mouse.state;

		//
		const noMovement = () => {
			state.changed.x = state.changed.y = false;

			state.direction.left = state.direction.right = false;
			state.direction.up = state.direction.down = false;

			state.movement.left = state.movement.right = 0;
			state.movement.up = state.movement.down = 0;

			return state;
		}

		const click = (_button = null, _click = null) => {
			if(Number.isInt(_button))
			{
				state.button[_button] = true;
			}
			else
			{
				state.button[_button = 0] = true;
			}

			if(String.isString(_click))
			{
				state.click[_click] = true;
			}
			else
			{
				state.click[_click = 'none'] = true;
			}

			for(var i = 0; i < state.button.length; ++i)
			{
				if(i !== _button)
				{
					state.button[i] = false;
				}
			}

			for(const idx in state.click)
			{
				if(idx !== _click)
				{
					state.click[idx] = false;
				}
			}
		}

		//
		state.changed.any = true;

		//
		if(_mouse.state === 'down')
		{
			click(_mouse.button, _mouse.click);
			noMovement();
		}
		else if(_mouse.state === 'up')
		{
			click(null, null);
			noMovement();
		}
		else if(_mouse.state === 'wheel')
		{
			click(_mouse.button, _mouse.click);
		}
		else //state == 'move'
		{
			const RESET_DIRECTION = true;
			click(0, 'none');

			if(_mouse.x > state.x)
			{
				state.direction.left = false;
				state.direction.right = true;
				state.changed.x = true;
			}
			else if(_mouse.x < state.x)
			{
				state.direction.left = true;
				state.direction.right = false;
				state.changed.x = true;
			}
			else
			{
				if(RESET_DIRECTION)
				{
					state.direction.left = state.direction.right = false;
				}

				state.changed.x = false;
			}

			if(_mouse.y > state.y)
			{
				state.direction.up = false;
				state.direction.down = true;
				state.changed.y = true;
			}
			else if(_mouse.y < state.y)
			{
				state.direction.up = true;
				state.direction.down = true;
				state.changed.y = true;
			}
			else
			{
				if(RESET_DIRECTION)
				{
					state.direction.up = state.direction.down = false;
				}

				state.changed.y = false;
			}

			state.movement.left = (state.x - _mouse.x);
			state.movement.right = (_mouse.x - state.x);
			state.movement.up = (state.y - _mouse.y);
			state.movement.down = (_mouse.y - state.y);

			state.x = _mouse.x;
			state.y = _mouse.y;

			state.changed.any = (state.changed.x || state.changed.y);
		}

		//
		return cloneStateObject(state);
	}

	function cloneStateObject(_state)
	{
		return Object.null(JSON.parse(JSON.stringify(_state)));
	};

	Mouse.decodeSequence = function(_data)
	{
		//
		const result = Object.create(null);

		//
		result.bytes = Uint8Array.fromString(result.chars = _data);

		//
		if(! ansi.isSeq(_data))
		{
			return null;
		}
		else
		{
			_data = ansi.unseq(_data);
		}

		if(! _data.startsWith('[<'))
		{
			return null;
		}
		else if(_data[_data.length - 1].toLowerCase() !== 'm')
		{
			return null;
		}

		switch(_data[_data.length - 1])
		{
			case 'M': result.state = 'down'; break;
			case 'm': result.state = 'up'; break;
			default: return null;
		}

		if((_data =  (_data = _data.removeFirst(2).removeLast()).split(';')).length !== 3)
		{
			return null;
		}
		else for(var i = 0; i < _data.length; ++i)
		{
			if((_data[i] = parseInt(_data[i])) === null || _data[i].isNaN)
			{
				return null;
			}
		}

		result.y = _data.pop();
		result.x = _data.pop();

		_data = _data[0];

		result.shift = !!(_data & 4);
		result.alt = !!(_data & 8);
		result.ctrl = !!(_data & 16);

		if(_data < 64) switch(_data & 3)
		{
			case 0:
				result.button = 1;
				result.click = 'left';
				break;
			case 1:
				result.button = 3;
				result.click = 'middle';
				break;
			case 2:
				result.button = 2;
				result.click = 'right';
				break;
			case 3:
				result.button = 0;
				result.click = 'none';
				result.state = 'move';
		}
		else
		{
			result.state = 'wheel';

			if(_data & 1)
			{
				result.button = 5;
				result.click = 'down';
			}
			else
			{
				result.button = 4;
				result.click = 'up';
			}
		}

		return result;
	}

})();
