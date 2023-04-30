(function()
{

	//
	const DEFAULT_WORKING_DIRECTORY_FALLBACK = true;
	const DEFAULT_ENABLE = false;
	const DEFAULT_ANSI = false;

	//
	const Logger = module.exports = class Logger extends require('core/node')
	{
		constructor(_options)
		{
			super(_options);
		}

		enable()
		{
			if(this._enabled)
			{
				return false;
			}
			else if(! this.loggerPath)
			{
				return null;
			}

			return this._enabled = true;
		}

		disable()
		{
			if(this._enabled)
			{
				return !(this._enabled = false);
			}

			return false;
		}

		get ansi()
		{
			if(typeof this.options.ansi === 'boolean')
			{
				return this.options.ansi;
			}

			return DEFAULT_ANSI;
		}

		set ansi(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.ansi = _value;
			}
			else
			{
				delete this.options.ansi;
			}

			return this.ansi;
		}

		get workingDirectoryFallback()
		{
			if(typeof this.options.workingDirectoryFallback === 'boolean')
			{
				return this.options.workingDirectoryFallback;
			}

			return DEFAULT_WORKING_DIRECTORY_FALLBACK;
		}

		set workingDirectoryFallback(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.workingDirectoryFallback = _value;
			}
			else
			{
				delete this.options.workingDirectoryFallback;
			}

			return this.workingDirectoryFallback;
		}

		checkIdentifier(_identifier, _throw = true)
		{
			if(String.isString(_identifier))
			{
				if((_identifier = path.check(_identifier.less, true)).length === 0)
				{
					if(_throw)
					{
						return x('Invalid _identifier (no characters left after filtering)');
					}
					else
					{
						return null;
					}
				}
			}
			else if(_throw)
			{
				return x('Invalid _identifier (not a non-empty String)');
			}
			else
			{
				return null;
			}

			var p = this.loggerPath;

			if(p)
			{
				p = path.join(p, _identifier);

				if(fs.exists.directory(p, true))
				{
					try
					{
						fs.chmodSync(p, Logger.mode.directory);
					}
					catch(_error)
					{
						if(_throw)
						{
							return x(_throw);
						}

						return null;
					}
				}
				else if(fs.exists(p))
				{
					if(_throw)
					{
						return x('Path \'' + p + '\' already exists, but not as directory');
					}

					return null;
				}
				else
				{
					try
					{
						fs.mkdirSync(p, { recursive: true, mode: Logger.mode.directory });
					}
					catch(_error)
					{
						if(_throw)
						{
							return x(_throw);
						}

						return null;
					}
				}
			}
			else if(_throw)
			{
				return x('No .loggerPath defined');
			}
			else
			{
				return null;
			}

			return _identifier;
		}

		get loggerPath()
		{
			var result;

			if(this.root)
			{
				result = this.root;
			}
			else if(this.workingDirectoryFallback)
			{
				result = this.root = process.cwd();
			}
			else
			{
				return null;
			}

			return result;
		}

		set loggerPath(_value)
		{
			if(String.isString(_value))
			{
				return this.root = (_value = path.resolve(_value.less));
			}
			else
			{
				this.root = null;
			}

			return this.loggerPath;
		}

		static get read()
		{
			return 'read';
		}

		static get write()
		{
			return 'write';
		}

		static get extension()
		{
			return '.raw';
		}

		static get mode()
		{
			return Object.null({ directory: 0o700, file: 0o600 });
		}

		read(_data, _encoding, _identifier, _throw = true)
		{
			var p = this.loggerPath;

			if(p)
			{
				if(String.isString(_identifier))
				{
					_identifier = this.checkIdentifier(_identifier, false);
				}
				else
				{
					_identifier = null;
				}

				p = path.join(p, (String.isString(_identifier) ? _identifier : ''), Logger.read + Logger.extension);
			}
			else if(_throw)
			{
				return x('Actually no .loggerPath set.. can\'t log any READ data here');
			}
			else
			{
				return 0;
			}

			var data = dataToString(_data);

			if(data.length === 0)
			{
				return 0;
			}
			else if(! this.ansi)
			{
				data = data.less;
			}

			fs.appendFileSync(p, data, { encoding: 'utf8', mode: Logger.mode.file });
			return data.length;
		}

		write(_data, _encoding, _identifier, _throw = true)
		{
			var p = this.loggerPath;

			if(p)
			{
				if(String.isString(_identifier))
				{
					_identifier = this.checkIdentifier(_identifier, false);
				}
				else
				{
					_identifier = null;
				}

				p = path.join(p, (String.isString(_identifier) ? _identifier : ''), Logger.write + Logger.extension);
			}
			else if(_throw)
			{
				return x('Actually no .loggerPath set.. can\'t log any WRITE data here');
			}
			else
			{
				return 0;
			}

			var data = dataToString(_data);

			if(data.length === 0)
			{
				return 0;
			}
			else if(! this.ansi)
			{
				data = data.less;
			}

			fs.appendFileSync(p, data, { encoding: 'utf8', mode: Logger.mode.file });
			return data.length;
		}

		get client()
		{
			if(this.options.client)
			{
				return this.options.client;
			}
			
			return null;
		}

		set client(_value)
		{
			if(_value instanceof Logger.Client)
			{
				return this.options.client = _value;
			}
			else
			{
				delete this.options.client;
			}

			return this.client;
		}

		get server()
		{
			if(this.options.server)
			{
				return this.options.server;
			}

			return null;
		}

		set server(_value)
		{
			if(_value instanceof Logger.Server)
			{
				return this.options.server = _value;
			}
			else
			{
				delete this.options.server;
			}

			return this.server;
		}

		static create(... _args)
		{
			const options = {};

			for(var i = 0; i < _args.length; i++)
			{
				if(_args[i] instanceof Logger.Client)
				{
					options.client = _args[i];
				}
				else if(_args[i] instanceof Logger.Server)
				{
					options.server = _args[i];
				}
				else if(Object.isObject(_args[i]))
				{
					options.merge(_args[i]);
				}
			}

			return new this(options);
		}
	}

	//
	Logger.Client = require('network/client');
	Logger.Server = require('network/server');

	//
	
})();

