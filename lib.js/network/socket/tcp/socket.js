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
	TCP.Socket = module.exports = class TcpSocket extends Socket
	{
		constructor(_options)
		{
			super(_options);
		}
	}

	//

})();

