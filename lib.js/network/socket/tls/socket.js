(function()
{
	
	//
	if(typeof TLS === 'undefined')
	{
		TLS = require('network/tls/');
	}

	//
	const Socket = require('network/socket/');

	//
	TLS.Socket = module.exports = class TlsSocket extends Socket
	{
		constructor(_options)
		{
			super(_options);
		}
	}

	//

})();

