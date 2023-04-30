(function()
{

	//
	const DEFAULT_THROW = false;

	const DEFAULT_PROGRESS_ROUND = 0;
	const DEFAULT_PROGRESS_LEFT = '%\\% ';
	const DEFAULT_PROGRESS_ALIGN_LEFT = 'right';
	const DEFAULT_PROGRESS_ALIGN_RIGHT = 'left';
	const DEFAULT_PROGRESS_ALIGN_TOP = 'center';
	const DEFAULT_PROGRESS_ALIGN_BOTTOM = 'center';

	//
	console._dir = console.dir;

	dir = console.dir = function(_object, _text, _options)
	{
		const options = {};

		if(Object.isObject(_options))
		{
			options.assign(_options);
			_options = null;
		}
		else if(typeof _options === 'boolean')
		{
			options.compact = _options;
		}
		else if(Number.isInt(_options))
		{
			options.depth = _options;
		}

		if(Object.isObject(_text))
		{
			options.assign(_text);
		}
		else if(String.isString(_text) || isNumeric(_text))
		{
			options.text = _text;
		}
		else if(typeof _text === 'boolean')
		{
			options.compact = _text;
		}

		if(isNumeric(options.text))
		{
			options.text = (typeof options.text.toText === 'function' ? options.text.toText() : options.text.toString());
		}
		else if(! String.isString(options.text))
		{
			delete options.text;
		}

		if(typeof options.compact !== 'boolean')
		{
			if(typeof DIR_COMPACT === 'boolean')
			{
				options.compact = DIR_COMPACT;
			}
			else
			{
				delete options.compact;
			}
		}

		if(options.depth !== null)
		{
			if(Number.isInt(options.depth))
			{
				options.depth = Math.abs(options.depth);
			}
			else if(DIR_DEPTH === null)
			{
				options.depth = null;
			}
			else if(Number.isInt(DIR_DEPTH))
			{
				options.depth = DIR_DEPTH;
			}
			else
			{
				delete options.depth;
			}
		}

		if(typeof options.showHidden !== 'boolean')
		{
			if(typeof DIR_HIDDEN === 'boolean')
			{
				options.showHidden = DIR_HIDDEN;
			}
			else
			{
				delete options.showHidden;
			}
		}

		if(typeof options.colors !== 'boolean')
		{
			if(typeof DIR_COLORS === 'boolean')
			{
				options.colors = (DIR_COLORS && COLORS);
			}
			else
			{
				options.colors = COLORS;
			}
		}

		if(typeof options.getters !== 'boolean')
		{
			if(typeof DIR_GETTERS === 'boolean')
			{
				options.getters = DIR_GETTERS;
			}
			else
			{
				delete options.getters;
			}
		}

		if(! Number.isInt(options.breakLength))
		{
			options.breakLength = (console.width || 80);
		}

		if(typeof options.numericSeparator !== 'boolean')
		{
			options.numericSeparator = false;
		}

		var result;

		if(typeof options.text === 'string')
		{
			if('less' in String.prototype)
			{
				options.text = options.text.less;
			}

			if('escapeC' in String.prototype)
			{
				options.text = options.text.escapeC();
			}

			if('high' in String.prototype)
			{
				options.text = options.text.high;
			}

			if('bold' in String.prototype)
			{
				options.text = options.text.bold;
			}

			result = '\t[ ' + options.text + ' ]' + EOL;
		}
		else
		{
			result = '';
		}

		result += util.inspect(_object, options) + EOL;

		if('stream' in options)
		{
			options.stream = process.getStream(options.stream);
		}
		else
		{
			options.stream = process.stdio[2];
		}

		if(options.stream)
		{
			options.stream.write(result);
		}
		else
		{
			return x('Invalid % option', null, 'stream');
		}

		return _object;
	}

	//
	console.eol = function(_amount = 1, _eol = EOL, _stream = 1)
	{
		if(typeof _eol !== 'string')
		{
			_eol = EOL;
		}
		else
		{
			_stream = process.getStream(_stream);
		}

		if(typeof _amount === 'bigint')
		{
			_amount = Number(_amount);
		}

		const data = _eol.repeat(_amount);

		if(_stream && typeof _stream.write === 'function')
		{
			_stream.write(data);
		}

		return data;
	}

	//
	function consoleDefault(_argument, _argv)
	{
		if(! Array.isArray(_argv, true))
		{
			_argv = [];
		}

		if(_argv.length > 0 && ('printf' in String))
		{
			_argv.unshift(_argument);
			_argument = String.repeat(_argv.length, '% ').removeLast();
		}
		else if('render' in String)
		{
			_argument = String.render(_argument, { colors: COLORS });
		}
		else if('typeOf' in Object)
		{
			_argument = '(' + Object.typeOf(_argument) + ')';
		}
		else
		{
			_argument = '(' + Object.prototype.toString.call(_argument).slice(8, -1) + ')';
		}

		return _argument;
	}

	function prepareData(_arguments, _stream)
	{
		if(typeof ansi === 'undefined')
		{
			ansi = require('tty/ansi');
		}

		_arguments = [ ... _arguments ];

		if(typeof _arguments[0] !== 'string')
		{
			if(_arguments.length === 0)
			{
				_arguments[0] = '';//date();
			}
			else if(_arguments.length === 1)
			{
				_arguments[0] = consoleDefault(_arguments[0]);
			}
			else
			{
				_arguments.unshift(consoleDefault(_arguments.shift(), _arguments));
			}
		}

		const files = [];
		var data;

		if('printf' in String)
		{
			data = String.printf(... _arguments);
		}
		else
		{
			data = _arguments[0];
		}

		var prefix;

		if(typeof WRITE === 'string')
		{
			files.push(WRITE);
		}

		if(typeof _stream === 'string') switch(_stream.toLowerCase())
		{
			case 'log':
				if(typeof PREFIX_LOG === 'string')
				{
					prefix = PREFIX_LOG;
				}
				if(typeof LOG === 'string')
				{
					files.pushUnique(LOG);
				}
				break;
			case 'info':
				if(typeof PREFIX_INFO === 'string')
				{
					prefix = PREFIX_INFO;
				}
				if(typeof INFO === 'string')
				{
					files.pushUnique(INFO);
				}
				break;
			case 'warn':
				if(typeof PREFIX_WARN === 'string')
				{
					prefix = PREFIX_WARN;
				}
				if(typeof WARN === 'string')
				{
					files.pushUnique(WARN);
				}
				break;
			case 'error':
				if(typeof PREFIX_ERROR === 'string')
				{
					prefix = PREFIX_ERROR;
				}
				if(typeof ERROR === 'string')
				{
					files.pushUnique(ERROR);
				}
				break;
			case 'debug':
				if(typeof PREFIX_DEBUG === 'string')
				{
					prefix = PREFIX_DEBUG;
				}
				if(typeof DEBUG === 'string')
				{
					files.pushUnique(DEBUG);
				}
				break;
			case 'high':
				if(typeof PREFIX_HIGH === 'string')
				{
					prefix = PREFIX_HIGH;
				}
				if(typeof HIGH === 'string')
				{
					files.pushUnique(HIGH);
				}
				break;
			default:
				prefix = '';
				break;
		}

		var consoleData = data.toText({ prefix });
		var fileData;

		if(files.length > 0 && typeof path !== 'undefined' && typeof fs !== 'undefined')
		{
			fileData = data.toText({ prefix }, true);

			if(typeof ansi === 'undefined')
			{
				ansi = require('tty/ansi');
			}

			if(! FORCE)
			{
				fileData = ansi.remove(fileData);
			}
			else if(typeof FORCE === 'string')
			{
				fileData = ansi.remove.color(fileData).color(FORCE);
			}
			else
			{
				fileData = fileData[_stream];
			}

			for(var i = 0; i < files.length; i++)
			{
				files[i] = path.resolve(files[i]);
			}
		}
		else
		{
			fileData = null;
			files.length = 0;
		}

		//LAST (FALSE) very important if CONFIG.INJECT...!! ^_^
		if(_stream === 'high')
		{
			consoleData = ansi.high(consoleData, null, true, false);
		}
		else
		{
			consoleData = ansi.stream[_stream](consoleData, null, true, false);
		}

		//
		return [ consoleData, fileData, files ];
	}

	stdout = console.stdout = function(_format, ... _printf)
	{
		if(typeof _format !== 'string')
		{
			if(arguments.length === 0)
			{
				_format = '';//date();
			}
			else
			{
				_format = consoleDefault(_format, _printf);
			}
		}

		if(('printf' in String) && _format.length > 0)
		{
			return process.stdio[1].write(String.printf(_format, ... _printf) + EOL);
		}

		return process.stdio[1].write(_format + EOL);
	}

	stderr = console.stderr = function(_format, ... _printf)
	{
		if(typeof _format !== 'string')
		{
			if(arguments.length === 0)
			{
				_format = '';//date();
			}
			else
			{
				_format = consoleDefault(_format, _printf);
			}
		}

		if(('printf' in String) && _format.length > 0)
		{
			return process.stdio[2].write(String.printf(_format, ... _printf) + EOL);
		}

		return process.stdio[2].write(_format + EOL);
	}

	//
	function appendToFiles(_files, _data, _stream)
	{
		if(typeof _data !== 'string')
		{
			return _files;
		}
		else
		{
			_data += EOL;
		}

		const errors = [];

		for(var i = 0; i < _files.length; i++)
		{
			try
			{
				fs.appendFileSync(_files[i], _data, { encoding, mode: 0o600 });
			}
			catch(_error)
			{
				errors.push(_files[i]);
				continue;
			}
		}

		return errors;
	}

	function handleStreams(_consoleData, _fileData, _files, _stream)
	{
		if(_files.length > 0 && typeof _fileData === 'string')
		{
			const errors = appendToFiles(_files, _fileData, _stream);

			if(! TEE)
			{
				return _fileData;
			}
		}

		if(typeof _consoleData === 'string') switch(_stream)
		{
			case 'log':
				_log(_consoleData);
				return _consoleData;
			case 'info':
				_info(_consoleData);
				return _consoleData;
			case 'warn':
				_warn(_consoleData);
				return _consoleData;
			case 'error':
				_error(_consoleData);
				return _consoleData;
			case 'debug':
				_debug(_consoleData);
				return _consoleData;
			case 'high':
				_info(_consoleData);
				return _consoleData;
		}

		return '';
	}

	//
	console.streams = [ 'log', 'info', 'warn', 'error', 'debug', 'dir', 'throw' ];

	//
	const _log = console.log;
	const _info = console.info;
	const _warn = console.warn;
	const _error = console.error;
	const _debug = console.debug;

	log = console.log = function()
	{
		if(! (WRITE && LOG))
		{
			return '';
		}

		var [ consoleData, fileData, files ] = prepareData(arguments, 'log');

		if(CZ_LOG || CZ)
		{
			consoleData = consoleData.colorize(false);
		}
		else if(RB)
		{
			consoleData = consoleData.rainbow(false);
		}

		return handleStreams(consoleData, fileData, files, 'log');
	}

	Object.defineProperty(console.log, 'width', { get: function()
	{
		return (console.width - PREFIX_LOG.textLength);
	}});

	Object.defineProperty(console.log, 'prefix', {
		get: function()
		{
			return PREFIX_LOG;
		},
		set: function(_value)
		{
			if(typeof _value === 'string')
			{
				return PREFIX_LOG = _value;
			}

			return PREFIX_LOG;
		}
	});

	info = console.info = function()
	{
		if(! (WRITE && INFO))
		{
			return '';
		}

		var [ consoleData, fileData, files ] = prepareData(arguments, 'info');

		if(CZ)
		{
			consoleData = consoleData.colorize(false);
		}
		else if(RB)
		{
			consoleData = consoleData.rainbow(false);
		}

		return handleStreams(consoleData, fileData, files, 'info');
	}

	Object.defineProperty(console.info, 'width', { get: function()
	{
		return (console.width - PREFIX_INFO.textLength);
	}});

	Object.defineProperty(console.info, 'prefix', {
		get: function()
		{
			return PREFIX_INFO;
		},
		set: function(_value)
		{
			if(typeof _value === 'string')
			{
				return PREFIX_INFO = _value;
			}

			return PREFIX_INFO;
		}
	});

	warn = console.warn = function()
	{
		if(! (WRITE && WARN))
		{
			return '';
		}

		var [ consoleData, fileData, files ] = prepareData(arguments, 'warn');

		if(CZ)
		{
			consoleData = consoleData.colorize(false);
		}
		else if(RB)
		{
			consoleData = consoleData.rainbow(false);
		}

		return handleStreams(consoleData, fileData, files, 'warn');
	}

	Object.defineProperty(console.warn, 'width', { get: function()
	{
		return (console.width - PREFIX_WARN.textLength);
	}});

	Object.defineProperty(console.warn, 'prefix', {
		get: function()
		{
			return PREFIX_WARN;
		},
		set: function(_value)
		{
			if(typeof _value === 'string')
			{
				return PREFIX_WARN = _value;
			}

			return PREFIX_WARN;
		}
	});

	error = console.error = function()
	{
		if(! (WRITE && ERROR))
		{
			return '';
		}

		var [ consoleData, fileData, files ] = prepareData(arguments, 'error');

		if(CZ)
		{
			consoleData = consoleData.colorize(false);
		}
		else if(RB)
		{
			consoleData = consoleData.rainbow(false);
		}

		return handleStreams(consoleData, fileData, files, 'error');
	}

	Object.defineProperty(console.error, 'width', { get: function()
	{
		return (console.width - PREFIX_ERROR.textLength);
	}});

	Object.defineProperty(console.error, 'prefix', {
		get: function()
		{
			return PREFIX_ERROR;
		},
		set: function(_value)
		{
			if(typeof _value === 'string')
			{
				return PREFIX_ERROR = _value;
			}

			return PREFIX_ERROR;
		}
	});

	debug = console.debug = function()
	{
		if(! (WRITE && DEBUG))
		{
			return '';
		}

		var [ consoleData, fileData, files ] = prepareData(arguments, 'debug');

		if(CZ)
		{
			consoleData = consoleData.colorize(false);
		}
		else if(RB)
		{
			consoleData = consoleData.rainbow(false);
		}

		return handleStreams(consoleData, fileData, files, 'debug');
	}

	Object.defineProperty(console.debug, 'width', { get: function()
	{
		return (console.width - PREFIX_DEBUG.textLength);
	}});

	Object.defineProperty(console.debug, 'prefix', {
		get: function()
		{
			return PREFIX_DEBUG;
		},
		set: function(_value)
		{
			if(typeof _value === 'string')
			{
				return PREFIX_DEBUG = _value;
			}

			return PREFIX_DEBUG;
		}
	});

	high = console.high = function()
	{
		if(! (WRITE && HIGH))
		{
			return '';
		}

		var [ consoleData, fileData, files ] = prepareData(arguments, 'high');

		if(CZ)
		{
			consoleData = consoleData.colorize(false);
		}
		else if(RB)
		{
			consoleData = consoleData.rainbow(false);
		}

		return handleStreams(consoleData, fileData, files, 'high');
	}

	Object.defineProperty(console.high, 'width', { get: function()
	{
		return (console.width - PREFIX_HIGH.textLength);
	}});

	Object.defineProperty(console.high, 'prefix', {
		get: function()
		{
			return PREFIX_HIGH;
		},
		set: function(_value)
		{
			if(typeof _value === 'string')
			{
				return PREFIX_HIGH = _value;
			}

			return PREFIX_HIGH;
		}
	});

	//
	console.throw = function(_error, _exit = EXIT)
	{
		if(! (_error instanceof Error))
		{
			if(_error && _error.toString)
			{
				_error = new Error(_error.toString());
			}
			else
			{
				_error = new Error(Object.prototype.toString.call(_error).slice(8, -1));
			}
		}

		if(typeof EOL !== 'string')
		{
			EOL = require('+os').EOL;
		}

		var result;

		if(typeof _error.toText === 'function')
		{
			try
			{
				process.stdio[2].write((result = _error.toText(true)) + EOL);
			}
			catch(_err)
			{
				process.stdio[2].write((result = _error.stack) + EOL);
			}
		}
		else
		{
			process.stdio[2].write((result = _error.stack) + EOL);
		}

		if(Number.isNumber(_exit))
		{
			process.exit(result = (Math.int(_exit) % 256));
		}
		else
		{
			result = _error;
		}

		return result;
	}

	//
	Object.defineProperty(console, 'size', { get: function()
	{
		const result = { width: 0, height: 0, depth: 0, colors: 0 };
		const tty = process.isTTY;

		if(tty === -1)
		{
			return result;
		}

		const stream = process.stdio[tty];

		if(typeof stream === 'undefined' || stream === null)
		{
			return result;
		}

		const yesFunc = (typeof stream.getColorDepth === 'function');

		result.width = stream.columns;
		result.height = stream.rows;
		result.depth = (yesFunc ? stream.getColorDepth() : 0);
		result.colors = (2 ** result.depth);

		//
		return result;
	}});

	Object.defineProperty(console, 'width', { get: function()
	{
		const tty = process.isTTY;

		if(tty === -1)
		{
			return 0;
		}

		const stream = process.stdio[tty];

		if(typeof stream === 'undefined' || stream === null)
		{
			return 0;
		}

		return stream.columns;
	}});

	Object.defineProperty(console, 'height', { get: function()
	{
		const tty = process.isTTY;

		if(tty === -1)
		{
			return 0;
		}

		const stream = process.stdio[tty];

		if(typeof stream === 'undefined' || stream === null)
		{
			return 0;
		}

		return stream.rows;
	}});

	Object.defineProperty(console, 'depth', { get: function()
	{
		const tty = process.isTTY;

		if(tty === -1)
		{
			return 0;
		}

		const stream = process.stdio[tty];

		if(typeof stream === 'undefined' || stream === null || typeof stream?.getColorDepth !== 'function')
		{
			return 0;
		}

		return stream.getColorDepth();
	}});

	Object.defineProperty(console, 'colors', { get: function()
	{
		return (2 ** console.depth);
	}});

	//
	bell = console.bell = function(_count = 1, _delay = 250)
	{
		if(typeof _count !== 'number')
		{
			_count = 1;
		}
		else if(_count < 1)
		{
			return '';
		}
		else
		{
			_count = Math.abs(_count.int);
		}

		if(typeof _delay !== 'number')
		{
			_delay = 250;
		}
		else
		{
			_delay = Math.abs(_delay.int);
		}

		const result = bel(Math.abs(_count.int));
		const stream = process.findStream();

		if(stream)
		{
			const bell = () => {
				stream.write(BEL);

				if(--_count > 0)
				{
					setTimeout(bell, _delay);
				}
			};

			bell();
		}

		return result;
	}

	arrange = console.arrange = function(_options, _stream = 1, _fallback_width = 80)
	{
		_options = Object.assign(_options, { line: ' ' });
		return console.line(' ', _options, _stream, _fallback_width);
	}

	console.getHeight = function(_value, _rows = console.height)
	{
		if(Stream.isStream(_rows, true))
		{
			_rows = _rows.rows;
		}

		if(typeof String.getHeight === 'function')
		{
			return String.getHeight(_value, _rows, false, null, false);
		}
		else if(isNaN(_value))
		{
			return null;
		}
		else if(typeof _value === 'string')
		{
			_value = parseInt(_value);
		}
		else
		{
			return null;
		}

		if(_value < 0)
		{
			if(typeof ansi === 'undefined')
			{
				require('tty/ansi');
			}

			_value = ansi.y(_value, _rows, false);
		}
		else if(_value > console.height)
		{
			_value = ((_value % (_rows + 1)) + 1);
		}

		if(_value === 0)
		{
			_value = 1;
		}

		return _value;
	}

	console.getY = console.getHeight;

	console.getWidth = function(_value, _columns = console.width)
	{
		if(Stream.isStream(_columns, true))
		{
			_columns = _columns.columns;
		}

		if(typeof String.getWidth === 'function')
		{
			return String.getWidth(_value, _columns, false, null, false);
		}
		else if(isNaN(_value))
		{
			return null;
		}
		else if(typeof _value === 'string')
		{
			_value = parseInt(_value);
		}
		else
		{
			return null;
		}

		if(_value < 0)
		{
			if(typeof ansi === 'undefined')
			{
				require('tty/ansi');
			}

			_value = ansi.x(_value, _columns, false);
		}
		else if(_value > console.width)
		{
			_value = ((_value % (_columns + 1)) + 1);
		}

		if(_value === 0)
		{
			_value = 1;
		}

		return _value;
	}

	console.getX = console.getWidth;

	//
	line = console.line = function(_line, _options, _stream = 1, _fallback_width = 80)
	{
		//
		const ansi = require('tty/ansi');
		const color = require('utility/color');

		//
		const options = {};

		if(Object.isObject(_line))
		{
			options.merge(_line);
		}
		else if(typeof _line === 'string' && _line.length > 0)
		{
			options.line = _line;
		}

		if(Object.isObject(_options))
		{
			options.merge(_options);
		}

		//
		if(typeof options.line !== 'string' || options.line.length === 0)
		{
			if(typeof LINE === 'string' && LINE.length > 0)
			{
				options.line = LINE;
			}
			else
			{
				options.line = '=';
			}
		}

		//
//TODO/?!??
//argue with own stream.. e.g.
//and see '_stream' argument..!!
//
		if((options.stream = process.findStream(1, null)) === null)
		{
			return x('No (.isTTY) stream found');
		}

		if((options.width = console.getWidth(options.width)) === null)
		{
			if(typeof (options.width = options.stream.columns) === 'undefined')
			{
				if(typeof _fallback_width === 'number' && _fallback_width !== 0)
				{
					options.width = Math.abs(_fallback_width.int);
				}
				else
				{
					return x('No real console width specified or found');
				}
			}
		}

		if(typeof options.eol === 'boolean')
		{
			options.eol = (options.eol ? EOL : '');
		}
		else if(Number.isInt(options.eol))
		{
			options.eol = eol(options.eol);
		}
		else if(! String.isString(options.eol))
		{
			options.eol = EOL;
		}

		if(typeof options.left !== 'string')
		{
			options.left = '';
		}

		if(typeof options.center !== 'string')
		{
			options.center = '';
		}

		if(typeof options.right !== 'string')
		{
			options.right = '';
		}

		if(typeof options.lineBG === 'string' && (options.lineBG.startsWith('random') || options.lineBG.length === 0))
		{
			options.lineBG = ansi.getRandomColor(options.lineBG);
		}
		else
		{
			options.lineBG = false;
		}

		if(typeof options.lineFG === 'string' && (options.lineFG.startsWith('random') || options.lineFG.length === 0))
		{
			options.lineFG = ansi.getRandomColor(options.lineFG);
		}
		else
		{
			options.lineFG = false;
		}

		if(typeof options.colorize !== 'boolean')
		{
			if(options.lineFG === false && options.lineBG === false && options.rainbow !== true)
			{
				options.colorize = true;
			}
			else
			{
				options.colorize = false;
			}
		}

		if(typeof options.rainbow !== 'boolean')
		{
			if(options.lineFG === false && options.lineBG === false && options.colorize === false)
			{
				options.rainbow = true;
			}
			else
			{
				options.rainbow = false;
			}
		}

		//
		while((options.left.textLength + options.center.textLength + options.right.textLength) >= options.width)
		{
			const a = [
				['left', options.left.length],
				['center', options.center.length],
				['right', options.right.length]
			];

			a.sort(1, false);
			options[a[0][0]] = options[a[0][0]].removeLast(2);
		}

		//
		const length = {
			left: options.left.textLength,
			center: options.center.textLength,
			right: options.right.textLength };

		if(options.left.length > 0)
		{
			if(options.fg)
			{
				options.left = options.left.colorFG(options.fg);
			}

			if(options.bg)
			{
				options.left = options.left.colorBG(options.bg);
			}
		}

		if(options.center.length > 0)
		{
			if(options.fg)
			{
				options.center = options.center.colorFG(options.fg);
			}

			if(options.bg)
			{
				options.center = options.center.colorBG(options.bg);
			}
		}

		if(options.right.length > 0)
		{
			if(options.fg)
			{
				options.right = options.right.colorFG(options.fg);
			}

			if(options.bg)
			{
				options.right = options.right.colorBG(options.bg);
			}
		}

		//
		//length { left, center, right }, 2...
		const centerStart = Math.floor((options.width - length.center) / 2);
		const rightStart = (options.width - length.right);

		//
		var l;

		var result = options.left;

		var done = length.left;
		var todo = options.width - length.left;

		if(length.center > 0)
		{
			l = String.fill((centerStart - done), options.line);

			done += l.length;
			todo -= l.length;

			if(options.colorize)
			{
				l = ansi.colorize(l, true);
			}
			else if(options.rainbow)
			{
				l = ansi.rainbow(l, true);
			}
			else
			{
				if(options.lineFG)
				{
					l = l.colorFG(options.lineFG);
				}

				if(options.lineBG)
				{
					l = l.colorBG(options.lineBG);
				}
			}

			result += (l + options.center);

			done += length.center;
			todo -= length.center;
		}

		if(length.right > 0)
		{
			l = String.fill((rightStart - done), options.line);

			done += l.length;
			todo -= l.length;

			if(options.colorize)
			{
				l = ansi.colorize(l, true);
			}
			else if(options.rainbow)
			{
				l = ansi.rainbow(l, true);
			}
			else
			{
				if(options.lineFG)
				{
					l = l.colorFG(options.lineFG);
				}

				if(options.lineBG)
				{
					l = l.colorBG(options.lineBG);
				}
			}

			result += (l + options.right);

			done += length.right;
			todo -= length.right;
		}

		if(todo > 0)
		{
			l = String.fill(todo, options.line);

			done += l.length;
			todo -= l.length;

			if(options.colorize)
			{
				l = ansi.colorize(l, true);
			}
			else if(options.rainbow)
			{
				l = ansi.rainbow(l, true);
			}
			else
			{
				if(options.lineFG)
				{
					l = l.colorFG(options.lineFG);
				}

				if(options.lineBG)
				{
					l = l.colorBG(options.lineBG);
				}
			}

			result += l;
		}

		//
		result += options.eol;

		if(options.stream)
		{
			options.stream.write(result);
		}

		return result;
	}

	//
	console.randomize = function(_string, _stream = 1, _max = 126, _min = 32, _crypto = true)
	{
		//
		if((_stream = process.getStream(_stream)) === null)
		{
			return 0;
		}

		if(Number.isInt(_string))
		{
			_string = alphabet(_string);
		}
		else if(! String.isString(_string))
		{
			_string = null;
		}

		if(Number.isInt(_max))
		{
			if(_max < -255)
			{
				_max = -255;
			}

			if(_max < 0)
			{
				_max = (255 + _max);
			}

			_max %= 256;
		}
		else
		{
			_max = 126;
		}

		if(Number.isInt(_min))
		{
			if(_min < -255)
			{
				_min = -255;
			}

			if(_min < 0)
			{
				_min = (255 + _min);
			}

			_min %= 256;
		}
		else
		{
			_min = 32;
		}

		//
		_stream = process.getStream(_stream);

		//
		var result = '';

		const getChar = () => {
			if(_string)
			{
				return _string[_string.getRandomIndex(_crypto)];
			}

			return String.fromCodePoint(Math.random.int(_max, _min, _crypto));
		};

		for(var y = 1; y < console.height; y++)
		{
			for(var x = 1; x <= console.width; x++)
			{
				result += getChar();
			}
		}

		//
		if(! _stream)
		{
			return result;
		}
		else
		{
			ansi.cursor.home(_stream);
			_stream.write(result);
		}

		return result;
	}

	console.randomText = function(_rows = -console.height, _columns = -console.width, _stream = 1, _crypto = true)
	{
		//
		if(! Number.isInt(_rows))
		{
			_rows = -console.height;
		}

		if(! Number.isInt(_columns))
		{
			_columns = -console.width;
		}

		//
		const result = Math.random.text(_rows, _columns);//TODO/_crypto as last argument (of these many ones....)
		const stream = process.getStream(_stream);

		//
		if(stream)
		{
			stream.write(result);
		}

		//
		return result;
	}

	//
	function checkAlign(_value, _type)
	{
		if(String.isString(_value))
		{
			_value = _value.toLowerCase();
		}
		else
		{
			_value = null;
		}

		switch(_type)
		{
			case 'left':
				if(_value !== null) switch(_value)
				{
					case 'left':
					case 'right':
					case 'center':
						return _value;
				}

				return DEFAULT_PROGRESS_ALIGN_LEFT;
			case 'top':
				if(_value !== null) switch(_value)
				{
					case 'left':
					case 'right':
					case 'center':
						return _value;
				}

				return DEFAULT_PROGRESS_ALIGN_TOP;
			case 'right':
				if(_value !== null) switch(_value)
				{
					case 'left':
					case 'right':
					case 'center':
						return _value;
				}

				return DEFAULT_PROGRESS_ALIGN_RIGHT;
			case 'bottom':
				if(_value !== null) switch(_value)
				{
					case 'left':
					case 'right':
					case 'center':
						return _value;
				}

				return DEFAULT_PROGRESS_ALIGN_BOTTOM;
		}
	}

	function getText(_text, _percent, _round = DEFAULT_PROGRESS_ROUND, _colors = COLORS)
	{
		if(Array.isArray(_text))
		{
			_text = _text.join(EOL);
		}
		else if(typeof _text !== 'string')
		{
			return x('Invalid % argument (neither % nor %)', null, '_text', 'String', 'Array');
		}
		else if(_text.length === 0)
		{
			return [];
		}

		if(typeof _colors !== 'boolean')
		{
			_colors = COLORS;
		}

		if(! Number.isInt(_round))
		{
			_round = DEFAULT_PROGRESS_ROUND;
		}

		if(! (Number.isInt(_round) && _round >= 0))
		{
			_round = DEFAULT_PROGRESS_ROUND;
		}

		_percent = Math.round(_percent, _round);
		const percentString = _percent.toFixed(_round)
			.padStart(3 + (_round === 0 ? 0 :_round + 1), ' ');

		var result = '';
		var sub;

		for(var i = 0; i < _text.length; ++i)
		{
			if(_text[i] === '\\')
			{
				if(i < (_text.length - 1))
				{
					result += _text[++i];
				}
				else
				{
					result += '\\';
				}
			}
			else if(_text[i] === '%')
			{
				sub = percentString;

				if(_colors)
				{
					sub = sub.colorizeAs('Number').bold;
				}

				result += sub;
			}
			else
			{
				result += _text[i];
			}
		}

		if(_colors)
		{
			return result.colorizeAs('String').split(EOL);
		}

		return result.split(EOL);
	}

	console.progress = function(_options, _raw = false)
	{
		//
		if(typeof _raw !== 'boolean')
		{
			_raw = false;
		}

		//
		if(! Object.isObject(_options))
		{
			return x('Invalid % argument (not an %)', null, '_options', 'Object');
		}
		else if(_raw)
		{
			//
			_options.percent = (_options.value * 100);

			//
			if(_options.left.length > 0)
			{
				_options.left = getText(_options.left, _options.percent, _options.round, _options.colors);
			}

			if(_options.top.length > 0)
			{
				_options.top = getText(_options.top, _options.percent, _options.round, _options.colors);
			}

			if(_options.right.length > 0)
			{
				_options.right = getText(_options.right, _options.percent, _options.round, _options.colors);
			}

			if(_options.bottom.length > 0)
			{
				_options.bottom = getText(_options.bottom, _options.percent, _options.round, _options.colors);
			}
		}
		else
		{
			//
			if(typeof ansi === 'undefined')
			{
				require('tty/ansi');
			}

			if(typeof color === 'undefined')
			{
				require('utility/color');
			}

			//
			if(typeof _options.raw !== 'boolean')
			{
				_options.raw = false;
			}

			//
			if('stream' in _options)
			{
				if((_options.stream = process.getStream(_options.stream)) === null)
				{
					_options.stream = process.stdio[1];
				}
			}
			else
			{
				_options.stream = process.stdio[1];
			}

			if(! _options.stream?.isTTY)
			{
				return x('Invalid %.% (no .%)', null, '_options', 'stream', 'isTTY');
			}

			if(! (Number.isInt(_options.topSpace) && _options.topSpace >= 0))
			{
				_options.topSpace = 1;
			}

			if(! (Number.isInt(_options.bottomSpace) && _options.bottomSpace >= 0))
			{
				_options.bottomSpace = 1;
			}

			if(! (Number.isInt(_options.leftSpace) && _options.leftSpace >= 0))
			{
				_options.leftSpace = 1;
			}

			if(! (Number.isInt(_options.rightSpace) && _options.rightSpace >= 0))
			{
				_options.rightSpace = 1;
			}

			//
			if(Number.isNumber(_options.value))
			{
				_options.value = _options.value;
			}
			else if(String.isString(_options.value))
			{
				if(_options.value.endsWith('%') && (_options.value = _options.value.removeLast()).isNumber())
				{
					_options.value = (_options.value.parseNumber() / 100);
				}
				else if(_options.value.isNumber())
				{
					_options.value = _options.value.parseNumber();
				}
				else
				{
					_options.value = 0;
					//return x('Invalid %.% argument (can\'t proceed without real % or percentage value)', null, '_options', 'value', 'Number');
				}
			}
			else
			{
				_options.value = 0;
				//return x('Invalid/missing %.% argument (expecting a % or %)', null, '_options', 'value', 'Number', 'String');
			}

			if(_options.value > 1)
			{
				_options.value = 1;
			}
			else if(_options.value < -1)
			{
				_options.value = -1;
			}

			if(_options.value < 0)
			{
				_options.value = (1 + _options.value);
			}

			_options.percent = (_options.value * 100);

			//
			if(Number.isNumber(_options.x) || String.isString(_options.x))
			{
				_options.x = console.getX(_options.x, _options.stream.columns);
			}
			else
			{
				_options.x = null;
			}

			if(Number.isNumber(_options.y) || String.isString(_options.y))
			{
				_options.y = console.getY(_options.y, _options.stream.rows);
			}
			else
			{
				_options.y = null;
			}

			_options.hasPosition = (_options.x !== null || _options.y !== null);

			if(_options.x === null)
			{
				_options.x = 1;
			}

			if(_options.y === null)
			{
				_options.y = 1;
			}

			//
			if(Number.isNumber(_options.width) || String.isString(_options.width))
			{
				_options.width = console.getWidth(_options.width, _options.stream.columns - _options.x + 1);
			}
			else
			{
				_options.width = null;
			}

			if(Number.isNumber(_options.height) || String.isString(_options.height))
			{
				_options.height = console.getHeight(_options.height, _options.stream.rows - _options.y + 1);
			}
			else
			{
				_options.height = null;
			}

			//
			if(typeof _options.left === 'string')
			{
				_options.left = _options.left.getLines(_options.height, false, _options.stream.columns - _options.width, true);
			}
			else if(Array.isArray(_options.left, true))
			{
				_options.left = String.getLines(_options.left, _options.height, false, _options.stream.columns - _options.width, true);
			}
			else
			{
				_options.left = [ DEFAULT_PROGRESS_LEFT ];
			}

			if(typeof _options.top === 'string')
			{
				_options.top = _options.top.getLines(null, false, _options.width, true);
			}
			else if(Array.isArray(_options.top, true))
			{
				_options.top = String.getLines(_options.top, null, false, _options.width, true);
			}
			else
			{
				_options.top = [];
			}

			if(typeof _options.right === 'string')
			{
				_options.right = _options.right.getLines(_options.height, false, _options.stream.columns - _options.width, true);
			}
			else if(Array.isArray(_options.right, true))
			{
				_options.right = String.getLines(_options.right, _options.height, false, _options.stream.columns - _options.width, true);
			}
			else
			{
				_options.right = [];
			}

			if(typeof _options.bottom === 'string')
			{
				_options.bottom = _options.bottom.getLines(null, false, _options.width, true);
			}
			else if(Array.isArray(_options.bottom, true))
			{
				_options.bottom = String.getLines(_options.bottom, null, false, _options.width, true);
			}
			else
			{
				_options.bottom = [];
			}

			//
			if(typeof _options.colors !== 'boolean')
			{
				_options.colors = COLORS;
			}

			if(_options.round === true)
			{
				_options.round = DEFAULT_PROGRESS_ROUND;
			}
			else if(_options.round === false)
			{
				_options.round = -1;
			}
			else if(Number.isInt(_options.round))
			{
				if(_options.round < 0)
				{
					_options.round = -1;
				}
			}
			else
			{
				_options.round = DEFAULT_PROGRESS_ROUND;
			}

			//
			_options._left = _options.left;
			_options._top = _options.top;
			_options._right = _options.right;
			_options._bottom = _options.bottom;

			if(_options.left.length > 0)
			{
				_options.left = getText(_options.left, _options.percent, _options.round, _options.colors);
			}

			if(_options.top.length > 0)
			{
				_options.top = getText(_options.top, _options.percent, _options.round, _options.colors);
			}

			if(_options.right.length > 0)
			{
				_options.right = getText(_options.right, _options.percent, _options.round, _options.colors);
			}

			if(_options.bottom.length > 0)
			{
				_options.bottom = getText(_options.bottom, _options.percent, _options.round, _options.colors);
			}

			//
			_options.lineMax = {
				left: String.lineMax(_options.left, true),
				top: String.lineMax(_options.top, true),
				right: String.lineMax(_options.right, true),
				bottom: String.lineMax(_options.bottom, true) };
			_options.lineCount = {
				left: String.lineCount(_options.left),
				top: String.lineCount(_options.top),
				right: String.lineCount(_options.right),
				bottom: String.lineCount(_options.bottom) };

			//
			/*_options.maxHeight = Math._max(
				Math._max(_options.lineCount.top, _options.lineCount.bottom),
				Math._max(_options.lineCount.top > 0 ? _options.topSpace : 0),
				Math._max(_options.lineCount.bottom > 0 ? _options.bottomSpace : 0),
				Math._max(_options.height === null ? 1 : _options.height)
			);*/
			//"FIXME"?!?????? look at these math.max'es.. ;~
			_options.maxHeight = Math._max(
				Math._max(_options.lineCount.top, _options.lineCount.bottom)
					+ (_options.lineCount.top > 0 ? _options.topSpace : 0)
					+ (_options.lineCount.bottom > 0 ? _options.bottomSpace : 0))
					+ (_options.height === null ? 1 : _options.height);

			//
			_options.hasSize = (_options.width !== null || _options.height !== null);

			if(_options.width === null)
			{
				_options.width = console.getWidth(_options.width, _options.stream.columns - _options.x + 1);
			}

			_options.originalHeight = (_options.height === null ? 1 : _options.height);
			_options.height = _options.maxHeight;

			//
			_options.left.applyLength(_options.height, false);
			_options.right.applyLength(_options.height, false);

			//
			if(typeof _options.center === 'boolean')
			{
				if(typeof _options.centerX !== 'boolean')
				{
					_options.centerX = _options.center;
				}

				if(typeof _options.centerY !== 'boolean')
				{
					_options.centerY = _options.center;
				}
			}
			else
			{
				if(typeof _options.centerX !== 'boolean')
				{
					_options.centerX = !Number.isInt(_options.x);
				}

				if(typeof _options.centerY !== 'boolean')
				{
					_options.centerY = !Number.isInt(_options.y);
				}
			}

			_options.center = (_options.centerX && _options.centerY);

			if(_options.centerX)
			{
				_options.x = console.getX(Math.floor((_options.stream.columns - _options.width + _options.x) / 2), _options.stream.columns);
			}

			if(_options.centerY)
			{
				_options.y = console.getY(Math.floor((_options.stream.rows - _options.height + _options.y) / 2), _options.stream.rows);
			}

			//
			if(typeof _options.brackets !== 'boolean')
			{
				_options.brackets = true;
			}

			if(_options.brackets)
			{
				if(typeof _options.openBracket !== 'string')
				{
					_options.openBracket = (_options.originalHeight === 1 ? (_options.colors ? '(' : '[') : '|');
				}

				if(typeof _options.closeBracket !== 'string')
				{
					_options.closeBracket = (_options.originalHeight === 1 ? (_options.colors ? ')' : ']') : '|');
				}

				_options.bracketLength = (_options.openBracket.textLength + _options.closeBracket.textLength);
			}
			else
			{
				_options.bracketLength = 0;
			}

			//
			_options.xAdd =
				(_options.lineCount.left === 0 ? 0 : (_options.lineMax.left + _options.leftSpace)) +
				(_options.lineCount.right === 0 ? 0 : (_options.lineMax.right + _options.rightSpace)) + _options.bracketLength;
			//_options.yAdd = _options.lineCount.top + _options.lineCount.bottom + _options.topSpace + _options.bottomSpace;
			_options.yAdd = _options.maxHeight;

			_options.barWidth = _options.width - _options.xAdd;
			_options.barHeight = _options.originalHeight;//_options.height - yAdd;

			//
			_options.leftAlign = checkAlign(_options.leftAlign, 'left');
			_options.topAlign = checkAlign(_options.topAlign, 'top');
			_options.rightAlign = checkAlign(_options.rightAlign, 'right');
			_options.bottomAlign = checkAlign(_options.bottomAlign, 'bottom');

			//
			if(! String.isString(_options.done))
			{
				_options.done = (_options.colors ? ' ' : '#');
			}

			if(! String.isString(_options.todo))
			{
				_options.todo = (_options.colors ? ' ' : '-');
			}

			//
			if(typeof _options.clear !== 'boolean')
			{
				_options.clear = false;
			}

			if(typeof _options.clearBuffer !== 'boolean')
			{
				_options.clearBuffer = true;
			}

			if(typeof _options.home !== 'boolean')
			{
				_options.home = false;
			}

			if(! Number.isNumber(_options.animation))
			{
				_options.animation = 0;
			}
			else if(_options.animation <= -1)
			{
				_options.animation = 0;
			}
			else if(_options.animation >= 1)
			{
				_options.animation = 0;
			}

			if(! (Number.isNumber(_options.timeout) && _options.timeout > 0))
			{
				_options.timeout = 0;
			}
			else
			{
				_options.timeout = Math.round(_options.timeout);
			}
		}

		//
		var done = String.fill(Math.round(_options.barWidth * _options.value), _options.done);
		var todo = String.fill(_options.barWidth - done.textLength, _options.todo);

		//
		if(_options.colors)
		{
			if(! color.isColor(_options.doneColor))
			{
				_options.doneColor = 'green';
			}

			if(! color.isColor(_options.todoColor))
			{
				_options.todoColor = 'white';
			}

			done = done.colorBG(_options.doneColor);
			todo = todo.colorBG(_options.todoColor);

			if(_options.openBracket || _options.closeBracket)
			{
				if(! color.isColor(_options.bracketColor))
				{
					_options.bracketColor = 'brightYellow';
				}

				if(typeof _options.boldBracket !== 'boolean')
				{
					_options.boldBracket = true;
				}

				_options.openBracket = _options.openBracket.colorFG(_options.bracketColor);
				_options.closeBracket = _options.closeBracket.colorFG(_options.bracketColor);

				if(_options.boldBracket)
				{
					_options.openBracket = _options.openBracket.bold;
					_options.closeBracket = _options.closeBracket.bold;
				}
			}
		}

		//
		if(_options.clear)
		{
			ansi.clear(_options.clearBuffer, _options.home, _options.stream);
		}

		//
		if(_options.brackets)
		{
			done = (_options.openBracket + done);
			todo = (todo + _options.closeBracket);
		}

		//
		const cursor = (_y, _x) => {
			return ansi.cursor(_y, _x, _options.stream);
		};

		const write = (_string) => {
			return _options.stream.write(_string);
		};

		//
		if((_options.hasPosition || _options.hasSize) && !_options.raw)
		{
			//
			var X, Y = _options.y - 1;
			var height = 0;

			//
			for(var i = 0, j = -1; i < _options.height; ++i, ++height)
			{
				//
				X = _options.x;
				Y = _options.y + height;

				//
				if(_options.lineCount.top > 0)
				{
					//
					if(i < _options.top.length)
					{
						//
						X += _options.leftSpace;

						//
						switch(_options.topAlign)
						{
							case 'center':
								X += Math.round((_options.width - _options.top[i].textLength) / 2);
								break;
							case 'right':
								X += _options.width - _options.top[i].textLength + _options.rightSpace;
								break;
						}

						//
						cursor(Y, X);
						write(_options.top[i]);
					}
					else if(i === _options.top.length)
					{
						height += (_options.topSpace - 1);
					}
					else
					{
						++j;
					}
				}
				else
				{
					++j;
				}

				//
				Y = (_options.y + height);

				//
				if(j >= 0)
				{
					//
					if(j < _options.barHeight)
					{
						//
						if(_options.lineCount.left > 0)
						{
							//
							if(j < _options.left.length)
							{
								//
								X = _options.x;

								if(_options.barHeight > 1)
								{
									Y += Math.floor((_options.barHeight - _options.lineCount.left) / 2);
								}

								//
								switch(_options.leftAlign)
								{
									case 'center':
										X += Math.round((_options.lineMax.left - _options.left[j].textLength) / 2);
										break;
									case 'right':
										X += (_options.lineMax.left - _options.left[j].textLength);
										break;
								}

								//
								cursor(Y, X);
								write(_options.left[j]);
							}

							//
							X = _options.x + _options.lineMax.left + _options.leftSpace;
						}

						//
						Y = (_options.y + height);

						//
						cursor(Y, X);
						write(done + todo);

						//
						if(_options.lineCount.right > 0 && j < _options.lineCount.right)
						{
							//
							X = _options.x + _options.lineMax.left + _options.leftSpace + _options.barWidth + _options.rightSpace + _options.bracketLength;

							if(_options.barHeight > 1)
							{
								Y += Math.floor((_options.barHeight - _options.lineCount.right) / 2);
							}

							//
							switch(_options.rightAlign)
							{
								case 'center':
									X += Math.round((_options.lineMax.right - _options.right[j].textLength) / 2);
									break;
								case 'right':
									X += (_options.lineMax.right - _options.right[j].textLength);
									break;
							}

							//
							cursor(Y, X);
							write(_options.right[j]);
						}
					}
					else
					{
						break;
					}
				}
			}

			if(_options.lineCount.bottom > 0)
			{
				//
				height += _options.bottomSpace;
				Y += _options.bottomSpace;

				//
				for(var i = 0; i < _options.bottom.length; ++i, ++Y)
				{
					//
					X = (_options.x + _options.leftSpace);

					//
					switch(_options.bottomAlign)
					{
						case 'center':
							X += Math.round((_options.width - _options.bottom[i].textLength) / 2);
							break;
						case 'right':
							X += _options.width - _options.bottom[i].textLength;
							break;
					}

					//
					cursor(Y, X);
					write(_options.bottom[i]);
				}
			}
		}
		else
		{
			if(_options.lineCount.left > 0)
			{
				write(_options.left[0]);
				write(String.fill(_options.leftSpace, ' '));
			}

			write(done + todo);

			if(_options.lineCount.right > 0)
			{
				write(String.fill(_options.rightSpace, ' '));
				write(_options.right[0]);
			}
		}

		//
		write(EOL);

		//
		if(_options.animation !== 0)
		{
			ansi.cursor.up(_options.height, null, _options.stream);

			if(Number.isInt(_options.timeout))
			{
				var newValue = _options.value + _options.animation;
				const lastValue = (newValue < 0 || newValue > 1);

				if(newValue <= 0)
				{
					newValue = 0;
				}
				else if(newValue >= 1)
				{
					newValue = 1;
				}

				return setTimeout(() => {
					return console.progress(Object.assign(_options, {
						value: newValue,
						animation: (lastValue ? 0 : _options.animation),
						left: _options._left,
						top: _options._top,
						right: _options._right,
						bottom: _options._bottom
					}), true);
				}, _options.timeout);
			}
		}
		else if(_options.home)
		{
			ansi.cursor.home(_options.stream);
		}

		//
		return _options.percent;
	}

	//
	//TODO/more _options.. e.g. colorization, w/ rainbow, etc..
	//
	console.writeFile = function(_file, _options, _callback = null, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		_options = Object.assign({
			chunk: CHUNK,
			stream: process.stdio[1],
			encoding, buffer: false
		}, _options);

		//
		if(typeof _options.buffer !== 'boolean')
		{
			_options.buffer = false;
		}

		//
		if(typeof _callback === 'function')
		{
			delete _options.callback;
		}
		else if(typeof _options.callback === 'function')
		{
			_callback = _options.callback;
			delete _options.callback;
		}
		else
		{
			_callback = null;
			delete _options.callback;
		}

		//
		if(typeof _callback !== 'function')
		{
		}
		else if(typeof _options.callback !== 'function' || _options.callback === _callback)
		{
			delete _options.callback;
		}
		else if('callback' in _options)

		//
		if(! path.isValid(_file))
		{
			if(path.isValid(_options.file))
			{
				_file = _options.file;
				delete _options.file;
			}
			else if(path.isValid(_options.path))
			{
				_file = _options.path;
				delete _options.path;
			}
			else if(path.isValid(_options.url))//TODO/real uniforms...
			{
				_file = _options.url;
				delete _options.url;
			}
			else
			{
				return x('Invalid % argument (not a valid % %)', null, '_file', 'path', 'String');
			}
		}

		//
		if(! Stream.isStream(_options.stream, false))
		{
			return x('Invalid %[%] (not a real %)', null, '_options', 'stream', 'Stream');
		}
		else if(! fs.exists.file(_file, null, true))
		{
			return x('The % doesn\'t exist (as a regular file)');
		}
		
		if(! String.isEncoding(_options.encoding, false, true, false, false))
		{
			_options.encoding = encoding;
		}

		if(! (Number.isInt(_options.chunk) && _options.chunk > 0))
		{
			_options.chunk = CHUNK;
		}

		//
		var buffer = (_options.buffer ? '' : null);
		var calls = 0;

		const cb = (_event) => {
			//
			++calls;

			//
			_options.stream.write(_event.string);

			//
			if(_event.finish)
			{
				if(_callback)
				{
					_callback({
						path: _file,
						size: _event.fileSize,
						options: _options,
						buffer, calls
					});
				}
			}
		};

		return fs.chunkRead(_file, cb, {
			chunk: _options.chunk,
			encoding: _options.encoding,
			close: true
		}, _throw);
	}

	//

})();

