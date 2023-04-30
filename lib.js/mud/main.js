(function()
{

	//
	if(typeof mud === 'undefined')
	{
		mud = module.exports = EVENT.create();
	}
	else
	{
		module.exports = mud;
	}

	//
	mud.assign({

		Master: require('mud/master'),
		Slave: require('mud/slave'),

		Object: require('mud/object/')

	});

	//
	
})();

