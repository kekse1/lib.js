(function()
{

	//
	const DEFAULT_FUNC = true;
	const DEFAULT_RAW = false;

	//
	if(typeof console === 'undefined')
	{
		console = require('+console');
	}

	//
	console.stream = function(_id, _func = DEFAULT_FUNC, _raw = DEFAULT_RAW)
	{
		if(typeof _raw !== 'boolean')
		{
			_raw = DEFAULT_RAW;
		}

		if(typeof _func !== 'boolean')
		{
			_func = DEFAULT_FUNC;
		}

		if(typeof _id === 'string')
		{
			_id = _id.toLowerCase();
		}
		else if(! Number.isInt(_id))
		{
			return null;
		}
		
		switch(_id)
		{
			case 0:
			case 'stdin':
				break;
			case 1:
			case 'stdout':
				if(_func)
				{
					if(_raw)
					{
						return process.stdout.write;
					}

					return console.stdout;
				}

				return process.stdout;
			case 2:
			case 'stderr':
				if(_func)
				{
					if(_raw)
					{
						return process.stderr.write;
					}

					return console.stderr;
				}

				return process.stderr;
			case 'log':
				return console.log;
			case 'info':
				return console.info;
			case 'warn':
				return console.warn;
			case 'error':
				return console.error;
			case 'debug':
				return console.debug;
		}

		return null;
	}

	//
	testing = console.testing = function(... _args)
	{
		//
		for(var i = 0; i < 2; ++i)
		{
			if(typeof _args[i] === 'function')
			{
				console.testing.callbacks.push(_args.splice(i--, 1)[0]);
			}
			else if(isInt(_args[i]))
			{
				console.testing.counter = Math.abs(_args.splice(i--, 1)[0]);
			}
		}
		
		//
		const finish = () => {
			var txt;
			
			if(typeof date === 'function')
			{
				txt = date();
			}
			else if(typeof Number.prototype.toText === 'function')
			{
				txt = Date.now().toText();
			}
			else
			{
				txt = Date.now().toLocaleString();
			}

			if(Object.isObject(console.testing.data) && console.testing.data.LENGTH === 0)
			{
				console.debug('%% ' + 'stopped your process'.bold + ', without stored data, % % % [%]',
					'testing'.high.bold.italic, '()'.italic.bold, 'after'.bold, console.testing.calls.toText().high.bold, 'calls'.bold, txt);
			}
			else
			{
				//
				txt += '  /  after ' + console.testing.calls.toText() + ' calls ...';
			
				//
				console.dir(console.testing.data, txt);
				console.testing.clear();
			}

			while(console.testing.callbacks.length > 0)
			{
				console.testing.callbacks.shift()(console.testing.data, txt, console.testing.counter);
			}

			if(BROWSER)
			{
				return window.stop();
			}

			return process.exit((console.testing.calls % 256) + 1);
		};
		
		//
		++console.testing.calls;
		
		//
		if(_args.length > 0)
		{
			if(_args.length === 1)
			{
				if(console.testing.counter > 0)
				{
					if(console.testing.calls === 0)
					{
						console.testing.data = _args[0];
					}
					else if(typeof console.testing.data === 'object' && console.testing.data !== null)
					{
						if(typeof _args[0] === 'object' && _args[0] !== null)
						{
							console.testing.data = { ... console.testing.data, ... _args[0] };
						}
						else
						{
							console.testing.data[console.testing.calls.toString()] = _args[0];
						}
					}
					else
					{
						console.testing.data = { [console.testing.calls.toString()]: _args[0], [(console.testing.calls - 1).toString()]: console.testing.data };
					}
				}
				else
				{
					console.testing.data = _args[0];
					return finish();
				}
			}
			else
			{
				const data = {};

				for(var i = 0; i < _args.length; i += 2)
				{
					data[_args[i + 1].toString()] = _args[i];
				}
				
				if(typeof console.testing.data === 'object' && console.testing.data !== null)
				{
					console.testing.data = { ... console.testing.data, ... data };
				}
				else
				{
					console.testing.data = { ... data, [console.testing.calls.toString()]: console.testing.data };
				}
			}
		}
		
		//
		if(console.testing.counter > 0)
		{
			const result = (console.testing.counter - console.testing.calls);
			
			if(result <= 0)
			{
				return finish();
			}
			
			return result;
		}

		return finish();		
	}

	console.testing.clear = console.testing.stop = function()
	{
		console.testing.calls = console.testing.counter = 0;
		console.testing.data = {};
		console.testing.callbacks.length = 0;
	}

	console.testing.calls = 0;
	console.testing._counter = 1;
	console.testing.data = {};
	console.testing.callbacks = [];

	Object.defineProperty(console.testing, 'counter', {
		get: function()
		{
			return console.testing._counter;
		},
		set: function(_value)
		{
			if(isNumber(_value))
			{
				if(_value < 1)
				{
					_value = 1;
				}
				else if(_value > ((2**32)-1))
				{
					_value = ((2**32)-1);
				}

				return console.testing._counter = _value;
			}

			return console.testing._counter;
		}
	});

	//

})();
