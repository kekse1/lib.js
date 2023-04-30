(function()
{

	//
	if(typeof User === 'undefined')
	{
		require('network/peer/user');
	}

	//
	Contact = module.exports = class Contact extends User
	{
		constructor(_options)
		{
			super(_options);
		}
	}

	//
	
})();

