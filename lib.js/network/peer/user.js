(function()
{

	//
	if(typeof Entity === 'undefined')
	{
		require('network/peer/entity');
	}

	//
	User = module.exports = class User extends Entity//require('network/socket/client')
	{
		constructor(_options)
		{
			super(_options);
		}

		reset()
		{
			//
			this.state = {};
			this.contacts = {};

			//
			return super.reset();
		}
	}

	//
	User.INDEX = [];

	//

})();

