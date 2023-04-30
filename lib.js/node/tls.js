(function()
{

	//
	tls = module.exports = require('node:tls');
	
	//
	tls.SNI = SNI = require('network/socket/tls/sni');

	//
	tls.Server.prototype.type = tls.Server.type = 'tls';
	tls.TLSSocket.prototype.type = tls.TLSSocket.type = 'tls';

	//

})();

