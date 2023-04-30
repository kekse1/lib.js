(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_RADIX = 256;

	//
	if(typeof RAW === 'undefined')
	{
		return x('Please %(%) instead of only this % module \'%\'', null, 'require', 'tty/raw/'.quote(), 'Screen', 'tty/raw/screen');
	}

	//
	Screen = module.exports = (require('core/event')).create();

	//
	Screen.STREAMS = [];

	Object.defineProperty(Screen, 'streams', { get: function()
	{
		return [ ... Screen.STREAMS ];
	}});

	Screen.ID = Object.create(null);

	Object.defineProperty(Screen, 'id', { get: function()
	{
		return Object.keys(Screen.ID);
	}});

	Object.defineProperty(Screen, 'isClean', { get: function()
	{
		return Screen.STREAMS.length === 0;
	}});

	//
	Screen.cleanUp = function(_throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(Screen.STREAMS.length === 0)
		{
			return [];
		}
		else if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		const result = new Array(Screen.STREAMS.length);

		for(var i = Screen.STREAMS.length - 1; i >= 0; --i)
		{
			result[i] = Screen.disable(Screen.STREAMS.splice(i, 1)[0], _throw);
		}

		return result;
	}

	//
	Screen.enable = function(_stream = process.stdio[1], _callback = null, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _callback !== 'function')
		{
			_callback = null;
		}

		//
		if(! Stream.isWriteStream(_stream, true))
		{
			if(_stream === true)
			{
				_stream = process.stdio[1];
			}
			else if(_throw)
			{
				return x('Invalid % argument (not an instance of %)', null, '_stream', 'WriteStream');
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
		else if(RAW.rawType(_stream, 'screen'))
		{
			if(_throw)
			{
				return x('Your % is already raw-enabled for RAW %', null, '_stream', 'Screen');
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
		_stream.screenCallback = function(... _args)
		{
			return Screen.onResize.call(_stream);
		}

		_stream.on('resize', _stream.screenCallback);

		//
		const info = { stream: _stream, RADIX: DEFAULT_RADIX, count: 0, sequence: [], COUNT: 0 };

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
		RAW.addStream(_stream, result, 'screen', info);

		//
		return (_stream.rawId = result);
	}

	Screen.disable = function(_id, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(Screen.id.length === 0)
		{
			if(_throw)
			{
				return x('There\'s currently no % RAW % defined', null, 'Screen', 'Stream');
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
				const ids = Screen.id;
				const result = new Array(ids.length);

				for(var i = ids.length - 1; i >= 0; --i)
				{
					result[i] = Screen.disable(ids[i], _throw);
				}

				return result;
			}
			else if(_throw)
			{
				return x('Please specify % argument (either a % or it\'s .%, or (%/%) to disable ALL streams', null, '_id', 'Stream', 'rawID', null, true);
			}

			return null;
		}
		else if(Screen.id.indexOf(_id) === -1)
		{
			if(_throw)
			{
				return x('Invalid % argument (your % could not be found)', null, '_id', 'Screen'.bold + '-ID');
			}

			return null;
		}

		//
		const result = (stream === null ? Screen.ID[_id] : stream);

		//
		if(typeof result.screenCallback === 'function')
		{
			result.off('resize', result.screenCallback);
		}

		//
		delete result.rawCallbacks;

		//
		return RAW.removeStream(result, 'screen', _throw);
	}

	//
	Screen.onResize = function()
	{
		//
		const result = Object.create(null);

		//
		result.width = (typeof this.columns === 'number' ? this.columns : 0);
		result.height = (typeof this.rows === 'number' ? this.rows : 0);
		result.depth = (typeof this.getColorDepth === 'function' ? this.getColorDepth() : 0);
		result.colors = (2 ** result.depth);

		//
		if(this.rawInfo.screen.radix > 0)
		{
			this.rawInfo.screen.sequence[this.rawInfo.screen.count] = result;
		}
		else if(this.rawInfo.screen.sequence.length > 0 || this.rawInfo.screen.count > 0)
		{
			this.rawInfo.screen.sequence.length = 0;
			this.rawInfo.screen.count = 0;
		}

		//
		const self = this;
		const info = self.rawInfo.screen;

		info.value = result;
		info.event = 'resize';

		//
		Screen.emitEvent.resize(this, info, result);

		//
		++this.rawInfo.screen.COUNT;

		if(this.rawInfo.screen.radix > 0)
		{
			if(++this.rawInfo.screen.count >= this.rawInfo.screen.radix)
			{
				this.rawInfo.screen.count = 0;
			}

			this.rawInfo.screen.sequence.applyLength(-this.rawInfo.screen.radix);
		}

		//
		return result;
	}

	//
	Screen.emitEvent = {};

	Screen.emitEvent.resize = function(_this, ... _args)
	{
		var result = 0;

		if(_this.rawCallbacks) for(const cb of _this.rawCallbacks)
		{
			cb(... _args, _this);
			++result;
		}

		Screen.emit('resize', ... _args, _this.rawID, _this);
		RAW.emit('resize', ... _args, _this.rawID, _this);

		return result;
	}

	//

})();
