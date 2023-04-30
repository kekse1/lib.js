(function()
{

	//
	if(typeof Entity === 'undefined')
	{
		require('network/peer/entity');
	}

	//
	Service = module.exports = class Service extends Entity
	{
		constructor(_options)
		{
			super(_options);
		}
	}

	//
	
})();

