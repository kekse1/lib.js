(function()
{

	//
	module.exports = Set;

	//
	Object.defineProperty(Set, 'isSet', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else try
		{
			for(var i = 0; i < _args.length; ++i)
			{
				if(_args[i].constructor?.name !== 'Set')
				{
					return false;
				}
			}
		}
		catch(_error)
		{
			return false;
		}

		return true;
	}});

	isSet = Set.isSet;

	//
	
})();

