(function()
{

	//
	if(typeof Socket === 'undefined')
	{
		require('network/socket/');
	}

	//
	WebSocketClient = module.exports = class WebSocketClient extends Client
	{
		constructor(... _args)
		{
			super(... _args);
		}
	}

	//
	
})();

