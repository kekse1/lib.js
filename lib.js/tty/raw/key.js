(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_RADIX = 256;

	const DEFAULT_SIGNALS = true;
	const DEFAULT_RESUME = true;

	//
	if(typeof RAW === 'undefined')
	{
		return x('Please %(%) instead of only this % module \'%\'', null, 'require', 'tty/raw/'.quote(), 'Key', 'tty/raw/key');
	}

	//
	Key = module.exports = (require('core/event')).create();

	//
	Key.readline = require('+readline');

	//
	Key.STREAMS = [];

	Object.defineProperty(Key, 'streams', { get: function()
	{
		return [ ... Key.STREAMS ];
	}});

	Key.ID = Object.create(null);

	Object.defineProperty(Key, 'id', { get: function()
	{
		return Object.keys(Key.ID);
	}});

	Object.defineProperty(Key, 'isClean', { get: function()
	{
		return Key.STREAMS.length === 0;
	}});

	//
	Key.cleanUp = function(_throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(Key.STREAMS.length === 0)
		{
			return [];
		}

		//
		const result = new Array(Key.STREAMS.length);

		for(var i = Key.STREAMS.length - 1; i >= 0; --i)
		{
			result[i] = Key.disable(Key.STREAMS.splice(i, 1)[0], _throw);
		}

		return result;
	}

	//
	Key.enable = function(_stream = process.stdio[0], _callback, _signals = DEFAULT_SIGNALS, _throw = DEFAULT_THROW)
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

		if(! RAW.isRawID(_stream.rawID))
		{
			_stream.rawID = null;
		}
		else if(RAW.rawType(_stream, 'key'))
		{
			if(_throw)
			{
				return x('Your % is already raw-enabled for RAW %', null, '_stream', 'Key');
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
		_stream.keyCallback = function(_string, _key)
		{
			return Key.onKey.call(_stream, _key, _string);
		}

		_stream.keyDataCallback = function(_data)
		{
			return Key.onKeyData.call(_stream, _data);
		}

		_stream.on('keypress', _stream.keyCallback);
		_stream.on('data', _stream.keyDataCallback);
		Key.readline.emitKeypressEvents(_stream);
		_stream.setRawMode(true);

		if(DEFAULT_RESUME)
		{
			_stream.resume();
		}

		//
		const info = { stream: _stream, RADIX: DEFAULT_RADIX, byteCount: 0, keyCount: 0, keySequence: [], byteSequence: [], signals: _signals, keyCOUNT: 0, byteCOUNT: 0, mouseCatched: 0n, catchingMouse: false };

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
						info.keySequence.length = 0;
						info.byteSequence.length = 0;
					}
					else if(_value !== info.RADIX)
					{
						info.keySequence.applyLength(_value);
						info.byteSequence.applyLength(_value);
					}

					return info.RADIX = _value;
				}

				return info.RADIX;
			}
		});

		//
		RAW.addStream(_stream, result, 'key', info);

		//
		return (_stream.rawID = result);
	}

	Key.disable = function(_id, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if(Key.id.length === 0)
		{
			if(_throw)
			{
				return x('There\'s currently no % RAW % defined', null, 'Key', 'Stream');
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
		if(! RAW.isRawID(_id))
		{
			if(_id === null || _id === true)
			{
				const ids = Key.id;
				const result = new Array(ids.length);

				for(var i = ids.length - 1; i >= 0; --i)
				{
					result[i] = Key.disable(ids[i], _throw);
				}

				return result;
			}
			else if(_throw)
			{
				return x('Please specify % argument (either a % or it\'s .%, or (%/%) to disable ALL streams', null, '_id', 'Stream', 'rawID', null, true);
			}

			return null;
		}
		else if(Key.id.indexOf(_id) === -1)
		{
			if(_throw)
			{
				return x('Invalid % argument (your % could not be found)', null, '_id', 'Key'.bold + '-ID');
			}

			return null;
		}

		//
		const result = (stream === null ? Key.ID[_id] : stream);

		//
		if(typeof result.keyCallback === 'function')
		{
			result.off('keypress', result.keyCallback);
		}

		if(typeof result.keyDataCallback === 'function')
		{
			result.off('data', result.keyDataCallback);
		}

		//
		var unsetRawMode;

		if(Array.isArray(result.rawType, false))
		{
			if(result.rawType.indexOf('mouse') === -1)
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
		return RAW.removeStream(result, 'key', _throw);
	}

	//
	Key.onKeyData = function(_data)
	{
		//
		if(this.rawInfo.key.catchingMouse)
		{
			return this.rawInfo.key.mouseCatched;
		}
		else if(_data.charCodeAt(0) === 27 && _data.charCodeAt(1) === 91)
		{
			return this.rawInfo.key.mouseCatched;
		}

		//
		var byte;

		if(_data.length === 0)
		{
			byte = null;
		}
		else if(_data.length === 1)
		{
			byte = _data.codePointAt(0);
		}
		else
		{
			byte = dataToUint8Array(_data);
		}

		if(this.rawInfo.key.signals)
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

		//
		if(this.rawInfo.key.radix > 0)
		{
			this.rawInfo.key.byteSequence[this.rawInfo.key.byteCount] = byte;
		}
		else if(this.rawInfo.key.byteSequence.length > 0 || this.rawInfo.key.byteCount > 0)
		{
			this.rawInfo.key.byteSequence.length = 0;
			this.rawInfo.key.byteCount = 0;
		}

		//
		const self = this;
		const info = self.rawInfo.key;

		info.value = byte;
		info.event = 'byte';

		//
		Key.emitEvent.byte(this, info, byte);

		//
		++this.rawInfo.key.byteCOUNT;

		if(this.rawInfo.key.radix > 0)
		{
			if(++this.rawInfo.key.byteCount >= this.rawInfo.key.radix)
			{
				this.rawInfo.key.byteCount = 0;
			}

			this.rawInfo.key.byteSequence.applyLength(-this.rawInfo.key.radix);
		}

		//
		return byte;
	}

	Key.onKey = function(_key, _string)
	{
		//
		if(this.rawInfo.key.signals && _key.ctrl) switch(_key.name)
		{
			case 'c': return process.stop('SIGINT');
			case 'd': return process.stop('SIGQUIT');
			default: break;
		}

		//
		if(! ('code' in _key))
		{
			_key.code = '';
		}

		//
		if(this.rawInfo.key.catchingMouse)
		{
			if(_key.sequence.toLowerCase() === 'm')
			{
				this.rawInfo.key.catchingMouse = false;
			}

			return this.rawInfo.key.mouseCatched;
		}
		else if(_key.code === '[<')
		{
			this.rawInfo.key.catchingMouse = true;
			return ++this.rawInfo.key.mouseCatched;
		}

		//
		if(typeof _string === 'string')
		{
			if((_key.string = _string) === '\r')
			{
				_string = _key.string = EOL;
			}
		}
		else
		{
			_string = _key.string = (_key.name.length === 1 ? _key.name : '');
		}

		//
		if(this.rawInfo.key.radix > 0)
		{
			this.rawInfo.key.keySequence[this.rawInfo.key.keyCount] = _key;
		}
		else if(this.rawInfo.key.keySequence.length > 0 || this.rawInfo.key.keyCount > 0)
		{
			this.rawInfo.key.keySequence.length = 0;
			this.rawInfo.key.keyCount = 0;
		}

		//
		const self = this;
		const info = self.rawInfo.key;

		info.value = _key;
		info.event = 'key';

		//
		Key.emitEvent.key(this, info, _key);

		//
		++this.rawInfo.key.keyCOUNT;

		if(this.rawInfo.key.radix > 0)
		{
			if(++this.rawInfo.key.keyCount >= this.rawInfo.key.radix)
			{
				this.rawInfo.key.keyCount = 0;
			}

			this.rawInfo.key.keySequence.applyLength(-this.rawInfo.key.radix);
		}

		//
		return _key;
	}

	//
	Key.emitEvent = {};

	Key.emitEvent.key = function(_this, ... _args)
	{
		var result = 0;

		if(_this.rawCallbacks) for(const cb of _this.rawCallbacks)
		{
			cb(... _args, _this);
			++result;
		}

		Key.emit('key', ... _args, _this.rawID, _this);
		RAW.emit('key', ... _args, _this.rawID, _this);

		return result;
	}

	Key.emitEvent.byte = function(_this, ... _args)
	{
		var result = 0;

		if(_this.rawCallbacks) for(const cb of _this.rawCallbacks)
		{
			cb(... _args, _this);
			++result;
		}

		Key.emit('byte', ... _args, _this.rawID, _this);
		RAW.emit('byte', ... _args, _this.rawID, _this);

		return result;
	}

	//

})();
