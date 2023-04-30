(function()
{

	//
	if(typeof RADIX === 'undefined')
	{
		require('core/radix');
	}

	//
	Socket = module.exports = class Socket extends RADIX
	{
		constructor(_options)
		{
			super(_options);
		}
		
		static create(... _args)
		{
			dir(this.constructor.create(), 'this.constructor.create() @ Socket');
			//create from server
		}
		
		static connect(... _args)
		{
			//connect w/out server
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
				return this.options.socket = _value;
			}

			return this.socket;
		}

		initializeSocket(_socket = this.socket)
		{
			//
			if(!_socket)
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
	Socket.Server = require('network/socket/server');
	Socket.Client = require('network/socket/client');

	//

})();

