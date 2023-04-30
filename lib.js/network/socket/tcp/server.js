(function()
{
	
	//
	if(typeof TCP === 'undefined')
	{
		TCP = require('network/tcp/');
	}

	//
	const Server = require('network/server');

	//
	TCP.Server = Server.TCP = module.exports = class TcpServer extends Server
	{
		constructor(_options)
		{
			super(_options);
		}

		reset()
		{
			this._clients = [];
			return super.reset();
		}

		get clients()
		{
			return this._clients.length;
		}

		propagateToClients(_key, _value)
		{
			var result = 0;

			for(const c of this._clients)
			{
				if(_key in c)
				{
					c[_key] = _value;
					++result;
				}
			}

			return result;
		}
	}

	//

})();

