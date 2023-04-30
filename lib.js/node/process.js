if(typeof __PROCESS !== 'number') __PROCESS = (function()
{

	//
	if(typeof path === 'undefined')
	{
		require('+path');
	}

	//
	const DEFAULT_ENV_DELIMITER_SPLIT = true;
	const DEFAULT_BIONIC = false;

	//
	process.cleanUp = (... _args) => {
		// these two should be more good than bad.. let's let 'em to their defaults (true)! ;-)
		const EMIT_CLEANUP = true;
		const EMIT_FIN = true;

		const hasProcEvents = (typeof process.emit === 'function');
		const hasGlobalEvents = (typeof emit === 'function');

		if(EMIT_CLEANUP)
		{
			if(hasGlobalEvents)
			{
				emit('cleanup', ... _args);
			}

			if(hasProcEvents)
			{
				process.emit('cleanup', ... _args);
			}
		}

		const result = Object.create(null);

		for(const idx in process.cleanUp)
		{
			if(typeof process.cleanUp[idx] === 'function')
			{
				result[idx] = process.cleanUp[idx](... _args);
			}
		}

		if(EMIT_FIN)
		{
			if(hasGlobalEvents)
			{
				emit('fin', ... _args);
			}

			if(hasProcEvents)
			{
				process.emit('fin', ... _args);
			}
		}

		return result;
	};

	process.cleanUp.rawCleanUp = () => {
		if(typeof RAW === 'undefined')
		{
			return [];
		}

		return RAW.cleanUp();
	};

	process.cleanUp.message = () => {
		if(! UPTIME)
		{
			return null;
		}

		var result;
		const hasOwnFunc = (typeof Math.time?.render === 'function');
		const suffix = (hasOwnFunc ? '' : 'seconds');

		if(hasOwnFunc)
		{
			result = Math.time.render(process.uptime() * 1000, COLORS, ', ', true, false);
		}
		else
		{
			result = process.uptime();
		}

		console.debug('Uptime: % %', result, suffix);
		return result;
	};

	process.cleanUp.cursor = () => {
		if(typeof ansi === 'undefined')
		{
			return false;
		}
		else
		{
			return ansi.cursor.show();
		}

		return true;
	};

	//
	process.on('uncaughtException', (_error) => {
		return throwError(_error, EXIT);
	});

	// check if data has been piped to the process (via stdin).
	Object.defineProperty(process, 'STDIN', { get: function()
	{
		return (!(process.stdin.isTTY));
	}});

	//
	Object.defineProperty(process, 'ARGV', { get: function()
	{
		return process.argv.slice((typeof NATIVE === 'boolean' && NATIVE) ? 3 : 2);
	}});

	//
	Object.defineProperty(process, 'hasEnv', { value: function(_key, _config = true)
	{
		if(typeof _key !== 'string' || _key.length === 0)
		{
			return x('Invalid _key (expecting non-empty String)');
		}

		if(_key in process.env)
		{
			return true;
		}
		else if(_config)
		{
			return (_key.toUpperCase() in CONFIG);
		}

		return false;
	}});

	Object.defineProperty(process, 'setEnv', { value: function(_key, _value = true, _render = true, _config = true, _throw = true)
	{
		if(typeof _key !== 'string' || _key.length === 0)
		{
			return x('Invalid _key (expecting non-empty String)');
		}

		const orig = _value;

		if(_render && typeof _value !== 'string')
		{
			if(isNumeric(_value))
			{
				_value = _value.toString();
			}
			else if(Array.isArray(_value, true))
			{
				if(_value.length === 0)
				{
					_value = '';
				}
				else if((_value = _value.join(path.delimiter)).length === 1)
				{
					_value = _value[0];
				}
			}
			else if(typeof String.render === 'function')
			{
				_value = String.render(_value);
			}
			else if(typeof _value.toText === 'function')
			{
				_value = _value.toText();
			}
			else if(typeof _value.toString === 'function')
			{
				_value = _value.toString();
			}
			else if(_throw)
			{
				return x('Couldn\'t make a % out of your %', null, 'String', '_value');
			}
		}

		if(_config)
		{
			if(_key.toUpperCase() in CONFIG)
			{
				CONFIG[_key.toUpperCase()] = orig;
			}
		}

		return process.env[_key] = _value;
	}});

	Object.defineProperty(process, 'getEnv', { value: function(_key, _parse = true, _config = true)
	{
		if(typeof _key !== 'string' || _key.length === 0)
		{
			return x('Invalid _key (expecting non-empty String)');
		}

		var result;

		if(_key in process.env)
		{
			result = process.env[_key];
		}
		else if(_config && ((_key = _key.toUpperCase()) in CONFIG))
		{
			result = CONFIG[_key];
		}
		else
		{
			return undefined;
		}

		if(_parse && typeof result === 'string' && result.length > 0)
		{
			if(DEFAULT_ENV_DELIMITER_SPLIT)
			{
				if((result = result.split(path.delimiter)).length === 1)
				{
					result = result[0];

					if(typeof String.parse === 'function')
					{
						result = String.parse(result);
					}
				}
				else if(typeof String.parse === 'function') for(var i = 0; i < result.length; ++i)
				{
					result[i] = String.parse(result[i]);
				}
			}
			else
			{
				result[i] = String.parse(result[i]);
			}
		}

		return result;
	}});

	Object.defineProperty(process, 'unsetEnv', { value: function(_key, _config = true)
	{
		if(typeof _key !== 'string' || _key.length === 0)
		{
			return x('Invalid _key (expecting non-empty String)');
		}

		var result;

		if(_key in process.env)
		{
			result = process.env[_key];
			delete process.env[_key];
		}
		else if(_config)
		{
			if(_key.toUpperCase() in CONFIG)
			{
				result = CONFIG[_key.toUpperCase()];
				delete CONFIG[_key.toUpperCase()];
			}
			else
			{
				result = undefined;
			}
		}
		else
		{
			result = undefined;
		}

		return result;
	}});

	//
	Object.defineProperty(process, 'STDIO', { get: function()
	{
		return (!(process.stdin.isTTY));
	}});

	//
	function stdioErrorExit(_error)
	{
		if(! isInt(EXIT))
		{
			return _error;
		}
		else if(isInt(STDIO_ERROR_THROW_EXIT))
		{
			process.exit(Math.abs(STDIO_ERROR_THROW_EXIT % 256));
		}
		else if(STDIO_ERROR_THROW_EXIT === true)
		{
			process.exit(Math.random.int(255, 0));
		}
	}

	function stdioErrorLog(_error)
	{
		if(typeof STDIO_ERROR_THROW_LOG !== 'string' || STDIO_ERROR_THROW_LOG.length === 0)
		{
			return null;
		}

		const mode = (fs.isPerm(MODE_FILE) ? MODE_FILE : 0o600);
		const endOfLines = 1 + 1;

		try
		{
			if(typeof fs === 'undefined')
			{
				try
				{
					fs = require('fs');
				}
				catch(_er)
				{
					return undefined;
				}
			}

			fs.appendFileSync(STDIO_ERROR_THROW_LOG, _error.stack + eol(endOfLines), { encoding, mode });
		}
		catch(_error)
		{
			return -1;
		}

		return _error.stack.length + endOfLines;
	}

	function adaptStdioStream(_stream, _index, _name)
	{
		//
		if(typeof _index === 'number')
		{
			_stream.index = _index;
		}

		if(typeof _name === 'string' && _name.length > 0)
		{
			_stream.name = _name;
		}

		//
		if(_index === 0)
		{
			return _stream;
		}

		//
		const _write = _stream.WRITE = _stream.write.bind(_stream);

		//
		_stream.write = (function(_data)
		{
			if(typeof __GLOBALS !== 'number')
			{
				return _write(_data);
			}
			else if(! WRITE)
			{
				return '';
			}
			else if(! (STDOUT || STDERR))
			{
				return '';
			}
			else switch(this.name)
			{
				case 'stdout':
					if(! STDOUT)
					{
						return '';
					}
					break;
				case 'stderr':
					if(! STDERR)
					{
						return '';
					}
					break;
			}

			if(isInt(_data) && _data > 0)
			{
				_data = eol(_data);
			}

			if(typeof _data !== 'string')
			{
				if(typeof dataToString === 'function' && (_data = dataToString(_data, (typeof encoding === 'string' ? encoding : 'utf8'))).length === 0)
				{
					return '';
				}
			}
			else if(_data.length === 0)
			{
				return '';
			}

			const less = (_string) => {
				return _string.less;
			};

			const color = (_string, _color, _respect = RESPECT) => {
				if(_respect)
				{
					return checkAnsiModule().color.fg(_color, _string);
				}

				return checkAnsiModule().force.fg(_color, _string);
			};

			const checkFileSystemModules = () => {
				if(typeof path === 'undefined')
				{
					path = require('+path');
				}

				if(typeof fs === 'undefined')
				{
					fs = require('+fs');
				}

				return { path, fs };
			};

			const checkAnsiModule = () => {
				if(typeof ansi === 'undefined')
				{
					ansi = require('tty/ansi');
				}

				return ansi;
			};

			//
			if(COLOR_STDOUT || COLOR_STDERR) switch(this.name)
			{
				case 'stdout':
					if(checkAnsiModule().isColor(COLOR_STDOUT))
					{
						_data = color(_data, COLOR_STDOUT);
					}
					break;
				case 'stderr':
					if(checkAnsiModule().isColor(COLOR_STDERR))
					{
						_data = color(_data, COLOR_STDERR);
					}
					break;
			}

			//
			var file;

			if(typeof WRITE === 'string' && WRITE.length > 0)
			{
				file = WRITE;
			}
			else switch(this.name)
			{
				case 'stdout':
					if(typeof STDOUT === 'string' && STDOUT.length > 0)
					{
						file = STDOUT;
					}
					else
					{
						file = null;
					}
					break;
				case 'stderr':
					if(typeof STDERR === 'string' && STDERR.length > 0)
					{
						file = STDERR;
					}
					else
					{
						file = null;
					}
					break;
				default:
					file = null;
					break;
			}

			if(file)
			{
				//
				var fileData = _data;

				//
				checkFileSystemModules();

				if(! FORCE)
				{
					fileData = less(fileData);
				}
				else if(FORCE !== true && checkAnsiModule().isColor(FORCE))
				{
					fileData = color(fileData, FORCE);
				}
				else if(FORCE === true)
				{
					switch(this.name)
					{
						case 'stdout':
							if(checkAnsiModule().isColor(COLOR_STDOUT))
							{
								fileData = color(fileData, COLOR_STDOUT);
							}
							break;
						case 'stderr':
							if(checkAnsiModule().isColor(COLOR_STDERR))
							{
								fileData = color(fileData, COLOR_STDERR);
							}
							break;
					}
				}

				const mode = (fs.isPerm(MODE_FILE) ? MODE_FILE : 0o600);
				var enc;

				if((typeof encoding === 'string' && encoding.length > 0) || encoding === null)
				{
					enc = encoding;
				}
				else
				{
					enc = 'utf8';
				}

				//
				try
				{
					file = path.resolve(file);
					fs.appendFileSync(file, fileData, { encoding: enc, mode });
				}
				catch(_error)
				{
					stdioErrorLog(_error);

					if(STDIO_ERROR_THROW_FILE)
					{
						return x(_error);
					}
					else
					{
						stdioErrorExit(_error);
					}

					if(! TEE)
					{
						return null;
					}
				}

				if(! TEE)
				{
					return fileData;
				}
			}

			//
			if(this.isTTY)
			{
				if(! ANSI)
				{
					_data = less(_data);
				}
				else if(ANSI !== true && checkAnsiModule().isColor(ANSI))
				{
					_data = color(_data, ANSI);
				}
				else if(CZ)
				{
					_data = checkAnsiModule().colorize(_data, true);
				}
				else if(RB)
				{
					_data = checkAnsiModule().rainbow(_data, true);
				}
			}
			else
			{
				if(! FORCE)
				{
					_data = less(_data);
				}
				else if(FORCE !== true && checkAnsiModule().isColor(FORCE))
				{
					_data = color(_data, FORCE);
				}
				else if(CZ)
				{
					_data = checkAnsiModule().colorize(_data, true);
				}
				else if(RB)
				{
					_data = checkAnsiModule().rainbow(_data, true);
				}
			}

			//
			/*if(!!ANSI && !!BIONIC && !!DEFAULT_BIONIC)
			{
				if(typeof bionic === 'undefined')
				{
					require('utility/bionic');
				}

				_data = bionic(_data, 'ansi', 'ansi', false);
			}*/

			//
			try
			{
				_write.call(this, _data);
			}
			catch(_error)
			{
				stdioErrorLog(_error);

				if(STDIO_ERROR_THROW)
				{
					return x(_error);
				}
				else
				{
					stdioErrorExit(_error);
				}

				return null;
			}

			return _data;
		}).bind(_stream);

		//
		_stream.on('error', (_error) => {
			stdioErrorLog(_error);

			if(STDIO_ERROR_THROW)
			{
				return x(_error);
			}
			else
			{
				stdioErrorExit(_error);
			}
		});

		//
		return _stream;
	}

	//
	process.stdio = [ 'stdin', 'stdout', 'stderr' ];

	for(var i = 0; i < process.stdio.length; i++)
	{
		process.stdio[i] = adaptStdioStream(process[process.stdio[i]], i, process.stdio[i]);
	}

	Object.defineProperty(process.stdio, 'stdin', { enumerable: true,
		get: function()
		{
			return process.stdio[0];
		},
		set: function(_value)
		{
			if(Stream.isReadStream(_value))
			{
				return process.stdio[0] = _value;
			}

			return process.stdio.stdin;
		}
	})

	Object.defineProperty(process.stdio, 'stdout', { enumerable: true,
		get: function()
		{
			return process.stdio[1];
		},
		set: function(_value)
		{
			if(Stream.isWriteStream(_value))
			{
				return process.stdio[1] = _value;
			}

			return process.stdio.stdout;
		}
	});

	Object.defineProperty(process.stdio, 'stderr', { enumerable: true,
		get: function()
		{
			return process.stdio[2];
		},
		set: function(_value)
		{
			if(Stream.isWriteStream(_value))
			{
				return process.stdio[2] = _value;
			}

			return process.stdio.stderr;
		}
	});

	process._stdin = process.stdin;
	process._stdout = process.stdout;
	process._stderr = process.stderr;

	Object.defineProperty(process, 'stdin', { enumerable: true, get: function()
	{
		return process.stdio.stdin;//[0];
	}});

	Object.defineProperty(process, 'stdout', { enumerable: true, get: function()
	{
		return process.stdio.stdout;//[1];
	}});

	Object.defineProperty(process, 'stderr', { enumerable: true, get: function()
	{
		return process.stdio.stderr;//[2];
	}});

	//
	(process.setEncoding = function(_encoding)
	{
		for(var i = 0; i < process.stdio.length; i++)
		{
			if(typeof process.stdio[i].setEncoding === 'function')
			{
				process.stdio[i].setEncoding(_encoding);
			}
		}

		return process.stdio;
	})(ENCODING);

	//
	Object.defineProperty(process, 'privileged', { get: function()
	{
		return (process.isRoot || process.hasRoot);
	}});

	Object.defineProperty(process, 'isRoot', { get: function()
	{
		return (process.getuid() === 0 || process.geteuid() === 0);
	}});

	Object.defineProperty(process, 'hasRoot', { get: function()
	{
		return (process.getgid() === 0 || process.getegid() === 0);
	}});

	//
	process.getStream = function(_index, _fallback = null, _check_tty = false, _read_stream = false, _throw = false)
	{
		if(Stream.isStream(_index, _check_tty))
		{
			return _index;
		}
		else if(! process.getStream.isValid(_index, _check_tty, _read_stream))
		{
			if(_throw)
			{
				return x('Invalid selection (no stream matches your _index)');
			}

			if(typeof _fallback !== 'undefined' && _fallback !== null)
			{
				return process.getStream(_fallback, null, _check_tty, _read_stream, _throw);
			}

			return _fallback;
		}

		//
		var result = null;

		if(typeof _index === 'number')
		{
			result = process.stdio[_index = process.stdio.getIndex(_index)];
		}
		else if(typeof _index === 'string')
		{
			for(var i = 0; i < process.stdio.length; i++)
			{
				if(process.stdio[i].name === _index)
				{
					result = process.stdio[i];
					break;
				}
			}
		}
		else if(Object.isObject(_index))
		{
			if(typeof _index.write === 'function')
			{
				result = _index;
			}
			else
			{
				result = null;
			}
		}
		else if(typeof _index === 'function')
		{
			return { write: _index, end: _index };
		}
		else
		{
			result = null;
		}

		if(typeof result === 'undefined' || result === null)
		{
			if(typeof _fallback !== 'undefined' && _fallback !== null)
			{
				result = process.getStream(_fallback, null, _check_tty, _read_stream, _throw);
			}

			if(result === null)
			{
				if(_throw)
				{
					return x('Unexpected: a valid stream _index did not result in any stream');
				}

				return result;
			}
		}

		if(_check_tty && !result.isTTY)
		{
			return process.getStream(_fallback, null, _check_tty, _read_stream, _throw);
		}

		return result;
	}

	process.getStream.isValid = function(_stream, _check_tty = false, _read_stream = false)
	{
		if(typeof _stream === 'undefined' || _stream === null)
		{
			return false;
		}

		if(Number.isInt(_stream))
		{
			_stream = process.stdio.getIndex(_stream);

			if(_read_stream === false && _stream === 0)
			{
				return false;
			}
			else if(_check_tty)
			{
				return (process.stdio[_stream].isTTY);
			}

			return true;
		}
		else if(typeof _stream === 'string')
		{
			if(_stream.length === 0)
			{
				return false;
			}

			for(var i = 0; i < process.stdio.length; i++)
			{
				if(process.stdio[i].name === _stream)
				{
					if(_check_tty)
					{
						return process.stdio[i].isTTY;
					}

					return true;
				}
			}
		}
		else if(Stream.isStream(_stream))
		{
			if(_check_tty)
			{
				return _stream.isTTY;
			}

			return true;
		}

		return false;
	}

	process.findTTY = function(_start = 1, _stop)
	{
		if(Number.isInt(_start))
		{
			_start = process.stdio.getIndex(_start);
		}
		else
		{
			_start = 1;
		}

		if(Number.isInt(_stop))
		{
			_stop = getIndex(_stop, process.stdio.length + 1);
		}
		else
		{
			_stop = process.stdio.length;
		}

		for(var i = _start; i < process.stdio.length && i <= _stop; ++i)
		{
			if(process.stdio[i].isTTY)
			{
				return process.stdio[i];
			}
		}

		return null;
	}

	process.findStream = function(_start = 1, _fallback = null, _check_tty = false, _prefer_tty = true, _read_stream = false, _throw = false)
	{
		if(typeof __STREAM !== 'number')
		{
			require('+stream');
		}

		if(typeof _start === 'number')
		{
			_start = process.stdio.getIndex(_start);
		}
		else if(Stream.isStream(_start, _check_tty))
		{
			return _start;
		}
		else
		{
			return process.getStream(_start, _fallback, _check_tty, _read_stream, _throw);
		}

		if(_check_tty)
		{
			for(var i = _start; i < process.stdio.length; i++)
			{
				if(process.stdio[i].isTTY)
				{
					return process.stdio[i];
				}
			}

			if(_throw)
			{
				return x('Couldn\'t find any stream with .isTTY');
			}

			return _fallback;
		}
		else if(_prefer_tty)
		{
			for(var i = _start; i < process.stdio.length; i++)
			{
				if(process.stdio[i].isTTY)
				{
					return process.stdio[i];
				}
			}

			return process.stdio[_start];
		}
		else if(tty.length > 0)
		{
			return process.stdio[_start];
		}

		if(_throw)
		{
			return x('Couldn\'t find a suitable stream');
		}

		if(typeof _fallback !== 'undefined' && _fallback !== null)
		{
			return process.getStream(_fallback, null, _check_tty, _read_stream, _throw);
		}

		return _fallback;
	}

	//
	Object.defineProperty(process, 'stop', { value: function(_signal)
	{
		if(Number.isInt(_signal))
		{
			return process.exit(_signal);
		}
		else if(String.isString(_signal))
		{
			return process.kill(process.pid, _signal.toUpperCase());
		}

		return x('Invalid _signal (expecting String or Integer)');
	}});

	//
	var signalsEnabled = null;

	//
	// < https://nodejs.org/api/process.html#process_signal_events >
	//
	// TODO: do i need 'SIGWINCH' here!? or do i only use my 'tty/raw'?!?
	//
	process.signals = function(_enable)
	{
		//
		if(typeof _enable !== 'boolean')
		{
			return x('Invalid % argument (expecting one % type)', null, '_enable', 'Boolean');
		}
		else if(_enable === true && signalsEnabled === true)
		{
			return false;
		}
		else if(_enable === false && signalsEnabled === false)
		{
			return false;
		}
		else
		{
			signalsEnabled = _enable;
		}

		//
		if(_enable)
		{
			__SIGNAL = Object.create(null);

			__SIGNAL.name = null;
			__SIGNAL.number = null;
			__SIGNAL.time = null;
		}
		else
		{
			__SIGNAL = null;
		}

		//
		try
		{
			const onSignal = (_name, _number) => {
				//
				if(SIGNAL)
				{
					console.warn('Signal \'%\' (%) received (PID: %, PPID: %)', _name, _number, process.pid, process.ppid);
				}

				//
				__SIGNAL.time = Date.now();
				__SIGNAL.name = _name;
				__SIGNAL.number = _number;
				__SIGNAL.warned = !!SIGNAL;

				//
				if(SIGNAL_EXIT)
				{
					return process.exit(_number);
				}
			};

			const onExit = (... _args) => {
				//
				if(SIGNAL && !__SIGNAL?.warned)
				{
					console.warn('Process ends now (PID: %, PPID: %)', process.pid, process.ppid);
				}

				//
				return process.cleanUp('onExit', ... _args);
			};

			//
			if(_enable)
			{
				//process.on('uncaughtException', onException);
				process.on('exit', onExit);
				process.on('SIGINT', onSignal);
				process.on('SIGQUIT', onSignal);
				process.on('SIGTERM', onSignal);
				process.on('SIGUSR1', onSignal);
				process.on('SIGUSR2', onSignal);
				process.on('SIGHUP', onSignal);//can cause trouble on windows?
				process.on('SIGBREAK', onSignal);//only on windows
			}
			else
			{
				//process.off('uncaughtException', onException);
				process.off('exit', onExit);
				process.off('SIGINT', onSignal);
				process.off('SIGQUIT', onSignal);
				process.off('SIGTERM', onSignal);
				process.off('SIGUSR1', onSignal);
				process.off('SIGUSR2', onSignal);
				process.off('SIGHUP', onSignal);//can cause trouble on windows?
				process.off('SIGBREAK', onSignal);//only on windows
			}
		}
		catch(_error)
		{
			return x(_error);
		}
	}

	process.signals(SIGNALS);

	//
	const _hrtime = process.hrtime;
	const _hrtime_bigint = process.hrtime.bigint;

	Object.defineProperty(process, 'hrtime', { value: function(_diff, _type)
	{
		if(String.isString(_diff) || typeof _diff === 'boolean')
		{
			[ _diff, _type ] = [ _type, _diff ];
		}
		else if(Number.isNumber(_type))
		{
			[ _diff, _type ] = [ _type, _diff ];
		}

		if(String.isString(_type))
		{
			switch(_type)
			{
				case 'nano':
				case 'nanoseconds':
					_type = 'nano';
					break;
				case 'micro':
				case 'microseconds':
					_type = 'micro';
					break;
				case 'milli':
				case 'milliseconds':
					_type = 'milli';
					break;
				case 'bigint':
					_type = 'bigint';
					break;
				case '*':
				case 'all':
					_type = '*';
					break;
				default:
					_type = '';
					break;
			}
		}
		else if(_type === true)
		{
			_type = '*';
		}
		else
		{
			_type = '';
		}

		if(! isNumeric(_diff))
		{
			_diff = null;
		}

		if(_type === '*')
		{
			return process.hrtime.all();
		}
		else if(_type && typeof process.hrtime[_type] === 'function')
		{
			return process.hrtime[_type](_diff);
		}

		return _hrtime();
	}});

	Object.defineProperty(process.hrtime, 'all', { value: function()
	{
		const result = Object.create(null);
		const types = [ 'bigint', 'nano', 'micro', 'milli' ];

		for(var idx of types)
		{
			if(idx === 'all')
			{
				continue;
			}
			else if(idx === 'bigint')
			{
				result[idx] = process.hrtime[idx]();
			}
			else
			{
				result[idx] = process.hrtime[idx]();
			}
		}

		return result;
	}});

	Object.defineProperty(process.hrtime, 'bigint', { value: function(_diff)
	{
		const result = _hrtime_bigint();

		if(typeof _diff === 'bigint')
		{
			return (result - _diff);
		}

		return result;
	}});

	Object.defineProperty(process.hrtime, 'nano', { value: function(_diff, _bigint = false)
	{
		if(_bigint)
		{
			if(Number.isNumber(_diff))
			{
				_diff = BigInt.from(_diff);
			}
			else if(typeof _diff !== 'bigint')
			{
				_diff = null;
			}

			return process.hrtime.bigint(_diff);
		}

		var result = process.hrtime();
		result = ((result[0] * 1e9) + result[1]);

		if(Number.isNumber(_diff))
		{
			result -= _diff;
		}

		return result;
	}});

	Object.defineProperty(process.hrtime, 'micro', { value: function(_diff)
	{
		var result = process.hrtime();
		result = ((result[0] * 1e6) + (result[1] * 1e-3));

		if(Number.isNumber(_diff))
		{
			result -= _diff;
		}

		return result;
	}});

	Object.defineProperty(process.hrtime, 'milli', { value: function(_diff)
	{
		var result = process.hrtime();
		result = ((result[0] * 1e3) + (result[1] * 1e-6));

		if(Number.isNumber(_diff))
		{
			result -= _diff;
		}

		return result;
	}});

	//
	Object.defineProperty(process, 'isTTY', { get: function()
	{
		for(var i = 1; i < process.stdio.length; ++i)
		{
			if(process.stdio[i].isTTY)
			{
				return i;
			}
		}

		return 0;
	}});

	//
	write = function(... _printf)
	{
		const result = String.printf(... _printf);
		process.stdio[1].write(result);
		return result;
	}

	write.eol = function(_eol = 1, ... _printf)
	{
		if(! (Number.isInt(_eol) && _eol >= 0))
		{
			_eol = 1;
		}

		const result = String.printf(... _printf) + eol(_eol);
		process.stdio[1].write(result);
		return result;
	}

	writeError = function(... _printf)
	{
		const result = String.printf(... _printf);
		process.stdio[2].write(result);
		return result;
	}

	writeError.eol = function(_eol = 1, ... _printf)
	{
		if(! (Number.isInt(_eol) && _eol >= 0))
		{
			_eol = 1;
		}

		const result = String.printf(... _printf) + eol(_eol);
		process.stdio[2].write(result);
		return result;
	}

	//
	process.warn = function(... _printf)
	{
		const result = String.printf(... _printf);
		process.emitWarning(result);
		return result;
	}

	//
	
	//
	return Date.now();

})();

