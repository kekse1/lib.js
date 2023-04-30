(function()
{

	//
	pushSearchPath = function(_path)
	{
		if(typeof _path === 'string' && _path.length > 0)
		{
			if(_path !== '/' && _path !== '//')
			{
			//	_path = path.normalize(_path).removeEnding('/');
			}
		}
		else
		{
			return x('Invalid path argument (not a non-empty String)');
		}

		//
		PATHS.push(_path);

		//
		return PATHS.length;
	}

	unshiftSearchPath = function(_path)
	{
		if(typeof _path === 'string' && _path.length > 0)
		{
			//_path = path.normalize(_path).removeEnding('/');
		}
		else
		{
			return x('Invalid path argument (not a non-empty String)');
		}

		//
		PATHS.unshift(_path);

		//
		return PATHS.length;
	}
	
	removeSearchPath = function(_path)
	{
		const orig = _path;

		if(typeof _path === 'string' && _path.length > 0)
		{
			//_path = path.normalize(_path).removeEnding('/');
		}
		else
		{
			return x('Invalid path argument (not a non-empty String)');
		}

		//
		for(var i = 0; i < PATHS.length; i++)
		{
			if(PATHS[i] === _path || PATHS[i] === orig)
			{
				PATHS.splice(i--, 1);
			}
		}
		
		//
		return PATHS.length;
	}

	Object.defineProperty(global, 'PATH', {
		get: function()
		{
			var result = '';

			for(var i = 0; i < PATHS.length; i++)
			{
				if(typeof PATHS[i] !== 'string' || PATHS[i].length === 0)
				{
					PATHS.splice(i--, 1);
				}
				else
				{
					result += PATHS[i] + (path.delimiter || ':');
				}
			}

			return result.substr(0, result.length - (path.delimiter || ':').length);
		},
		set: function(_value)
		{
			if(typeof _value !== 'string' || _value.length === 0)
			{
				return x('Invalid argument (not a non-empty String)');
			}
			else
			{
				_value = _value.split(path.delimiter || ':');
			}
			
			var withLibPath = false;
			
			for(var i = 0; i < _value.length; i++)
			{
				if(_value[i].length === 0)
				{
					_value.splice(i--, 1);
				}
				else if((_value[i] = path.normalize(_value[i]).removeEnding('/')) === __dirname.removeEnding('/'))
				{
					withLibPath = true;
				}
			}
			
			if(withLibPath)
			{
				PATHS.length = _value.length;
			}
			else
			{
				PATHS.length = (_value.length + 1);
				PATHS[0] = __dirname;
			}
			
			for(var i = 0, j = PATHS.length; i < _value.length; i++, j++)
			{
				PATHS[j] = _value[i];
			}
			
			return _value.join(path.delimiter || ':');
		}
	});

})();

