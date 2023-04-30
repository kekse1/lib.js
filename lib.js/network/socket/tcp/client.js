(function()
{

	//
	if(typeof TCP === 'undefined')
	{
		TCP = require('network/tcp/');
	}

	//
	const Client = require('network/client');

	//
	TCP.Client = Client.TCP = module.exports = class TcpClient extends Client
	{
		constructor(_options)
		{
			super(_options);
		}
	}

	//

})();

