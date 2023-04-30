(function()
{

	//
	const DEFAULT_THROW = true;

	const DEFAULT_MODULO_DIMENSION = false;
	const DEFAULT_MODULO_POSITIVE = true;
	const DEFAULT_MODULO_NEGATIVE = true;

	const DEFAULT_REPEAT_DIMENSIONS = false;

	const DEFAULT_LOAD_TYPED_ARRAY_TYPE = Uint8Array;

	//
	if(typeof LIST === 'undefined')
	{
		require('core/list');
	}

	//
	FIELD = module.exports = class FIELD extends LIST
	{
		constructor(_options)
		{
			//
			super(_options);

			//
			return this.PROXY = new Proxy(this, FIELD.getProxyOptions(this));
		}

		toString()
		{
			return 'field<' + this.carrierType + '(' + this.length + ')>[' + (this.dimensions.join(',') || '-') + ']';
		}

		static maybeIndexProperty(_string)
		{
			if(! String.isString(_string))
			{
				return null;
			}
			else if(! isNaN(_string))
			{
				return true;
			}
			else if(_string.indexOf(' ') > -1 || _string.indexOf('\t') > -1 || _string.indexOf(',') > -1 || _string.indexOf('.') > -1)
			{
				return true;
			}
			else if(_string.indexOf('/') > -1 || _string.indexOf('!') > -1)
			{
				return true;
			}
			else if(_string.indexOf(' ') > -1 || _string.indexOf('\t') > -1)
			{
				return true;
			}

			return false;
		}

		static parseProperty(_string, _type, _throw = DEFAULT_THROW)
		{
			//
			switch(_type = _type.toLowerCase())
			{
				case 'get':
				case 'set':
					break;
				default:
					if(_throw)
					{
						return x('Invalid % argument (expecting one of [ %, % ])', null, '_type', 'get', 'set');
					}

					return null;
			}

			if(typeof _string !== 'string')
			{
				if(_throw)
				{
					return x('Invalid % argument (expecting a %)', null, '_string', 'String');
				}

				return null;
			}
			else if(_string.length === 0)
			{
				if(_throw)
				{
					return x('Your % argument may not be empty', null, '_string');
				}

				return null;
			}

			//
			var radix = null;
			var coordinates = [];
			var size = '';
			var count = '';
			var nextSize = false;
			const bigint = [];
			var nextBig = false;
			var type = '';
			var sub = '';

			for(var i = 0, j = 0; i < _string.length; ++i)
			{
				if(_string[i] === ' ' || _string[i] === '\t')
				{
					if(sub.length > 0)
					{
						if(nextSize)
						{
							size = sub;
							nextSize = false;
						}
						else
						{
							coordinates[j] = sub;
							bigint[j++] = nextBig;
						}

						nextBig = false;
						sub = '';
					}
				}
				else if(_string[i] === '+')
				{
					nextBig = true;
				}
				else if(_string[i] === '!' && size.length === 0)
				{
					nextSize = true;
				}
				else if(_string[i] === '/')
				{
					if(radix === null && sub.length > 0)
					{
						coordinates[j] = sub;
						bigint[j++] = nextBig;
						nextBig = false;
						sub = '';
					}

					radix = '';
				}
				else if(_string[i] === 'b' && type.length === 0 && coordinates.length === 0 && (size.length > 0 || sub.length > 0))
				{
					if(_type === 'get')
					{
						type = 'bit';

						for(++i; i < _string.length; ++i)
						{
							if(_string[i] !== ' ' && _string[i] !== '\t')
							{
								count += _string[i];
							}
							else
							{
								break;
							}
						}

						--i;
					}
				}
				else if(_string[i] === 'n' && type.length === 0 && coordinates.length === 0 && (size.length > 0 || sub.length > 0))
				{
					if(_type === 'get')
					{
						type = 'bigint';

						for(++i; i < _string.length; ++i)
						{
							if(_string[i] !== ' ' && _string[i] !== '\t')
							{
								count += _string[i];
							}
							else
							{
								break;
							}
						}

						--i;
					}
				}
				else if(_string[i] === 'm' && type.length === 0 && coordinates.length === 0 && (size.length > 0 || sub.length > 0))
				{
					if(_type === 'get')
					{
						type = 'number';

						for(++i; i < _string.length; ++i)
						{
							if(_string[i] !== ' ' && _string[i] !== '\t')
							{
								count += _string[i];
							}
							else
							{
								break;
							}
						}

						--i;
					}
				}
				else if(radix === null)
				{
					sub += _string[i];
				}
				else
				{
					radix += _string[i];
				}
			}

			if(sub.length > 0)
			{
				coordinates.push(sub);
				bigint.push(nextBig);
			}

			//
			if(radix === null || radix.length === 0)
			{
				radix = 10;
			}
			else if((radix = parseInt(radix)) === null)
			{
				return null;
			}

			//
			if(_type === 'set')
			{
				size = null;
				count = null;
			}
			else
			{
				if(size.length > 0)
				{
					if((size = parseInt(size, radix)) === null)
					{
						return null;
					}
				}
				else
				{
					size = 1;
				}

				if(count.length > 0)
				{
					if((count = parseInt(count, radix)) === null)
					{
						return null;
					}
				}
				else
				{
					count = 1;
				}

				if(type === 'number' && count >= 53)
				{
					type = 'bigint';
				}
			}

			//
			if(coordinates.length === 0)
			{
				return null;
			}
			else for(var i = 0; i < coordinates.length; ++i)
			{
				if((coordinates[i] = parseInt(coordinates[i], radix)) === null)
				{
					return null;
				}
				else if(bigint[i])
				{
					coordinates[i] = BigInt.from(coordinates[i]);
				}
			}

			const result = Object.create(null);
			result.method = _type;
			result.size = size;
			result.count = count;
			result.radix = radix;

			if(coordinates.length === 0)
			{
				return null;
			}
			else if(coordinates.length === 1)
			{
				result.form = 'list';
				result.index = coordinates.shift();
			}
			else
			{
				result.form = 'field';
				result.coordinates = FIELD.checkCoordinates(... coordinates);
			}

			if(_type === 'get')
			{
				result.type = type;
			}

			//
			return result;
		}

		getBit(_coordinates, _size = 1, _count = 1)
		{
			if(Number.isInt(_coordinates) || typeof _coordinates === 'bigint')
			{
				return super.getBit(_coordinates, _size, _count);
			}
			else if(Array.isArray(_coordinates))
			{
				_coordinates = this.getIndex(this.index(... _coordinates));
			}
			else
			{
				return x('Invalid % argument (neither a non-empty %, nor a % or %)', null, '_coordinates', 'Array', 'Integer', 'BigInt');
			}

			return super.getBit(_coordinates, _size, _count);
		}

		getNumber(_coordinates, _size = 1, _count = 1)
		{
			if(Number.isInt(_coordinates) || typeof _coordinates === 'bigint')
			{
				return super.getBit(_coordinates, _size, _count);
			}
			else if(Array.isArray(_coordinates))
			{
				_coordinates = this.getIndex(this.index(... _coordinates));
			}
			else
			{
				return x('Invalid % argument (neither a non-empty %, nor a % or %)', null, '_coordinates', 'Array', 'Integer', 'BigInt');
			}

			return super.getNumber(_coordinates, _size, _count);
		}

		getBigInt(_coordinates, _size = 1, _count = 1)
		{
			if(Number.isInt(_coordinates) || typeof _coordinates === 'bigint')
			{
				return super.getBit(_coordinates, _size, _count);
			}
			else if(Array.isArray(_coordinates))
			{
				_coordinates = this.getIndex(this.index(... _coordinates));
			}
			else
			{
				return x('Invalid % argument (neither a non-empty %, nor a % or %)', null, '_coordinates', 'Array', 'Integer', 'BigInt');
			}

			return super.getBigInt(_coordinates, _size, _count);
		}

		getValue(_coordinates, _size = 1, _count = 1)
		{
			if(Number.isInt(_coordinates) || typeof _coordinates === 'bigint')
			{
				return super.getBit(_coordinates, _size, _count);
			}
			else if(Array.isArray(_coordinates))
			{
				_coordinates = this.getIndex(this.index(... _coordinates));
			}
			else
			{
				return x('Invalid % argument (neither a non-empty %, nor a % or %)', null, '_coordinates', 'Array', 'Integer', 'BigInt');
			}

			return super.getValue(_coordinates, _size, _count);
		}

		setValue(_coordinates, _value)
		{
			if(Number.isInt(_coordinates) || typeof _coordinates === 'bigint')
			{
				return super.getBit(_coordinates, _size, _count);
			}
			else if(Array.isArray(_coordinates))
			{
				_coordinates = this.getIndex(this.index(... _coordinates));
			}
			else
			{
				return x('Invalid % argument (neither a non-empty %, nor a % or %)', null, '_coordinates', 'Array', 'Integer', 'BigInt');
			}

			return super.setValue(_coordinates, _value);
		}

		get(_string_or_request, _original, _has = false, _throw = DEFAULT_THROW)
		{
			//
			var request;

			if(typeof _string_or_request === 'string')
			{
				request = FIELD.parseProperty(_string_or_request, 'get', _throw);
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
			else if(request.form === 'list')
			{
				request.index = this.getIndex(request.index);
			}
			else
			{
				request.coordinates = this.getIndex(request.coordinates);
			}

			var method;

			switch(request.type)
			{
				case 'bit':
					method = 'getBit';
					break;
				case 'number':
					method = 'getNumber';
					break;
				case 'bigint':
					method = 'getBigInt';
					break;
				case '':
					method = 'getValue';
					break;
			}

			if(request.form === 'list')
			{
				return super[method](request.index, request.size, request.count);
			}

			return this[method](request.coordinates, request.size, request.count);
		}

		set(_string_or_request, _original, _value, _throw = DEFAULT_THROW)
		{
			//
			var request;

			if(typeof _string_or_request === 'string')
			{
				request = FIELD.parseProperty(_string_or_request, 'set', _throw);
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
			if(request.form === 'list')
			{
				request.index = this.getIndex(request.index);
				return super.setValue(request.index, _value);
			}
			else
			{
				request.coordinates = this.getIndex(request.coordinates);
			}

			return this.setValue(request.coordinates, _value);
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
				else if((_property = FIELD.parseProperty(_property, 'get', DEFAULT_THROW)) === null)
				{
					return undefined;
				}
				else if(_property.form === 'list')
				{
					_property.index = _target.getIndex(_property.index);
				}
				else
				{
					_property.coordinates = _target.getIndex(_property.coordinates);
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
				else if((_property = FIELD.parseProperty(_property, 'set', DEFAULT_THROW)) === null)
				{
					if(FIELD.maybeIndexProperty(_property))
					{
						return false;
					}

					_target[original] = _value;
					return true;
				}
				else if(_property.form === 'list')
				{
					_property.index = _target.getIndex(_property.index);
				}
				else
				{
					_property.coordinates = _target.getIndex(_property.coordinates);
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
				else if((_property = FIELD.parseProperty(_property, 'get', DEFAULT_THROW)) === null)
				{
					return null;
				}
				else if(_property.form === 'list')
				{
					_property.index = _target.getIndex(_property.index);
				}
				else
				{
					_property.coordinates = _target.getIndex(_property.coordinates);
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

		static get checkForArray()
		{
			return LIST.checkForArray;
		}

		static createFromFile(_path, _type, ... _args)
		{
			if(! (path.isValid(_path) || fs.isFile(_path)))
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
			const options = { dimensions: [] };

			for(var i = 0, d = 0; i < _args.length; ++i)
			{
				if(Number.isInt(_args[i]) && _args[i] !== 0)
				{
					options.dimensions[d++] = _args.splice(i--, 1)[0];
				}
				else if(Object.isObject(_args[i]) && ('dimensions' in _args[i]))
				{
					if(Array.isArray(_args[i].dimensions, true))
					{
						if(Array.isArray(options.dimensions, true))
						{
							options.dimensions.concat(_args[i].dimensions);
						}
						else
						{
							options.dimensions = _args[i].dimensions;
						}
					}
					else if(path.isValid(_args[i].dimensions))
					{
						options.dimensions = path.resolve(_args[i].dimensions);
					}
					else if(Number.isInt(_args[i].dimensions) && _args[i].dimensions >= 0)
					{
						options.dimensions = _args[i].dimensions;
					}

					delete _args[i].dimensions;
				}
			}

			//
			return super.create(... _args, options);
		}

		static getLength(... _dimensions)
		{
			if(_dimensions.length === 0)
			{
				return 0;
			}
			else if(_dimensions.length === 1)
			{
				if((_dimensions = FIELD.checkDimensionValue(_dimensions[0])) !== null)
				{
					if((_dimensions = FIELD.loadDimensions(_dimensions, CHUNK, DEFAULT_THROW)) === null)
					{
						return 0;
					}
				}
				else
				{
					return 0;
				}
			}

			if((_dimensions = FIELD.checkDimensions(... _dimensions)) === null)
			{
				return 0;
			}

			var result = 1;

			for(const dim of _dimensions)
			{
				result *= dim;
				result = numeric.adaptNumber(result);
			}

			return result;
		}

		getLength()
		{
			return FIELD.getLength(... this.dimensions);
		}

		static checkDimensionValue(_value)
		{
			if(Array.isArray(_value, true))
			{
				return null;
			}
			else if(path.isValid(_value) || fs.isFile(_value))
			{
				if(fs.exists.file(_value, null, true))
				{
					return _value;
				}
			}

			return null;
		}

		static checkDimensions(... _dimensions)
		{
			const result = [];

			if(_dimensions.length === 0)
			{
				return null;
			}

			for(var i = 0, j = 0; i < _dimensions.length; ++i)
			{
				if(Number.isInt(_dimensions[i]) && _dimensions[i] > 0)
				{
					result[j++] = _dimensions[i];
				}
			}

			if(_dimensions.length === 0)
			{
				return null;
			}

			return result;
		}

		static checkCoordinates(... _coordinates)
		{
			const result = [];

			for(var i = 0, j = 0; i < _coordinates.length; ++i)
			{
				if(Number.isInt(_coordinates[i]))
				{
					result[j++] = _coordinates[i];
				}
			}

			return result;
		}

		getIndex(_index_coordinates, _fallback = _index_coordinates)
		{
			if(! isNumeric(_index_coordinates))
			{
				return super.getIndex(_index_coordinates, _fallback);
			}
			else if(! Array.isArray(_index_coordinates, true))
			{
				return x('Invalid % argument (neither an % nor a % or %)', null, '_index_coordinates', 'Array', 'Number', 'BigInt');
			}
			else if(this.dimensions.length === 0)
			{
				if(Array.isArray(_fallback, true))
				{
					return [ ... _fallback ];
				}

				return _fallback;
			}

			const result = new Array(_index_coordinates.length);
			var dim;

			for(var i = 0; i < _index_coordinates.length; ++i)
			{
				result[i] = getIndex(_index_coordinates[i], this.dimensions[i % this.dimensions.length]);
			}

			return result;
		}

		get dimensions()
		{
			var result;

			if(! ('dimensions' in this.options))
			{
				return this.options.dimensions = [];
			}
			else if(! Array.isArray(this.options.dimensions, true))
			{
				const chk = FIELD.checkDimensionValue(this.options.dimensions);

				if(chk === null)
				{
					return this.options.dimensions = [];
				}
				else if((result = FIELD.loadDimensions(this.options.dimensions, CHUNK, DEFAULT_THROW)) === null)
				{
					return this.options.dimensions = [];
				}
			}
			else
			{
				result = this.options.dimensions;
			}

			return [ ... result ];
		}

		set dimensions(_value)
		{
			if(path.isValid(_value) || fs.isFile(_value))
			{
				return this.options.dimensions = this.loadDimensions(_value, this.chunk, false, DEFAULT_THROW);
			}
			if(Array.isArray(_value, true))
			{
				if((_value = FIELD.checkDimensions(... _value)) === null)
				{
					delete this.options.dimensions;
				}
				else
				{
					this.options.dimensions = FIELD.checkDimensions(... _value);
					this.length = FIELD.getLength(... this.options.dimensions = FIELD.checkDimensions(... _value));
				}
			}
			else
			{
				delete this.options.dimensions;
			}

			return this.dimensions;
		}

		static index(_coordinates, _dimensions, _options)
		{
			//
			_options = Object.assign({
				bigint: false,
				dimensionModulo: DEFAULT_MODULO_DIMENSION,
				positiveModulo: DEFAULT_MODULO_POSITIVE,
				negativeModulo: DEFAULT_MODULO_NEGATIVE
			}, _options);

			//
			if(! Array.isArray(_coordinates, false))
			{
				return x('Invalid % argument (not a non-empty %)', null, '_coordinates', 'Array');
			}

			//
			if(Array.isArray(_dimensions, true))
			{
				if((_dimensions = FIELD.checkDimensions(... _dimensions)) === null)
				{
					return x('Invalid % argument (doesn\'t result in non-empty %)', null, '_dimensions', 'Array');
				}
			}
			else if((_dimensions = FIELD.checkDimensionValue(_dimensions)) !== null)
			{
				_dimensions = FIELD.loadDimensions(_dimensions, CHUNK, DEFAULT_THROW);
			}

			if(! Array.isArray(_dimensions))
			{
				return x('Invalid % argument (not a non-empty %)', null, '_dimensions', 'Array');
			}

			//
			if(_coordinates.length === 0)
			{
				return (_options.bigint ? 0n : 0);
			}
			else if(_dimensions.length === 0)
			{
				return _coordinates[0];
			}

			//
			var result = (_options.bigint ? 0n : 0);
			var mul = (_options.bigint ? 1n : 1);
			var coord, dim;

			const switchToBigInt = () => {
				_options.bigint = true;
				result = BigInt.from(result);
				mul = BigInt.from(mul);
			};

			const checkNumber = () => {
				if(_options.bigint || typeof result === 'bigint')
				{
					return result;
				}
				else if(numberTooHigh(result))
				{
					return switchToBigInt();
				}

				return result;
			}

			for(var i = _coordinates.length - 1, j = _dimensions.length - 1;; --i, --j)
			{
				//
				if(Number.isNumber(_coordinates[i]))
				{
					coord = _coordinates[i];
				}
				else if(typeof _coordinates[i] === 'bigint')
				{
					coord = Number.from(_coordinates[i]);
				}
				else
				{
					return x('Invalid %[%] (neither % nor %)', null, '_coordinates', i, 'Number', 'BigInt');
				}

				if(Number.isNumber(_dimensions[j]))
				{
					dim = _dimensions[j];
				}
				else if(typeof _dimensions[j] === 'bigint')
				{
					dim = Number.from(_dimensions[j]);
				}
				else
				{
					return x('Invalid %[%] (neither % nor %)', null, '_dimensions', i, 'Number', 'BigInt');
				}

				//
				if(coord < 0)
				{
					if(_options.negativeModulo)
					{
						coord = (dim + (coord % dim));

						if(_options.positiveModulo && coord >= dim)
						{
							coord %= dim;
						}
					}
				}
				else if(coord >= dim && _options.positiveModulo)
				{
					coord %= dim;
				}

				//
				result += (_options.bigint ? BigInt.from(mul * coord) : (mul * coord));
				mul *= (_options.bigint ? BigInt.from(dim) : dim);

				//
				checkNumber(result);
				checkNumber(mul);

				//
				if(i === 0)
				{
					break;
				}

				if(j === 0)
				{
					if(_options._dimensionModulo)
					{
						j = _dimensions.length;
					}
					else
					{
						break;
					}
				}
			}

			return result;
		}

		get repeatDimensions()
		{
			if(typeof this.options.repeatDimensions === 'boolean')
			{
				return this.options.repeatDimensions;
			}

			return DEFAULT_REPEAT_DIMENSIONS;
		}

		set repeatDimensions(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.repeatDimensions = _value;
			}
			else
			{
				delete this.options.repeatDimensions;
			}

			return this.repeatDimensions;
		}

		get dimensionModulo()
		{
			if(typeof this.options.dimensionModulo === 'boolean')
			{
				return this.options.dimensionModulo;
			}

			return DEFAULT_MODULO_DIMENSION;
		}

		set dimensionModulo(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.dimensionModulo = _value;
			}
			else
			{
				delete this.options.dimensionModulo;
			}

			return this.dimensionModulo;
		}

		get negativeModulo()
		{
			if(typeof this.options.negativeModulo === 'boolean')
			{
				return this.options.negativeModulo;
			}

			return DEFAULT_MODULO_NEGATIVE;
		}

		set negativeModulo(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.negativeModulo = _value;
			}
			else
			{
				delete this.options.negativeModulo;
			}

			return this.negativeModulo;
		}

		get positiveModulo()
		{
			if(typeof this.options.positiveModulo === 'boolean')
			{
				return this.options.positiveModulo;
			}

			return DEFAULT_MODULO_POSITIVE;
		}

		set positiveModulo(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.positiveModulo = _value;
			}
			else
			{
				delete this.options.positiveModulo;
			}

			return this.positiveModulo;
		}

		get bigint()
		{
			return false;
		}

		index(... _coordinates)
		{
			if(this.length === 0)
			{
				return (this.bigint ? 0n : 0);
			}
			else if(_coordinates.length === 0)
			{
				return (this.bigint ? 0n : 0);
			}
			else if(this.dimensions.length === 0)
			{
				return super.getIndex(_coordinates[0]);
			}

			return Number.from(getIndex(FIELD.index(_coordinates, this.dimensions, {
				bigint: this.bigint,
				dimensionModulo: this.dimensionModulo,
				negativeModulo: this.negativeModulo,
				positiveModulo: this.positiveModulo
			}), this.length));
		}

		bigIndex(... _coordinates)
		{
			if(_coordinates.length === 0)
			{
				return (this.bigint ? 0n : 0);
			}
			else if(this.dimensions.length === 0)
			{
				return super.getIndex(_coordinates[0]);
			}

			return FIELD.index(_coordinates, this.dimensions, {
				bigint: this.bigint,
				dimensionModulo: this.dimensionModulo,
				negativeModulo: this.negativeModulo,
				positiveModulo: this.positiveModulo
			});
		}

		static coordinates(_index, _dimensions, _options)
		{
			//
			_options = Object.assign({ repeatDimensions: DEFAULT_REPEAT_DIMENSIONS }, _options);

			//
			if(_dimensions.length === 0)
			{
				return [ Number.from(_index) ];
			}

			//
			if(Number.isNumber(_index))
			{
				_index = BigInt.from(_index);
			}
			else if(typeof _value !== 'bigint')
			{
				return x('Invalid % argument (neither % nor %)', null, '_index', 'Number', 'BigInt');
			}

			if(Array.isArray(_dimensions, true))
			{
				if((_dimensions = FIELD.checkDimensions(... _dimensions)) === null)
				{
					return x('Invalid % argument (doesn\'t result in non-empty %)', null, '_dimensions', 'Array');
				}
			}
			else if((_dimensions = FIELD.checkDimensionValue(_dimensions)) !== null)
			{
				if((_dimensions = FIELD.loadDimensions(_dimensions, CHUNK, DEFAULT_THROW)) === null)
				{
					return [ Number.from(_index) ];
					//return x('Invalid % argument (not a non-empty %)', null, '_dimensions', 'Array');
				}
			}
			else
			{
				return [ Number.from(_index) ];
				//return x('Invalid % argument (not a non-empty %)', null, '_dimensions', 'Array');
			}

			const result = new Array(_dimensions.length);
			var dim, value;
			var rest = _index;

			if(_options.repeatDimensions)
			{
				var i = _dimensions.length - 1;
				var r = 0;

				while(rest >= 1n)
				{
					//
					if(Number.isNumber(_dimensions[i]))
					{
						dim = BigInt.from(_dimensions[i]);
					}
					else if(typeof _dimensions[i] === 'bigint')
					{
						dim = _dimensions[i];
					}
					else
					{
						return x('Invalid %[%] (neither a % nor %)', null, '_dimensions', i, 'Number', 'BigInt');
					}

					result[r++] = Number.from(rest % dim);
					rest /= dim;

					//
					if(--i === -1)
					{
						i = _dimensions.length - 1;
					}
				}
			}
			else
			{
				for(var i = _dimensions.length - 1; i >= 0; --i)
				{
					if(Number.isNumber(_dimensions[i]))
					{
						dim = BigInt.from(_dimensions[i]);
					}
					else if(typeof _dimensions[i] === 'bigint')
					{
						dim = _dimensions[i];
					}
					else
					{
						return x('Invalid %[%] (neither a % nor %)', null, '_dimensions', i, 'Number', 'BigInt');
					}

					result[i] = Number.from(rest % dim);
					rest /= dim;
				}

				if(rest >= 1n)
				{
					if(! numberTooHigh(rest))
					{
						rest = Number.from(rest);
					}

					result.push(rest);
				}
			}

			return result;
		}

		coordinates(_index)
		{
			if(this.dimensions.length === 0)
			{
				return [ this.getIndex(_index) ];
			}

			return FIELD.coordinates(this.getIndex(_index), this.dimensions, {
				repeatDimensions: this.repeatDimensions
			});
		}

		bigCoordinates(_index)
		{
			if(this.dimensions.length === 0)
			{
				return [ Number.from(_index) ];
			}

			return FIELD.coordinates(_index, this.dimensions, {
				repeatDimensions: this.repeatDimensions
			});
		}

		loadDimensions(_json_path, _chunk = this.chunk, _apply = true, _throw = DEFAULT_THROW)
		{
			const result = FIELD.loadDimensions(_json_path, _chunk, _throw);

			if(_apply && result !== null)
			{
				return this.dimensions = FIELD.checkDimensions(... result);
			}

			return result;
		}

		static loadDimensions(_json_path_fd, _chunk = CHUNK, _throw = DEFAULT_THROW)
		{
			if(typeof _throw !== 'boolean')
			{
				_throw = DEFAULT_THROW;
			}

			return LIST.loadArrayFromFile(_json_path_fd, null, Uint32Array, _chunk, true, _throw);
		}
	}

	//

})();
