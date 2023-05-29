(function()
{

	//
	const DEFAULT_THROW = true;

	const DEFAULT_OVERWRITE = false;
	const DEFAULT_TRUNCATE = true;//used in 'fs.formatFile()' and 'fs.randomizeFile()'.. @ secure erasing.. see: < https://www.heise.de/security/meldung/Sicheres-Loeschen-Einmal-ueberschreiben-genuegt-198816.html >

	const DEFAULT_RADIX = 256;
	const DEFAULT_CRYPTO_ERASE = false;

	const DEFAULT_READLINE_ALTERNATIVE_COUNTING = false;//don't know what's better...... :-/ (false) is .subarray() styles, (true) .subarr()......

	//
	fs = module.exports = require('node:fs');

	//
	fs.isFile = function(_handle, _path_exists = false, _path_exists_type = null)
	{
		if(Number.isInt(_handle) && _handle >= 0)
		{
			if(_path_exists === null)
			{
				return true;
			}

			return fs.exists(_handle);
		}
		else if(_path_exists && path.isValid(_handle))
		{
			return fs.exists(_handle, null, true, _path_exists_type);
		}

		return null;
	}

	//
	// extension for 'path.resolve()'
	// here ANY symbolic link in the WHOLE path will be replaced
	// by the resource it's pointing to...!
	//
	// the 2nd argument (_existing = true) will return (null) if not existing resource
	//
	fs.resolve = function(_path, _existing = false)
	{
		if(typeof _path === 'string')
		{
			_path = path.resolve(_path);
		}
		else
		{
			return x('Invalid % argument (expecting a %)', null, '_path', 'String');
		}

		if(_existing)
		{
			if(! fs.exists(_path, true))
			{
				return null;
			}
		}

		var parts = _path.split(path.sep);
		var sub;

		for(var i = 1; i <= parts.length; ++i)
		{
			sub = parts.subarr(0, i).join(path.sep);

			if(sub.length === 0)
			{
				continue;
			}
			else if(! fs.exists.symlink(sub))
			{
				continue;
			}

			parts = Array.concat(fs.readlinks.all(sub, true).split(path.sep), parts.subarr(i));
			i = 0;
		}

		return parts.join(path.sep);
	}

	//
	fs.findAbove = function(_path, _search = '', _resolve = false)
	{
		if(typeof _path === 'string')
		{
			_path = path.resolve(_path);
		}
		else
		{
			return x('Invalid _path (expecting a String)');
		}

		if(typeof _search === 'string' && _search.length > 0)
		{
			_search = path.normalize(_search);
		}
		else
		{
			_search = '';
		}

		if(typeof _resolve !== 'boolean')
		{
			return x('Invalid _resolve argument (expecting Boolean)');
		}

		var result = _path;
		var lastPath = result;

		do
		{
			if(fs.exists(a = path.join(result, _search), _resolve))
			{
				return result;
			}

			result = path.up(1, result);

			if(result === lastPath)
			{
				break;
			}
			else
			{
				lastPath = result;
			}
		}
		while(true);

		//
		return null;
	}

	//
	Object.defineProperty(fs, 'types', { get: function()
	{
		return [
			'block',
			'char',
			'directory',
			'fifo',
			'file',
			'socket',
			'symlink',
			'unkown'
		];
	}});

	//
	fs.exists = function(_path_fd, _callback, _resolve = true, _type)
	{
		var file;

		if(path.isValid(_path_fd))
		{
			file = 'path';
			_path_fd = path.resolve(_path_fd);
		}
		else if(fs.isFile(_path_fd, null))
		{
			file = 'fd';
		}
		else
		{
			dir(_path_fd, '-_pat-fd');
			return x('Invalid path or file descriptor');
		}

		if(typeof _callback === 'boolean')
		{
			const bool = _callback;

			if(typeof _resolve === 'function')
			{
				_callback = _resolve;
			}
			else
			{
				_callback = null;
			}

			_resolve = bool;
		}

		function checkType(_stats)
		{
			_type = _type.toLowerCase();

			switch(_type)
			{
				case 'files': return (_stats.isFile() || _stats.isSymbolicLink());
				case 'regular': return (_stats.isFile() || _stats.isSymbolicLink() || _status.isDirectory());
				case 'file': return _stats.isFile();
				case 'directory': return _stats.isDirectory();
				case 'symlink': return _stats.isSymbolicLink()
				case 'socket': return _stats.isSocket();
				case 'block': return _stats.isBlockDevice();
				case 'char': return _stats.isCharacterDevice();
				case 'fifo': return _stats.isFIFO();
				default: return (_type === 'unknown');
			}
		}

		if(typeof _callback === 'function')
		{
			function callback(_error, _stats)
			{
				if(_error)
				{
					_callback(false, null, _stats);
				}
				else
				{
					if(file === 'path')
					{
						_stats.path = _path_fd;
						_stats.fd = null;
					}
					else if(file === 'fd')
					{
						_stats.fd = _path_fd;
						_stats.path = null;
					}

					_stats.type = fs.getFileType(_stats);

					if(String.isString(_type))
					{
						_callback((_type === checkType(_stats)), _stats.type, _stats);
					}
					else
					{
						_callback(true, _stats.type, _stats);
					}
				}
			}

			if(file === 'fd')
			{
				fs.fstat(_path_fd, callback);
			}
			else if(_resolve)
			{
				fs.stat(_path_fd, callback);
			}
			else
			{
				fs.lstat(_path_fd, callback);
			}
		}
		else try
		{
			var stats;

			if(file === 'fd')
			{
				stats = fs.fstatSync(_path_fd);
			}
			else if(_resolve)
			{
				stats = fs.statSync(_path_fd);
			}
			else
			{
				stats = fs.lstatSync(_path_fd);
			}

			if(String.isString(_type))
			{
				return checkType(stats);
			}

			return true;
		}
		catch(_error)
		{
			return false;
		}
	}

	fs.exists.files = function(_path_fd, _callback)
	{ return fs.exists(_path_fd, _callback, false, 'files'); }
	fs.exists.regular = function(_path_fd, _callback)
	{ return fs.exists(_path_fd, _callback, false, 'regular'); }
	fs.exists.file = function(_path_fd, _callback, _resolve = true)
	{ return fs.exists(_path_fd, _callback, _resolve, 'file'); }
	fs.exists.directory = function(_path_fd, _callback, _resolve = true)
	{ return fs.exists(_path_fd, _callback, _resolve, 'directory'); }
	fs.exists.symlink = function(_path_fd, _callback)
	{ return fs.exists(_path_fd, _callback, false, 'symlink'); }
	fs.exists.socket = function(_path_fd, _callback, _resolve = true)
	{ return fs.exists(_path_fd, _callback, _resolve, 'socket'); }
	fs.exists.block = function(_path_fd, _callback, _resolve = true)
	{ return fs.exists(_path_fd, _callback, _resolve, 'block'); }
	fs.exists.char = function(_path_fd, _callback, _resolve = true)
	{ return fs.exists(_path_fd, _callback, _resolve, 'char'); }
	fs.exists.fifo = function(_path_fd, _callback, _resolve = true)
	{ return fs.exists(_path_fd, _callback, _resolve, 'fifo'); }
	fs.exists[''] = fs.exists;

	//
	fs.getFilePerms = function(_mode)
	{
		return (_mode & 0o7777).toString(8);
	}

	fs.perms = function(_path, _callback, _mode = true)
	{
		if(typeof _mode !== 'boolean')
		{
			_mode = true;
		}

		_path = path.resolve(_path);

		if(_callback)
		{
			fs.stat(_path, (_error, _stats) => {
				if(_error) return _callback(_error);
				return _callback(null, (_mode ? _stats.mode : fs.getFilePerms(_stats.mode)), _stats);
			});
		}
		else
		{
			const stats = fs.statSync(_path);

			if(_mode)
			{
				return stats.mode;
			}

			return fs.getFilePerms(stats.mode);
		}
	}

	fs.getFileType = function(_stats)
	{
		if(_stats instanceof fs.Stats)
		{
			if(_stats.isFile()) return 'file';
			if(_stats.isDirectory()) return 'directory';
			if(_stats.isSymbolicLink()) return 'symlink';
			if(_stats.isSocket()) return 'socket';
			if(_stats.isBlockDevice()) return 'block';
			if(_stats.isCharacterDevice()) return 'char';
			if(_stats.isFIFO()) return 'fifo';
			return 'unknown';
		}

		return x('Invalid _stats argument (should be a \'fs.Stats\' Object)');
	}

	//TODO/allgemeine 'fs.stat()'..!
	//
	fs.size = function(_path, _callback, _resolve = true)
	{
		var fd;

		if(path.isValid(_path))
		{
			_path = path.resolve(_path);
			fd = false;
		}
		else if(fs.isFile(_path))
		{
			fd = true;
		}
		else
		{
			return x('Invalid _path (expecting String or Integer)');
		}

		const callback = (_error, _stats) => {
			var size;

			if(_error)
			{
				size = -1;
			}
			else
			{
				size = _stats.size;
			}

			return _callback(_error, size, _stats);
		};

		try
		{
			if(_resolve)
			{
				if(typeof _callback === 'function')
				{
					if(fd)
					{
						return fs.fstat(_path, callback);
					}

					return fs.stat(_path, callback);
				}
				else
				{
					if(fd)
					{
						return fs.fstatSync(_path).size;
					}

					return fs.statSync(_path).size;
				}
			}
			else
			{
				if(typeof _callback === 'function')
				{
					if(fd)
					{
						return fs.fstat(_path, callback);
					}

					return fs.lstat(_path, callback);
				}
				else
				{
					if(fd)
					{
						return fs.fstatSync(_path).size;
					}

					return fs.lstatSync(_path).size;
				}
			}
		}
		catch(_error)
		{
			return -1;
		}
	}

	fs.type = function(_path, _callback, _resolve = false)
	{
		var fd;

		if(path.isValid(_path))
		{
			_path = path.resolve(_path);
			fd = false;
		}
		else if(fs.isFile(_path))
		{
			fd = true;
		}
		else
		{
			return x('Invalid _path (expecting String or Integer)');
		}

		const callback = (_error, _stats) => {
			var type;

			if(_error)
			{
				type = '';
			}
			else
			{
				type = fs.getFileType(_stats);
			}

			return _callback(_error, type, _stats);
		};

		try
		{
			if(_resolve)
			{
				if(typeof _callback === 'function')
				{
					if(fd)
					{
						return fs.fstat(_path, callback);
					}

					return fs.stat(_path, callback);
				}
				else
				{
					if(fd)
					{
						return fs.getFileType(fs.fstatSync(_path));
					}

					return fs.getFileType(fs.statSync(_path));
				}
			}
			else
			{
				if(typeof _callback === 'function')
				{
					if(fd)
					{
						return fs.fstat(_path, callback);
					}

					return fs.lstat(_path, callback);
				}
				else
				{
					if(fd)
					{
						return fs.getFileType(fs.fstatSync(_path));
					}

					return fs.getFileType(fs.lstatSync(_path));
				}
			}
		}
		catch(_error)
		{
			return '';
		}

		return null;
	}

	fs.mode = function(_path, _callback)
	{
		_path = path.resolve(_path);

		if(_callback)
		{
			fs.stat(_path, (_error, _stats) => {
				if(_error) _callback(_error);
				else _callback(null, _stats.mode, _stats);
			});
		}
		else
		{
			const stats = fs.statSync(_path);
			return stats.mode;
		}

		return _path;
	}

	//
	//todo/w/ _callback..!!! //real async version TODO!/!
	fs.readlinks = function(_path, _resolve = true, _callback)
	{
		_path = path.resolve(_path);

		const targets = [];
		const pures = [];
		var target = _path;
		var pure;

		///if(_callback)//real async version TODO!/
		while(fs.exists.symlink(target))
		{
			pure = fs.readlinks.one(target, false);
			target = fs.readlinks.one(target, true);

			const circle = (targets.indexOf(target) > -1);

			if(circle)
			{
				break;
			}

			targets.push(target);
			pures.push(pure);
		}

		if(_callback)
		{
			_callback(null, (_resolve ? targets : pures), (_resolve ? pures : targets));
			return _path;
		}

		return (_resolve ? targets : pures);
	}

	fs.readlinks.list = fs.readlinks;

	fs.readlinks.all = function(_path, _resolve = true, _callback)
	{
		_path = path.resolve(_path);

		if(_callback)
		{
			fs.readlinks(_path, _resolve, (_path, _a, _b) => {
				_callback(null, _a.last(), _b.last());
			});

			return _path;
		}

		const targets = fs.readlinks(_path, _resolve);

		if(targets === null || targets.length === 0)
		{
			return null;
		}

		return targets.last();
	}

	fs.readlinks.one = function(_path, _resolve = true, _callback)
	{
		_path = path.resolve(_path);

		//
		if(_callback)
		{
			//
			fs.readlink(_path, { encoding }, (_error, _target) => {
				if(_error)
				{
					_callback(_error);
				}
				else
				{
					if(_resolve && !_target.startsWith(path.sep))
					{
						_target = path.join(path.dirname(_path), _target);

						if(path.dirname(_path).length === 0)
						{
							_target = path.sep + _target;
						}

						_target = path.resolve(_target);
					}

					_callback(null, _target);
				}
			});


			//
			return _path;
		}

		//
		if(! fs.exists.symlink(_path))
		{
			return null;
		}

		var target = fs.readlinkSync(_path, { encoding });

		if(_resolve && !target.startsWith(path.sep))
		{
			target = path.join(path.dirname(_path), target);

			if(path.dirname(_path).length === 0)
			{
				target = path.sep + target;
			}

			target = path.resolve(target);
		}

		//
		return target;
	}

	//
	fs.isExecutable = function(_path, _callback)
	{
		_path = path.resolve(_path);

		if(_callback)
		{
			fs.access(_path, fs.constants.X_OK, (_error) => {
				if(_error) _callback(_error, false);
				else _callback(null, true);
			});
		}
		else
		{
			try
			{
				fs.accessSync(_path, fs.constants.X_OK);
				return true;
			}
			catch(_error)
			{
				return false;
			}
		}

		return _path;
	}

	fs.isReadable = function(_path, _callback)
	{
		_path = path.resolve(_path);

		if(_callback)
		{
			fs.access(_path, fs.constants.R_OK, (_error) => {
				if(_error) _callback(_error, false);
				else _callback(null, true);
			});
		}
		else
		{
			try
			{
				fs.accessSync(_path, fs.constants.R_OK);
				return true;
			}
			catch(_error)
			{
				return false;
			}
		}

		return _path;
	}

	fs.isWritable = function(_path, _callback)
	{
		_path = path.resolve(_path);

		if(_callback)
		{
			fs.access(_path, fs.constants.W_OK, (_error) => {
				if(_error) _callback(_error, false);
				else _callback(null, true);
			});
		}
		else
		{
			try
			{
				fs.accessSync(_path, fs.constants.W_OK);
				return true;
			}
			catch(_error)
			{
				return false;
			}
		}

		return _path;
	}

	//
	fs.list = function(_path, _depth = false, _hidden = false, _type)
	{
		return fs.count(_path, _depth, _hidden, _type, true);
	}

	fs.list.file = function(_path, _depth = false, _hidden = false)
	{
		return fs.list(_path, _depth, _hidden, 'file');
	}

	fs.list.directory = function(_path, _depth = false, _hidden = false)
	{
		return fs.list(_path, _depth, _hidden, 'directory');
	}

	fs.list.symlink = function(_path, _depth = false, _hidden = false)
	{
		return fs.list(_path, _depth, _hidden, 'symlink');
	}

	fs.list.socket = function(_path, _depth = false, _hidden = false)
	{
		return fs.list(_path, _depth, _hidden, 'socket');
	}

	fs.list.block = function(_path, _depth = false, _hidden = false)
	{
		return fs.list(_path, _depth, _hidden, 'block');
	}

	fs.list.char = function(_path, _depth = false, _hidden = false)
	{
		return fs.list(_path, _depth, _hidden, 'char');
	}

	fs.list.fifo = function(_path, _depth = false, _hidden = false)
	{
		return fs.list(_path, _depth, _hidden, 'fifo');
	}

	fs.count = function(_path, _depth = false, _hidden = false, _type, _list = false, _types = true)
	{
		if(typeof _path === 'string' && _path.length > 0)
		{
			_path = path.resolve(_path);
		}
		else
		{
			return x('Expecting a path (non-empty String)');
		}

		if(typeof _depth === 'boolean')
		{
			_depth = (_depth ? 0 : 1);
		}
		else if(Number.isInt(_depth))
		{
			_depth = Math.abs(_depth);
		}
		else
		{
			_depth = 1;
		}

		if(typeof _list !== 'boolean')
		{
			_list = false;
		}

		if(typeof _hidden !== 'boolean')
		{
			_hidden = false;
		}

		if(typeof _type === 'string' && _type.length > 0)
		{
			_type = [ _type ];
		}
		else if(! Array.isArray(_type))
		{
			_type = [];
		}
		else for(var i = 0; i < _type.length; i++)
		{
			if(typeof _type[i] !== 'string' || _type[i].length === 0)
			{
				return x('Invalid _type[' + i + '] (expecting non-empty Strings)');
			}
			else
			{
				_type[i] = _type[i].toLowerCase();
			}
		}

		var withTypes;

		if(_type.length === 1)
		{
			withTypes = false;
		}
		else if(typeof _types === 'boolean')
		{
			withTypes = _types;
		}
		else
		{
			withTypes = true;
		}

		const withFileTypes = (_list || _depth !== 1 || withTypes);

		//
		const packItem = (_entry, _path) => {
			const prepareNullObject = (__entry, __path) => {
				const res = Object.create(null);

				res.path = __path;
				res.name = __entry.name;

				const typeChecks = [
					[ 'isFile', 'file' ],
					[ 'isDirectory', 'directory' ],
					[ 'isSymbolicLink', 'symlink' ],
					[ 'isBlockDevice', 'block' ],
					[ 'isCharacterDevice', 'char' ],
					[ 'isSocket', 'socket' ],
					[ 'isFIFO', 'fifo' ]
				];

				for(var i = 0; i < typeChecks.length; i++)
				{
					const check = typeChecks[i];

					if(__entry[check[0]]() === true)
					{
						res.type = check[1];
					}

					/*res[check[0]] = function()
					{
						return (this.type === check[1]);
					}*/
				}

				if(! String.isString(res.type))
				{
					res.type = 'unknown';
				}

				return res;
			};

			//
			const fullPath = path.join(_path, (withFileTypes ? _entry.name : _entry));

			if(withFileTypes && withTypes)
			{
				return prepareNullObject(_entry, fullPath);
			}

			return fullPath;
		};

		//
		var result = (_list ? [] : 0);
		var index = 0;

		const traverse = (_path, _depth_current = 1) => {
			const ls = fs.readdirSync(_path, { encoding, withFileTypes: true });

			for(var i = 0; i < ls.length; i++)
			{
				if(! _hidden)
				{
					if((withFileTypes ? ls[i].name : ls[i])[0] === '.')
					{
						continue;
					}
				}

				var ok = false;

				if(_type.length > 0)
				{
					var ok = false;

					for(var j = 0; j < _type.length; j++)
					{
						switch(_type[j])
						{
							case 'file':
								if(ls[i].isFile())
								{
									ok = true;
								}
								break;
							case 'directory':
								if(ls[i].isDirectory())
								{
									ok = true;
								}
								break;
							case 'symlink':
								if(ls[i].isSymbolicLink())
								{
									ok = true;
								}
								break;
							case 'socket':
								if(ls[i].isSocket())
								{
									ok = true;
								}
								break;
							case 'block':
								if(ls[i].isBlockDevice())
								{
									ok = true;
								}
								break;
							case 'char':
								if(ls[i].isCharacterDevice())
								{
									ok = true;
								}
								break;
							case 'fifo':
								if(ls[i].isFIFO())
								{
									ok = true;
								}
								break;
						}

						if(ok)
						{
							if(_list)
							{
								result[index++] = packItem(ls[i], _path);
							}
							else
							{
								result++;
							}

							break;
						}
					}
				}
				else if(_list)
				{
					result[index++] = packItem(ls[i], _path);
				}
				else
				{
					result++;
				}

				if(withFileTypes && (_depth === 0 || _depth_current < _depth))
				{
					if(ls[i].isDirectory())
					{
						traverse(path.join(_path, ls[i].name), _depth_current + 1);
					}
				}
			}

			return result;
		}

		return traverse(_path);
	}

	fs.count.file = function(_path, _depth = false, _hidden = false, _list = false)
	{
		return fs.count(_path, _depth, _hidden, 'file', _list);
	}

	fs.count.directory = function(_path, _depth = false, _list = false, _hidden = false)
	{
		return fs.count(_path, _depth, _hidden, 'directory', _list);
	}

	fs.count.symlink = function(_path, _depth = false, _list = false, _hidden = false)
	{
		return fs.count(_path, _depth, _hidden, 'symlink', _list);
	}

	fs.count.socket = function(_path, _depth = false, _list = false, _hidden = false)
	{
		return fs.count(_path, _depth, _hidden, 'socket', _list);
	}

	fs.count.block = function(_path, _depth = false, _list = false, _hidden = false)
	{
		return fs.count(_path, _depth, _hidden, 'block', _list);
	}

	fs.count.char = function(_path, _depth = false, _list = false, _hidden = false)
	{
		return fs.count(_path, _depth, _hidden, 'char', _list);
	}

	fs.count.fifo = function(_path, _depth = false, _list = false, _hidden = false)
	{
		return fs.count(_path, _depth, _hidden, 'fifo', _list);
	}

	//
	fs.where = function(_sub, _list = true, _path = process.env.PATH, _delim = path.delimiter)
	{
		if(typeof _list !== 'boolean' && !Number.isInt(_list))
		{
			_list = true;
		}
		else if(Number.isInt(_list) && _list === 0)
		{
			_list = false;
		}

		if(! String.isString(_sub))
		{
			if(Array.isArray(_sub))
			{
				var str = '';

				for(const ss of _sub)
				{
					if(String.isString(ss))
					{
						str += ss + path.sep;
					}
				}

				if((_sub = str.removeLast(path.sep.length)).length === 0)
				{
					_sub = null;
				}
			}
			else
			{
				_sub = null;
			}

			if(_sub === null)
			{
				return x('Invalid % path to search for (expecting non-empty %)', null, '_sub', 'String');
			}
		}

		if(! String.isString(_delim))
		{
			if(! String.isString(_delim = path.delimiter))
			{
				return x('Invalid path %iter (expecting non-empty %)', null, '_delim', 'String');
			}
		}

		if(! path.isValid(_path))
		{
			if(Array.isArray(_path, false))
			{
				var str = '';

				for(const pp of _path)
				{
					if(String.isString(pp))
					{
						str += pp + _delim;
					}
				}

				if((_path = str.removeLast(_delim.length)).length === 0)
				{
					_path = null;
				}
			}
			else if(String.isString(process.env.PATH))
			{
				_path = process.env.PATH;
			}

			if(_path === null)
			{
				return x('Invalid $% (not in your environment)', null, 'PATH');
			}
		}

		const splitPath = () => {
			const result = [];
			var sub = '';

			for(var i = 0, j = 0; i < _path.length; i++)
			{
				if(_path[i] === '\\' && i < (_string.length - 1))
				{
					if(_path.at(i + 1, _delim))
					{
						sub += _delim;
						i += _delim.length;
					}
					else
					{
						sub += '\\';
					}
				}
				else if(_path.at(i, _delim))
				{
					if(sub.length > 0)
					{
						result[j++] = sub;
						sub = '';
					}
				}
				else
				{
					sub += _path[i];
				}
			}

			if(sub.length > 0)
			{
				result.push(sub);
			}

			return result;
		};

		const paths = splitPath();
		const result = [];
		var p;

		for(var i = 0, j = 0; i < paths.length; i++)
		{
			if(fs.exists(p = path.resolve(path.join(paths[i], _sub)), true))
			{
				if(_list)
				{
					result[j++] = p;

					if(Number.isInt(_list) && _list > 0 && j >= _list)
					{
						return result;
					}
				}
				else
				{
					return p;
				}
			}
		}

		if(Number.isInt(_list) && _list < 0)
		{
			result.applyLength(_list);
		}

		return result;
	}

	//
	fs.touch = function(_path, _callback, _size = 0, _chmod, _atime = Date.now(), _mtime = _atime, _mkdir = false, _mkdir_mode = 0o700)
	{
if(_mkdir)
{
	return x('TODO (fs.mkdirSync(dir, { recursive: true, mode: _mkdir_mode }))');
}
		//
		if(! path.isValid(_path))
		{
			return x('Invalid % argument (not a valid path %)', null, '_path', 'String');
		}

		if(typeof _callback !== 'function')
		{
			_callback = null;
		}

		if(! (Date.isDate(_atime) || String.isString(_atime) || Number.isNumber(_atime)))
		{
			_atime = Date.now();
		}

		if(! (Date.isDate(_mtime) || String.isString(_mtime) || Number.isNumber(_mtime)))
		{
			_mtime = Date.now();
		}

		if(! (Number.isInt(_size) && _size >= 0))
		{
			_size = 0;
		}

		try
		{
			if(_callback)
			{
				fs.exists(_path, (_exists, _type, _stats) => {
					if(_exists)
					{
						_callback(null, false, fs.size(_path));
					}
					else if(Number.isInt(_chmod) || String.isString(_chmod))
					{
						fs.open(_path, 'a', _chmod, (_error, _fd) => {
							if(_error)
							{
								_callback(_error, null, -1);
							}
							else if(_size > 0)
							{
								fs.ftruncate(_fd, _size, (_error) => {
									if(_error)
									{
										return _callback(_error, true, 0);
									}

									return fs.close(_fd, (_error) => {
										return _callback(_error, true, _size);
									});
								});
							}
							else
							{
								fs.close(_fd, (_error) => {
									return _callback(_error, true, 0);
								});
							}
						});
					}
					else
					{
						fs.open(_path, 'a', (_error, _fd) => {
							if(_error)
							{
								_callback(_error, null, -1);
							}
							else if(_size > 0)
							{
								fs.ftruncate(_fd, _size, (_error) => {
									if(_error)
									{
										return _callback(_error, true, 0);
									}

									return fs.close(_fd, (_error) => {
										return _callback(_error, true, _size);
									});
								});
							}
							else
							{
								fs.close(_fd, (_error) => {
									return _callback(_error, true, 0);
								});
							}
						});
					}
				}, false);

				//
				return null;
			}
			else if(fs.exists(_path, null, false))
			{
				return false;
			}
			else
			{
				var fd;

				if(Number.isInt(_chmod) || String.isString(_chmod))
				{
					fd = fs.openSync(_path, 'a', _chmod);
				}
				else
				{
					fd = fs.openSync(_path, 'a');
				}

				if(_size > 0)
				{
					fs.ftruncateSync(fd, _size);
				}

				fs.closeSync(fd);
			}

			return true;
		}
		catch(_error)
		{
			if(_callback)
			{
				_callback(_error);
			}
			else
			{
				x(_error);
			}

			return false;
		}
	}

	fs.touch.mkdir = function(_path, _callback, _size = 0, _chmod, _atime = new Date(), _mtime = _atime)
	{
		return fs.touch(_path, _callback, _size, _chmod, _atime, _mtime, true);
	}

	//
	// < https://www.heise.de/security/meldung/Sicheres-Loeschen-Einmal-ueberschreiben-genuegt-198816.html >
	//
	fs.erase = function(_path_fd, _callback, _options, _throw = DEFAULT_THROW)
	{
		if(fs.randomizeFile(_path_fd, _callback, Object.assign({
			crypto: DEFAULT_CRYPTO_ERASE,
			offset: 0
		}, _options, {
			truncate: true,
			length: 0
		}), _throw) === null)
		{
			return null;
		}
		else if(typeof _path_fd === 'string') try
		{
			fs.unlinkSync(_path_fd);
			return true;
		}
		catch(_error)
		{
			if(_throw)
			{
				return x(_error);
			}
		}

		return false;
	}

	fs.erase.random = fs.erase;

	fs.erase.zero = function(_path_fd, _callback, _options, _throw = DEFAULT_THROW)
	{
		if(fs.formatFile(_path_fd, _callback, Object.assign({
			radix: null,
			offset: 0,
		}, _options, {
			truncate: true,
			length: 0
		}), _throw) === null)
		{
			return null;
		}
		else if(typeof _path_fd === 'string') try
		{
			fs.unlinkSync(_path_fd);
			return true;
		}
		catch(_error)
		{
			if(_throw)
			{
				return x(_error);
			}
		}

		return false;
	}

	fs.randomizeFile = function(_path_fd, _callback, _options, _throw = DEFAULT_THROW)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _callback !== 'function')
		{
			_callback = null;
		}

		var hasEncoding;
		
		_options = Object.assign({
			crypto: CRYPTO,
			chunk: CHUNK,
			chunks: null,
			offset: 0,
			length: null,
			truncate: DEFAULT_TRUNCATE,
			radix: DEFAULT_RADIX,
			encoding,
			mode: 0o600,
			startChunk: 0,
			stopChunk: null,
			close: (typeof _path_fd === 'string')
		}, _options);

		if(typeof _options.autoClose === 'boolean')
		{
			_options.close = _options.autoClose;
			delete _options.autoClose;
		}
		else if(typeof _options.close !== 'boolean')
		{
			_options.close = (typeof _path_fd === 'string');
		}

		if(! isRadix(_options.radix, false, false) && _options.radix !== null)
		{
			_options.radix = DEFAULT_RADIX;
		}

		if(typeof _options.crypto !== 'boolean')
		{
			_options.crypto = CRYPTO;
		}

		if(! (Number.isInt(_options.chunk) && _options.chunk > 0))
		{
			_options.chunk = CHUNK;
		}

		if(typeof _options.truncate !== 'boolean')
		{
			_options.truncate = DEFAULT_TRUNCATE;
		}

		if(! Number.isInt(_options.offset))
		{
			_options.offset = 0;
		}

		if(! Number.isInt(_options.length))
		{
			_options.length = null;
		}

		if(! String.isEncoding(_options.encoding, false, true, false, false))
		{
			_options.encoding = null;
			hasEncoding = false;
		}
		else
		{
			hasEncoding = true;
		}

		if(! fs.isPerm(_options.mode))
		{
			_options.mode = null;
		}

		if(! (Number.isInt(_options.chunks) && _options.chunks >= 0))
		{
			_options.chunks = null;
		}

		if(! (Number.isInt(_options.startChunk) && _options.startChunk >= 0))
		{
			_options.startChunk = 0;
		}

		if(! (Number.isInt(_options.stopChunk) && _options.stopChunk >= _options.startChunk))
		{
			_options.stopChunk = null;
		}

		var size, handle;

		if(path.isValid(_path_fd))
		{
			_path_fd = path.resolve(_path_fd);

			if(fs.exists.file(_path_fd, null, true))
			{
				size = fs.size(handle = fs.openSync(_path_fd, 'r+'));
				_options.mode = null;
			}
			else if(! fs.exists(_path_fd, null, true))
			{
				fs.touch(_path_fd, null, size = (_options.length === null ? 0 : _options.length), _options.mode);
				handle = fs.openSync(_path_fd, 'r+');
			}
			else if(_throw)
			{
				return x('Your path exists, but it ain\'t a file');
			}
			else
			{
				return null;
			}
		}
		else if(fs.isFile(_path_fd))
		{
			size = fs.size(handle = _path_fd);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting a % or an %)', null, '_path_fd', 'String', 'Integer');
		}
		else
		{
			return null;
		}

		if(_options.offset < 0)
		{
			if(size < 1)
			{
				_options.offset = 0;
			}
			else if((_options.offset = size + _options.offset) < 0)
			{
				_options.offset = 0;
			}
		}

		const checkLength = (_new_value) => {
			//
			if(Number.isInt(_new_value) || _new_value === null)
			{
				_options.length = _new_value;
			}

			//
			if(_options.length === null)
			{
				_options.length = (size - _options.offset);
			}

			if(_options.length < 0)
			{
				if((_options.length = (size + _options.length - _options.offset)) < 0)
				{
					_options.length = 0;
				}
			}

			if(size > 0 && (_options.length > (size - _options.offset)))
			{
				if((_options.length = (size - _options.offset)) < 0)
				{
					_options.length = 0;
				}
			}
			else if(size < 1)
			{
				_options.length = 0;
			}

			//
			return _options.length;
		};

		checkLength();

		if(_options.length === 0 || _options.chunks === 0)
		{
			if(_options.truncate && size > 0)
			{
				fs.randomizeFile(handle, null, Object.assign(_options, {
					truncate: false,
					offset: 0,
					length: size
				}), _throw);

				fs.ftruncateSync(handle, 0);
			}
			else
			{
				_options.truncate = null;
			}

			return 0;
		}
		else if(_options.truncate)
		{
			const stopIndex = (_options.offset + _options.length);

			if(size > stopIndex)
			{
				//security first! ;-D
				fs.randomizeFile(handle, null, Object.assign(_options, {
					truncate: false,
					offset: stopIndex,
					length: (size - stopIndex - 1)
				}), _throw);

				fs.ftruncateSync(handle, stopIndex);
			}
		}
		else
		{
			_options.truncate = null;
		}

		//
		const alpha = ((_options.radix === 256 || _options.radix === -257 || _options.radix === null) ? null : alphabet(_options.radix));

		if(typeof alpha !== 'string' && alpha !== null)
		{
			if(_throw)
			{
				return x('Invalid % option (couldn\'t create alphabet; and is not %)', null, 'radix', null);
			}

			return null;
		}

		//
		var result = 0;
		var buffer = null;
		var written = null;
		var rest = _options.length;
		var min;
		var chunks = 0;
		var computedChunks = Math._min(_options.chunks, Math.ceil(_options.length / _options.chunk));
		var finish = false;
		var finishSent = false;
		var ignored = 0;

		//
		var STOP = false;

		const stop = () => {
			if(STOP)
			{
				return false;
			}

			return STOP = true;
		};

		const ev = {};

		Object.defineProperty(ev, 'CHANGEABLE', { enumerable: true, get: function()
		{
			return [ 'chunk', 'chunks', 'crypto', 'encoding', 'length', 'startChunk', 'stopChunk' ];
		}});

		Object.defineProperty(ev, 'stop', { value: stop, enumerable: true });

		Object.defineProperty(ev, 'chunk', { enumerable: true,
			get: function()
			{
				return _options.chunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value > 0)
				{
					return _options.chunk = _value;
				}

				return ev.chunk;
			}
		});

		Object.defineProperty(ev, 'chunks', { enumerable: true,
			get: function()
			{
				return _options.chunks;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.chunks = _value;
				}
				else if(_value === null)
				{
					return _options.chunks = _value;
				}

				return ev.chunks;
			}
		});

		Object.defineProperty(ev, 'crypto', { enumerable: true,
			get: function()
			{
				return _options.crypto;
			},
			set: function(_value)
			{
				if(typeof _value === 'boolean')
				{
					return _options.crypto = _value;
				}

				return ev.crypto;
			}
		});

		Object.defineProperty(ev, 'encoding', { enumerable: true,
			get: function()
			{
				return _options.encoding;
			},
			set: function(_value)
			{
				if(_value === '')
				{
					_value = 'utf8';
				}

				if(_value === null)
				{
					return _options.encoding = _value;
				}
				else if(String.isEncoding(_value, false, true, false, false))
				{
					return _options.encoding = _value;
				}

				return ev.encoding;
			}
		});

		Object.defineProperty(ev, 'length', { enumerable: true,
			get: function()
			{
				return _options.length;
			},
			set: function(_value)
			{
				const orig = ev.length;
				const result = checkLength(_value);
				const diff = (result - orig);

				if(diff === 0)
				{
					return result;
				}
				else
				{
					rest += diff;
					computedChunks = Math._min(_options.chunks, Math.ceil(result / _options.chunk));
				}

				return result;
			}
		});

		Object.defineProperty(ev, 'startChunk', { enumerable: true,
			get: function()
			{
				return _options.startChunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.startChunk = _value;
				}

				return ev.startChunk;
			}
		});

		Object.defineProperty(ev, 'stopChunk', { enumerable: true,
			get: function()
			{
				return _options.stopChunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= _options.startChunk)
				{
					return _options.stopChunk = _value;
				}
				else if(_value === null)
				{
					return _options.stopChunk = _value;
				}

				return ev.stopChunk;
			}
		});

		Object.defineProperty(ev, 'alphabet', { enumerable: true, get: function()
		{
			return alpha;
		}});

		Object.defineProperty(ev, 'byte', { enumerable: true, get: function()
		{
			return (result + _options.offset);
		}});

		Object.defineProperty(ev, 'computedChunks', { enumerable: true, get: function()
		{
			return computedChunks;
		}});

		Object.defineProperty(ev, 'file', { enumerable: true, get: function()
		{
			return handle;
		}});

		Object.defineProperty(ev, 'fileSize', { enumerable: true, get: function()
		{
			return size;
		}});

		Object.defineProperty(ev, 'mode', { enumerable: true, get: function()
		{
			return _options.mode;
		}});

		Object.defineProperty(ev, 'offset', { enumerable: true, get: function()
		{
			return _options.offset;
		}});

		Object.defineProperty(ev, 'path', { enumerable: true, get: function()
		{
			return (_path_fd === handle ? null : _path_fd);
		}});

		Object.defineProperty(ev, 'radix', { enumerable: true, get: function()
		{
			return _options.radix;
		}});

		Object.defineProperty(ev, 'truncate', { enumerable: true, get: function()
		{
			return _options.truncate;
		}});

		const getEventObjectElements = (_error, _event = ev) => {
			//
			_event.buffer = buffer;
			_event.bytes = result;
			_event.count = chunks;
			_event.error = _error;
			_event.finish = (_error === null ? finish : null);
			_event.ignoredChunks = ignored;
			_event.rest = rest;
			_event.size = min;
			_event.stopped = STOP;
			_event.written = written;

			//
			if(hasEncoding)
			{
				_event.string = String.fromUint8Array(buffer, _options.encoding);
			}
			else
			{
				_event.string = null;
			}

			//
			if(_event.finish)
			{
				finishSent = true;
			}

			//
			return _event;
		};

		const callback = (_error = null) => {
			if(! _callback)
			{
				return;
			}
			else
			{
				getEventObjectElements(_error, ev);
			}

			//
			return _callback(ev);
		};

		//
		try
		{
			if(alpha === null) while(result < _options.length)
			{
				if(STOP)
				{
					break;
				}
				else if(finish)
				{
					break;
				}

				min = Math._min(_options.chunk, rest);

				if(ignored < _options.startChunk)
				{
					++ignored;

					result += min;
					rest -= min;
				}
				else
				{
					buffer = new Uint8Array(min);

					if(_options.crypto)
					{
						crypto.getRandomValues(buffer);
					}
					else
					{
						buffer.randomize(255, 0, false);
					}

					written = fs.writeSync(handle, buffer, 0, min, result + _options.offset);

					result += written;
					rest -= written;
					++chunks;
				}

				if(rest <= 0)
				{
					finish = true;
				}
				else if(_options.chunks !== null && chunks >= _options.chunks)
				{
					finish = true;
				}
				else if(_options.stopChunk !== null && (chunks + ignored) >= _options.stopChunk)
				{
					finish = true;
				}

				if(STOP)
				{
					break;
				}
				else if((chunks + ignored) >= _options.startChunk)
				{
					callback(null);
				}
			}
			else if(typeof alpha === 'string') while(result < _options.length)
			{
				if(STOP)
				{
					break;
				}
				else if(finish)
				{
					break;
				}

				min = Math._min(_options.chunk, rest);

				if(ignored < _options.startChunk)
				{
					++ignored;

					result += min;
					rest -= min;
				}
				else
				{
					buffer = alpha.getRandom(min, true, _options.crypto).toUint8Array();

					written = fs.writeSync(handle, buffer, 0, min, result + _options.offset);

					result += written;
					rest -= written;
					++chunks;
				}

				if(rest <= 0)
				{
					finish = true;
				}
				else if(_options.chunks !== null && chunks >= _options.chunks)
				{
					finish = true;
				}
				else if(_options.stopChunk !== null && (chunks + ignored) >= _options.stopChunk)
				{
					finish = true;
				}

				if(STOP)
				{
					break;
				}
				else if((chunks + ignored) >= _options.startChunk)
				{
					callback(null);
				}
			}

			if(_options.close)
			{
				fs.closeSync(handle);
			}
		}
		catch(_error)
		{
			if(_throw)
			{
				return x(_error);
			}
			else if(_callback)
			{
				callback(_error);
			}

			return null;
		}

		if(! finishSent && _callback)
		{
			_callback(Object.assign(getEventObjectElements(null), { stopped: STOP }));
		}

		return result;
	}

	//
	fs.formatFile = function(_path_fd, _callback, _options, _throw = DEFAULT_THROW)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _callback !== 'function')
		{
			_callback = null;
		}

		var hasEncoding;
		
		_options = Object.assign({
			chunk: CHUNK,
			chunks: null,
			offset: 0,
			length: null,
			truncate: DEFAULT_TRUNCATE,
			radix: DEFAULT_RADIX,//or (null) for \0 only..! ;-D
			reverse: false,
			encoding,
			mode: 0o600,
			startChunk: 0,
			stopChunk: null,
			close: (typeof _path_fd === 'string')
		}, _options);

		if(typeof _options.autoClose === 'boolean')
		{
			_options.close = _options.autoClose;
			delete _options.autoClose;
		}
		else if(typeof _options.close !== 'boolean')
		{
			_options.close = (typeof _path_fd === 'string');
		}

		if(typeof _options.reverse !== 'boolean')
		{
			_options.reverse = false;
		}

		if(! isRadix(_options.radix, false, false) && _options.radix !== null)
		{
			_options.radix = DEFAULT_RADIX;
		}

		if(! (Number.isInt(_options.chunk) && _options.chunk > 0))
		{
			_options.chunk = DEFAULT_CHUNK;
		}

		if(typeof _options.truncate !== 'boolean')
		{
			_options.truncate = DEFAULT_TRUNCATE;
		}

		if(! Number.isInt(_options.offset))
		{
			_options.offset = 0;
		}

		if(! Number.isInt(_options.length))
		{
			_options.length = null;
		}

		if(! String.isEncoding(_options.encoding, false, true, false, false))
		{
			_options.encoding = null;
			hasEncoding = false;
		}
		else
		{
			hasEncoding = true;
		}

		if(! fs.isPerm(_options.mode))
		{
			_options.mode = null;
		}

		if(! (Number.isInt(_options.chunks) && _options.chunks >= 0))
		{
			_options.chunks = null;
		}

		if(! (Number.isInt(_options.startChunk) && _options.startChunk >= 0))
		{
			_options.startChunk = 0;
		}

		if(! (Number.isInt(_options.stopChunk) && _options.stopChunk >= _options.startChunk))
		{
			_options.stopChunk = null;
		}

		var size, handle;

		if(path.isValid(_path_fd))
		{
			_path_fd = path.resolve(_path_fd);

			if(fs.exists.file(_path_fd, null, true))
			{
				size = fs.size(handle = fs.openSync(_path_fd, 'r+'));
				_options.mode = null;
			}
			else if(! fs.exists(_path_fd, null, true))
			{
				fs.touch(_path_fd, null, size = (_options.length === null ? 0 : _options.length), _options.mode);
				handle = fs.openSync(_path_fd, 'r+');
			}
			else if(_throw)
			{
				return x('Your path exists, but it ain\'t a file');
			}
			else
			{
				return null;
			}
		}
		else if(fs.isFile(_path_fd))
		{
			size = fs.size(handle = _path_fd);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting a % or an %)', null, '_path_fd', 'String', 'Integer');
		}
		else
		{
			return null;
		}

		if(_options.offset < 0)
		{
			if(size < 1)
			{
				_options.offset = 0;
			}
			else if((_options.offset = size + _options.offset) < 0)
			{
				_options.offset = 0;
			}
		}

		const checkLength = (_new_value) => {
			//
			if(Number.isInt(_new_value) || _new_value === null)
			{
				_options.length = _new_value;
			}

			//
			if(_options.length === null)
			{
				_options.length = (size - _options.offset);
			}

			if(_options.length < 0)
			{
				if((_options.length = (size + _options.length - _options.offset)) < 0)
				{
					_options.length = 0;
				}
			}

			if(size > 0 && (_options.length > (size - _options.offset)))
			{
				if((_options.length = (size - _options.offset)) < 0)
				{
					_options.length = 0;
				}
			}
			else if(size < 1)
			{
				_options.length = 0;
			}

			//
			return _options.length;
		};

		checkLength();

		if(_options.length === 0 || _options.chunks === 0)
		{
			if(_options.truncate && size > 0)
			{
				fs.formatFile(handle, null, Object.assign(_options, {
					truncate: false,
					offset: 0,
					length: size
				}), _throw);

				fs.ftruncateSync(handle, 0);
			}
			else
			{
				_options.truncate = null;
			}

			return 0;
		}
		else if(_options.truncate)
		{
			const stopIndex = (_options.offset + _options.length);

			if(size > stopIndex)
			{
				//secure it! :-D
				fs.formatFile(handle, null, Object.assign(_options, {
					truncate: false,
					offset: stopIndex,
					length: (size - stopIndex - 1)
				}), _throw);

				fs.ftruncateSync(handle, stopIndex);
			}
		}
		else
		{
			_options.truncate = null;
		}

		//
		const alpha = (_options.radix === null ? null : alphabet(_options.radix));

		if(typeof alpha !== 'string' && alpha !== null)
		{
			if(_throw)
			{
				return x('Invalid % option (couldn\'t create alphabet, and is not %)', null, 'radix', null);
			}

			return null;
		}

		//
		var result = 0;
		var buffer = null;
		var written = null;
		var rest = _options.length;
		var min;
		var chunks = 0;
		var computedChunks = Math._min(_options.chunks, Math.ceil(_options.length / _options.chunk));
		var finish = false;
		var finishSent = false;
		var ignored = 0;

		//
		var STOP = false;

		const stop = () => {
			if(STOP)
			{
				return false;
			}

			return STOP = true;
		}

		const ev = {};

		Object.defineProperty(ev, 'CHANGEABLE', { enumerable: true, get: function()
		{
			return [ 'chunk', 'chunks', 'encoding', 'length', 'reverse', 'startChunk', 'stopChunk' ];
		}});

		Object.defineProperty(ev, 'stop', { value: stop, enumerable: true });

		Object.defineProperty(ev, 'chunk', { enumerable: true,
			get: function()
			{
				return _options.chunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value > 0)
				{
					return _options.chunk = _value;
				}

				return ev.chunk;
			}
		});

		Object.defineProperty(ev, 'chunks', { enumerable: true,
			get: function()
			{
				return _options.chunks;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.chunks = _value;
				}
				else if(_value === null)
				{
					return _options.chunks = _value;
				}

				return ev.chunks;
			}
		});

		Object.defineProperty(ev, 'encoding', { enumerable: true,
			get: function()
			{
				return _options.encoding;
			},
			set: function(_value)
			{
				if(_value === '')
				{
					_value = 'utf8';
				}

				if(_value === null)
				{
					return _options.encoding = _value;
				}
				else if(String.isEncoding(_value, false, true, false, false))
				{
					return _options.encoding = _value;
				}

				return ev.encoding;
			}
		});

		Object.defineProperty(ev, 'length', { enumerable: true,
			get: function()
			{
				return _options.length;
			},
			set: function(_value)
			{
				const orig = ev.length;
				const result = checkLength(_value);
				const diff = (result - orig);

				if(diff === 0)
				{
					return result;
				}
				else
				{
					rest += diff;
					computedChunks = Math._min(_options.chunks, Math.ceil(result / _options.chunk));
				}

				return result;
			}
		});

		Object.defineProperty(ev, 'reverse', { enumerable: true,
			get: function()
			{
				return _options.reverse;
			},
			set: function(_value)
			{
				if(typeof _value === 'boolean')
				{
					return _options.reverse = _value;
				}

				return ev.reverse;
			}
		});

		Object.defineProperty(ev, 'startChunk', { enumerable: true,
			get: function()
			{
				return _options.startChunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.startChunk = _value;
				}

				return ev.startChunk;
			}
		});

		Object.defineProperty(ev, 'stopChunk', { enumerable: true,
			get: function()
			{
				return _options.stopChunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= _options.startChunk)
				{
					return _options.stopChunk = _value;
				}
				else if(_value === null)
				{
					return _options.stopChunk = _value;
				}

				return ev.stopChunk;
			}
		});

		Object.defineProperty(ev, 'alphabet', { enumerable: true, get: function()
		{
			return alpha;
		}});

		Object.defineProperty(ev, 'byte', { enumerable: true, get: function()
		{
			return (result + _options.offset);
		}});

		Object.defineProperty(ev, 'computedChunks', { enumerable: true, get: function()
		{
			return computedChunks;
		}});

		Object.defineProperty(ev, 'file', { enumerable: true, get: function()
		{
			return handle;
		}});

		Object.defineProperty(ev, 'fileSize', { enumerable: true, get: function()
		{
			return size;
		}});

		Object.defineProperty(ev, 'mode', { enumerable: true, get: function()
		{
			return _options.mode;
		}});

		Object.defineProperty(ev, 'offset', { enumerable: true, get: function()
		{
			return _options.offset;
		}});

		Object.defineProperty(ev, 'path', { enumerable: true, get: function()
		{
			return (_path_fd === handle ? null : _path_fd);
		}});

		Object.defineProperty(ev, 'radix', { enumerable: true, get: function()
		{
			return _options.radix;
		}});

		Object.defineProperty(ev, 'truncate', { enumerable: true, get: function()
		{
			return _options.truncate;
		}});

		const getEventObjectElements = (_error, _event = ev) => {
			//
			_event.buffer = buffer;
			_event.bytes = result;
			_event.count = chunks;
			_event.error = _error;
			_event.finish = (_error === null ? finish : null);
			_event.ignoredChunks = ignored;
			_event.rest = rest;
			_event.size = min;
			_event.stopped = STOP;
			_event.written = written;
			
			//
			if(hasEncoding)
			{
				_event.string = String.fromUint8Array(buffer, _options.encoding);
			}
			else
			{
				_event.string = null;
			}

			//
			if(_event.finish)
			{
				finishSent = true;
			}

			//
			return _event;
		};

		const callback = (_error = null) => {
			if(! _callback)
			{
				return;
			}
			else
			{
				getEventObjectElements(_error, ev);
			}

			//
			return _callback(ev);
		};

		//
		try
		{
			while(result < _options.length)
			{
				//
				if(STOP)
				{
					break;
				}
				else if(finish)
				{
					break;
				}

				//
				min = Math._min(_options.chunk, rest);

				if(ignored < _options.startChunk)
				{
					++ignored;

					result += min;
					rest -= min;
				}
				else
				{
					buffer = new Uint8Array(min);

					//
					if(alpha !== null)
					{
						if(_options.reverse)
						{
							for(var i = alpha.length - 1, j = 0; j < min; --i, ++j)
							{
								if(i < 0)
								{
									i = alpha.length - 1;
								}

								buffer[j] = alpha.charCodeAt(i);
							}
						}
						else
						{
							for(var i = 0, j = 0; j < min; ++i, ++j)
							{
								if(i === alpha.length)
								{
									i = 0;
								}

								buffer[j] = alpha.charCodeAt(i);
							}
						}
					}

					//
					written = fs.writeSync(handle, buffer, 0, min, result + _options.offset);

					result += written;
					rest -= written;
					++chunks;
				}

				if(rest <= 0)
				{
					finish = true;
				}
				else if(_options.chunks !== null && chunks >= _options.chunks)
				{
					finish = true;
				}
				else if(_options.stopChunk !== null && (chunks + ignored) >= _options.stopChunk)
				{
					finish = true;
				}

				//
				if(STOP)
				{
					break;
				}
				else if((chunks + ignored) >= _options.startChunk)
				{
					callback(null);
				}
			}

			if(_options.close)
			{
				fs.closeSync(handle);
			}
		}
		catch(_error)
		{
			if(_throw)
			{
				return x(_error);
			}
			else if(_callback)
			{
				callback(_error);
			}

			return null;
		}

		if(! finishSent && _callback)
		{
			_callback(Object.assign(getEventObjectElements(null), { stopped: STOP }));
		}

		return result;
	}

	//
	fs.chunkRead = function(_path_fd, _callback, _options, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _callback !== 'function')
		{
			return x('Invalid % argument (a % is necessary)', null, '_callback', 'Function');
		}

		var hasEncoding;
		
		_options = Object.assign({
			chunk: CHUNK,
			chunks: null,
			encoding,
			length: null,
			offset: 0,
			backwards: false,
			startChunk: 0,
			stopChunk: null,
			close: (typeof _path_fd === 'string')
		}, _options);

		if(typeof _options.autoClose === 'boolean')
		{
			_options.close = _options.autoClose;
			delete _options.autoClose;
		}
		else if(typeof _options.close !== 'boolean')
		{
			_options.close = (typeof _path_fd === 'string');
		}

		if(! (Number.isInt(_options.chunk) && _options.chunk > 0))
		{
			_options.chunk = CHUNK;
		}

		if(! Number.isInt(_options.offset))
		{
			_options.offset = 0;
		}

		if(! Number.isInt(_options.length))
		{
			_options.length = null;
		}

		if(! String.isEncoding(_options.encoding, false, true, false, false))
		{
			_options.encoding = null;
			hasEncoding = false;
		}
		else
		{
			hasEncoding = true;
		}

		if(! (Number.isInt(_options.chunks) && _options.chunks >= 0))
		{
			_options.chunks = null;
		}

		if(! (Number.isInt(_options.startChunk) && _options.startChunk >= 0))
		{
			_options.startChunk = 0;
		}

		if(! (Number.isInt(_options.stopChunk) && _options.stopChunk >= _options.startChunk))
		{
			_options.stopChunk = null;
		}

		if(typeof _options.backwards !== 'boolean')
		{
			_options.backwards = false;
		}

		var size, handle;

		if(path.isValid(_path_fd))
		{
			_path_fd = path.resolve(_path_fd);

			if(fs.exists.file(_path_fd, null, true))
			{
				size = fs.size(handle = fs.openSync(_path_fd, 'r'));
			}
			else if(_throw)
			{
				return x('Your path doesn\'t exist [as a file]');
			}
			else
			{
				return null;
			}
		}
		else if(fs.isFile(_path_fd))
		{
			size = fs.size(handle = _path_fd);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting a % or an %)', null, '_path_fd', 'String', 'Integer');
		}
		else
		{
			return null;
		}

		if(_options.offset < 0)
		{
			if(size < 1)
			{
				_options.offset = 0;
			}
			else if((_options.offset = size + _options.offset) < 0)
			{
				_options.offset = 0;
			}
		}

		const checkLength = (_new_value) => {
			//
			if(Number.isInt(_new_value) || _new_value === null)
			{
				_options.length = _new_value;
			}

			//
			if(_options.length === null)
			{
				_options.length = (size - _options.offset);
			}

			if(_options.length < 0)
			{
				if((_options.length = (size + _options.length - _options.offset)) < 0)
				{
					_options.length = 0;
				}
			}

			if(size > 0 && (_options.length > (size - _options.offset)))
			{
				if((_options.length = (size - _options.offset)) < 0)
				{
					_options.length = 0;
				}
			}
			else if(size < 1)
			{
				_options.length = 0;
			}

			//
			return _options.length;
		};

		const origLength = _options.length;
		checkLength();

		//
		if(! _options.backwards)
		{
			if(_options.chunks !== null && _options.chunks < 0)
			{
				_options.backwards = true;
			}
		}

		if(_options.chunks !== null)
		{
			_options.chunks = Math.abs(_options.chunks);
		}

		if((Number.isInt(_options.chunks) && _options.chunks <= 0) || origLength === 0)
		{
			return 0;
		}

		//
		var result = 0;
		var buffer = null;
		var read = null;
		var rest = _options.length;
		var min;
		var chunks = 0;
		var ignored = 0;
		var computedChunks = Math._min(_options.chunks, Math.ceil(_options.length / _options.chunk));
		var finish = false;
		var finishSent = false;

		//
		var STOP = false;

		const stop = () => {
			if(STOP)
			{
				return false;
			}

			return STOP = true;
		};

		const ev = {};

		Object.defineProperty(ev, 'CHANGEABLE', { enumerable: true, get: function()
		{
			return [ 'chunk', 'chunks', 'encoding', 'length', 'startChunk', 'stopChunk' ];
		}});

		Object.defineProperty(ev, 'stop', { value: stop, enumerable: true });

		Object.defineProperty(ev, 'chunk', { enumerable: true,
			get: function()
			{
				return _options.chunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value > 0)
				{
					return _options.chunk = _value;
				}

				return ev.chunk;
			}
		});

		Object.defineProperty(ev, 'chunks', { enumerable: true,
			get: function()
			{
				return _options.chunks;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.chunks = _value;
				}
				else if(_value === null)
				{
					return _options.chunks = _value;
				}

				return ev.chunks;
			}
		});

		Object.defineProperty(ev, 'encoding', { enumerable: true,
			get: function()
			{
				return _options.encoding;
			},
			set: function(_value)
			{
				if(_value === '')
				{
					_value = 'utf8';
				}

				if(_value === null)
				{
					return _options.encoding = _value;
				}
				else if(String.isEncoding(_value, false, true, false, false))
				{
					return _options.encoding = _value;
				}

				return ev.encoding;
			}
		});

		Object.defineProperty(ev, 'length', { enumerable: true,
			get: function()
			{
				return _options.length;
			},
			set: function(_value)
			{
				const orig = ev.length;
				const result = checkLength(_value);
				const diff = (result - orig);

				if(diff === 0)
				{
					return result;
				}
				else
				{
					rest += diff;
					computedChunks = Math._min(_options.chunks, Math.ceil(result / _options.chunk));
				}

				return result;
			}
		});

		Object.defineProperty(ev, 'startChunk', { enumerable: true,
			get: function()
			{
				return _options.startChunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.startChunk = _value;
				}

				return ev.startChunk;
			}
		});

		Object.defineProperty(ev, 'stopChunk', { enumerable: true,
			get: function()
			{
				return _options.stopChunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= _options.startChunk)
				{
					return _options.stopChunk = _value;
				}
				else if(_value === null)
				{
					return _options.stopChunk = _value;
				}

				return ev.stopChunk;
			}
		});

		Object.defineProperty(ev, 'byte', { enumerable: true, get: function()
		{
			return (result + _options.offset);
		}});

		Object.defineProperty(ev, 'backwards', { enumerable: true, get: function()
		{
			return _options.backwards;
		}});

		Object.defineProperty(ev, 'computedChunks', { enumerable: true, get: function()
		{
			return computedChunks;
		}});

		Object.defineProperty(ev, 'file', { enumerable: true, get: function()
		{
			return handle;
		}});

		Object.defineProperty(ev, 'fileSize', { enumerable: true, get: function()
		{
			return size;
		}});

		Object.defineProperty(ev, 'offset', { enumerable: true, get: function()
		{
			return _options.offset;
		}});

		Object.defineProperty(ev, 'path', { enumerable: true, get: function()
		{
			return (_path_fd === handle ? null : _path_fd);
		}});

		const getEventObjectElements = (_error, _event = ev) => {
			//
			_event.buffer = buffer;
			_event.bytes = result;
			_event.count = chunks;
			_event.error = _error;
			_event.finish = (_error === null ? finish : null);
			_event.ignoredChunks = ignored;
			_event.read = read;
			_event.rest = rest;
			_event.size = min;
			_event.stopped = STOP;
			
			//
			if(hasEncoding)
			{
				_event.string = String.fromUint8Array(buffer, _options.encoding);
			}
			else
			{
				_event.string = null;
			}

			//
			if(size < 1)
			{
				_event.finish = true;
				finishSent = true;
			}
			else if(_event.finish)
			{
				finishSent = true;
			}

			//
			return _event;
		};
		
		const callback = (_error = null) => {
			//
			if(! _callback)
			{
				return;
			}
			else
			{
				getEventObjectElements(_error, ev);
			}
			
			//
			return _callback(ev);
		};

		if(size === 0)
		{
			buffer = new Uint8Array(min = 0);
			read = 0;
			++chunks;
			finish = true;
			callback(null);
			return 0;
		}
		else try
		{
			if(_options.backwards) while(result < _options.length)
			{
throw new Error('TODO (backwards)');
			}
			else while(result < _options.length)
			{
				if(STOP)
				{
					break;
				}
				else if(finish)
				{
					break;
				}

				min = Math._min(_options.chunk, rest);

				if(ignored < _options.startChunk)
				{
					++ignored;

					result += min;
					rest -= min;
				}
				else
				{
					buffer = new Uint8Array(min);
					read = fs.readSync(handle, buffer, 0, min, result + _options.offset);

					if(read > 0)
					{
						result += read;
						rest -= read;
					}

					++chunks;
				}

				if(read === 0)
				{
					finish = true;
				}
				else if(rest <= 0)
				{
					finish = true;
				}
				else if(_options.chunks !== null && chunks >= _options.chunks)
				{
					finish = true;
				}
				else if(_options.stopChunk !== null && (chunks + ignored) >= _options.stopChunk)
				{
					finish = true;
				}

				if(STOP)
				{
					break;
				}
				else if((chunks + ignored) >= _options.startChunk)
				{
					callback(null);
				}
			}

			if(_options.close)
			{
				fs.closeSync(handle);
			}
		}
		catch(_error)
		{
			if(_throw)
			{
				return x(_error);
			}
			else if(_callback)
			{
				callback(_error);
			}

			return null;
		}

		if(! finishSent && _callback)
		{
			_callback(Object.assign(getEventObjectElements(null), { stopped: STOP }));
		}

		return result;
	}

	fs.chunkWrite = function(_path_fd, _data, _callback, _options, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _callback !== 'function')
		{
			_callback = null;
		}
		
		var hasEncoding;

		_options = Object.assign({
			chunk: CHUNK,
			encoding,
			truncate: DEFAULT_TRUNCATE,
			secure: true,
			offset: 0,
			mode: 0o600,
			length: null,
			fill: false,
			chunks: null,
			startChunk: 0,
			stopChunk: null,
			close: (typeof _path_fd === 'string')
		}, _options);

		if(typeof _options.autoClose === 'boolean')
		{
			_options.close = _options.autoClose;
			delete _options.autoClose;
		}
		else if(typeof _options.close !== 'boolean')
		{
			_options.close = (typeof _path_fd === 'string');
		}

		if(! (Number.isInt(_options.chunk) && _options.chunk > 0))
		{
			_options.chunk = CHUNK;
		}

		if(! Number.isInt(_options.offset))
		{
			_options.offset = 0;
		}

		if(! Number.isInt(_options.length))
		{
			_options.length = null;
		}

		if(! String.isEncoding(_options.encoding, false, true, false, false))
		{
			_options.encoding = null;
			hasEncoding = false;
		}
		else
		{
			hasEncoding = true;
		}

		if(typeof _options.fill !== 'boolean')
		{
			_options.fill = false;
		}

		if(! fs.isPerm(_options.mode))
		{
			_options.mode = null;
		}

		if(typeof _options.truncate !== 'boolean')
		{
			_options.truncate = DEFAULT_TRUNCATE;
		}

		if(typeof _options.secure !== 'boolean')
		{
			_options.secure = true;
		}

		if(! (Number.isInt(_options.chunks) && _options.chunks >= 0))
		{
			_options.chunks = null;
		}

		if(! (Number.isInt(_options.startChunk) && _options.startChunk >= 0))
		{
			_options.startChunk = 0;
		}

		if(! (Number.isInt(_options.stopChunk) && _options.stopChunk >= _options.startChunk))
		{
			_options.stopChunk = null;
		}

		if((_data = dataToUint8Array(_data)).length === 0)
		{
			return 0;
		}

		var size, handle;

		if(path.isValid(_path_fd))
		{
			_path_fd = path.resolve(_path_fd);

			if(fs.exists.file(_path_fd, null, true))
			{
				size = fs.size(handle = fs.openSync(_path_fd, 'r+'));
				_options.mode = null;
			}
			else if(! fs.exists(_path_fd, null, true))
			{
				fs.touch(_path_fd, null, size = _data.length, _options.mode);
				handle = fs.openSync(_path_fd, 'r+');
			}
			else if(_throw)
			{
				return x('Your path exists, but it ain\'t a file');
			}
			else
			{
				return null;
			}
		}
		else if(fs.isFile(_path_fd))
		{
			size = fs.size(handle = _path_fd);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting a % or an %)', null, '_path_fd', 'String', 'Integer');
		}
		else
		{
			return null;
		}

		if(_options.offset < 0)
		{
			if(size < 1)
			{
				_options.offset = 0;
			}
			else if((_options.offset = size + _options.offset) < 0)
			{
				_options.offset = 0;
			}
		}

		const checkLength = (_new_value) => {
			//
			if(Number.isInt(_new_value) || _new_value === null)
			{
				_options.length = _new_value;
			}

			//
			if(_options.length === null && _options.fill)
			{
				if((_options.length = (size - _options.offset)) < 0)
				{
					_options.length = (size + _options.length - _options.offset);
				}
			}

			if(_options.length === null)
			{
				if(_options.fill)
				{
					_options.length = (size - _options.offset);
				}
				else
				{
					_options.length = _data.length;
				}
			}

			if(_options.length !== null)
			{
				if(_options.length < 0)
				{
					_options.length = 0;
				}

				if(_options.length === 0 || _options.chunks === 0)
				{
					return 0;
				}
			}
			else
			{
				_options.length = _data.length;
			}

			return _options.length = Math._min(_options.length, _data.length);
		};

		checkLength();

		//
		if(size > _data.length && _options.truncate)
		{
			if(_options.secure)
			{
				fs.randomizeFile(handle, null, {
					truncate: false,
					offset: 0,
					length: size
				}, _throw);
			}
			else
			{
				fs.formatFile(handle, null, {
					truncate: false,
					offset: 0,
					length: size,
					radix: null
				}, _throw);
			}

			fs.ftruncateSync(handle, _options.length);
		}
		else
		{
			_options.truncate = null;
		}

		//
		var result = 0;
		var buffer = null;
		var written = null;
		var rest = _options.length;
		var min;
		var chunks = 0;
		var ignored = 0;
		var computedChunks = Math._min(_options.chunks, Math.ceil(_options.length / _options.chunk));
		var finish = false;
		var finishSent = false;

		//
		var STOP = false;

		const stop = () => {
			if(STOP)
			{
				return false;
			}

			return STOP = true;
		};

		const ev = {};

		Object.defineProperty(ev, 'CHANGEABLE', { enumerable: true, get: function()
		{
			return [ 'chunk', 'chunks', 'encoding', 'length', 'startChunk', 'stopChunk' ];
		}});

		Object.defineProperty(ev, 'stop', { value: stop, enumerable: true });

		Object.defineProperty(ev, 'chunk', { enumerable: true,
			get: function()
			{
				return _options.chunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value > 0)
				{
					return _options.chunk = _value;
				}

				return ev.chunk;
			}
		});

		Object.defineProperty(ev, 'chunks', { enumerable: true,
			get: function()
			{
				return _options.chunks;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.chunks = _value;
				}
				else if(_value === null)
				{
					return _options.chunks = _value;
				}

				return ev.chunks;
			}
		});

		Object.defineProperty(ev, 'encoding', { enumerable: true,
			get: function()
			{
				return _options.encoding;
			},
			set: function(_value)
			{
				if(_value === '')
				{
					_value = 'utf8';
				}

				if(_value === null)
				{
					return _options.encoding = _value;
				}
				else if(String.isEncoding(_value, false, true, false, false))
				{
					return _options.encoding = _value;
				}

				return ev.encoding;
			}
		});

		Object.defineProperty(ev, 'length', { enumerable: true,
			get: function()
			{
				return _options.length;
			},
			set: function(_value)
			{
				const orig = ev.length;
				const result = checkLength(_value);
				const diff = (result - orig);

				if(diff === 0)
				{
					return result;
				}
				else
				{
					rest += diff;
					computedChunks = Math._min(_options.chunks, Math.ceil(result / _options.chunk));
				}

				return result;
			}
		});

		Object.defineProperty(ev, 'startChunk', { enumerable: true,
			get: function()
			{
				return _options.startChunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.startChunk = _value;
				}

				return ev.startChunk;
			}
		});

		Object.defineProperty(ev, 'stopChunk', { enumerable: true,
			get: function()
			{
				return _options.stopChunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= _options.startChunk)
				{
					return _options.stopChunk = _value;
				}
				else if(_value === null)
				{
					return _options.stopChunk = _value;
				}

				return ev.stopChunk;
			}
		});

		Object.defineProperty(ev, 'byte', { enumerable: true, get: function()
		{
			return (result + _options.offset);
		}});

		Object.defineProperty(ev, 'computedChunks', { enumerable: true, get: function()
		{
			return computedChunks;
		}});

		Object.defineProperty(ev, 'data', { enumerable: true, get: function()
		{
			return _data;
		}});

		Object.defineProperty(ev, 'file', { enumerable: true, get: function()
		{
			return handle;
		}});

		Object.defineProperty(ev, 'fileSize', { enumerable: true, get: function()
		{
			return size;
		}});

		Object.defineProperty(ev, 'fill', { enumerable: true, get: function()
		{
			return _options.fill;
		}});

		Object.defineProperty(ev, 'mode', { enumerable: true, get: function()
		{
			return _options.mode;
		}});

		Object.defineProperty(ev, 'offset', { enumerable: true, get: function()
		{
			return _options.offset;
		}});

		Object.defineProperty(ev, 'path', { enumerable: true, get: function()
		{
			return (_path_fd === handle ? null : _path_fd);
		}});

		Object.defineProperty(ev, 'secure', { enumerable: true, get: function()
		{
			return _options.secure;
		}});

		Object.defineProperty(ev, 'truncate', { enumerable: true, get: function()
		{
			return _options.truncate;
		}});

		const getEventObjectElements = (_error = null, _event = ev) => {
			//
			_event.buffer = buffer;
			_event.bytes = result;
			_event.count = chunks;
			_event.error = _error;
			_event.finish = (_error === null ? finish : null);
			_event.ignoredChunks = ignored;
			_event.rest = rest;
			_event.size = min;
			_event.stopped = STOP;
			_event.written = written;

			//
			if(hasEncoding)
			{
				_event.string = String.fromUint8Array(buffer, _options.encoding);
			}
			else
			{
				_event.string = null;
			}

			//
			if(_event.finish)
			{
				finishSent = true;
			}

			//
			return _event;
		};
		
		const callback = (_error = null) => {
			if(! _callback)
			{
				return;
			}
			else
			{
				getEventObjectElements(_error, ev);
			}

			//
			return _callback(ev);
		};

		try
		{
			while(result < _options.length)
			{
				if(STOP)
				{
					break;
				}
				else if(finish)
				{
					break;
				}

				min = Math._min(_options.chunk, rest);

				if(ignored < _options.startChunk)
				{
					++ignored;

					result += min;
					rest -= min;
				}
				else
				{
					if(_callback)
					{
						buffer = _data.subarr(result + _options.offset, min);
						written = fs.writeSync(handle, buffer, 0, min, result + _options.offset);
					}
					else
					{
						written = fs.writeSync(handle, _data, result + _options.offset, min, result + _options.offset);
					}

					++chunks;

					result += written;
					rest -= written;
				}

				if(rest <= 0)
				{
					finish = true;
				}
				else if(_options.chunks !== null && chunks >= _options.chunks)
				{
					finish = true;
				}
				else if(_options.stopChunk !== null && (chunks + ignored) >= _options.stopChunk)
				{
					finish = true;
				}

				if(STOP)
				{
					break;
				}
				else if((chunks + ignored) >= _options.startChunk)
				{
					callback(null);
				}
			}

			if(_options.close)
			{
				fs.closeSync(handle);
			}
		}
		catch(_error)
		{
			if(_throw)
			{
				return x(_error);
			}
			else if(_callback)
			{
				callback(_error);
			}

			return null;
		}

		if(! finishSent && _callback)
		{
			_callback(Object.assign(getEventObjectElements(null), { stopped: STOP }));
		}

		return result;
	}

	//
	fs.readLine = function(_path_fd, _callback, _options, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		if(typeof _callback !== 'function')
		{
			_callback = null;
		}

		var hasEncoding;
		
		_options = Object.assign({
			chunk: CHUNK,
			chunks: null,
			encoding,
			startLine: 0,
			stopLine: null,
			startChunk: 0,
			stopChunk: null,
			lines: null,
			maxLineLength: null,
			length: null,
			offset: 0,
			backwards: false,
			close: (typeof _path_fd === 'string')
		}, _options);

		if(typeof _options.autoClose === 'boolean')
		{
			_options.close = _options.autoClose;
			delete _options.autoClose;
		}
		else if(typeof _options.close !== 'boolean')
		{
			_options.close = (typeof _path_fd === 'string');
		}

		if(! (Number.isInt(_options.chunk) && _options.chunk > 0))
		{
			_options.chunk = CHUNK;
		}

		if(! Number.isInt(_options.offset))
		{
			_options.offset = 0;
		}

		if(! Number.isInt(_options.length))
		{
			_options.length = null;
		}

		if(! Number.isInt(_options.lines))
		{
			_options.lines = null;
		}

		if(! (Number.isInt(_options.startLine) && _options.startLine >= 0))
		{
			_options.startLine = 0;
		}

		if(! (Number.isInt(_options.stopLine) && _options.stopLine >= _options.startLine))
		{
			_options.stopLine = null;
		}

		if(! (Number.isInt(_options.startChunk) && _options.startChunk >= 0))
		{
			_options.startChunk = 0;
		}

		if(! (Number.isInt(_options.stopChunk) && _options.stopChunk >= _options.startChunk))
		{
			_options.stopChunk = null;
		}

		if(! (Number.isInt(_options.chunks) && _options.chunks >= 0))
		{
			_options.chunks = null;
		}

		if(! (Number.isInt(_options.maxLineLength) && _options.maxLineLength > 0))
		{
			_options.maxLineLength = null;
		}

		if(typeof _options.backwards !== 'boolean')
		{
			_options.backwards = false;
		}

		if(! String.isEncoding(_options.encoding, false, true, false, false))
		{
			_options.encoding = null;
			hasEncoding = false;
		}
		else
		{
			hasEncoding = true;
		}

		var size, handle;

		if(path.isValid(_path_fd))
		{
			_path_fd = path.resolve(_path_fd);

			if(fs.exists.file(_path_fd, null, true))
			{
				size = fs.size(handle = fs.openSync(_path_fd, 'r'));
			}
			else if(_throw)
			{
				return x('Your path doesn\'t exist [as a file]');
			}
			else
			{
				return null;
			}
		}
		else if(fs.isFile(_path_fd))
		{
			size = fs.size(handle = _path_fd);
		}
		else if(_throw)
		{
			return x('Invalid % argument (expecting a % or an %)', null, '_path_fd', 'String', 'Integer');
		}
		else
		{
			return null;
		}

		if(_options.offset < 0)
		{
			if(size < 1)
			{
				_options.offset = 0;
			}
			else if((_options.offset = size + _options.offset) < 0)
			{
				_options.offset = 0;
			}
		}

		const checkLength = (_new_value) => {
			//
			if(Number.isInt(_new_value) || _new_value === null)
			{
				_options.length = _new_value;
			}

			//
			if(_options.length === null)
			{
				_options.length = (size - _options.offset);
			}

			if(_options.length < 0)
			{
				if((_options.length = (size + _options.length - _options.offset)) < 0)
				{
					_options.length = 0;
				}
			}

			if(size > 0 && (_options.length > (size - _options.offset)))
			{
				if((_options.length = (size - _options.offset)) < 0)
				{
					_options.length = 0;
				}
			}
			else if(size < 1)
			{
				_options.length = 0;
			}

			//
			return _options.length;
		};

		const origLength = _options.length;
		checkLength();

		if((Number.isInt(_options.chunks) && _options.chunks === 0) || (Number.isInt(_options.lines) && _options.lines === 0) || origLength === 0)
		{
			return 0;
		}

		//
		if(! _options.backwards)
		{
			if(_options.chunks !== null && _options.chunks < 0)
			{
				_options.backwards = true;
			}
			else if(_options.lines !== null && _options.lines < 0)
			{
				_options.backwards = true;
			}
		}

		if(_options.chunks !== null)
		{
			_options.chunks = Math.abs(_options.chunks);
		}

		if(_options.lines !== null)
		{
			_options.lines = Math.abs(_options.lines);
		}

		//
		var result = 0;
		var bytes = 0;
		var buffer = null;
		var read = null;
		var rest = _options.length;
		var min;
		var chunks = 0;
		var line = '';
		var last = null;
		var type = '';
		var search;
		var ignoredLines = 0;
		var ignoredChunks = 0;
		var counted = 0;
		var computedChunks = Math._min(_options.chunks, Math.ceil(_options.length / _options.chunk));
		var finish = false;
		var finishSent = false;
		var limitOverflow = 0;

		//
		var STOP = false;

		const stop = () => {
			if(STOP)
			{
				return false;
			}

			return STOP = true;
		}

		const ev = {};

		Object.defineProperty(ev, 'CHANGEABLE', { enumerable: true, get: function()
		{
			return [ 'chunk', 'chunks', 'encoding', 'length', 'lines', 'maxLineLength', 'startChunk', 'startLine', 'stopChunk', 'stopLine' ];
		}});

		Object.defineProperty(ev, 'stop', { value: stop, enumerable: true });

		Object.defineProperty(ev, 'chunk', { enumerable: true,
			get: function()
			{
				return _options.chunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value > 0)
				{
					return _options.chunk = _value;
				}

				return ev.chunk;
			}
		});

		Object.defineProperty(ev, 'chunks', { enumerable: true,
			get: function()
			{
				return _options.chunks;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.chunks = _value;
				}
				else if(_value === null)
				{
					return _options.chunks = _value;
				}

				return ev.chunks;
			}
		});

		Object.defineProperty(ev, 'encoding', { enumerable: true,
			get: function()
			{
				return _options.encoding;
			},
			set: function(_value)
			{
				if(_value === '')
				{
					_value = 'utf8';
				}

				if(_value === null)
				{
					return _options.encoding = _value;
				}
				else if(String.isEncoding(_value, false, true, false, false))
				{
					return _options.encoding = _value;
				}

				return ev.encoding;
			}
		});

		Object.defineProperty(ev, 'length', { enumerable: true,
			get: function()
			{
				return _options.length;
			},
			set: function(_value)
			{
				const orig = ev.length;
				const result = checkLength(_value);
				const diff = (result - orig);

				if(diff === 0)
				{
					return result;
				}
				else
				{
					rest += diff;
					computedChunks = Math._min(_options.chunks, Math.ceil(result / _options.chunk));
				}

				return result;
			}
		});

		Object.defineProperty(ev, 'lines', { enumerable: true,
			get: function()
			{
				return _options.lines;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.lines = _value;
				}
				else if(_value === null)
				{
					return _options.lines = _value;
				}

				return ev.lines;
			}
		});

		Object.defineProperty(ev, 'maxLineLength', { enumerable: true,
			get: function()
			{
				return _options.maxLineLength;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value > 0)
				{
					return _options.maxLineLength = _value;
				}
				else if(_value === null)
				{
					return _options.maxLineLength = _value;
				}

				return ev.maxLineLength;
			}
		});

		Object.defineProperty(ev, 'startChunk', { enumerable: true,
			get: function()
			{
				return _options.startChunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.startChunk = _value;
				}

				return ev.startChunk;
			}
		});

		Object.defineProperty(ev, 'startLine', { enumerable: true,
			get: function()
			{
				return _options.startLine;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= 0)
				{
					return _options.startLine = _value;
				}

				return ev.startLine;
			}
		});

		Object.defineProperty(ev, 'stopChunk', { enumerable: true,
			get: function()
			{
				return _options.stopChunk;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= _options.startChunk)
				{
					return _options.stopChunk = _value;
				}
				else if(_value === null)
				{
					return _options.stopChunk = _value;
				}

				return ev.stopChunk;
			}
		});

		Object.defineProperty(ev, 'stopLine', { enumerable: true,
			get: function()
			{
				return _options.stopLine;
			},
			set: function(_value)
			{
				if(Number.isInt(_value) && _value >= _options.startLine)
				{
					return _options.stopLine = _value;
				}
				else if(_value === null)
				{
					return _options.stopLine = _value;
				}

				return ev.stopLine;
			}
		});

		Object.defineProperty(ev, 'backwards', { enumerable: true, get: function()
		{
			return _options.backwards;
		}});

		Object.defineProperty(ev, 'byte', { enumerable: true, get: function()
		{
			return (bytes + _options.offset);
		}});

		Object.defineProperty(ev, 'computedChunks', { enumerable: true, get: function()
		{
			return computedChunks;
		}});

		Object.defineProperty(ev, 'file', { enumerable: true, get: function()
		{
			return handle;
		}});

		Object.defineProperty(ev, 'fileSize', { enumerable: true, get: function()
		{
			return size;
		}});

		Object.defineProperty(ev, 'offset', { enumerable: true, get: function()
		{
			return _options.offset;
		}});

		Object.defineProperty(ev, 'path', { enumerable: true, get: function()
		{
			return (_path_fd === handle ? null : _path_fd);
		}});

		const getEventObjectElements = (_error = null, _result, _from, _to, _event = ev) => {
			//
			if(hasEncoding)
			{
				line = line.encode(_options.encoding);
			}
			else
			{
				line = line.toUint8Array();
			}					

			//
			_event.buffer = buffer.clone();
			_event.bytes = bytes;
			_event.count = chunks;
			_event.countLines = result;
			_event.endLine = (result + _options.startLine);
			_event.eol = type;
			_event.error = _error;
			_event.finish = (_error === null ? finish : null);
			_event.from = _from;
			_event.ignoredChunks = ignoredChunks;
			_event.ignoredLines = ignoredLines;
			_event.limitOverflow = limitOverflow;
			_event.line = line;
			_event.read = read;
			_event.rest = rest;
			_event.size = min;
			_event.stopped = STOP;
			_event.to = _to;
			
			//
			if(hasEncoding)
			{
				_event.string = String.fromUint8Array(buffer, _options.encoding);
			}
			else
			{
				_event.string = null;
			}

			//
			if(size < 1)
			{
				_event.finish = true;
				finishSent = true;
			}
			else if(_event.finish)
			{
				finishSent = true;
			}
			
			//
			return _event;
		};
		
		const callback = (_error = null) => {
			//
			var from, to, started;

			if(size >= 1)
			{
				started = (ignoredLines >= (_options.startLine - 1));

				if(started)
				{
					++result;
				}
				else
				{
					++ignoredLines;
				}

				//
				var from, to;

				if(DEFAULT_READLINE_ALTERNATIVE_COUNTING)
				{
					from = counted + (line.length === 0 ? 0 : 1);
					counted += line.length;
					to = (line.length === 0 ? null : counted);
					counted += type.length;
				}
				else
				{
					from = counted;
					counted += line.length;
					to = counted;
					counted += type.length;
				}
			}
			else
			{
				from = to = null;
				started = true;
			}

			//
			var res;

			if(_callback && started)
			{
				//
				getEventObjectElements(_error, result, from, to, ev);

				//
				res = _callback(ev);
			}
			else
			{
				res = null;
			}

			//
			type = line = '';
			last = null;

			//
			return res;
		};

		//
		const appendToLine = (_value, _index) => {
			if(_options.maxLineLength !== null)
			{
				const diff = (_options.maxLineLength - (line.length + _value.length));

				if(diff < 0)
				{
					line += _value.substr(0, -diff);
					limitOverflow = -diff;
					callback(null);
					limitOverflow = 0;
					line = _value.removeFirst(-diff);
				}
			}

			line += _value;
			return line.length;
		};

		if(size === 0)
		{
			buffer = new Uint8Array(min = 0);
			read = 0;
			++chunks;
			finish = true;
			callback(null);
			return 0;
		}
		else try
		{
			if(_options.backwards) while(bytes < _options.length)
			{
throw new Error('TODO (backwards)');
			}
			else while(bytes < _options.length)
			{
				//
				if(STOP)
				{
					break;
				}
				else if(finish)
				{
					break;
				}

				//
				min = Math.min(_options.chunk, rest);

				if(ignoredChunks < _options.startChunk)
				{
					result += min;
					rest -= min;
					++ignoredChunks;
				}
				else
				{
					buffer = new Uint8Array(min);

					read = fs.readSync(handle, buffer, 0, min, bytes + _options.offset);
					const origBytes = bytes;

					if(read > 0)
					{
						//
						bytes += read;
						rest -= read;
						++chunks;

						//
						search = 0;

						if(last !== null)
						{
							if(last === 10)
							{
								if(buffer[0] === 13)
								{
									type = '\n\r';
									search = 1;
								}
								else
								{
									type = '\n';
								}
							}
							else if(last === 13)
							{
								if(buffer[0] === 10)
								{
									type = '\r\n';
									search = 1;
								}
								else
								{
									type = '\r';
								}
							}
							else
							{
								type = '';
							}

							last = null;

							if(type.length > 0)
							{
								callback(null);
							}
						}

						for(var i = search; i < min; ++i)
						{
							if(STOP)
							{
								break;
							}
							else if(finish)
							{
								break;
							}

							if(buffer[i] === 10)
							{
								if(i < (min - 1) && buffer[i + 1] === 13)
								{
									type = '\n\r';
									last = null;
									++i;
								}
								else
								{
									type = '\n';
									last = 10;
								}
							}
							else if(buffer[i] === 13)
							{
								if(i < (min - 1) && buffer[i + 1] === 10)
								{
									type = '\r\n';
									last = null;
									++i;
								}
								else
								{
									type = '\r';
									last = 13;
								}
							}
							else
							{
								type = '';
								last = null;
								appendToLine(String.fromCodePoint(buffer[i]));
							}

							if(i >= (min - 1) && rest <= 0)
							{
								finish = true;
							}
							else if(_options.lines !== null && result >= (_options.lines - 1))
							{
								finish = true;
							}
							else if((origBytes + i) >= _options.length)
							{
								finish = true;
							}
							else if(_options.stopChunk !== null && (chunks + ignoredChunks) >= _options.stopChunk)
							{
								finish = true;
							}
							else if(_options.stopLine !== null && (result + ignoredLines) >= (_options.stopLine - 1))
							{
								finish = true;
							}

							if(type.length > 0)
							{
								callback(null);
							}
						}
					}
				}

				//
				if(read === 0)
				{
					finish = true;
				}
				else if(rest <= 0)
				{
					finish = true;
				}
				else if(_options.chunks !== null && chunks >= _options.chunks)
				{
					finish = true;
				}
				else if(_options.lines !== null && result >= _options.lines)
				{
					finish = true;
				}
				else if(_options.stopChunk !== null && (chunks + ignoredChunks) >= _options.stopChunk)
				{
					finish = true;
				}
				else if(_options.stopLine !== null && (result + ignoredLines) >= _options.stopLine)
				{
					finish = true;
				}

				//
				if(finish && !finishSent)
				{
					callback(null);
				}

				//
				if(STOP || finish)
				{
					break;
				}
			}

			if(type.length > 0 || line.length > 0)
			{
				finish = true;
				callback(null);
			}

			if(_options.close)
			{
				fs.closeSync(handle);
			}
		}
		catch(_error)
		{
			if(_throw)
			{
				return x(_error);
			}
			else if(_callback)
			{
				callback(_error);
			}

			return null;
		}

		if(! finishSent && _callback)
		{
			_callback(Object.assign(getEventObjectElements(null, result, undefined, undefined), { stopped: STOP }));
		}

		return result;
	}

	//

})();

