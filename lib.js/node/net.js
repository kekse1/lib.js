(function()
{

	//
	net = module.exports = require('node:net');

	//
	net.Server.type = net.Server.prototype.type = 'tcp';
	net.Socket.type = net.Socket.prototype.type = 'tcp';

	//
	
})();

