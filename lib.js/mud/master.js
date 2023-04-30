(function()
{

	const Master = module.exports = class MUDMaster extends require('core/node')
	{
		constructor(_options)
		{
			//
			super(_options);

			//
			this.server = [];

			//
			this.protocol = {};
		}

		createServer(_protocol, _options)
		{
			const options = {};
//TODO/'network/server::create()'!!
			if(typeof _protocol === 'string')
			{
				options.protocol = _protocol;
			}
			else if(Object.isObject(_protocol))
			{
				options.merge(_protocol);
			}

			if(Object.isObject(_options))
			{
				options.merge(_options);
			}
			else if(typeof _options === 'string')
			{
				options.protocol = _options;
			}

			const server = Master.Server.create(options);

			this.server.push(server);
			this.protocol[server.protocol] = server;

			return server;
		}

		createSlave(_options)
		{
throw new Error('TODO');
		}

		static create(_options)
		{
			return new Master(_options);
		}
	}
	
	//
	Master.Slave = require('mud/slave');

	//
	Master.Server = require('network/server');

	//
	
})();

