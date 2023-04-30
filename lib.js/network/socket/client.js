(function()
{

	//
	const Socket = require('network/socket/');

	//
	Client = module.exports = class Client extends Socket
	{
		constructor(_options)
		{
dir(this.constructor.name,'constr..name');
			super(_options);
			this.radixStream = RADIX.create(_options);
			return this.PROXY = new Proxy(this, Client.getProxyOptions(this));
		}

		static getProxyOptions(_this)
		{
			const result = {};

			result.get = (_target, _property, _receiver) => {
				if(! isNaN(_property))
				{
					_property = getIndex(Number(_property), _target.radixStream.length);
					return _target.radixStream[_property];
				}

				return _target[_property];
			};

			result.set = (_target, _property, _value, _receiver) => {
				if(! isNaN(_property) && typeof _value === 'string')
				{
					_property = getIndex(Number(_property), _target.radixStream.length);
					_target.radixStream.replace(_property, _value);
					return true;
				}

				_target[_property] = _value;
				return true;
			};

			return result;
		}

		static get socketEvents()
		{
			return [ 'close', 'connect', 'data', 'drain', 'end', 'error', 'lookup', 'ready', 'timeout' ];
		}

		static create(... _args)
		{
			const options = Object.assign(... _args);

			for(var i = 0; i < _args.length; ++i)
			{
				if(Object.is(_args[i], 'Socket'))
				{
					options.socket = _args[i];
				}
			}

			return new this(options);
		}

		static connect(... _args)
		{
			const options = Object.assign(... _args);
			const socket = net.createConnection(options);
			return new this(Object.assign(options, { socket });
		}

		get readOnly()
		{
			if(typeof this.options.readOnly === 'boolean')
			{
				return this.options.readOnly;
			}

			return DEFAULT_READ_ONLY;
		}
		
		set readOnly(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.readOnly = _value;
			}
			
			return this.readOnly;
		}

		get socket()
		{
			if(this.options.socket)
			{
				return this.options.socket;
			}

			return null;
		}

		set socket(_value)
		{
			if(Object.is(_value, 'Socket'))
			{
				return this.initializeSocket(_value);
			}

			return this.socket;
		}

		initializeSocket(_socket = this.socket)
		{
			//
			if(! Object.is(_socket, 'Socket'))
			{
				return null;
			}
			else if(_socket._initialized)
			{
				return this.options.socket = _socket;
			}
			else
			{
				_socket._initialized = true;
			}

			//
			this.initializeSocketEvents(_socket);

			//
			return this.options.socket = _socket;
		}

		initializeSocketEvents(_socket = this.socket)
		{
			if(! Object.is(_socket, 'Socket'))
			{
				return -1;
			}
			else if(_socket._initializedEvents)
			{
				return 0;
			}
			else
			{
				_socket._initializedSocketEvents = true;
			}

			var result = 0;
			const events = Client.socketEvents;

			for(var i = 0; i < events.length; ++i)
			{
				if(typeof this['on' + events[i]] === 'function')
				{
					_socket.on(events[i], this['on' + events[i]]);
					++result;
				}
			}

			return result;
		}
		
		get in()
		{
			if(this.socket)
			{
				return this.socket.bytesRead;
			}

			return -1;
		}

		get out()
		{
			if(this.socket)
			{
				return this.socket.bytesWritten;
			}

			return -1;
		}

		get timeout()
		{
			if(this.socket)
			{
				return this.socket.timeout;
			}

			return undefined;
		}

		set timeout(_value)
		{
			if(! (isInt(_value) && _value > 0))
			{
				return this.timeout;
			}
			else if(this.socket)
			{
				this.socket.setTimeout(_value);
			}

			return _value;
		}

		get encoding()
		{
			if('encoding' in this.options)
			{
				return this.options.encoding;
			}

			return DEFAULT_ENCODING;
		}

		set encoding(_value)
		{
			if(this.socket)
			{
				this.socket.setEncoding(_value);
			}

			return this.options.encoding = _value;
		}
	}

	//
	Socket.Peer = Peer;
	Socket.Protocol = require('network/protocol/');

	//
	Socket.Radix = require('core/radix');

	//

})();

