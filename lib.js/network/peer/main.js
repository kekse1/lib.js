(function()
{

	//
	if(typeof Domain === 'undefined')
	{
		require('network/peer/domain');
	}

	//
	Peer = module.exports = class Peer extends Domain
	{
		constructor(_options)
		{
			super(_options);
		}
	}

	//
	Peer.assign({

		Process: require('network/peer/process'),

		Entity: require('network/peer/entity'),

		Domain: require('network/peer/domain'),

		User: require('network/peer/user'),
		Contact: require('network/peer/contact'),

		Service: require('network/peer/service'),
		Bot: require('network/peer/bot')

	});

	//
	
})();

