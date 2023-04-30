(function()
{

	//
	if(typeof Service === 'undefined')
	{
		require('network/peer/service');
	}
	
	//
	Bot = module.exports = class Bot extends Service
	{
		constructor(_options)
		{
			super(_options);
		}
	}
	
	//
	
})();

