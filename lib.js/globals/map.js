(function()
{

	//
	const DEFAULT_SORT_ASC = true;

	//
	module.exports = Map;

	//
	Object.defineProperty(Map, 'isMap', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else try
		{
			for(var i = 0; i < _args.length; ++i)
			{
				if(_args[i].constructor?.name !== 'Map')
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

	isMap = Map.isMap;

	//
	Object.defineProperty(Map.prototype, 'entriesSortedByValues', { value: function(_asc = DEFAULT_SORT_ASC)
	{
		if(typeof _asc !== 'boolean')
		{
			_asc = DEFAULT_SORT_ASC;
		}

		return [ ... this.entries() ].sort(1, _asc);
	}});

	Object.defineProperty(Map.prototype, 'entriesSortedByKeys', { value: function(_asc = DEFAULT_SORT_ASC)
	{
		if(typeof _asc !== 'boolean')
		{
			_asc = DEFAULT_SORT_ASC;
		}

		return [ ... this.entries() ].sort(0, _asc);
	}});

	//
	
})();

