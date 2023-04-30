(function()
{

	//
	module.exports = DataView;

	//
	Object.defineProperty(DataView, 'isDataViewClass', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else try
		{
			for(var i = 0; i < _args.length; ++i)
			{
				if(_args[i].name !== 'DataView')
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

	Object.defineProperty(DataView, 'isDataView', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else try
		{
			for(var i = 0; i < _args.length; ++i)
			{
				if(_args[i].constructor?.name !== 'DataView')
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

	isDataViewClass = DataView.isDataViewClass;
	isDataView = DataView.isDataView;
	
	//
	
})();

