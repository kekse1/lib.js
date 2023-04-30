(function()
{

	//
	const DEFAULT_TRUE = 'yes';
	const DEFAULT_FALSE = 'no';

	//
	Object.defineProperty(Boolean.prototype, 'toString', { value: function(_false = DEFAULT_FALSE, _true = DEFAULT_TRUE)
	{
		if(typeof _false === 'boolean' || Object.isObject(_false))
		{
			return String.render(this.valueOf(), _false);
		}

		const options = Object.assign(... arguments);

		if(String.isString(options.true))
		{
			_true = options.true;
		}

		if(String.isString(options.false))
		{
			_false = options.false;
		}

		if(! String.isString(_false))
		{
			_false = DEFAULT_FALSE;
		}

		if(! String.isString(_true))
		{
			_true = DEFAULT_TRUE;
		}

		return (this.valueOf() === false ? _false : _true);
	}});

	//
	Object.defineProperty(Boolean, 'sum', { value: function(... _args)
	{
		var result = 0;

		for(var i = 0; i < _args.length; ++i)
		{
			if(_args[i] === true)
			{
				++result;
			}
			else if(_args[i] === false)
			{
				--result;
			}
		}

		return result;
	}});

	Object.defineProperty(Boolean, 'count', { value: function(... _args)
	{
		var yes = 0;
		var no = 0;

		for(var i = 0; i < _args.length; ++i)
		{
			if(_args[i] === true)
			{
				++yes;
			}
			else if(_args[i] === false)
			{
				++no;
			}
		}

		return Object.null({ true: yes, false: no });
	}});

	Object.defineProperty(Boolean, 'true', { value: function(... _args)
	{
		var result = 0;

		for(var i = 0; i < _args.length; ++i)
		{
			if(_args[i] === true)
			{
				++result;
			}
		}

		return result;
	}});

	Object.defineProperty(Boolean, 'false', { value: function(... _args)
	{
		var result = 0;

		for(var i = 0; i < _args.length; ++i)
		{
			if(_args[i] === false)
			{
				++result;
			}
		}

		return result;
	}});

	Object.defineProperty(Boolean, 'isBoolean', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] !== 'boolean')
			{
				return false;
			}
		}

		return true;
	}});

	isBoolean = Boolean.isBoolean;

	//
	Object.defineProperty(Boolean, 'equal', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else if(typeof _args[0] !== 'boolean')
		{
			return x('All of your arguments need to be %s', null, 'Boolean');
		}
		else if(_args.length === 1)
		{
			return true;
		}
		else for(var i = 1; i < _args.length; ++i)
		{
			if(typeof _args[i] !== 'boolean')
			{
				return x('Your %[%] is not a %', null, '..._args', i, 'Boolean');
			}
			else if(_args[i] !== _args[0])
			{
				return false;
			}
		}

		return true;
	}});

	//
	
})();

module.exports = Boolean;

