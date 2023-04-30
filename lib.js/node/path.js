(function()
{

	//
	path = module.exports = require('node:path');

	//
	const _resolve = path.resolve;
	
	path.resolve = function(... _args)
	{
		if(_args.length === 0)
		{
			return process.cwd();
		}
		else for(var i = 0; i < _args.length; i++)
		{
			if(typeof _args[i] !== 'string')
			{
				return x('Path in %[%] needs to be a String', null, 'arguments', i);
			}
			else if(_args[i] === '\\~')
			{
				_args[i] = '~';
			}
			else if(_args[i].startsWith('\\~/'))
			{
				_args[i] = _args[i].substr(1);
			}
			else if(_args[i] === '~')
			{
				_args[i] = os.homedir();
			}
			else if(_args[i] === '~/')
			{
				_args[i] = os.homedir() + path.sep;
			}
			else if(_args[i] === '\\~')
			{
				_args[i] = '~';
			}
			else if(_args[i] === '\\~/')
			{
				_args[i] = '~/';
			}
			else if(_args[i].startsWith('~/'))
			{
				_args[i] = os.homedir() + _args[i].slice(1);
			}
			else if(_args[i].startsWith('\\~/'))
			{
				_args[i] = _args[i].slice(1);
			}
		}

		return _resolve(... _args);
	}

	//
	const _dirname = path.dirname;

	path.dirname = function(_path, _trailing_slash = false)
	{
		if(typeof _path !== 'string')
		{
			return x('Invalid _path (expecting a String)');
		}
		else
		{
			//_path = path.normalize(_path);
		}

		const result = _dirname(_path);

		if(_trailing_slash && result[result.length - 1] !== path.sep)
		{
			return result + path.sep;
		}

		return result;
	}

	//
	
})();

