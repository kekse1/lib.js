/*
 * http/1-server fuer websocket ONLY!
 */
(function()
{

	//
	if(typeof Socket === 'undefined')
	{
		require('network/socket/');
	}

	//
	WebSocketServer = module.exports = class WebSocketServer extends Server
	{
		constructor(... _args)
		{
			super(... _args);
		}
	}

	//

})();

