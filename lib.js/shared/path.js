(function()
{

	//
	if(typeof path === 'undefined')
	{
		require('+path');
	}

	//
	const DEFAULT_RESOLVE = false;//TODO/'DEFAULT_RESOLVE' isntead!? for all in here??!? thin bout i.
	const DEFAULT_LOCK_CHROOT = false;
	const DEFAULT_DOT_FILES = false;
	const DEFAULT_DOT = '.';

	const DEFAULT_THROW = true;

	const DEFAULT_EXTNAME_COUNT = 1;//0 for ALL .ext.. ^_^ or negatives..

	const DEFAULT_MAX_DEPTH = 256;
	const DEFAULT_MAX_LENGTH_ITEM = 256;
	const DEFAULT_MAX_LENGTH = ((DEFAULT_MAX_DEPTH * path.sep.length) + (DEFAULT_MAX_DEPTH * DEFAULT_MAX_LENGTH_ITEM));

	const DEFAULT_UNIFORM = true;
	const DEFAULT_RESTORE = true;

	//
	Object.defineProperty(path, 'shared', { get: function() { return true; } });

	//
	function checkUrlPathArgument(_value, _return = false)
	{
		if(typeof _value === 'string')
		{
			if(_return)
			{
				return _value;
			}

			return true;
		}
		else if(typeof _value === 'object' && _value !== null)
		{
			if(typeof Uniform === 'undefined')
			{
				require('network/uniform');
			}

			if(Uniform.isUniform(_value))
			{
				if(_return)
				{
					return _value.href;
				}

				return true;
			}
		}

		if(_return)
		{
			return null;
		}

		return false;
	}

	//
	path.isValid = function(_path, _check_uniform = DEFAULT_UNIFORM, _zero_length = true, _throw = false)
	{
		if((_path = checkUrlPathArgument(_path, true)) === null)
		{
			if(_throw)
			{
				return x('Invalid % argument', null, '_path');
			}

			return false;
		}
		else if(_path.length === 0)
		{
			if(_zero_length)
			{
				return true;
			}
			else if(_throw)
			{
				return x('Your % argument may not be empty', null, '_path');
			}

			return false;
		}
		else if(_path.length > DEFAULT_MAX_LENGTH)
		{
			if(_throw)
			{
				return x('Your % argument is a % with .% > %', null, '_path', 'String', 'length', DEFAULT_MAX_LENGTH);
			}

			return false;
		}

		var byte;

		for(var i = 0; i < _path.length; ++i)
		{
			if((byte = _path.charCodeAt(i)) < 32 || byte === 127)
			{
				if(_throw)
				{
					return x('Your % argument contains unsuitable characters', null, '_path');
				}

				return false;
			}
		}

		const split = _path.split(path.sep);

		if(split.length > DEFAULT_MAX_DEPTH)
		{
			if(_throw)
			{
				return x('Your % argument is too deep (contains more than % separators)', null, '_path', DEFAULT_MAX_DEPTH);
			}

			return false;
		}

		return true;
	}


	//
	// gedacht fuer minifiy.js via php-script. nutze auch 'path.secure()', siehe hierunter..
	//
	// php uebergibt als root-path den $_SERVER['DOCUMENT_ROOT'], unter dem alles bleiben sollte..
	//
	// TODO: brauche ich hier auch 'path.sameStart()' bzw. 'path.sameEnd()'!????? TODO alles noch... bald (danach the 'minfify' ;-)
	//
	path.chroot = function(_path, _root = path.sep, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _path !== 'string')
		{
			if(_throw)
			{
				return x('Invalid % argument (not a %)', null, '_path', 'String');
			}

			return null;
		}
		else
		{
			_path = path.secure(_path, false, true, _throw);
		}

		if(typeof _root !== 'string')
		{
			if(_throw)
			{
				return x('Invalid % argument (not a %)', null, '_root', 'String');
			}

			return null;
		}
		else
		{
			_path = path.secure(_path, false, true, _throw);
		}

		//
		//
		//TODO/
		//
		//
	}

	//
	path.isDotFile = function(_path, _dot = DEFAULT_DOT)
	{
		if(! String.isString(_dot))
		{
			_dot = DEFAULT_DOT;
		}

		if(typeof _path !== 'string')
		{
			return null;
		}
		else if(_path.startsWith(_dot))
		{
			return true;
		}
		else if(path.basename(_path).startsWith(_dot))
		{
			return true;
		}

		return false;
	}

	path.withDotFile = function(_path, _dot = DEFAULT_DOT)
	{
		if(! String.isString(_dot))
		{
			_dot = DEFAULT_DOT;
		}

		if(typeof _path !== 'string')
		{
			return null;
		}
		else if(path.isDotFile(_path, _dot))
		{
			return true;
		}

		const split = _path.split(path.sep);

		for(const p of split)
		{
			if(p.startsWith(_dot))
			{
				return true;
			}
		}

		return false;
	}

	//
	path.secure = function(_path, _lock_chroot, _dot_files, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _lock_chroot !== 'string' && typeof _lock_chroot !== 'boolean')
		{
			_lock_chroot = DEFAULT_LOCK_CHROOT;
		}

		if(typeof _dot_files !== 'boolean')
		{
			_dot_files = DEFAULT_DOT_FILES;
		}

		//
		if(typeof _path === 'string')
		{
			if(_lock_chroot === true)
			{
				if(_path === path.sep || _path === '..')
				{
					if(_throw)
					{
						return x('The path is locked, so you neither may access fs root or any higher level directory');
					}

					return null;
				}
			}

			if(_dot_files === false)
			{
				if(path.isDotFile(_path))
				{
					if(_throw)
					{
						return x('No DOT files allowed (starting with a dot \'%\', e.g. \'%\')', null, '.', '.htaccess');
					}

					return null;
				}
			}
		}
		else
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting non-empty %)', null, '_path', 'String');
			}

			return null;
		}

		//
		var result = '';
		var byte;

		for(var i = 0; i < _path.length; ++i)
		{
			if(_lock_chroot === true && _path.at(i, path.sep))
			{
				if(_throw)
				{
					return x('The path is locked, so may not contain \'%\' (\'%\')', null, 'path.sep', path.sep);
				}
			}
			else if(_lock_chroot === true && _path.at(i, '..' + path.sep))
			{
				if(_throw)
				{
					return x('The path is locked, so may not switch to depths above (\'%\')', null, '..');
				}
			}
			else if((byte = _path.charCodeAt(i)) < 32 || byte > 127)
			{
				if(_throw)
				{
					return x('Invalid path[%] character (char code %)', null, i, byte);
				}
			}
			else
			{
				result += _path[i];
			}
		}

		//
		if(typeof _file_chroot === 'string')
		{
			return path.chroot(result, _lock_chroot, _throw);
		}

		return result;
	}

	//
	path.sameStart = function(... _args)
	{
		//
		if(_args.length === 0)
		{
			return '';
		}

		var resolve = DEFAULT_RESOLVE;
		var sameEnd = false;

		for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'undefined')
			{
				sameEnd = !sameEnd;
				_args.splice(i--, 1);
			}
			else if(typeof _args[i] === 'boolean' || _args[i] === null)
			{
				resolve = _args[i];
				_args.splice(i--, 1);
			}
			else if(typeof _args[i] === 'string')
			{
				if(_args[i].length === 0)
				{
					_args.splice(i--, 1);
				}
			}
			else if(Array.isArray(_args[i], true))
			{
				_args[i] = _args[i].join(path.sep);
			}
			else
			{
				return x('Invalid %[%] argument (expecting %s, % or %)', null, '..._args', i, 'String', 'Boolean', null);
			}
		}

		if(_args.length === 0)
		{
			return '';
		}
		else if(typeof resolve === 'boolean') for(var i = 0; i < _args.length; ++i)
		{
			if(resolve)
			{
				_args[i] = path.resolve(_args[i]);
			}
			else
			{
				_args[i] = path.normalize(_args[i]);
			}
		}

		for(var i = 0; i < _args.length; ++i)
		{
			_args[i] = _args[i].removeEnding(path.sep).split(path.sep);
		}

		//
		const result = [];

		//
		const getNextPathComponents = () => {
			const result = new Array(_args.length);

			for(var i = 0; i < _args.length; ++i)
			{
				if(sameEnd)
				{
					result[i] = _args[i].pop();
				}
				else
				{
					result[i] = _args[i].shift();
				}
			}

			return result;
		};

		const equalPathComponents = (_components) => {
			var result = true;

			for(var i = 1; i < _components.length; ++i)
			{
				if(_components[i] !== _components[0])
				{
					result = false;
					break;
				}
			}

			return result;
		};

		const reachedEnd = () => {
			for(var i = 0; i < _args.length; ++i)
			{
				if(_args[i].length === 0)
				{
					return true;
				}
			}

			return false;
		};

		const takeComponent = (_value) => {
			if(sameEnd)
			{
				result.unshift(_value);
			}
			else
			{
				result.push(_value);
			}
		};

		var nextComponents = getNextPathComponents();
		var stop = false;
		var prepareStop = false;

		while(!stop)
		{
			if(prepareStop)
			{
				stop = true;
			}

			if(equalPathComponents(nextComponents))
			{
				takeComponent(nextComponents[0]);
				nextComponents = getNextPathComponents();
			}
			else
			{
				break;
			}

			if(reachedEnd())
			{
				prepareStop = true;
			}
		}

		//
		return result.join(path.sep);
	}

	path.sameEnd = function(... _args)
	{
		return path.sameStart(... _args, undefined);
	}

	//
	path.check = function(_name, _single_name)
	{
		if(typeof _single_name !== 'boolean')
		{
			return x('Invalid _single_name argument (is not a Boolean)');
		}
		else if(! String.isString(_name))
		{
			return null;
		}

		var result = _name.cut();

		if(_single_name)
		{
			if(path.sep === '/')
			{
				result = result.replaces('/', '\\');
			}
			else if(path.sep === '\\')
			{
				result = result.replaces('\\', '/');
			}
			else
			{
				return x('Unexpected (gibt\'s noch weitere Separatoren?)!');
			}
		}

		return result;
	}

	//
	path.depth = function(_path)
	{
		if(typeof _path === 'string')
		{
			_path = path.resolve(_path);
		}
		else
		{
			return x('Invalid _path (not a String)');
		}

		if(_path === path.sep)
		{
			return 0;
		}

		return (_path.indicesOf(path.sep).length);
	}

	path.up = function(_up = 1, _path = process.cwd())
	{
		if(typeof _path === 'string')
		{
			_path = path.resolve(_path);
		}
		else
		{
			return x('Invalid _path (not a String)');
		}

		if(typeof _up !== 'number')
		{
			return x('Invalid _up depth (not a Number)');
		}
		else if(_up === 0)
		{
			return _path;
		}
		else if(_up > 1)
		{
			var result = _path;

			while(--_up >= 0)
			{
				result = path.up(1, result);
			}

			if(result.length === 0)
			{
				return path.sep;
			}

			return result;
		}

		_path = path.resolve(_path);
		const idx = _path.lastIndexOf(path.sep);

		if(idx === -1 || _path === path.sep)
		{
			return path.sep;
		}

		if((_path = _path.substr(0, idx)).length === 0)
		{
			_path = path.sep;
		}

		return _path;
	}

	//
	path._extname = path.extname;

	path.extname = function(_path, _count = 1)
	{
		if(typeof _path !== 'string')
		{
			return null;
		}
		else if(! Number.isInt(_count))
		{
			throw new Error('Invalid _count argument');
		}
		
		var split = path.normalize(_path).split(path.sep);
		
		if(split[split.length - 1].length === 0)
		{
			return '';
		}
		else
		{
			split = split[split.length - 1].split('.');
			
			if(split[0].length === 0)
			{
				split.splice(0, 2);
			}
			else
			{
				split.splice(0, 1);
			}
		}
		
		_count = Math._min(_count, split.length);
		
		if(_count === 0)
		{
			return ('.' + split.join('.'));
		}
		
		const negative = (_count < 0);
		_count = Math.abs(_count);
		const result = [];
		
		while(result.length < _count)
		{
			if(negative)
			{
				result.push(split.shift());
			}
			else
			{
				result.unshift(split.pop());
			}
		}
		
		return ('.' + result.join('.'));
	}

	path._dirname = path.dirname;

	path.dirname = function(_path)
	{
		if(typeof _path !== 'string')
		{
			return null;
		}
		else if(_path.length === 0)
		{
			return '.';
		}
		else if(_path === path.sep)
		{
			return path.sep;
		}

		const split = _path.split('/');
		const result = [];
		
		for(var i = 0; i < split.length; ++i)
		{
			if(split[i].length === 0)
			{
				result.push('');
			}
			else if(split[i] === '.')
			{
				result.push('.');
			}
			else if(split[i] === '..')
			{
				result.push('..');
			}
			else
			{
				result.push(split[i]);
			}
		}
		
		if(result[result.length - 1].length > 0)
		{
			return result.slice(0, -1).join(path.sep);
		}

		return result.join(path.sep);
	}
	
	//
	/*path._dirname = path.dirname;

	path.dirname = function(_path)
	{
		if(typeof _path !== 'string')
		{
			return null;
		}
		else if(_path.length === 0)
		{
			return '.';
		}
		else if(_path === path.sep)
		{
			return path.sep;
		}

		return path.normalize(_path).split(path.sep).slice(-2, -1);
	}*/

	//
	path.color = fs.color;

	//
	const _parse = path._parse = path.parse;

	path.parse = function(_path, _ext_count)
	{
		if(typeof _path !== 'string')
		{
			return x('Invalid % argument (not a %)', null, '_path', 'String');
		}
		else if(typeof _parse === 'function')
		{
			//return _parse(_path, ... _args);
		}

		const result = { root: '', dir: '', base: '', ext: '', name: '' };

		if(_path.length === 0)
		{
			return result;
		}

		result.root = (_path[0] === path.sep ? path.sep : '');
		result.dir = path.dirname(_path);
		result.ext = path.extname(_path, _ext_count);
		result.base = path.basename(_path);
		result.name = path.basename(result.base, result.ext);

		return result;
	}

	path.render = function(_object)
	{
		if(! Object.isObject(_object))
		{
			return x('Invalid % argument (not an %)', null, '_object', 'Object');
		}

		return (_object.root + _object.dir + path.sep + _object.base).replaces(path.sep + path.sep, path.sep);
	}

	//

})();

