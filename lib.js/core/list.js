
	//
	//TODO/much implementation is already done in 'core/FILE'....
	//BUT some members are extended in here.. those should maybe stay (but use 'super' ;-) ...
	//

(function()
{

	//
	const DEFAULT_THROW = true;

	const DEFAULT_READ_ONLY = false;

	const DEFAULT_LOAD_TRY_JSON = false;
	const DEFAULT_LOAD_TYPED_ARRAY_TYPE = Uint8Array;

	const DEFAULT_STRICT = false;

	const DEFAULT_FAKE_RANDOM = false;
	const DEFAULT_FAKE_RADIX = 256;

	//
	if(typeof FILE === 'undefined')
	{
		require('core/file');
	}

	//
	LIST = module.exports = class LIST extends FILE
	{
		constructor(_options)
		{
			//
			super(_options);

			//
			if(typeof FIELD === 'undefined')
			{
				require('core/field');
			}

			//
			this.initialize();

			//
			if(! this.PROXY)
			{
				return this.PROXY = new Proxy(this, LIST.getProxyOptions(this));
			}
		}

		toString()
		{
			return 'list<' + this.carrierType + '(' + this.length + ')>';
		}

		getIndex(_index, _fallback = _index)
		{
			if(this.length === 0)
			{
				if(Array.isArray(_fallback, true))
				{
					return [ ... _fallback ];
				}

				return _fallback;
			}
			else if(typeof _index === 'bigint')
			{
				if(this.carrierType === 'file')
				{
					return getIndex(_index, BigInt.from(8 * this.length));
				}

				const bits = this.carrierBits;

				if(bits === 0)
				{
					return getIndex(Number.from(_index / 8n), this.length);
				}

				return getIndex(_index, BigInt.from(bits * this.length));
			}
			else if(! Number.isNumber(_index))
			{
				return x('Invalid % argument (not a %)', null, '_index', 'Number');
			}

			return getIndex(_index, this.length);
		}

		static parseProperty(_string, _type, _throw = DEFAULT_THROW)
		{
			const result = FIELD.parseProperty(_string, _type, _throw);

			if(result === null)
			{
				return null;
			}
			else
			{
				result.form = 'list';

				if('coordinates' in result)
				{
					result.index = result.coordinates[0];
					delete result.coordinates;
				}
			}

			//
			return result;
		}

		static format(_item, _length, _perms, _throw = DEFAULT_THROW)
		{
			//
			if(path.isValid(_item) || fs.isFile(_item))
			{
				return LIST.formatFile(_item, _length, _perms, _throw);
			}
			else if(LIST.checkForArray(_item, true, true))
			{
				return LIST.formatArray(_item, _length, _throw);
			}
			else if(_throw)
			{
				return x('Invalid % argument');
			}

			return null;
		}

		static formatFile(_path_handle, _length, _perms, _throw = DEFAULT_THROW)
		{
			if(! (path.isValid(_path_handle) || fs.isFile(_path_handle)))
			{
				return x('Invalid % argument (neither a path % nor a file descriptor %)', null, '_path_handle', 'String', 'Integer');
			}
			else if(typeof _throw !== 'boolean')
			{
				_throw = DEFAULT_THROW;
			}

			if(! Number.isInt(_length) && _length >= 0)
			{
				return x('Invalid % argument (expecting a positive %)', null, '_length', 'Integer');
			}
			else if(! fs.isPerm(_perms))
			{
				_perms = LIST.perms.file;
			}
		}

		static formatArray(_class_instance, _length, _throw = DEFAULT_THROW)
		{
			if(! LIST.checkForArray(_class_instance, true, true))
			{
				return x('Invalid % argument (no % or %, neither class nor instance)', null, '_class_instance', 'Array', 'TypedArray');
			}
			else if(typeof _throw !== 'boolean')
			{
				_throw = DEFAULT_THROW;
			}

			if(! Number.isInt(_length) && _length >= 0)
			{
				return x('Invalid % argument (expecting a positive %)', null, '_length', 'Integer');
			}
		}

		useIndex(_index, _throw = true)
		{
			if(Number.isInt(_index))
			{
				return [ this.getIndex(_index), 0 ];
			}
			else if(typeof _index === 'bigint')
			{
				_index = this.getIndex(_index);

				if(typeof _index === 'number')
				{
					return [ _index, 0 ];
				}

				var rest;

				if(this.carrierType === 'file')
				{
					rest = Number.from(_index % 8n);
				}
				else
				{
					const t = this.arrayType;

					if(t.length === 0 || t === 'Array')
					{
						rest = null;
					}
					else
					{
						rest = Number.from(_index % BigInt.from(this.array.BITS_PER_ELEMENT));
					}
				}

				return [ _index, rest ];
			}

			return x('Invalid % (neither % nor %)', null, 'index', 'Integer', 'BigInt');
		}

		getBit(_index, _size = 1, _count = 1)
		{
			const [ index, rest ] = this.useIndex(_index);
dir({index,rest,_index,_size,_count}, '.getBit()');
		}

		getBigInt(_index, _size = 1, _count = 1)
		{
			const [ index, rest ] = this.useIndex(_index);
dir({index,rest,_index,_size,_count}, '.getBigInt()');
		}

		getNumber(_index, _size = 1, _count = 1)
		{
			const [ index, rest ] = this.useIndex(_index);
dir({index,rest,_index,_size,_count}, '.getNumber()');
		}

		getValue(_index, _size = 1, _count = 1)
		{
			const [ index, rest ] = this.useIndex(_index);
dir({index,rest,_index,_size,_count}, '.getValue()');

		}

		setValue(_index, _value)
		{
			const [ index, rest ] = this.useIndex(_index);
dir({index,rest,_index,_value}, '.setValue()');
		}

		get(_string_or_request, _original, _has = false, _throw = DEFAULT_THROW)
		{
			//
			var request;

			if(typeof _string_or_request === 'string')
			{
				request = LIST.parseProperty(_string_or_request, 'get', _throw);
			}
			else if(Object.isObject(_string_or_request))
			{
				request = _string_or_request;
			}
			else
			{
				request = null;
			}

			if(! request)
			{
				if(_throw)
				{
					return x('No valid % or % specified, or it couldn\'t be parsed (\'%\')', null, 'String', 'Request', _original);
				}

				return null;
			}
			else if(_has)
			{
				return true;
			}
			else
			{
				request.index = this.getIndex(request.index);
			}

			switch(request.type)
			{
				case 'bit':
					return this.getBit(request.index, request.size, request.count);
				case 'number':
					return this.getNumber(request.index, request.size, request.count);
				case 'bigint':
					return this.getBigInt(request.index, request.size, request.count);
				case '':
					return this.getValue(request.index, request.size, request.count);
			}

			return undefined;
		}

		set(_string_or_request, _original, _value, _throw = DEFAULT_THROW)
		{
			//
			var request;

			if(typeof _string_or_request === 'string')
			{
				request = LIST.parseProperty(_string_or_request, 'set', _throw);
			}
			else if(Object.isObject(_string_or_request))
			{
				request = _string_or_request;
			}
			else
			{
				request = null;
			}

			if(! request)
			{
				if(_throw)
				{
					return x('No valid % or % specified, or it couldn\'t be parsed (\'%\')', null, 'String', 'Request', _original);
				}

				return null;
			}
			else
			{
				request.index = this.getIndex(request.index);
			}

			return this.setValue(request.index, _value);
		}


		static getProxyOptions(_this = this)
		{
			//
			const result = {};

			//
			result.get = (_target, _property, _receiver) => {
				const original = _property;

				if(_property in _target)
				{
					return _target[_property];
				}
				else if((_property = LIST.parseProperty(_property, 'get', DEFAULT_THROW)) === null)
				{
					return undefined;
				}
				else
				{
					_property.index = _target.getIndex(_property.index);
				}

				return _target.get(_property, original, false, DEFAULT_THROW);
			};

			// NEEDS to return a boolean type!
			result.set = (_target, _property, _value, _receiver) => {
				const original = _property;

				if(_property in _target)
				{
					_target[_property] = _value;
					return true;
				}
				else if((_property = LIST.parseProperty(_property, 'set', DEFAULT_THROW)) === null)
				{
					if(FIELD.maybeIndexProperty(_property))
					{
						return false;
					}

					_target[original] = _value;
					return true;
				}
				else
				{
					_property.index = _target.getIndex(_property.index);
				}

				return _target.set(_property, original, _value, DEFAULT_THROW);
			};

			// "if(_property in _target)"
			result.has = (_target, _property) => {
				const original = _property;

				if(_property in _target)
				{
					return true;
				}
				else if((_property = LIST.parseProperty(_property, 'get', DEFAULT_THROW)) === null)
				{
					return null;
				}
				else
				{
					_property.index = _target.getIndex(_property.index);
				}

				return _target.get(_property, original, true, DEFAULT_THROW);
			};

			// "getOwnPropertyNames()", "getOwnPropertySymbols()", ..
			result.ownKeys = (_target) => {
				//const result = [];
				return Object.getOwnProperties(_target, false, false);
			};

			//
			return result;
		}

		static checkForArray(_item, _class = true, _instance = true)
		{
			if(_class)
			{
				if(Array.isArrayClass(_item, true))
				{
					return true;
				}
			}

			if(_instance)
			{
				if(Array.isArray(_item, true, true, false))
				{
					return true;
				}
			}

			return false;
		}

		static createFromFile(_path, _type, ... _args)
		{
			if(! (path.isValid(_path) || (Number.isInt(_path) && _path >= 0)))
			{
				return x('Invalid % argument (not a valid path %, nor a file handle %)', null, '_path', 'String', 'Integer');
			}
			else if(! LIST.checkForArray(_type, true, false))
			{
				_type = DEFAULT_LOAD_TYPED_ARRAY_TYPE;
				//return x('Invalid % argument (expecting the class of an % or %)', null, '_type', 'Array', 'TypedArray');
			}

			return this.create(... _args, { array: _path, arrayType: _type });
		}

		static create(... _args)
		{
			const options = {};

			for(var i = 0; i < _args.length; ++i)
			{
				if(typeof _args[i] === 'boolean')
				{
					options.readOnly = _args[i];
				}
				else if(path.isValid(_args[i]))
				{
					options.path = _args[i];
				}
				else if(Object.isObject(_args[i], false))
				{
					options.assign(_args[i]);
				}
				else if(LIST.checkForArray(_args[i]))
				{
					options.array = _args[i];
				}
				else if(Number.isInt(_args[i]) && _args[i] > 0)
				{
					options.length = _args[i];
				}
			}

			if(! Number.isInt(options.length))
			{
				if(LIST.checkForArray(options.array, false, true))
				{
					options.length = options.array.length;
				}
				else if(Array.isArray(options.dimensions, false))
				{
					options.length = FIELD.getLength(... options.dimensions);
				}
				else
				{
					options.length = 0;
				}
			}

			if(path.isValid(options.path))
			{
				options.path = path.resolve(options.path);
				delete options.array;
			}
			else if(path.isValid(options.array))
			{
				options.array = path.resolve(options.array);
				delete options.path;
			}
			else if(Number.isInt(options.path) && options.path >= 0)
			{
				options.file = options.path;
				delete options.array;
				delete options.path;
			}
			else if(Number.isInt(options.array) && options.array >= 0)
			{
				delete options.path;
			}
			else
			{
				delete options.path;
			}

			//
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
				//
				//TODO/
				//.. if already opened r/w, re-open r-only..
				//
				return this.options.readOnly = _value;
			}

			return this.readOnly;
		}

		get carrierLength()
		{
			if(this.hasCarrier)
			{
				const array = this.arrayLength;

				if(array !== 0)
				{
					return array;
				}

				return this.fileLength;
			}

			return 0;
		}

		set carrierLength(_value)
		{
			if(Number.isInt(_value) && this.hasCarrier)
			{
				return this.truncate(_value);
			}

			return this.carrierLength;
		}

		get arrayLength()
		{
			const array = this.array;

			if(array)
			{
				return array.length;
			}

			return 0;
		}

		set arrayLength(_value)
		{
			if(Number.isInt(_value) && this.array !== null)
			{
				return this.truncateArray(_value);
			}

			return this.arrayLength;
		}

		get fileLength()
		{
			const file = this.file;

			if(file === null)
			{
				return 0;
			}

			return fs.size(file);
		}

		set fileLength(_value)
		{
			if(Number.isInt(_value) && this.file !== null)
			{
				return this.truncateFile(_value);
			}

			return this.fileLength;
		}

		get length()
		{
			var result = this.carrierLength;

			if(result === 0 && Number.isInt(this.options.length) && this.options.length >= 0)
			{
				return this.options.length;
			}

			return result;
		}

		set length(_value)
		{
			if(Number.isInt(_value))
			{
				if(this.hasCarrier)
				{
					return this.truncate(_value);
				}

				return this.options.length = _value;
			}
			else
			{
				delete this.options.length;
			}

			return this.length;
		}

		get bitLength()
		{
			return (BigInt.from(this.length) * 8n);
		}

		//set bitLength(_value)

		get fakeRandom()
		{
			if(typeof this.options.fakeRandom === 'boolean')
			{
				return this.options.fakeRandom;
			}

			return DEFAULT_FAKE_RANDOM;
		}

		set fakeRandom(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.fakeRandom = _value;
			}
			else
			{
				delete this.options.fakeRandom;
			}

			return this.fakeRandom;
		}

		get fakeRadix()
		{
			if(typeof this.options.fakeRadix === 'number' || typeof this.options.fakeRadix === 'string')
			{
				return this.options.fakeRadix;
			}

			return DEFAULT_FAKE_RADIX;
		}

		set fakeRadix(_value)
		{
			if(isRadix(_value, false))
			{
				return this.options.fakeRadix = _value;
			}
			else
			{
				delete this.options.fakeRadix;
			}

			return this.fakeRadix;
		}

		get carrierType()
		{
			if(this.array !== null)
			{
				return 'array';
			}
			else if(this.file !== null)// || this.path !== null)
			{
				return 'file';
			}
			else if(this.path !== null)
			{
				return x('Please .% first for your .% \'%\'', null, 'openFile()', 'path', this.path);
			}

			return 'null';
		}

		get carrier()
		{
			if(this.file !== null)
			{
				return this.file;
			}
			else if(this.path !== null)
			{
				return this.path;
			}
			else if(LIST.checkForArray(this.options.array, false, true))
			{
				return this.options.array;
			}
			else if(LIST.checkForArray(this.options.array, true, false))
			{
				return x('Your % or % needs to be instanciated first', null, 'Array', 'TypedArray');
			}

			return null;
		}

		set carrier(_value)
		{
			if(LIST.checkForArray(_value, true, true))
			{
				return this.array = _value;
			}
			else if(Number.isInt(_value))
			{
				return this.file = _value;
			}
			else if(path.isValid(_value))
			{
				return this.path = _value;
			}

			return null;
		}

		get array()
		{
			if(this.options.array)
			{
				return this.options.array;
			}

			return null;
		}

		set array(_value)
		{
			if(this.__INIT)
			{
				return this.options._array = _value;
			}

			var tryOut;

			if(path.isValid(_value))
			{
				tryOut = _value;
			}
			else if(Number.isInt(_value) && _value >= 0)
			{
				tryOut = _value;
			}
			else
			{
				tryOut = null;
			}

			if(tryOut !== null && fs.exists.file(tryOut, null, true))
			{
				const tryJSON = true;//DEFAULT_LOAD_TRY_JSON
				const type = (LIST.checkForArray(this.options.arrayType, true, false) ? this.options.arrayType : DEFAULT_LOAD_TYPED_ARRAY_TYPE);
				this.options.length = (_value = this.options.array = this.loadArrayFromFile(_value, null, type, this.chunk, tryJSON, false, true)).length;
				delete this.options.arrayType;
			}

			if(LIST.checkForArray(_value, true, false))
			{
				var length;

				if(Number.isInt(this.options.length))
				{
					length = this.options.length;
				}
				else if((this instanceof FIELD) && this.dimensions.length > 0)
				{
					length = this.getLength();
				}
				else
				{
					length = 0;
				}

				this.options.array = new _value(this.options.length = length);
			}
			else if(LIST.checkForArray(_value, false, true))
			{
				this.options.length = _value.length;
				this.options.array = _value;
			}
			else
			{
				return null;
			}

			if(this.file !== null)
			{
				this.closeFile();
			}

			this.options._cache = null;
			return this.options.array;
		}

		get arrayClass()
		{
			const array = this.array;

			if(array === null)
			{
				return null;
			}

			return array.constructor;
		}

		get arrayType()
		{
			const array = this.array;

			if(array === null)
			{
				return '';
			}

			return array.constructor.name;
		}

		set arrayType(_value)
		{
			if(this.__INIT)
			{
				return this.options.arrayType = _value;
			}

			this.toArray(_value, DEFAULT_STRICT, true, DEFAULT_THROW);
		}

		get hasCarrier()
		{
			return (this.hasFileCarrier || this.hasArrayCarrier);
		}

		get hasFileCarrier()
		{
			return (this.file !== null);
		}

		get hasArrayCarrier()
		{
			return (this.array !== null);
		}

		get hasNumericCarrier()
		{
			return (this.carrierBits > 0);
		}

		get hasRegularCarrier()
		{
			const array = this.array;

			if(array === null)
			{
				return false;
			}

			return (array.constructor.name === 'Array');
		}

		get carrierBits()
		{
			if(this.file !== null)
			{
				return 8;
			}

			const array = this.array;

			if(array === null)
			{
				return 0;
			}
			else if(array.constructor.name === 'Array')
			{
				return 0;
			}

			return array.BITS_PER_ELEMENT;
		}

		get carrierBytes()
		{
			if(this.file !== null)
			{
				return 1;
			}

			const array = this.array;

			if(array === null)
			{
				return 0;
			}
			else if(array.constructor.name === 'Array')
			{
				return 0;
			}

			return array.BYTES_PER_ELEMENT;
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
			if(Number.isInt(_value))
			{
				const orig = this.file;
				delete this.options.array;

				if(orig !== _value)
				{
					if(fs.exists.file(_value))
					{
						this.options.file = _value;
						this.resetCache();
					}
					else
					{
						return x('This file doesn\'t exist');
					}
				}
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
			if(String.isString(_value) && path.isValid(_value))
			{
				const orig = this.path;
				this.options.path = path.resolve(_value);

				if(! this.__INIT && orig !== this.options.path)
				{
					this.openFile(true);
				}

				return this.options.path;
			}
			else if(this.file !== null)
			{
				this.closeFile();
				delete this.options.path;
			}

			return this.path;
		}

		static get perms()
		{
			return { file: 0o600, directory: 0o700 };
		}

		initialize()
		{
			//
			if(this.__INIT)
			{
				return x('The .% member function is defined to do the rest AFTER intial creation', null, 'initialize()');
			}

			//
			if('_array' in this.options)
			{
				this.array = this.options._array;
				delete this.options._array;
			}
			else if(this.file !== null)
			{
				return true;
			}
			else if(this.path !== null)
			{
				delete this.options.array;
				delete this.options._array;

				this.openFile(true, true);
			}
			else if(LIST.checkForArray(this.options.array, true, false))
			{
				this.array = this.options.array;
			}
			else
			{
				delete this.options.array;
				delete this.options._array;
				delete this.options.file;
				delete this.options.path;

				return false;
			}

			//
			this.resetCache();

			//
			return true;
		}

		closeFile(_throw = DEFAULT_THROW)
		{
			if(this.file === null)
			{
				if(_throw)
				{
					return x('No file open');
				}

				return false;
			}

			try
			{
				fs.closeSync(this.file);
				delete this.options.file;
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

		openFile(_close = false, _force = false, _throw = DEFAULT_THROW)
		{
			if(this.hasCarrier && !_force)
			{
				if(_throw)
				{
					return x('There\'s already a carrier defined, so please use % = %', null, '_force', true);
				}

				return null;
			}
			else if(this.path === null)
			{
				if(_throw)
				{
					return x('No .% defined', null, 'path');
				}

				return null;
			}
			else if(this.file !== null)
			{
				if(_close)
				{
					fs.closeFile(_throw);
				}
				else if(_throw)
				{
					return x('A file is already open');
				}
				else
				{
					return null;
				}
			}
			else if(! fs.exists(this.path, null, true))
			{
				if(this.readOnly)
				{
					return x('The file (%) doesn\'t exist, and can\'t be created due to .% == %', null, this.path, 'readOnly', true);
				}

				this.touchFile(_throw);
			}

			const flags = (this.readOnly ? 'r' : 'r+');
			var result;

			try
			{
				this.options.length = fs.size(result = fs.openSync(this.path, flags, LIST.perms.file));
				delete this.options.array;
			}
			catch(_error)
			{
				if(_throw)
				{
					return x(_error);
				}
				else
				{
					result = null;
				}

				result = null;
			}

			delete this.options.file;

			if(result === null)
			{
				return result;
			}
			else
			{
				this.options.file = result;
			}

			return result;
		}

		checkReadOnly(_throw = DEFAULT_THROW)
		{
			if(! this.readOnly)
			{
				return false;
			}
			else if(_throw)
			{
				return x('The .% mode is enabled, so this action is not allowed', null, 'readOnly');
			}

			return true;
		}

		touchFile(_throw = DEFAULT_THROW)
		{
			if(this.file !== null)
			{
				if(_throw)
				{
					return x('Your file is already open');
				}

				return false;
			}
			else if(this.path === null)
			{
				if(_throw)
				{
					return x('No .% defined, so no file can be touched', null, 'path');
				}

				return false;
			}
			else
			{
				if(this.checkReadOnly(_throw))
				{
					return false;
				}
			}

			var length;

			if(Number.isInt(this.options.length))
			{
				length = Math.abs(this.options.length);
			}
			else
			{
				length = this.options.length = 0;
			}

			return fs.touch(this.path, null, length);
		}

		chmodFile(_throw = DEFAULT_THROW)
		{
			if(this.checkReadOnly(_throw))
			{
				return false;
			}
			else try
			{
				if(this.file !== null)
				{
					fs.fchmodSync(this.file, LIST.perms.file);
				}
				else if(this.path !== null)
				{
					fs.chmodSync(this.path, LIST.perms.file);
				}
				else if(_throw)
				{
					return x('Neither .% nor .%', null, 'file', 'path');
				}
				else
				{
					return false;
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

		truncate(_length, _throw = DEFAULT_THROW)
		{
			if(this.checkReadOnly(_throw))
			{
				return false;
			}
			else if(this.file !== null || this.path !== null)
			{
				return this.truncateFile(_length, _throw);
			}
			else if(this.array !== null)
			{
				return this.truncateArray(_length, _throw);
			}
			else if(_throw)
			{
				return x('No carrier');
			}

			return -1;
		}

		truncateFile(_length, _throw = DEFAULT_THROW)
		{
			if(this.checkReadOnly(_throw))
			{
				return false;
			}

			const pathTruncate = (_path) => {
				try
				{
					fs.truncateSync(_path, _length);
				}
				catch(_error)
				{
					if(_throw)
					{
						return x(_error);
					}

					return -1;
				}

				return this.options.length = fs.size(_path);
			};

			const fileTruncate = (_file) => {
				try
				{
					fs.ftruncateSync(_file, _length);
				}
				catch(_error)
				{
					if(_throw)
					{
						return x(_error);
					}

					return -1;
				}

				return this.options.length = fs.size(_file);
			};

			if(! Number.isInt(_length))
			{
				if(_throw)
				{
					return x('Invalid % argument (not an %)', null, '_length', 'Integer');
				}

				_length = 0;
			}
			else if(_length < 0)
			{
throw new Error('TODO (same behavior as for array.setLength() w/ negative values)');
			}

			if(this.file !== null)
			{
				return fileTruncate(this.file);
			}
			else if(this.path !== null)
			{
				return pathTruncate(this.path);
			}
			else if(_throw)
			{
				return x('Neither .% nor .% available', null, 'file', 'path');
			}

			return -1;
		}

		truncateArray(_length, _throw = DEFAULT_THROW)
		{
			if(this.checkReadOnly(_throw))
			{
				return false;
			}

			const regularTruncate = () => {
				try
				{
					this.options.array = this.options.array.setLength(_length);
				}
				catch(_error)
				{
					if(_throw)
					{
						return x(_error);
					}

					return -1;
				}

				return this.options.length = this.options.array.length;
			};

			const numericTruncate = () => {
				try
				{
					this.options.array = this.options.array.setLength(_length);
				}
				catch(_error)
				{
					if(_throw)
					{
						return x(_error);
					}

					return -1;
				}

				return this.options.length = this.options.array.length;
			};

			if(! Number.isInt(_length))
			{
				if(_throw)
				{
					return x('Invalid % argument (not an %)', null, '_length', 'Integer');
				}

				_length = 0;
			}

			const array = this.array;

			if(array === null)
			{
				if(_throw)
				{
					return x('No array carrier');
				}

				return -1;
			}
			else if(array.constructor.name === 'Array')
			{
				return regularTruncate();
			}

			return numericTruncate();
		}

		//
		reset()
		{
			//
			if(! this.__INIT)
			{
				this.resetCache();
			}

			//
			return super.reset();
		}

		resetCache()
		{
			if(this.file !== null && this.path !== null)
			{
				return this._cache = null;
			}

			return this._cache = {
				byteOffset: {
					read: null,
					write: null
				}
			};
		}

		//
		write(_offset, _value, _throw = DEFAULT_THROW)
		{
			if(this.checkReadOnly(_throw))
			{
				return 0;
			}

			if(typeof _offset === 'bigint')
			{
				//const [ index, rest ] = this.useIndex(_index);
				//and these functions???
			}
			else if(Number.isNumber(_offset))
			{
				_offset = this.getIndex(_offset);
			}
			else
			{
				return x('Invalid % argument (expecting an % or %)', null, '_offset', 'Integer', 'BigInt');
			}

			if(String.isString(_value))
			{
				return this.writeBits(_offset, _value);
			}
			else if(isNumeric(_value))
			{
				return this.writeNumeric(_offset, _value);
			}
			else
			{
				return this.writeValue(_offset, _value);
			}
		}

		read(_offset, _bits, _count = 1, _throw = DEFAULT_THROW)
		{
			if(typeof _offset === 'bigint')
			{
				//const [ index, rest ] = this.useIndex(_offset);
				//and the other functions for get/set!???
			}
			else if(Number.isNumber(_offset))
			{
				_offset = this.getIndex(_offset);
			}
		}

		writeBits(_offset, _value, _throw = DEFAULT_THROW)
		{
			if(! this.hasCarrier)
			{
				return this.fakeWrite('bit', ... arguments);
			}

			if(this.checkReadOnly(_throw))
			{
				return 0;
			}
			else if(! this.hasCarrier)
			{
				if(_throw)
				{
					return x('No carrier');
				}

				return 0;
			}
		}

		readBits(_offset, _count = 1, _throw = DEFAULT_THROW)
		{
			if(! this.hasCarrier)
			{
				return this.fakeRead('bit', ... arguments);
			}

			if(! this.hasNumericCarrier)
			{
				if(_throw)
				{
					return x('No numeric carrier');
				}

				return null;
			}
		}

		writeNumerics(_offset, _value, _throw = DEFAULT_THROW)
		{
			if(! this.hasCarrier)
			{
				return this.fakeWrite('numeric', ... arguments);
			}

			if(this.checkReadOnly(_throw))
			{
				return null;
			}
			else if(! this.hasCarrier)
			{
				if(_throw)
				{
					return x('No carrier');
				}

				return null;
			}

			/*switch(this.carrier)
			{
				case 'file':
					return this.writeByteToFile();
				case 'array':
					return this.writeByteToArray();
			}*/
		}

		readNumerics(_offset, _bits, _count = 1, _throw = DEFAULT_THROW)
		{
			if(! this.hasCarrier)
			{
				return this.fakeRead('numeric', ... arguments);
			}

			if(! this.hasNumericCarrier)
			{
				if(_throw)
				{
					return x('No numeric carrier');
				}

				return null;
			}

			//
			/*switch(this.carrier)
			{
				case 'file':
					return this.readByteFromFile();
				case 'array':
					return this.readByteFromArray();
			}*/
		}

		writeValues(_offset, _value, _throw = DEFAULT_THROW)
		{
			if(! this.hasCarrier)
			{
				return this.fakeWrite('value', ... arguments);
			}

			if(this.checkReadOnly(_throw))
			{
				return null;
			}
			else if(! this.hasRegularCarrier)
			{
				if(_throw)
				{
					return x('No regular carrier');
				}

				return null;
			}
		}

		readValues(_offset, _count = 1, _throw = DEFAULT_THROW)
		{
			if(! this.hasCarrier)
			{
				return this.fakeRead('value', ... arguments);
			}

			if(! this.hasCarrier)
			{
				if(_throw)
				{
					return x('No carrier');
				}

				return null;
			}
		}

		fakeRead(_type, _count = 1, _throw = DEFAULT_THROW)
		{
			switch(_type)
			{
				case 'value':
					break;
				case 'numeric':
					break;
				case 'bit':
					break;
			}
		}

		//simple 'echo'! ;-D ...
		fakeWrite(_value, _throw = DEFAULT_THROW)
		{
			return _value;
		}

		//
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

		//
		saveArrayToFile(_path, _callback, _overwrite = false, _perms = LIST.perms.file, _chunk = this.chunk, _throw = DEFAULT_THROW)
		{
			if(typeof _throw !== 'boolean')
			{
				_throw = DEFAULT_THROW;
			}

			if(! (Number.isInt(_chunk) && _chunk > 0))
			{
				_chunk = this.chunk;
			}

			if(! fs.isPerm(_perms))
			{
				_perms = LIST.perms.file;
			}

			if(typeof _overwrite !== 'boolean')
			{
				_overwrite = false;
			}

			if(typeof _callback !== 'function')
			{
				_callback = null;
			}

			if(! path.isValid(_path))
			{
				return x('No valid % defined', null, '_path');
			}
			else if(fs.exists(_path) && !_overwrite)
			{
				return x('File already exists, so please do % = %', null, '_overwrite', true);
			}

			var data;
			var typed;

			if(this.hasNumericCarrier)
			{
				data = new Uint8Array(this.array.buffer);
				typed = true;
			}
			else if(this.hasRegularCarrier)
			{
				try
				{
					data = JSON.stringify(this.array);
					typed = false;
				}
				catch(_error)
				{
					return x('Your % carrier couldn\'t be serialized (by %.%)', null, 'Array', 'JSON', 'stringify()');
				}
			}
			else
			{
				return x('If you have a %, it ain\'t a regular % nor a numeric %', null, 'carrier', 'Array', 'TypedArray');
			}

			try
			{
				const callback = (_event) => {
					if(_event.error)
					{
						_callback({
							error: _event.error,
							chunk: _chunk,
							mode: _perms,
							path: _path
						});
					}
					else if(_event.finish)
					{
						_callback({
							error: null,
							chunks: _event.chunks,
							bytes: _event.bytes,
							chunk: _chunk,
							mode: _perms,
							path: _path
						});
					}
				};

				return fs.chunkWrite(_path, data, {
					chunk: _chunk,
					mode: _perms,
					overwrite: _overwrite,
					truncate: true,
					encoding: (typed ? null : encoding)
				}, (_callback ? callback : null), _throw);
			}
			catch(_error)
			{
				if(_throw)
				{
					return x(_error);
				}
			}

			return 0;
		}

		loadArrayFromFile(_path_fd, _callback, _type = this.options.arrayType, _chunk = this.chunk, _try_json = DEFAULT_LOAD_TRY_JSON, _apply = true, _throw = DEFAULT_THROW)
		{
			var result;

			try
			{
				result = LIST.loadArrayFromFile(_path_fd, _callback, _type, _chunk, _try_json, _throw);
				this.options.length = result.length;
				this.options.array = result;
				delete this.options.arrayType;
			}
			catch(_error)
			{
				return x(_error);
			}

			if(_apply)
			{
				this.options.array = result;
			}

			return result;
		}

		static loadArrayFromFile(_path_fd, _callback, _type = DEFAULT_LOAD_TYPED_ARRAY_TYPE, _chunk = CHUNK, _try_json = DEFAULT_LOAD_TRY_JSON, _throw = DEFAULT_THROW)
		{
			if(typeof _throw !== 'boolean')
			{
				_throw = DEFAULT_THROW;
			}

			if(! (Number.isInt(_chunk) && _chunk > 0))
			{
				_chunk = CHUNK;
			}

			if(! LIST.checkForArray(_type, true, false))
			{
				_type = DEFAULT_LOAD_TYPED_ARRAY_TYPE;
			}

			if(typeof _try_json !== 'boolean')
			{
				_try_json = DEFAULT_LOAD_TRY_JSON;
			}

			if(typeof _callback !== 'function')
			{
				_callback = null;
			}

			if(! (path.isValid(_path_fd) || (Number.isInt(_path_fd) && _path_fd >= 0)))
			{
				return x('Invalid % argument (not a valid path %)', null, '_path_fd', 'String');
			}
			else if(! fs.exists.file(_path_fd, null, true))
			{
				return x('Your % is not an existing file', null, '_path_fd');
			}

			var handle, size;

			if(typeof _path_fd === 'number')
			{
				size = fs.size(handle = _path_fd);
			}
			else try
			{
				size = fs.size(handle = fs.openSync(_path_fd, 'r', LIST.perms.file));
			}
			catch(_error)
			{
				return x(_error);
			}

			//
			const target = new Uint8Array(size);
			var error = null;
			var offset = 0;
			var result;
			var isNumericArray = null;

			const tryJSON = () => {
				if(typeof _path_fd === 'string' && path.extname(_path_fd) === '.json')
				{
					return true;
				}
				else if(typeof _path_fd === 'number')
				{
					return true;
				}
				else if(_try_json)
				{
					return true;
				}

				return false;
			};

			const tryFormat = () => {
				if(! tryJSON())
				{
					return result = target;
				}

				const string = target.toString('utf8');

				try
				{
					result = JSON.parse(string);
					isNumericArray = false;
				}
				catch(_error)
				{
					result = target;
					isNumericArray = true;
				}

				return result;
			};

			const callback = (_event) => {

				//
				if(_event.error)
				{
					error = _event.error;

					if(_throw)
					{
						return x(_event.error);
					}
					else if(_callback)
					{
						_callback({
							error: _event.error
						});
					}

					return false;
				}
				else
				{
					target.set(_event.buffer, offset);
					offset += _event.size;
				}

				if(_event.finish)
				{
					if(_callback)
					{
						_callback({
							error: null,
							data: target,
							array: tryFormat(),
							arrayType: (isNumericArray ? 'numeric' : 'regular'),
							isNumericArray
						});
					}
				}
			};

			if(fs.chunkRead(handle, callback, { chunk: _chunk }, _throw) === 0)
			{
				isNumericArray = true;
			}
			else
			{
				tryFormat();
			}

			if(error)
			{
				return null;
			}

			if(Array.isArray(result, true, false, false))
			{
				return TypedArray.fromArray(result, 0, result.length, _type, true, true);
			}
			else if(TypedArray.isTypedArray(result, true, false))
			{
				if(result.constructor.name !== _type.name)
				{
					return result.to(_type);
				}

				return result;
			}

			return x('Invalid %... unexpected!', null, 'result');
		}

		toArray(_type, _strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			if(String.isString(_type))
			{
				if(_type === '[]' || (_type = _type.toLowerCase()) === 'array')
				{
					return this.toRegularArray(_apply, _throw);
				}

				return this.toTypedArray(_type, _strict, _apply, _throw);
			}
			else if(TypedArray.isTypedArrayClass(_type))
			{
				return this.toTypedArray(_type, _strict, _apply, _throw);
			}
			else if(Array.isArrayClass(_type, false))
			{
				return this.toRegularArray(_apply, _throw);
			}

			return x('Invalid % argument (expecting an % or a %)', null, '_type', 'Object', 'String');
		}

		toRegularArray(_apply = true, _throw = DEFAULT_THROW)
		{
			if(this.hasRegularCarrier)
			{
				return this.options.array;
			}
			else if(! this.hasNumericCarrier)
			{
				return x('Your carrier needs to be a numeric one, if it\'s not a regular one');
			}

			const result = Array.fromTypedArray(this.options.array);

			if(_apply)
			{
				this.options.array = result;
			}

			return result;
		}

		toTypedArray(_type, _strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			if(! this.hasArrayCarrier)
			{
				return x('To convert to other %s, your carrier needs to be an % or %, too', null, 'TypedArray', 'Array', 'TypedArray');
			}

			var target = null;
			const ta = TypedArray.typedArray;

			if(String.isString(_type))
			{
				_type = _type.toLowerCase();

				for(const arr of ta)
				{
					if(arr.name.toLowerCase() === _type)
					{
						target = arr;
						break;
					}
				}
			}
			else if(TypedArray.isTypedArrayClass(_type))
			{
				target = _type;
			}

			if(target === null)
			{
				return x('Invalid % argument (neither a matching % nor any % class)', null, '_type', 'String', 'TypedArray');
			}

			var result;

			if(this.hasRegularCarrier)
			{
				const tempArray = [];

				for(var i = 0, j = 0; i < this.options.array.length; ++i)
				{
					if(Number.isNumber(this.options.array[i]))
					{
						tempArray[j++] = this.options.array[i];
					}
					else if(_strict)
					{
						if(_throw)
						{
							return x('Can\'t convert your regular % to the % (%); but you can try % = %', null, 'Array', 'TypedArray', target.name, '_strict', false);
						}

						result = null;
						break;
					}
				}

				result = new target(tempArray);
			}
			else
			{
				result = new target(this.options.array.buffer);
			}

			if(_apply && result !== null)
			{
				this.options.array = result;
			}

			return result;
		}

		toInt8Array(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(Int8Array, _strict, _apply, _throw);
		}

		toUint8Array(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(Uint8Array, _strict, _apply, _throw);
		}

		toUint8ClampedArray(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(Uint8ClampedArray, _strict, _apply, _throw);
		}

		toInt16Array(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(Int16Array, _strict, _apply, _throw);
		}

		toUint16Array(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(Uint16Array, _strict, _apply, _throw);
		}

		toInt32Array(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(Int32Array, _strict, _apply, _throw);
		}

		toUint32Array(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(Uint32Array, _strict, _apply, _throw);
		}

		toFloat32Array(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(Float32Array, _strict, _apply, _throw);
		}

		toFloat64Array(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(Float64Array, _strict, _apply, _throw);
		}

		toBigInt64Array(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(BigInt64Array, _strict, _apply, _throw);
		}

		toBigUint64Array(_strict = DEFAULT_STRICT, _apply = true, _throw = DEFAULT_THROW)
		{
			return this.toTypedArray(BigUint64Array, _strict, _apply, _throw);
		}
	}

	//

})();
