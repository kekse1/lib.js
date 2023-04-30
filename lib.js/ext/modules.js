(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_GLOBAL_TIMEOUT = 10000;//to disable, set to smth. other than an integer >= 1000.. ^_^

	//
	modules = {};

	//
	modules.module = {};
	modules.callback = [];
	modules.group = {};
	modules.waiting = 0;
	
	//
	Object.defineProperty(modules, 'count', { get: function()
	{
		return Object.keys(modules.module).length;
	}});

	//
	var globalTimeout = null;

	function updateGlobalTimeout(_delay = DEFAULT_GLOBAL_TIMEOUT)
	{
		if(! (isInt(_delay) && _delay >= 1000))
		{
			return false;
		}
		else if(globalTimeout !== null)
		{
			window.clearTimeout(globalTimeout);
			globalTimeout = null;
		}

		globalTimeout = window.setTimeout(() => {
			return modules.forceFinish();
		}, _delay);

		return true;
	}

	//
	modules.check = function(_module, _throw = DEFAULT_THROW)
	{
		if(typeof _module !== 'string')
		{
			if(_throw)
			{
				throw new Error('Not a String');
			}

			return null;
		}
		else if((_module = _module.toLowerCase()) in modules.module)
		{
			return modules.module[_module];
		}

		return null;
	}

	modules.ready = function(_module, _throw = DEFAULT_THROW)
	{
		var orig = _module;

		if(!(_module = modules.check(_module, _throw)))
		{
			return -1;
		}
		else if(_module.ready !== null)
		{
			return modules.waiting;
		}
		else
		{
			orig = orig.toLowerCase();
		}

		console.log('The module \'' + orig + '\' is ready now (' + (_module.ready = Date.now()) + '; ' + modules.count + ' total, ' + (modules.waiting - 1) + ' still waiting now)');

		if(--modules.waiting <= 0)
		{
			return modules.finish();
		}

		return modules.waiting;
	}

	modules.unready = function(_module, _throw = DEFAULT_THROW)
	{
		var orig = _module;

		if(!(_module = modules.check(_module, _throw)))
		{
			return null;
		}
		else if(_module.ready === null)
		{
			return modules.waiting;
		}
		else
		{
			orig = orig.toLowerCase();
		}

		console.log('The module \'' + orig + '\' is NOT ready again (' + modules.count + ' total, ' + (modules.waiting - 1) + ' still waiting now)');
		_module.ready = null;
		return ++modules.waiting;
	}

	modules.register = function(_module, _group = null, _throw = DEFAULT_THROW)
	{
		if(modules.check(_module, _throw))
		{
			return modules.waiting;
		}
		else
		{
			_module = _module.toLowerCase();
		}

		if(isInt(DEFAULT_GLOBAL_TIMEOUT) && DEFAULT_GLOBAL_TIMEOUT >= 1000)
		{
			updateGlobalTimeout();
		}

		console.log('Registered module \'' + _module + '\' (' + (modules.count + 1) + ' now, with ' + modules.callback.length + ' callbacks waiting atm)');
		modules.module[_module] = { ready: null };
		return ++modules.waiting;
	}
	
	modules.unregister = function(_module, _throw = DEFAULT_THROW)
	{
		if(! modules.check(_module, _throw))
		{
			return false;
		}
		else
		{
			_module = _module.toLowerCase();
		}

		console.log('UN-registered module \'' + _module + '\' (' + (modules.count - 1) + ' left, with ' + modules.callback.length + ' callbacks waiting atm)');
		delete modules.module[_module];

		if(--modules.waiting <= 0)
		{
			return modules.finish();
		}

		return modules.waiting;
	}

	modules.setCallback = function(_callback, _throw = DEFAULT_THROW)
	{
		return modules.addCallback(_callback, false, _throw);
	}

	modules.addCallback = function(_callback, _force = true, _throw = DEFAULT_THROW)
	{
		if(typeof _callback !== 'function')
		{
			if(_throw)
			{
				throw new Error('Not a function');
			}

			return null;
		}
		else if(! _force && modules.callback.indexOf(_callback) > -1)
		{
			return false;
		}
		else
		{
			console.log('Added module callback (' + (modules.callback.length + 1) + ' now, for ' + modules.count + ' modules atm)');
		}

		modules.callback.push(_callback);

		if(modules.count > 0 && modules.waiting <= 0)
		{
			modules.finish(true, _throw);
		}

		return true;
	}

	modules.removeCallback = function(_callback, _count = null, _backwards = false)
	{
		if(typeof _callback !== 'function')
		{
			throw new Error('Not a function');
		}
		else if(_count !== null && !(isInt(_count) && _count >= 0))
		{
			throw new Error('Invalid _count argument');
		}
		else if(typeof _backwards !== 'boolean' && _count !== null)
		{
			_backwards = false;
		}
		else if(_count === null)
		{
			_backwards = false;
		}

		if(_count !== null && _count <= 0)
		{
			return 0;
		}

		var result = 0;

		const func = (_index) => {
			if(modules.callback[_index] === _callback)
			{
				modules.callback.splice(_index--, 1);
				++result;

				if(_count !== null && result >= _count)
				{
					return _index = null;
				}
				
				return index;
			}

			return _index;
		};

		if(_backwards) for(var i = modules.callback.length - 1; i >= 0; --i)
		{
			if(func(i) === null)
			{
				break;
			}
		}
		else for(var i = 0; i < modules.callback.length; ++i)
		{
			if((i = func(i)) === null)
			{
				break;
			}
		}

		if(result > 0)
		{
			console.log('Removed ' + result + ' module callbacks (' + modules.callback.length + ' now, for ' + modules.count + ' modules atm)');
		}

		return result;
	}

	modules.forceFinish = function(_throw = DEFAULT_THROW)
	{
		if(modules.count === 0)
		{
			return false;
		}

		modules.waiting = 0;
		return modules.finish(_throw);
	}

	modules.finish = function(_throw = DEFAULT_THROW)
	{
		if(modules.waiting > 0)
		{
			if(_throw)
			{
				throw new Error('Won\'t finish() without waiting state is fulfilled');
			}

			return -1;
		}
		else if(modules.count <= 0)
		{
			if(_throw)
			{
				throw new Error('No module is waiting');
			}

			return 0;
		}
		
		var result = 0;

		for(const cb of modules.callback)
		{
			cb(modules.module);
			++result;
		}

		if(result > 0)
		{
			console.log(modules.count + ' modules ready now (so we called ' + result + ' callbacks)');
		}

		modules.reset();
		return result;
	}

	modules.reset = function()
	{
		console.log('Module reset (' + modules.count + ' modules, ' + modules.callback.length + ' callbacks)');

		modules.clearModules();
		modules.clearCallbacks();
	}
	
	modules.clearModules = function()
	{
		if(modules.count === 0)
		{
			return false;
		}
		else
		{
			modules.module = {};
			modules.waiting = 0;
		}
		
		return true;
	}
	
	modules.clearCallbacks = function()
	{
		if(modules.callback.length === 0)
		{
			return false;
		}
		else
		{
			modules.callback.length = 0;
		}
		
		return true;
	}

	//
	
})();

