(function()
{
	
	//
	if(typeof TCP === 'undefined')
	{
		TCP = require('network/tcp/');
	}

	//
	const Socket = require('network/socket/');

	//
	Server = module.exports = class Server extends Socket
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

