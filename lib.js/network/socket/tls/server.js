(function()
{
	
	//
	if(typeof TLS === 'undefined')
	{
		TLS = require('network/tls/');
	}

	//
	const Server = require('network/server');

	//
	TLS.Server = Server.TLS = module.exports = class TlsServer extends Server
	{
		constructor(_options)
		{
			super(_options);
		}
	}

	//
	TLS.Server.SNI = require('network/tls/sni');

	//

})();

