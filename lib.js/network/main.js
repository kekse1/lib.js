module.exports = function _()
{

	//
	if(typeof network === 'undefined')
	{
		network = {};
	}

	//
	if(BROWSER || __INIT)
	{
		network.address = require('network/address');
		network.ip = require('network/ip');
		network.uniform = require('network/uniform');
		network.mail = require('network/mail');

		return network;
	}

	//
	network.assign({

		net: require('+net'),
		tls: require('+tls'),
		dgram: require('+dgram')

	});

	network.tcp = network.net;
	network.udp = network.dgram;
	
	//
	network.assign({

		service: require('network/service'),

		ip: require('network/ip'),
		address: require('network/address'),
		uniform: require('network/uniform'),
		mail: require('network/mail'),

		socket: require('network/socket/'),
		protocol: require('network/protocol/'),

		utility: require('network/utility'),

		proxy: require('network/proxy'),
		router: require('network/router'),
		tunnel: require('network/tunnel'),

		filter: require('network/filter/')

	});

	//
	return network;

}

