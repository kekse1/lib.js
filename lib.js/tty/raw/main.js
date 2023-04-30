(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_SIGNALS = true;
	const DEFAULT_PAUSE = true;

	//
	RAW = raw = module.exports = (require('core/event')).create();

	//
	RAW.Screen = RAW.screen = require('tty/raw/screen');
	RAW.Key = RAW.key = require('tty/raw/key');
	RAW.Mouse = RAW.mouse = require('tty/raw/mouse');

	//
	Object.defineProperty(RAW, 'ID', { get: function()
	{
		const result = Object.create(null);

		Object.prototype.assign.call(result, RAW.Screen.ID);
		Object.prototype.assign.call(result, RAW.Key.ID);
		Object.prototype.assign.call(result, RAW.Mouse.ID);

		return result;
	}});

	Object.defineProperty(RAW, 'id', { get: function()
	{
		const result = [];

		result.concat(RAW.Screen.id);
		result.concat(RAW.Key.id);
		result.concat(RAW.Mouse.id);

		return result;
	}});

	//
	Object.defineProperty(RAW, 'streams', { get: function()
	{
		const result = [];

		result.concat(RAW.Key.STREAMS);
		result.concat(RAW.Mouse.STREAMS);
		result.concat(RAW.Screen.STREAMS);

		return result;
	}});

	RAW.getStream = function(_id_stream, _get_stream = true, _throw = DEFAULT_THROW)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(Stream.isStream(_id_stream))
		{
			if(RAW.streams.indexOf(_id_stream) > -1)
			{
				return _id_stream;
			}
			else if(_throw)
			{
				return x('This % was not found', null, 'stream');
			}
		}
		else if(String.isString(_id_stream))
		{
			const streams = RAW.streams;

			for(const s of streams)
			{
				if(s.rawID === _id_stream)
				{
					return s;
				}
			}

			if(_throw)
			{
				return x('There\'s no % with the % \'%\' available', null, 'Stream', 'ID', _id_stream);
			}
		}
		else if(_get_stream && (_id_stream = process.getStream(_id_stream, null, false, false, false)) !== null)
		{
			return _id_stream;
		}
		else if(_throw)
		{
			return x('The % argument needs to be a non-empty % or a %', null, '_id_stream', 'String', 'Stream');
		}

		return null;
	}

	RAW.hasStream = function(_id_stream, _throw = DEFAULT_THROW)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(Stream.isStream(_id_stream))
		{
			return (RAW.streams.indexOf(_id_stream) > -1);
		}
		else if(String.isString(_id_stream))
		{
			return (RAW.id.indexOf(_id_stream) > -1);
		}
		else if(_throw)
		{
			return x('The % argument needs to be a % or a non-empty %', null, '_id_stream', 'Stream', 'String');
		}
		else
		{
			return null;
		}

		return false;
	}

	//
	Object.defineProperty(RAW, 'isClean', { get: function()
	{
		return (RAW.Screen.isClean && RAW.Key.isClean && RAW.Mouse.isClean);
	}});

	RAW.cleanUp = function(_throw = DEFAULT_THROW)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		const result = [];

		result.concat(RAW.Screen.cleanUp(_throw));
		result.concat(RAW.Key.cleanUp(_throw));
		result.concat(RAW.Mouse.cleanUp(_throw));

		return result;
	}

	//
	RAW.isRawID = function(_id)
	{
		if(String.isString(_id))
		{
			return true;
		}

		return false;
	}

	//
	Object.defineProperty(RAW, 'types', { get: function()
	{
		return [ 'key', 'mouse', 'screen' ];
	}});

	//
	RAW.enable = function(_options = true, _callback = null, _signals = DEFAULT_SIGNALS, _throw = DEFAULT_THROW)
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

		if(typeof _options === 'function')
		{
			_callback = _options;
			_options = true;
		}
		else if(typeof _callback !== 'function')
		{
			_callback = null;
		}

		//
		const types = RAW.types;

		//
		const result = Object.create(null);

		if(Object.isObject(_options))
		{
			var item;

			for(const idx in _options)
			{
				if(types.indexOf(idx) === -1)
				{
					continue;
				}
				else
				{
					item = Object.create(null);
				}

				var s;

				if(Stream.isStream(_options[idx], true))
				{
					item.stream = _options[idx];
				}
				else if((s = process.getStream(_options[idx], null, true, false, false)) !== null)
				{
					item.stream = s;
				}
				else if(Object.isObject(_options[idx]))
				{
					if(Stream.isStream(_options[idx].stream, true))
					{
						item.stream = _options[idx].stream;
					}
					else if(typeof _options[idx].stream === 'boolean')
					{
						if(_options[idx].stream)
						{
							item.stream = true;
						}
						else
						{
							continue;
						}
					}
					else if(_throw)
					{
						return x('No .% could be found in % with index \'%\'', null, 'stream', 'Object', idx);
					}
					else
					{
						continue;
					}

					if(('callback' in item) && typeof item.callback !== 'function')
					{
						delete item.callback;
					}
				}
				else if(typeof _options[idx] === 'function')
				{
					item.callback = _options[idx];
				}
				else if(typeof _options[idx] === 'boolean')
				{
					if(_options[idx])
					{
						item.stream = true;
					}
					else
					{
						continue;
					}
				}
				else if(_throw)
				{
					return x('Invalid % at index \'%\' (neither an %, nor a % or a % type)', null, 'item', idx, 'Object', 'Stream', 'Boolean');
				}
				else
				{
					continue;
				}

				if(typeof item.throw !== 'boolean')
				{
					item.throw = _throw;
				}

				if(typeof item.signals !== 'boolean')
				{
					item.signals = _signals;
				}

				if(typeof item.callback !== 'function' && _callback)
				{
					item.callback = _callback;
				}

				result[idx] = item;
			}
		}
		else if(typeof _options === 'boolean')
		{
			if(! _options)
			{
				return null;
			}

			const types = RAW.types;

			for(const t of types)
			{
				result[t] = Object.null({
					stream: true,
					throw: _throw,
					signals: _signals
				});

				if(_callback)
				{
					result[t].callback = _callback;
				}
			}
		}
		else if(_throw)
		{
			return x('Your % argument needs to be an %', null, '_options', 'Object');
		}
		else
		{
			return null;
		}

		//
		if(result.LEN === 0)
		{
			if(_throw)
			{
				return x('Did not found % RAW type (available ones are [ %, %, % ])', null, 'type', 'key', 'mouse', 'screen');
			}

			return null;
		}

		//
		for(const idx in result)
		{
			switch(idx)
			{
				case 'key':
					result[idx] = RAW.Key.enable(result[idx].stream, result[idx].callback, result[idx].signals, result[idx].throw);
					break;
				case 'mouse':
					result[idx] = RAW.Mouse.enable(result[idx].stream, result[idx].callback, result[idx].signals, result[idx].throw);
					break;
				case 'screen':
					result[idx] = RAW.Screen.enable(result[idx].stream, result[idx].callback, result[idx].signals, result[idx].throw);
					break;
			}
		}

		//
		return result;
	}

	RAW.disable = function(_options = true, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		const options = [];

		if(typeof _options === 'boolean')
		{
			if(_options)
			{
				const ids = RAW.id;

				if(ids.length === 0)
				{
					if(_throw)
					{
						return x('There are currently no %s available', null, 'Stream');
					}

					return null;
				}
				else for(var i = 0; i < ids.length; ++i)
				{
					options[i] = RAW.getStream(ids[i], true, _throw);
				}
			}
			else
			{
				return null;
			}
		}
		else if(String.isString(_options))
		{
			if((options[0] = RAW.getStream(_options, true, _throw)) === null)
			{
				return null;
			}
		}
		else if(Stream.isStream(_options, false))
		{
			if((options[0] = RAW.getStream(_options, true, _throw)) === null)
			{
				return null;
			}
		}
		else if(Array.isArray(_options, false))
		{
			for(var i = 0, j = 0; i < _options.length; ++i)
			{
				if(String.isString(_options[i]))
				{
					if((options[j++] = RAW.getStream(_options[i], true, _throw)) === null)
					{
						options.splice(j--, 1);
					}
				}
				else if(Stream.isStream(_options[i], false))
				{
					if((options[j++] = RAW.getStream(_options[i], true, _throw)) === null)
					{
						options.splice(j--, 1);
					}
				}
				else if(_throw)
				{
					return x('Invalid %[%] argument (neither a non-empty % nor a % instance)', null, '_options', i, 'String', 'Stream');
				}
			}
		}
		else if(Object.isObject(_options))
		{
			const stream = [];
			const testRawInfo = [ 'screen', 'mouse', 'key' ];

			for(const tri of testRawInfo)
			{
				if(tri in _options)
				{
					if(Stream.isStream(_options[tri].stream))
					{
						stream.push(_options[tri].stream);
					}
					else if(RAW.isRawID(_options[tri]))
					{
						for(const s of RAW.streams)
						{
							if(s.rawID === _options[tri])
							{
								stream.push(s);
							}
						}
					}
				}
			}

			const types = RAW.types;
			const keys = Object.keys(_options);

			if(stream.length === 0)
			{
				if(keys.length === 0)
				{
					if(_throw)
					{
						return x('Your % % doesn\'t contain any usable information (neither %s nor % %s)', null, '_options', 'Object', 'Stream', 'Stream', 'ID');
					}

					return null;
				}
				else
				{
					var s;

					for(var i = 0, j = stream.length; i < keys.length; ++i)
					{
						if((s = RAW.getStream(_options[keys[i]], true, _throw)) === null)
						{
							continue;
						}
						else if(s.rawType.indexOf(keys[i]) === -1)
						{
							if(_throw)
							{
								return x('This % does not serve for a % \'%\'', null, 'Stream', 'RAW type', keys[i]);
							}

							continue;
						}
						else
						{
							stream[j++] = s;
						}
					}
				}

				if(stream.length > 0)
				{
					options.concatUnique(stream);
				}
				else if(_throw)
				{
					return x('No % found in %', null, 'Stream', 'Object');
				}
				else
				{
					return null;
				}
			}
			else
			{
				options.concatUnique(stream);
			}
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting a % type, a %, a non-empty % or a non-empty %)', null, '_options', 'Boolean', 'Stream', 'Array', 'String');
		}
		else
		{
			return null;
		}

		//
		if(options.length === 0)
		{
			if(_throw)
			{
				return x('There\'s only an empty % left right now..', null, 'Array');
			}

			return null;
		}

		//
		var types, res, id, stream;
		const result = Object.create(null);

		for(var i = 0; i < options.length; ++i)
		{
			stream = options[i];

			id = stream.rawID;
			res = Object.create(null);

			if(Array.isArray(stream.rawType, false))
			{
				types = [ ... stream.rawType ];
			}
			else
			{
				continue;
			}

			for(const t of types) switch(t)
			{
				case 'key':
					res[t] = RAW.Key.disable(stream, _throw);
					break;
				case 'mouse':
					res[t] = RAW.Mouse.disable(stream, _throw);
					break;
				case 'screen':
					res[t] = RAW.Screen.disable(stream, _throw);
					break;
			}

			if(Object.LEN(res) > 0)
			{
				result[id] = res;
			}
		}

		return result;
	}

	//
	RAW.rawType = function(_id_stream, _type, _throw = DEFAULT_THROW)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		var stream;

		if(String.isString(_id_stream))
		{
			stream = RAW.getStream(_id_stream, true, _throw);
		}
		else if(Stream.isStream(_id_stream, false))
		{
			stream = RAW.getStream(_id_stream, true, _throw);
		}
		else
		{
			stream = null;
		}

		if(stream)
		{
			if(! Array.isArray(stream.rawType, false))
			{
				return [];
			}
			else if(stream.rawType.length === 0)
			{
				return [];
			}
		}

		if(String.isString(_type))
		{
			_type = [ _type ];
		}
		else if(! Array.isArray(_type, false))
		{
			_type = [];
		}
		else if(_type.length === 0)
		{
			_type = [];
		}

		if(stream === null)
		{
			const streams = RAW.streams;

			if(streams.length === 0)
			{
				return [];
			}
			else if(_type.length === 0)
			{
				const result = Object.null({ key: [], mouse: [], screen: [] });

				for(var i = 0; i < streams.length; ++i)
				{
					for(const t of streams[i].rawType)
					{
						result[t].pushUnique(streams[i].rawID);
					}
				}

				return result;
			}
			else
			{
				const result = Object.create(null);

				for(var i = 0; i < streams.length; ++i)
				{
					result[streams[i].rawID] = [];

					for(const t of streams[i].rawType)
					{
						result[streams[i].rawID].push(t);
					}
				}

				return result;
			}
		}

		const types = RAW.types;

		for(var i = 0; i < _type.length; ++i)
		{
			if(types.indexOf(_type[i] = _type[i].toLowerCase()) === -1)
			{
				if(_throw)
				{
					return x('Your %[%] is not valid (expecting at least one of [ %, %, % ])', null, '_type', i, 'key', 'mouse', 'screen');
				}

				_type.splice(i--, 1);
			}
		}

		if(_type.length === 0)
		{
			_type = null;
		}

		if(_type)
		{
			for(const t of stream.rawType)
			{
				for(var i = 0; i < _type.length; ++i)
				{
					if(_type[i] === t)
					{
						return true;
					}
				}
			}

			return false;
		}

		return [ ... stream.rawType ];
	}

	RAW.addStream = function(_stream, _id, _raw_type, _info)
	{
		//
		if(! Stream.isStream(_stream, true))
		{
			return x('Invalid % argument (not a real % instance)', null, '_stream', 'Stream');
		}
		else if(! String.isString(_id))
		{
			return x('Invalid % argument (not a non-empty %)', null, '_id', 'String');
		}
		else if(! String.isString(_raw_type))
		{
			return x('Invalid % argument (not a non-empty %)', null, '_raw_type', 'String');
		}
		else if(! Object.isObject(_info))
		{
			_info = {};
		}

		//
		if(RAW.isRawID(_stream.rawID) && _stream.rawID !== _id)
		{
			return x('Your % already has a .% set (which is not like your new one)', null, '_stream', 'rawID');
		}
		else
		{
			_stream.rawID = _id;
		}

		if(Array.isArray(_stream.rawType, true))
		{
			if(_stream.rawType.indexOf(_raw_type = _raw_type.toLowerCase()) > -1)
			{
				return x('This % (%) is already configured for % \'%\'', null, '_stream', _stream.rawID.quote(), 'stream type', _raw_type);
			}
		}
		else
		{
			_stream.rawType = [];
		}

		//
		switch(_raw_type = _raw_type.toLowerCase())
		{
			case 'mouse':
				Mouse.STREAMS.pushUnique(_stream);
				Mouse.ID[_id] = _stream;
				break;
			case 'key':
				Key.STREAMS.pushUnique(_stream);
				Key.ID[_id] = _stream;
				break;
			case 'screen':
				Screen.STREAMS.pushUnique(_stream);
				Screen.ID[_id] = _stream;
				break;
			default:
				return x('Invalid % argument (needs to be one of [ %, %, % ])', '_raw_type', 'mouse', 'key', 'screen');
		}

		//
		if(! Object.isObject(_stream.rawInfo))
		{
			_stream.rawInfo = {};
		}

		if(! Object.isObject(_stream.rawInfo[_raw_type]))
		{
			_stream.rawInfo[_raw_type] = { id: _stream.rawID, type: _raw_type };
		}

		_stream.rawInfo[_raw_type].assign(_info);

		//
		_stream.rawType.pushUnique(_raw_type);

		//
		return _stream;
	}

	//
	RAW.removeStream = function(_id, _raw_type, _throw = DEFAULT_THROW)
	{
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

		if(! String.isString(_id))
		{
			if(_throw)
			{
				return x('Invalid or missing % argument (it\'s the .% attribute of a %)', null, '_id', 'rawID', 'String');
			}

			return null;
		}
		else if(RAW.id.indexOf(_id) === -1)
		{
			if(_throw)
			{
				return x('Invalid % argument (stream could not be found)', null, '_id');
			}

			return null;
		}

		if(String.isString(_raw_type)) switch(_raw_type = _raw_type.toLowerCase())
		{
			case 'mouse':
			case 'key':
			case 'screen':
				break;
			default:
				_raw_type = null;
				break;
		}
		else
		{
			_raw_type = null;
		}

		//
		const result = (stream === null ? RAW.ID[_id] : stream);

		//
		if(_raw_type) switch(_raw_type)
		{
			case 'mouse':
				Mouse.STREAMS.remove(result);
				delete Mouse.ID[_id];
				result.rawType.remove('mouse');
				delete result.rawInfo[_raw_type];
				break;
			case 'key':
				Key.STREAMS.remove(result);
				delete Key.ID[_id];
				result.rawType.remove('key');
				delete result.rawInfo[_raw_type];
				break;
			case 'screen':
				Screen.STREAMS.remove(result);
				delete Screen.ID[_id];
				result.rawType.remove('screen');
				delete result.rawInfo[_raw_type];
				break;
		}
		else for(var i = result.rawType.length - 1; i >= 0; --i)
		{
			switch(result.rawType[i])
			{
				case 'mouse':
					Mouse.STREAMS.remove(result);
					delete Mouse.ID[_id];
					result.rawType.splice(i, 1);
					break;
				case 'key':
					Key.STREAMS.remove(result);
					delete Key.ID[_id];
					result.rawType.splice(i, 1);
					break;
				case 'screen':
					Screen.STREAMS.remove(result);
					delete Screen.ID[_id];
					result.rawType.splice(i, 1);
					break;
			}
		}

		//
		if(!Array.isArray(result.rawType, false))
		{
			//
			delete result.rawType;
			delete result.rawID;
			delete result.rawInfo;

			//
			if(DEFAULT_PAUSE)
			{
				result.pause();
			}

			//
			return true;
		}

		//
		return false;
	}

	//
	RAW.pause = function(_id_stream, _throw = DEFAULT_THROW)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		const stream = RAW.getStream(_id_stream, true, _throw);

		if(stream === null)
		{
			return null;
		}
		else if(typeof stream.pause !== 'function')
		{
			if(_throw)
			{
				return x('There\'s no .% function in your %', null, 'pause()', 'Stream');
			}

			return false;
		}

		stream.pause();
		return true;
	}

	RAW.resume = function(_id_stream, _throw = DEFAULT_THROW)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		const stream = RAW.getStream(_id_stream, true, _throw);

		if(stream === null)
		{
			return null;
		}
		else if(typeof stream.resume !== 'function')
		{
			if(_throw)
			{
				return x('There\'s no .% function in your %', null, 'resume()', 'Stream');
			}

			return false;
		}

		stream.resume();
		return true;
	}

	//

})();
