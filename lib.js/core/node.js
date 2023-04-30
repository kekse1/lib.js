(function()
{

	//
	if(typeof ITEM === 'undefined')
	{
		require('core/item');
	}

	//
	const DEFAULT_NAME_LENGTH = 16;
	const DEFAULT_REAL_LENGTH = 8;
	const DEFAULT_TIMEOUT = null;
	const DEFAULT_TIMEOUT_AGAIN = true;
	const DEFAULT_DELETE_ROOT = true;
	const DEFAULT_WORKING_DIRECTORY_ROOT_FALLBACK = true;

	//
	const id = require('utility/id');

	//
	NODE = module.exports = class NODE extends ITEM
	{
		constructor(_options)
		{
			//
			super(_options);

			//
			this.setBase();

			//
			this.uptimer();

			//
		}

		static get toIndex()
		{
			return ITEM.toIndex;
		}

		static get fromIndex()
		{
			return ITEM.fromIndex;
		}

		static get INDEX()
		{
			return ITEM.INDEX;
		}

		uptimer()
		{
			this.up = Date.now();

			if(typeof process?.hrtime?.bigint === 'function')
			{
				this.hr = process.hrtime.bigint();
			}
			else
			{
				this.hr = null;
			}
		}

		get uptime()
		{
			return Date.now(this.up);
		}

		get hrtime()
		{
			if(this.hr === null)
			{
				return null;
			}

			return process.hrtime.bigint(this.hr);
		}

		prepareConsoleOutput(... _args)
		{
			var more = this.toString();

			if(more.length > 0)
			{
				more = more.high;
			}
			else
			{
				more = null;
			}

			_args[0] = '[' + date.now().debugFG + '] ' + (more ? more + ' ' : '') + _args[0];

			return _args;
		}

		log(... _args)
		{
			return console.log.apply(this, this.prepareConsoleOutput.call(this, ... _args));
		}

		info(... _args)
		{
			return console.info.apply(this, this.prepareConsoleOutput.call(this, ... _args));
		}

		warn(... _args)
		{
			return console.warn.apply(this, this.prepareConsoleOutput.call(this, ... _args));
		}

		error(... _args)
		{
			return console.error.apply(this, this.prepareConsoleOutput.call(this, ... _args));
		}

		debug(... _args)
		{
			return console.debug.apply(this, this.prepareConsoleOutput.call(this, ... _args));
		}

		applyOptions()
		{
			//
			if(Number.isInt(this.options.timeout) && this.options.timeout >= 0)
			{
				this.timeout = this.options.timeout;
			}
			else
			{
				this.timeout = DEFAULT_TIMEOUT;
			}

			//
			if(! this.hasRoot && String.isString(ROOT))
			{
				this.root = ROOT;
			}

			//
			return super.applyOptions();
		}

		get hasRoot()
		{
			return (this.root !== null);
		}

		get deleteRoot()
		{
			if(typeof this.options.deleteRoot === 'boolean')
			{
				return this.options.deleteRoot;
			}

			return DEFAULT_DELETE_ROOT;
		}

		set deleteRoot(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.deleteRoot = _value;
			}
			else
			{
				delete this.options.deleteRoot;
			}

			return this.deleteRoot;
		}

		static get mode()
		{
			return Object.null({ directory: 0o700, file: 0o600 });
		}

		get workingDirectoryRootFallback()
		{
			if(typeof this.options.workingDirectoryRootFallback === 'boolean')
			{
				return this.workingDirectoryRootFallback;
			}

			return DEFAULT_WORKING_DIRECTORY_ROOT_FALLBACK;
		}

		set workingDirectoryRootFallback(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.workingDirectoryRootFallback;
			}
			else
			{
				delete this.options.workingDirectoryRootFallback;
			}

			return this.workingDirectoryRootFallback;
		}

		get root()
		{
			if(typeof this.options.root === 'string')
			{
				return this.options.root;
			}
			else if(this.workingDirectoryRootFallback)
			{
				if(BROWSER)
				{
					return path.dirname(location.pathname);
				}

				return process.cwd();
			}

			return null;
		}

		set root(_value)
		{
			const orig = this.options.root;

			if(String.isString(_value))
			{
				if((_value = path.resolve(_value.less)) === orig)
				{
					return _value;
				}
				else if(this.deleteRoot && String.isString(orig) && fs.exists.directory(orig, true)) try
				{
					fs.rmSync(orig, { recursive: true, force: true });
					delete this.options.root;
				}
				catch(_error)
				{
					this.error('Can\'t delete the old root directory (%).', orig);
				}

				if(fs.exists(_value, false))
				{
					if(! fs.exists.directory(_value, true))
					{
						this.error('Can\'t change \'%\' => \'%\' (as it ain\'t a directory, even if it exists..)!', '.root', _value);
						return orig;
					}
					else try
					{
						fs.chmodSync(_value, NODE.mode.directory);
						return this.options.root = _value;
					}
					catch(_error)
					{
						this.error('Can\'t \'%(%)\'!', 'chmod', _value);
					}
				}
				else try
				{
					fs.mkdirSync(_value, { recursive: true, mode: NODE.mode.directory });
					return this.options.root = _value;
				}
				catch(_error)
				{
					this.error('Can\'t \'%(%)\'!', 'mkdir', _value);
				}
			}
			else
			{
				if(! String.isString(orig))
				{
					return orig;
				}
				else if(this.deleteRoot && fs.exists.directory(orig, true)) try
				{
					fs.rmSync(orig, { recursive: true, force: true });
				}
				catch(_error)
				{
					this.error('Can\'t \'%(%)\'!', 'rm', orig);
				}

				delete this.options.root;
			}

			if(this.root === null && String.isString(ROOT))
			{
				return this.root = ROOT;
			}
			else if(this.root !== orig)
			{
				this.emit('root', this.root, orig, this);
			}

			return this.root;
		}

		ontimeout(_timeout = this.timeout, _debug_message = true)
		{
			if(this.timeoutAgain && this.hasTimeout)
			{
				this.setTimeout();
			}

			if(_debug_message)
			{
				this.debug('timeout: % milliseconds (repeat: %)', _timeout, this.timeoutAgain);
			}
		}

		get timeoutAgain()
		{
			if(typeof this.options.timeoutAgain === 'boolean')
			{
				return this.options.timeoutAgain;
			}

			return DEFAULT_TIMEOUT_AGAIN;
		}

		set timeoutAgain(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.timeoutAgain = _value;
			}
			else
			{
				delete this.options.timeoutAgain;
			}

			return this.timeoutAgain;
		}

		get timeout()
		{
			if(Number.isInt(this.options.timeout))
			{
				return this.options.timeout;
			}
			else if(this.options.timeout === null || this.options.timeout === false)
			{
				return this.options.timeout = null;
			}

			return DEFAULT_TIMEOUT;
		}

		set timeout(_value)
		{
			if(Number.isInt(_value) && _value >= 0)
			{
				this.setTimeout(_value);
				return this.options.timeout = _value;
			}
			else if(_value === null || _value === false)
			{
				this.unsetTimeout(false);
				return this.options.timeout = null;
			}
			else
			{
				this.unsetTimeout(false);
				delete this.options.timeout;
			}

			return this.timeout;
		}

		get hasTimeout()
		{
			return (Number.isInt(this.timeout) && this.timeout >= 0);
		}

		setTimeout(_value = this.timeout, _set = true)
		{
			//
			if(Number.isInt(_value) && _value >= 0)
			{
				this.unsetTimeout(false);
			}

			//
			if(_set)
			{
				this.options.timeout = _value;
			}

			//
			this._timeout = setTimeout(() => {
				this.emit('timeout', _value, this);
			}, _value);

			//
			return _value;
		}

		unsetTimeout(_unset = true)
		{
			//
			if(_unset)
			{
				delete this.options.timeout;
			}

			//
			if(this._timeout)
			{
				clearTimeout(this._timeout);
				delete this._timeout;
			}
			else
			{
				return false;
			}

			//
			return true;
		}

		reset()
		{
			//
			if(this.hasTimeout)
			{
				this.setTimeout();
			}

			//
			return super.reset();
		}

		setBase()
		{
			const base = NODE.createBase();

			for(var idx in base)
			{
				this[idx] = base[idx];
			}
		}

		static createBase(_name = DEFAULT_NAME_LENGTH, _real = DEFAULT_REAL_LENGTH)
		{
			//
			const result = Object.create(null);

			result.UUID = id.uuid();
			result.NAME = id.half(_name || 16);
			result.REAL = id.full(_real || 8);
			result.TYPE = null;

			//
			return result;
		}

		static create(_options)
		{
			return new this(Object.assign({ type: this }, _options));
		}

		destroy(_callback, _base = true)
		{
			if(_base)
			{
				delete this.UUID;
				delete this.NAME;
				delete this.REAL;
			}

			this.timeout = null;
			return super.destroy(_callback);
		}

		toString()
		{
			if(this.destroyed)
			{
				return '';
			}

			return (this.REAL + ' <' + this.NAME + '@' + os.hostname() + '>');
		}

		get address()
		{
	throw new Error('TODO');
		}

		set address(_value)
		{
			return this.address;
		}
	}

	//

})();

