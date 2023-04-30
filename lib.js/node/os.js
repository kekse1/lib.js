(function()
{

	//
	os = module.exports = require('node:os');
	
	//
	const _hostname = os.hostname;

	Object.defineProperty(os, 'hostname', { value: function(_name_or_real = false)
	{
		if(typeof _name_or_real === 'string')
		{
			return _name_or_real;
		}
		else if(HOSTNAME && _name_or_real === false)
		{
			return HOSTNAME;
		}

		return _hostname();
	}});

	//

})();

