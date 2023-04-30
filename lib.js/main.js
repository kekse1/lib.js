if(typeof __LIBRARY === 'undefined') __LIBRARY = (function()
{
	//
	if(typeof NATIVE !== 'boolean')
	{
		NATIVE = false;
	}

	//
	__INIT = true;
	__START = Date.now();
	__STOP = null;

	//
	(function()
	{
		isNumber = (_number) => {
			if(typeof _number !== 'number')
			{
				return false;
			}

			if(Number.isNaN(_number))
			{
				return false;
			}

			return Number.isFinite(_number);
		};

		isInt = function(_number)
		{
			return (isNumber(_number) && (_number % 1) === 0);
		}

		isFloat = function(_number)
		{
			return (isNumber(_number) && (_number % 1) !== 0);
		}

		//
		_parseInt = Number._parseInt = Number.parseInt;
		_parseFloat = Number._parseFloat = Number.parseFloat;

		Number.prototype._toString = Number.prototype.toString;
		if(typeof BigInt !== 'undefined') BigInt.prototype._toString = BigInt.prototype.toString;

		//
		throwError = function(_error, _exit = EXIT)
		{
			if(typeof console.throw === 'function')
			{
				console.throw(_error, _exit);
			}
			else if(typeof _error.toText === 'function')
			{
				process.stderr.write(_error.toText(COLORS) + EOL);
			}
			else
			{
				process.stderr.write(_error.stack + EOL);
			}

			if(isInt(_exit))
			{
				process.exit(_exit);
			}

			return _error;
		}

		x = function(_error, _type_options, ... _printf)
		{
			//
			if(! (_error instanceof Error))
			{
				if(typeof _error === 'string')
				{
					_error = new Error(_error);
				}
				else if(isNumber(_error) || typeof _error === 'bigint')
				{
					_error = new Error(typeof _error.toText === 'function' ? _error.toText() : _error.toString());
				}
				else
				{
					_error = new Error();
				}
			}

			//
			var errorCode;

			if(typeof _type_options === 'object' && _type_options !== null)
			{
				const keys = Object.keys(_type_options, false, false);

				for(var i = 0; i < keys.length; i++)
				{
					_error[keys[i]] = _type_options[keys[i]];
				}

				if(typeof _type_options.type !== 'undefined')
				{
					_error.type = _type_options.type;
				}

				if(isInt(_type_options.exit))
				{
					errorCode = _type_options.exit;
				}
				else
				{
					errorCode = EXIT;
				}
			}
			else
			{
				errorCode = EXIT;
			}

			if(typeof _error.type === 'undefined' || _error.type === null)
			{
				if(typeof _type_options === 'string' && _type_options.length > 0)
				{
					_error.type = _type_options;
				}
				else if(isNumber(_type_options))
				{
					_error.type = _type_options;
				}
				/*else if('code' in _error)
				{
					_error.type = _error.code;
				}
				else if('name' in _error)
				{
					_error.type = _error.name;
				}*/
			}

			//TODO/fix me!??
			//if(STACK.length > 0 && !Array.isArray(_error.requireStack))
			/*if(STACK.length > 0 && !Array.isArray(_error.moduleStack))
			{
				_error.moduleStack = (typeof String.colorize === 'function' ? String.colorize(STACK.length) : STACK.length) + ' [ ' + STACK.join(', ') + ' ]';
			}*/

			//
			//will be camel.disable()d:
			const errInfo = errorInfo;

			if(errInfo) for(const idx in errInfo)
			{
				_error[idx] = errInfo[idx];
			}

			_error.nodeVersion = process.version.substr(1);
			_error.libraryVersion = process.versions.library;

			if(_printf.length > 0)
			{
				if(typeof String.printf === 'function')
				{
					_error._printf = _printf;
				}
				else
				{
					//
					var res = '';

					for(var i = 0; i < _error.message.length; i++)
					{
						if(_error.message[i] === '\\')
						{
							if(i < (_error.message.length - 1) && _error.message[i + 1] === '%')
							{
								res += '%';
								i++;
							}
							else
							{
								res += '\\';
							}
						}
						else if(_error.message[i] === '%')
						{
							if(i < (_error.message.length - 2) && _error.message[i + 1] === '{')
							{
								const idx = _error.message.indexOf('}', i + 2);

								if(idx > -1)
								{
									_error.message = _error.message.substr(0, i + 1) + _error.message.substr(idx + 1);
								}
							}

							if(_printf.length > 0)
							{
								res += (typeof String.render === 'function' ? String.render(_printf.shift()) : _printf.shift());
							}
						}
						else
						{
							res += _error.message[i];
						}
					}

					_error.message = res;
				}
			}

			//
			//_error._this = this;

			//
			if(x.LIST.indexOf(x.LAST = _error) === -1)
			{
				x.LIST.push(_error);
			}

			//
			/*typeof throwError === 'function')
			{
				return throwError(_error, 255);
			}
			else */if(_error._printf && typeof String.printf === 'function')
			{
				if(_error.message.length === 0)
				{
					_error.message = String.repeat(_error._printf.length, '% ').removeLast();
				}

				_error.message = String.printf(COLORS, _error.message, ... _error._printf);
			}

			//throw _error;
			return throwError(_error, errorCode);
		}

		x.LAST = null;
		x.LIST = [];

	})();

	//
	(function()
	{
		//
		Object.defineProperty(global, 'BROWSER', { get: function() { return false; }});

		//
		window = global;
		window.window = global;
		window.global = global;

		//
		/*
		window.location = {};
		window.location.search = '';
		document = {};
		window.addEventListener = (_event, _callback) => {

		};*/

		//
		if(typeof __fs === 'undefined')
		{
			__fs = require('node:fs');
		}

		if(typeof __path === 'undefined')
		{
			__path = require('node:path');
		}

		if(typeof __os === 'undefined')
		{
			__os = require('node:os');
		}

		//
		PATHS = [ __dirname ];

		//
		try
		{
			//
			const DEFAULT_CONFIG = 'config.js';

			//
			var cfg;

			if(typeof CONFIG === 'string' && CONFIG.length > 0)
			{
				cfg = CONFIG;
			}
			else
			{
				cfg = __path.join(__dirname, DEFAULT_CONFIG);
			}

			//
			CONFIG = Object.create(null);
			CONFIG.REAL = __path.join(__dirname, '../');

			__CONFIG = require(cfg);

			require(__path.join(__dirname, 'global.js'));
		}
		catch(_error)
		{
			console.error('CONFIG is misconfigured.. \'' + cfg + '\' is not a valid \'config.js\'!');
			console.debug(_error.stack);
			process.exit(2);
		}

		//
		if(typeof CONFIG.HOME === 'string')
		{
			PATHS[1] = [ __path.join(__os.homedir(), CONFIG.HOME) ];
		}
		else
		{
			PATHS[1] = __os.homedir();
		}

		//
		require(__path.join(__dirname, 'require.js'));

		//
		(updateEnvironment = function()
		{
			if(typeof PATHS === 'string' && PATHS.length > 0)
			{
				PATHS = [ PATHS ];
			}
			else if(! Array.isArray(PATHS))
			{
				return x('Invalid % variable (expecting an %)', null, 'PATHS', 'Array');
			}

			const delim = ((typeof __path === 'object' && __path !== null && typeof __path.delimiter === 'string' && __path.delimiter.length > 0) ? __path.delimiter : ':');
			const result = PATHS.join(delim);

			return (process.env['NODE_PATH'] = result);
		})();

		//
		//(function()
		if(true)
		{
			//
			__module = require('module');
			__require = __module.prototype.require;
			__resolve = require.resolve;
			__cache = require.cache;

			//
			(function()
			{
				const list = [];
				const ls = __fs.readdirSync(__path.join(__dirname, 'node'), { encoding: 'utf8', withFileTypes: true });

				for(var i = 0, j = 0; i < ls.length; i++)
				{
					if(! ls[i].isFile())
					{
						continue;
					}
					else if(__path.extname(ls[i].name) === '.js')
					{
						list[j++] = __path.basename(ls[i].name, '.js');
					}
				}

				//which one?
				__module.prototype.extendedModules = list;
				__module.extendedModules = list;
			})();

			//
			function isNodeModule(_id)
			{
				if(typeof _id !== 'string' || _id.length === 0)
				{
					return x('% needs to be a non-empty %', null, 'Argument', 'String');
				}
				else if(_id.startsWith('node:'))
				{
					_id = _id.slice(5);
				}

				return (__module.builtinModules.indexOf(_id) > -1);
			}

			Object.defineProperty(__module.prototype, 'isNodeModule', { get: function() { return isNodeModule; }});

			function isExtendedNodeModule(_id, _regular_check = false)
			{
				if(typeof _id !== 'string' || _id.length === 0)
				{
					return x('% needs to be a non-empty %', null, 'Argument', 'String');
				}
				/*else if(_id.startsWith('node:'))
				{
					_id = _id.slice(5);
				}*/

				if(_regular_check && !isNodeModule(_id))
				{
					return false;
				}

				return (__module.extendedModules.indexOf(_id) > -1);
			}

			Object.defineProperty(__module.prototype, 'isExtendedNodeModule', { get: function() { return isExtendedNodeModule; }});

			//
			var silentMode = false;
			var rawMode = false;

			Object.defineProperty(__module.prototype, 'silentMode', { get: function() { return silentMode; }});
			Object.defineProperty(__module.prototype, 'rawMode', { get: function() { return rawMode; }});

			//
			prepareModule = function(_id)
			{
				var temporaryUnsetRawMode;

				switch(_id[0])
				{
					case ':':
					case '+':
					case '~':
					case '.':
						temporaryUnsetRawMode = true;
						break;
					default:
						if(_id.startsWith('node:'))
						{
							temporaryUnsetRawMode = true;
						}
						else if(_id.startsWith('lib:') || _id.startsWith('library:'))
						{
							temporaryUnsetRawMode = true;
						}
						else if(_id.startsWith('ext:') || _id.startsWith('extension:'))
						{
							temporaryUnsetRawMode = true;
						}
						else if(_id.startsWith('home:'))
						{
							temporaryUnsetRawMode = true;
						}
						else if(_id.startsWith('work:'))
						{
							temporaryUnsetRawMode = true;
						}
						else
						{
							temporaryUnsetRawMode = false;
						}
						break;
				}

				if(rawMode && !temporaryUnsetRawMode)
				{
					return original;
					//return __resolve.call(this, _id);
				}

				//
				const original = _id;
				const sep = (typeof __path.sep === 'string' ? __path.sep : '/');

				//
				if(_id.startsWith('raw:'))
				{
					_id = ('!' + _id.substr(4));
				}
				else if(_id.startsWith('RAW:'))
				{
					_id = ('^' + _id.substr(4));
				}
				else if(_id.startsWith('silent:'))
				{
					_id = ('?' + _id.substr(7));
				}

				//
				if(_id[0] === '^')
				{
					rawMode = true;
					_id = ('!' + _id.substr(1));
				}

				//
				if(_id[0] === '!')
				{
					return _id.substr(1);
					//return __resolve.call(this, _id.substr(1));
				}
				else if(_id[0] === '?')
				{
					silentMode = true;
					_id = _id.substr(1);
				}

				//
				if(_id[_id.length - 1] === sep)
				{
					_id += 'main.js';
				}

				//
				if(_id.startsWith(sep) || _id.startsWith('.' + sep) || _id.startsWith('..' + sep))
				{
					return _id;
				}
				else if(isExtendedNodeModule(_id))
				{
					_id = ('+' + _id);
				}
				else if(isNodeModule(_id))
				{
					if(! _id.startsWith('node:'))
					{
						_id = ('node:' + _id);
					}
				}
				else if(_id.startsWith('lib:'))
				{
					_id = _id.substr(3);
				}
				else if(_id.startsWith('library:'))
				{
					_id = _id.substr(7);
				}
				else if(_id.startsWith('ext:'))
				{
					_id = ('+' + _id.substr(4));
				}
				else if(_id.startsWith('extension:'))
				{
					_id = ('+' + _id.substr(10));
				}
				else if(_id.startsWith('home:'))
				{
					_id = ('~' + _id.substr(5));
				}
				else if(_id.startsWith('work:'))
				{
					_id = ('.' + _id.substr(5));
				}

				//
				if(_id.startsWith('node:'))
				{
					return _id;
				}

				//
				var paths;

				switch(_id[0])
				{
					case ':':
						_id = ('./' + _id.substr(1));
						paths = [ __dirname ];
						break;
					case '+':
						_id = ('./' + _id.substr(1));
						paths = [ __path.join(__dirname, 'node') ];
						break;
					case '~':
						_id = ('./' + _id.substr(1));
						paths = [ __path.join(__os.homedir(), (typeof CONFIG.HOME === 'string' ? CONFIG.HOME : '')) ];
						break;
					case '.':
						_id = ('./' + _id.substr(1));
						paths = [ process.cwd() ];
						break;
					default:
						paths = [
							__dirname,
							__path.join(__dirname, 'node'),
							__path.join(__os.homedir(), (typeof CONFIG.HOME === 'string' ? CONFIG.HOME : '')),
							process.cwd(),
							... module.paths
						];
						break;
				}

				try
				{
					return __resolve.call(this, _id, { paths });
				}
				catch(_error)
				{
					try
					{
						return __resolve.call(this, ('./' + _id), { paths });
					}
					catch(_error_sub)
					{
						return undefined;
					}
				}

				return null;
				//const ext = Object.keys(__module._extensions);
			}
			
			Object.defineProperty(__module.prototype, 'prepareModule', { get: function() { return prepareModule; }});

			//
			const checkDependency = (_id, _state) => {
				if(typeof dependency === 'undefined')
				{
					return checkDependency.null.push([ _id, _state ]);
				}

				return dependency.require(_id, _state);
			};

			checkDependency.null = [];

			Object.defineProperty(__module.prototype, 'checkDependency', { get: function() { return checkDependency; }});

			//
			__module.prototype.require = function(_id)
			{
				//
				const original = _id;
				const originalRawMode = rawMode;

				//
				if(typeof _id === 'object' && _id !== null)
				{
					var res;

					if(Array.isArray(_id))
					{
						//
						res = [];

						//
						for(var i = 0; i < _id.length; i++)
						{
							if(typeof _id[i] !== 'string' || _id[i].length === 0)
							{
								return x('Invalid %[%] (not a non-empty %)', null, '_id', i, 'String');
							}
						}

						//
						for(var i = 0; i < _id.length; i++)
						{
							res[i] = require(_id[i]);
						}
					}
					else
					{
						//
						res = Object.create(null);

						//
						for(const idx in _id)
						{
							if(typeof _id[idx] !== 'string' || _id[idx].length === 0)
							{
								return x('Invalid %[%] (not a non-empty %)', null, '_id', idx, 'String');
							}
						}

						//
						for(const idx in _id)
						{
							res[idx] = require(_id[idx]);
						}
					}

					return res;
				}
				else if(typeof _id !== 'string' || _id.length === 0)
				{
					return x('Invalid % (not a non-empty %)', null, '_id', 'String');
				}

				//
				const inc = () => {
					//
					if(silentMode)
					{
						return -1;
					}

					//
					if(++NESTED > NESTED_PEAK)
					{
						NESTED_PEAK = NESTED;
					}

					//
					STACK.push(_id);
					HISTORY.push(_id);

					//
					LAST = _id;
					++TOTAL_MODULES;

					//
					checkDependency(_id, true);

					//
					return NESTED;
				};

				const dec = () => {
					//
					checkDependency(_id, false);

					//
					STACK.pop();

					//
					return --NESTED;
				};

				//
				if(typeof (_id = prepareModule.call(this, _id)) !== 'string')
				{
					return x('Module could not be resolved (not found: \'%\')'.bold, null, original);
				}
				else if(_id.length === 0)
				{
					return x('Invalid % argument (may not be empty)', null, '_id');
				}
				else
				{
					inc();
				}

				if(_id in CACHE)
				{
					dec();

					if(typeof CACHE[_id] === 'function' && CACHE[_id].name === '_')
					{
						return CACHE[_id]();
					}

					return CACHE[_id];
				}

				//
				var result;
				var error;

				try
				{
					result = __require.call(this, _id);
					error = false;
					CACHE[_id] = result;
				}
				catch(_error)
				{
					result = undefined;
					error = true;

					if(! silentMode)
					{
						return x(_error);
					}
				}
				finally
				{
					//
					dec();

					//
					silentMode = false;
					rawMode = originalRawMode;
				}

				//
				if(typeof result === 'function' && result.name === '_')
				{
					return result();
				}

				//
				return result;
			}

			//
			//__module.prototype.require.resolve = __resolve;
			//__module.prototype.require.cache = __cache;

			//
			STACK = [];
			HISTORY = [];

			Object.defineProperty(__module.prototype, 'moduleStack', { enumerable: true, get: function()
			{
				return [ ... STACK ];
			}});

			Object.defineProperty(__module.prototype, 'moduleHistory', { enumerable: true, get: function()
			{
				return [ ... HISTORY ];
			}});

			//
			LAST = null;

			TOTAL_MODULES = 0;
			NESTED = NESTED_PEAK = 0;

			Object.defineProperty(__module.prototype, 'lastModule', { enumerable: true, get: function()
			{
				return LAST;
			}});

			Object.defineProperty(__module.prototype, 'running', { enumerable: true, get: function()
			{
				return (NESTED > 0);
			}});

			Object.defineProperty(__module.prototype, 'nestedModulePeak', { enumerable: true, get: function()
			{
				return NESTED_PEAK;
			}});

			Object.defineProperty(__module.prototype, 'nestedModules', { enumerable: true, get: function()
			{
				return NESTED;
			}});

			Object.defineProperty(__module.prototype, 'moduleCount', { enumerable: true, get: function()
			{
				return TOTAL_MODULES;
			}});

			//
			CACHE = Object.create(null);

			Object.defineProperty(__module.prototype, 'moduleCache', { enumerable: true, get: function()
			{
				return CACHE;
			}});

			//
			Object.defineProperty(global, 'errorInfo', { get: function()
			{
				return {
					lastModule: LAST,
					moduleStack: (STACK.length === 0 ? null : [ ... STACK ]),
					nestedModules: NESTED,
					nestedModulePeak: NESTED_PEAK,
					moduleCount: TOTAL_MODULES
				};
			}});

		}

		//
		require(__path.join(__dirname, 'copyright.js'));

		//
		autoload = require(__path.join(__dirname, 'autoload.json'));

		for(var i = 0; i < autoload.length; i++)
		{
			autoload[i] = require(autoload[i]);
		}

		//
		__INIT = false;
		__STOP = Date.now();

	})();

	//
	//module.exports = process.versions.library;
	module.exports = VERSION;

	//
	return Date.now();

})();

