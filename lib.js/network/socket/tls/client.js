(function()
{
	
	//
	if(typeof TLS === 'undefined')
	{
		TLS = require('network/tls/');
	}

	//
	const Client = require('network/client');

	//
	TLS.Client = Client.TLS = module.exports = class TlsClient extends Client
	{
		constructor(_options)
		{
			super(_options);
		}

		static get socketEvents()
		{
			return Array.concat(super.socketEvents, [ 'secureConnection' ]);
		}
	}

	//
	TLS.Client.SNI = require('network/tls/sni');

	//

})();

