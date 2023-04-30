#!/usr/bin/env node

//
NATIVE = true;

//
(function()
{

	//
	const PREFIX = [ '--lib-', '--library-' ];
	const KEYS = [
		[ 'version', false ],
		[ 'config', true ],
		[ 'trace', false ]
	];


	//
	__path = require('node:path');
	__fs = require('node:fs');
	__os = require('node:os');

	//
	(function()
	{
		//
		function showError(_error, _exit_code = EXIT)
		{
			if(typeof EOL !== 'string')
			{
				if(typeof os !== 'undefined')
				{
					EOL = os.EOL;
				}
				else
				{
					EOL = '\n';
				}
			}

			if(typeof throwError === 'function')
			{
				return throwError(_error, _exit_code);
			}
			else if(console.throw)
			{
				console.throw(_error, _exit_code);
			}
			else if(typeof _error.toText === 'function')
			{
				process.stderr.write(_error.toText() + EOL);
			}
			else
			{
				process.stderr.write(_error.stack + EOL);
			}

			if(isInt(_exit_code))
			{
				process.exit(_exit_code);
			}
			
			return _error;
		}
		
		//
		(function()
		{

			//
			const args = Object.create(null);
			var key, value, assignIndex, found;
			
			(function()
			{
				for(var i = 2; i < process.argv.length; i++)
				{
					key = value = assignIndex = null;

					for(const p of PREFIX)
					{
						if(process.argv[i].startsWith(p))
						{
							key = process.argv[i].slice(p.length);
							process.argv.splice(i--, 1);
							break;
						}
					}

					if(key === null)
					{
						continue;
					}

					if((assignIndex = key.indexOf('=')) > -1)
					{
						value = key.slice(assignIndex + 1);
						key = key.slice(0, assignIndex);
					}

					for(const k of KEYS)
					{
						if(key === k[0])
						{
							if(k[1])
							{
								if(value)
								{
									args[key] = value;
									break;
								}
								else
								{
									value = true;
								}
							}
							else
							{
								value = false;
							}
						}
					}

					if(value === null || typeof value === 'string')
					{
						continue;
					}
					else if(value)
					{
						value = null;

						for(var j = i + 1; j < process.argv.length; j++)
						{
							if(process.argv[j][0] !== '-')
							{
								value = process.argv[j];
								process.argv.splice(j, 1);
								break;
							}
						}

						if(value)
						{
							args[key] = value;
						}
					}
					else if(typeof args[key] === 'number')
					{
						args[key]++;
					}
					else
					{
						args[key] = 1;
					}
				}
			})();

			//
			if(typeof args.config === 'string')// && args.config.length > 0)
			{
				if(__fs.existsSync(__path.join(args.config, 'config.js')))
				{
					CONFIG = (args.config = __path.join(args.config, 'config.js'));
				}
				else if(__fs.existsSync(args.config))
				{
					CONFIG = (args.config = __path.resolve(args.config));
				}
				else
				{
					console.error('CONFIG not found @ \'' + args.config + '\'');
					process.exit(2);
				}

				CONFIG = __path.resolve(CONFIG);
			}

			//
			try
			{
				//
				require(__path.join(__dirname, 'main.js'));

				//
				if(args.version)
				{
					process.stdout.write('v' + process.versions.library + EOL);
					process.exit();
				}

				//
				if(args.config)
				{
					console.warn('You changed the % path (\'%\')', 'CONFIG', args.config);
				}

				//
				if(args.trace)
				{
					Error.stackTraceLimit = __TRACE_DEFINED_BEFORE = Infinity;
				}
				else
				{
					__TRACE_DEFINED_BEFORE = null;
				}

				//
				/*if(typeof __LIBRARY === 'undefined')
				{
					return invalidLibCode();
				}*/
			}
			catch(_error)
			{
				/*if(_error.code === 'MODULE_NOT_FOUND')
				{
					return invalidLibCode();
				}*/

				return showError(_error, 255);
			}
		})();

		//
		(function()
		{
			//
			process.node = process.argv[0];
			process.exec = fs.readlinks.all(process._exec = process.argv[1]);

			//
			var file = null;
			var args = 0;

			for(var i = 2; i < process.argv.length; i++)
			{
				if(process.argv[i] === '-')
				{
					file = '-';
					break;
				}
				else if(fs.exists.file(process.argv[i], true))
				{
					//file = path.resolve(process.argv[i]);
					file = process.argv[i];
					break;
				}

				++args;
			}
			
			//
			function takeFile(_path)
			{
				process.orig = _path;
				process.file = path.resolve(process.orig);
				process.real = fs.readlinks.all(process.file, true);
				process.name = path.basename(process.file);
				process.base = path.basename(process.name, '.js');

				//
				if(process.file === __filename || process.real === __filename)
				{
					console.error('No chance. I can\'t execute ' + 'myself'.bold + '..');
					process.exit(253);
				}

				if(fs.exists.file(process.file, true))
				{
					try
					{
						process.main = require('!' + process.file, true, false, true);
					}
					catch(_error)
					{
						return throwError(_error, EXIT);
					}
				}
				else
				{
					console.error(`Your script "${process.file.warn}" couldn\'t be found.`);
					process.exit(254);
				}
			}
			
			function takeStdin()
			{
				NATIVE = false;
				var data = '';

				process.stdin.on('data', (_chunk) => { data += _chunk.toString(encoding); });
				process.stdin.on('end', () => {
					//
					process.file = process.base = process.name = '-';
					
					//
					if((data = data.trim()).length > 0)
					{
						try
						{
							return eval.call(null, data);
						}
						catch(_error)
						{
							return showError(_error, 255);
						}
					}
					else
					{
						console.error('No script data found in % (%).', 'stdin', '-'.bold);
						process.exit(251);
					}
				});
			}
			
			function take(_type, _arg = null)
			{
				switch(_type)
				{
					case 'file': return takeFile(_arg); break;
					case 'stdin': return takeStdin(); break;
				}
			}
			
			//
			if(file)
			{
				if(file === '-')
				{
					take('stdin');
				}
				else
				{
					take('file', file);
				}
			}
			else if(process.STDIN)
			{
				take('stdin');
			}
			else
			{
				process.file = path.resolve(process.argv[1]);
				process.base = path.basename(process.argv[1]);
				process.name = path.basename(process.base, '.js');

				if(args === 0)
				{
					console.info(`${'Syntax:'.toRandomCase().colorize()} ${process.base} <${'script'.toRandomCase().high}> [${'parameters'.toRandomCase().debug}]`);
				}
				else
				{
					console.error('% of your % argument' + (args === 1 ? '' : 's') + ' is an ' + 'existing file'.bold + '.', 'None'.high.bold, args.toString().bold.colorizeAs('Number'));
				}

				process.exit(255);
			}
		})();

	})();

})();

