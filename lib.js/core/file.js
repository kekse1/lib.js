(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_READ_ONLY = true;

	//
	FILE = module.exports = class FILE extends NODE
	{
		constructor(_options)
		{
			//
			super(_options);

			//
			if(this.file)
			{
				if(! fs.isFile(this.file))
				{
					delete this.options.file;
					delete this.options.path;

					if(this.path)
					{
						this.path = this.path;
					}
				}
			}
			else if(this.path)
			{
				this.path = this.path;
			}
		}

		static create(... _args)
		{
			const options = Object.assign(... _args);

			for(var i = 0; i < _args.length; ++i)
			{
				if(Object.isObject(_args[i]))
				{
					continue;//already above @ Object.assign(..._args);
				}
				else if(typeof _args[i] === 'boolean')
				{
					options.readOnly = _args[i];
				}
				else if(path.isValid(_args[i]))
				{
					options.path = _args[i];
				}
				else if(fs.isFile(_args[i]))
				{
					options.file = _args[i];
				}
			}

			return new this(options);
		}

		get readOnly()
		{
			if(typeof this.options.readOnly === 'boolean')
			{
				return this.options.readOnly;
			}

			return DEFAULT_READ_ONLY;
		}

		set readOnly(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.readOnly = _value;
			}
			else
			{
				delete this.options.readOnly;
			}

			return this.readOnly;
		}

		getFlags()
		{
			var result = 'r';

			if(! this.readOnly)
			{
				result += '+';
			}

			return result;
		}

		static getMode(_type)
		{
			const result = Object.null({
				directory: MODE_DIRECTORY,
				file: MODE_FILE
			});

			if(String.isString(_type))
			{
				if(_type in result)
				{
					return result[_type];
				}

				return undefined;
			}

			return result;
		}

		get file()
		{
			if(typeof this.options.file === 'number')
			{
				return this.options.file;
			}

			return null;
		}

		set file(_value)
		{
			const orig = this.file;

			if(_value === orig)
			{
				return _value;
			}
			else if(orig !== null)
			{
				this.closeFile(true, true);
			}

			if(fs.isFile(_value))
			{
				this.options.file = _value;
			}
			else
			{
				delete this.options.file;
			}
			
			return this.file;
		}

		get path()
		{
			if(typeof this.options.path === 'string')
			{
				return this.options.path;
			}

			return null;
		}

		set path(_value)
		{
			if(this.INIT)
			{
				if(typeof _value === 'string')
				{
					return this.options.path = this._path_init = _value;
				}

				return this.options.path;
			}
			else if(! path.isValid(_value))
			{
				_value = null;
			}
			else
			{
				_value = fs.resolve(_value);
			}

			const orig = this.path;

			if(_value === orig && !this._path_init)
			{
				return _value;
			}
			else
			{
				delete this._path_init;
			}

			if(this.file !== null)
			{
				this.closeFile(true, true);
			}

			if(_value === null)
			{
				delete this.options.path;
				return null;
			}

			if(this.readOnly && !this.checkPath(_value, true))
			{
				delete this.options.path;
				return null;
			}
			else
			{
				this.options.path = _value;
			}

			if(this.openFile(true, true, true, false) === null)
			{
				delete this.options.path;
				return null;
			}

			return this.path;

			//
			//TODO/
			//
			//maybe 'this.openDirectory()'...
			//or maybe CREATE, if !this.readOnly... so 'fs.touch()' or 'touchFile()' in here!! ;-)
			//AND: chmod(), if set...
			//
		}

		checkPath(_value, _existing = this.readOnly)
		{
			if(! path.isValid(_value))
			{
				return false;
			}
			else if(_existing && !fs.exists(_value, null, true))
			{
				return false;
			}

			return true;
		}

		closeFile(_apply = true, _throw = DEFAULT_THROW)
		{
			if(! this.file)
			{
				if(_throw)
				{
					return x('There\'s no file opened to close it');
				}

				return false;
			}
			else try
			{
				fs.closeSync(this.file);

				if(_apply)
				{
					delete this.options.file;
				}
			}
			catch(_error)
			{
				if(_apply)
				{
					delete this.options.file;
				}

				if(_throw)
				{
					return x(_error);
				}

				return false;
			}

			return true;
		}

		closeDirectory()
		{
throw new Error('TODO');
		}

		close()
		{
throw new Error('TODO');
		}

		openFile(_apply = true, _close = true, _mode_set = true, _throw = DEFAULT_THROW)
		{
			if(this.file)
			{
				if(_close)
				{
					this.close(true);
				}
				else if(_throw)
				{
					return x('There\'s already a file opened');
				}
				else
				{
					return null;
				}
			}
			else if(! this.path)
			{
				if(_throw)
				{
					return x('No path defined');
				}

				return null;
			}
			else if(! fs.exists.file(this.path, null, true))
			{
				if(_throw)
				{
					const otherType = fs.exists(this.path, null, true);
					return x('This file (%) doesn\'t exist' + (otherType ? ' as file'.bold + ' (it\'s a %)': ''), null, this.path, (otherType ? fs.type(this.path) : null));
				}

				return null;
			}

			var result;

			try
			{
				result = fs.openSync(this.path, this.getFlags(), FILE.getMode('file'));

				if(_apply)
				{
					this.options.file = result;
				}

				//fs.fchmodSync(result, FILE.getMode('file'));
			}
			catch(_error)
			{
				if(_apply)
				{
					delete this.options.file;
				}

				if(_throw)
				{
					return x(_error);
				}

				return null;
			}

			return result;
		}

		openDirectory()
		{
throw new Error('TODO');
		}

		open()
		{
throw new Error('TODO');
		}

		touchFile(_throw = DEFAULT_THROW)
		{
throw new Error('TODO');
		}

		touchDirectory(_recursive = DEFAULT_RECURSIVE, _throw = DEFAULT_THROW)
		{
throw new Error('TODO');
		}

		touch()
		{
throw new Error('TODO');
		}

		chmod(_mode, _throw = DEFAULT_THROW)
		{
			if(! (this.file || this.path))
			{
				if(_throw)
				{
					return x('Neither a % nor a % defined', null, 'path', 'file');
				}

				return false;
			}

			var type;

			if(this.file)
			{
				type = fs.type(this.file);
			}
			else if(fs.exists(this.path))
			{
				type = fs.type(this.path);
			}
			else if(_throw)
			{
				return x('No usable resource found/defined')
			}
			else
			{
				return false;
			}

			switch(type)
			{
				case 'directory':
					return this.chmodDirectory();
				case 'file':
					return this.chmodFile();
				default:
					return this.chmodOther();
			}

			return null;
		}

		chmodOther(_mode, _throw = DEFAULT_THROW)
		{
			if(_throw)
			{
				return x('TODO');
			}

			return false;
		}

		chmodDirectory(_mode, _throw = DEFAULT_THROW)
		{
throw new Error('TODO');//see 'fs.opendir*()' at < https://nodejs.org/dist/latest/docs/api/fs.html#fsopendirpath-options-callback >...
		}

		chmodFile(_mode, _throw = DEFAULT_THROW)
		{
			if(! (this.path || this.file))
			{
				if(_throw)
				{
					return x('There\'s no % nor % defined', null, 'path', 'file');
				}

				return false;
			}
			else if(! (fs.exists(this.path, null, true) || fs.isFile(this.file)))
			{
				if(_throw)
				{
					return x('This % or % doesn\'t exist', null, 'path', 'file');
				}

				return false;
			}
			else if(! fs.isPerm(_mode))
			{
				if(typeof (_mode = FILE.getMode('file')) === 'undefined')
				{
					if(_throw)
					{
						return x('No valid file % found (see %.%)', null, 'mode', 'FILE', 'getMode()');
					}

					return false;
				}
			}

			try
			{
				if(this.file)
				{
					fs.fchmodSync(this.file, _mode);
				}
				else
				{
					fs.chmodSync(this.path, _mode);
				}
			}
			catch(_error)
			{
				if(_throw)
				{
					return x(_error);
				}

				return false;
			}

			return true;
		}

		get fileType()
		{
throw new Error('TODO');//see 'fs.opendir*()' at < https://nodejs.org/dist/latest/docs/api/fs.html#fsopendirpath-options-callback >
			if(! this.file)
			{
				return '';
			}
			else if(true)
			{
				return 'file';
			}
			else if(false)
			{
				return 'directory';
			}
		}

		get chunk()
		{
			if(typeof this.options.chunk === 'number')
			{
				return this.options.chunk;
			}

			return CHUNK;
		}

		set chunk(_value)
		{
			if(Number.isInt(_value) && _value > 0)
			{
				return this.options.chunk = _value;
			}
			else
			{
				delete this.options.chunk;
			}

			return this.chunk;
		}

		get encoding()
		{
			if(typeof this.options.encoding === 'string' || this.options.encoding === null)
			{
				return this.options.encoding;
			}

			return encoding;
		}

		set encoding(_value)
		{
			if(String.isEncoding(_value, false, true, false, false))
			{
				return this.options.encoding = _value;
			}
			else
			{
				delete this.options.encoding;
			}

			return this.encoding;
		}

		chunkRead(_callback, _options, _throw = DEFAULT_THROW)
		{
			if(! (this.file || this.path))
			{
				return x('No file opened, and no path defined, so reading is not possible now');
			}
			else if(typeof _callback !== 'function')
			{
				_callback = null;
			}
			else
			{
				_options = Object.assign({
					chunk: this.chunk,
					encoding: this.encoding
				}, _options);
			}

			return fs.chunkRead(this.file || this.path, _callback, _options, _throw);
		}

		chunkWrite(_callback, _data, _options, _throw = DEFAULT_THROW)
		{
throw new Error('TODO');
		}

		readLine(_callback, _options, _throw = DEFAULT_THROW)
		{
throw new Error('TODO');
		}

		static format()
		{
throw new Error('TODO');
		}

		static randomize()
		{
throw new Error('TODO');
		}

		get size()
		{
			if(this.file)
			{
				return fs.size(this.file);
			}
			else if(this.path)
			{
				return fs.size(this.path);
			}

			return -1;
		}

		getIndex(_offset)
		{
			if(! Number.isInt(_offset))
			{
				return null;
			}

			const size = this.size;

			if(size <= 0)
			{
				return -1;
			}

			return getIndex(_offset, size);
		}

		offset(_offset, _throw = DEFAULT_THROW)
		{
			if(! (this.file || this.path))
			{
				if(_throw)
				{
					return x('No file opened, and no path defined; so reading is not possible here');
				}

				return null;
			}
			else if(Number.isInt(_offset))
			{
				const idx = this.getIndex(_offset);

				if(idx === null)
				{
					return null;
				}
				else if(idx < 0)
				{
					return { length: 0, offset: -1, line: 0, column: 0 };
				}
				
				_offset = idx;
			}
			else if(_throw)
			{
				return x('Invalid % argument (not a % %)', null, '_offset', '-/+', 'Integer');
			}
			else
			{
				return null;
			}

			var last = null;
			const result = { length: this.size, line: 0, column: 0, offset: -1 };

			const cb = (_event) => {
				var origColumn = result.column;
				const b = _event.buffer;
				const endLine = (_eol) => {
					origColumn = result.column;
					result.column = 0;
					++result.line;
				};

				if(b.length > 0 && result.line === 0)
				{
					result.line = 1;
				}
				
				for(var i = 0; i < b.length; ++i)
				{
					if(b[i] === 10)
					{
						if(last === 10)
						{
							--i;
							endLine();
							last = null;
						}
						else if(last === null && i === (b.length - 1))
						{
							last = 10;
						}
						else
						{
							if(b[i + 1] === 13)
							{
								++i;
							}

							endLine();
							last = null;
						}
					}
					else if(b[i] === 13)
					{
						if(last === 13)
						{
							--i;
							endLine();
							last = null;
						}
						else if(last === null && i === (b.length - 1))
						{
							last = 13;
						}
						else
						{
							if(b[i + 1] === 10)
							{
								++i;
							}

							endLine();
							last = null;
						}
					}
					else if(last !== null)
					{
						endLine();
						last = null;
					}
					else
					{
						++result.column;
					}

					if(++result.offset >= _offset)
					{
						_event.finish = true;
						_event.stop();
						break;
					}
				}

				if(last !== null)
				{
					endLine();
				}

				if(result.column === 0)
				{
					--result.line;
					result.column = origColumn;
				}
			};

			this.chunkRead(cb, { encoding: null });
			return result;
		}

		lines(_counts = false)
		{
throw new Error('TODO');
		}
	}

})();

