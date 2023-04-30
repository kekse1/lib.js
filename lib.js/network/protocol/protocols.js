(function()
{

	//
	const DEFAULT_EXCLUDE = [ 'upgrade' ];

	//
	protocols = module.exports = [];
	protocols.upgrade = require('network/protocol/upgrade/protocols');

	//
	(function()
	{
		//
		const exclude = (Array.isArray(DEFAULT_EXCLUDE) ? DEFAULT_EXCLUDE : []);
		const list = fs.readdirSync(__dirname, { encoding, withFileTypes: true });
		var e;

		for(var i = 0, j = 0; i < list.length; ++i)
		{
			if(! list[i].isDirectory())
			{
				continue;
			}
			else
			{
				e = false;
			}

			for(var k = 0; k < exclude.length; ++k)
			{
				if(exclude[k] === list[i].name)
				{
					e = true;
					break;
				}
			}

			if(! e)
			{
				protocols[j++] = list[i].name;
			}
		}

	})();

})();

