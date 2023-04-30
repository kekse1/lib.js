(function()
{

	//
	Object.defineProperty(Function, 'isFunction', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] !== 'function')
			{
				return false;
			}
		}

		return true;
	}});

	isFunction = Function.isFunction;

	//
	Object.defineProperty(Function.prototype, '_toString', { value: Function.prototype.toString });

	Object.defineProperty(Function.prototype, 'toString', { value: function(_options)
	{
		if(_options === null)
		{
			return this._toString();
		}

		return String.render(this, _options);
	}});

	//
	Object.defineProperty(Function, 'isNative', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] !== 'function')
			{
				return false;
			}
			else if(!_args[i].toString(null).endsWith(Function.isNative.compare))
			{
				return false;
			}
		}

		return true;
	}});

	Function.isNative.compare = '() { [native code] }';

	Object.defineProperty(Function.prototype, 'isNative', { get: function()
	{
		return Function.isNative(this.valueOf());
	}});

	//
	Object.defineProperty(Function, 'equal', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else if(typeof _args[0] !== 'function')
		{
			return x('All of your arguments need to be %s', null, 'Function');
		}
		else for(var i = 1; i < _args.length; ++i)
		{
			if(typeof _args[i] !== 'function')
			{
				return x('Invalid %[%] argument (not a %)', null, '..._args', i, 'Function');
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

module.exports = Function;

