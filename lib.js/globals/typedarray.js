(function()
{

	//
	const DEFAULT_BIGINT = true;
	const DEFAULT_GROW = true;

	//
	TypedArray = module.exports = Object.getPrototypeOf(Uint8Array);

	//
	Object.defineProperty(Array, 'typedArray', { get: function()
	{
		return [
			Int8Array,
			Uint8Array,
			Uint8ClampedArray,
			Int16Array,
			Uint16Array,
			Int32Array,
			Uint32Array,
			Float32Array,
			Float64Array,
			BigInt64Array,
			BigUint64Array
		];
	}});

	Object.defineProperty(Array, 'typedArrays', { get: function()
	{
		const array = Array.typedArray;
		const result = new Array(array.length);

		for(var i = 0; i < array.length; ++i)
		{
			result[i] = array[i].name;
		}

		return result;
	}});

	Object.defineProperty(Array, 'isTypedArrayClass', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else try
		{
			const ta = Array.typedArrays;

			for(var i = 0; i < _args.length; ++i)
			{
				if(_args[i].name !== 'TypedArray')
				{
					var isOne = false;

					for(const t of ta)
					{
						if(_args[i].name === t)
						{
							isOne = true;
							break;
						}
					}

					if(! isOne)
					{
						return false;
					}
				}
			}
		}
		catch(_error)
		{
			return false;
		}

		return true;
	}});

	isTypedArrayClass = Array.isTypedArrayClass;
	
	Object.defineProperty(Array, 'isTypedArray', { value: function(_item, _empty = true, _class = false)
	{
		if(arguments.length === 0)
		{
			return null;
		}

		const ta = Array.typedArrays;
		var result = false;

		try
		{
			for(const t of ta)
			{
				if(_item.constructor.name === t)
				{
					result = true;
					break;
				}
			}
		}
		catch(_error)
		{
			result = false;
		}

		if(result)
		{
			if(_empty === false)
			{
				return (_item.length > 0);
			}
			else if(_empty === true)
			{
				return true;
			}
			else if(Number.isInt(_empty) && _empty >= 0)
			{
				return (_item.length >= _empty);
			}
		}
		else if(_class && Array.isTypedArrayClass(_item))
		{
			return true;
		}
		
		return result;
	}});

	isTypedArray = Array.isTypedArray;

	const ta = Array.typedArray;
	const st = [ 'int', 'uint', 'uint', 'int', 'uint', 'int', 'uint', 'float', 'float', 'bigint', 'biguint' ];
	
	for(var i = 0; i < ta.length; ++i)
	{
		//
		const type = ta[i];
		const nType = st[i];

		//
		Object.defineProperty(type, 'type', { get: function() { return nType; }});
		Object.defineProperty(type.prototype, 'type', { get: function() { return nType; }});

		//
		Object.defineProperty(type.prototype, 'isIntArray', { get: function() { return (nType === 'int'); }});
		Object.defineProperty(type.prototype, 'isUintArray', { get: function() { return (nType === 'uint'); }});
		Object.defineProperty(type.prototype, 'isFloatArray', { get: function() { return (nType === 'float'); }});
		Object.defineProperty(type.prototype, 'isBigIntArray', { get: function() { return (nType === 'bigint'); }});
		Object.defineProperty(type.prototype, 'isBigUintArray', { get: function() { return (nType === 'biguint'); }});

		//
		Object.defineProperty(type, 'isIntArray', { get: function() { return (nType === 'int'); }});
		Object.defineProperty(type, 'isUintArray', { get: function() { return (nType === 'uint'); }});
		Object.defineProperty(type, 'isFloatArray', { get: function() { return (nType === 'float'); }});
		Object.defineProperty(type, 'isBigIntArray', { get: function() { return (nType === 'bigint'); }});
		Object.defineProperty(type, 'isBigUintArray', { get: function() { return (nType === 'biguint'); }});

		//
		Object.defineProperty(TypedArray, type.name, { value: type });

		//
		Object.defineProperty(type, 'is' + type.name, { value: function(_item, _empty = true, _class = false)
		{
			if(arguments.length === 0)
			{
				return null;
			}
			
			const result = (_item instanceof type);
			
			if(result)
			{
				if(_empty === false)
				{
					return (_item.length > 0);
				}
				else if(_empty === true)
				{
					return true;
				}
				else if(Number.isInt(_empty) && _empty >= 0)
				{
					return (_item.length >= _empty);
				}
			}
			else if(_class)
			{
				if(_item === type)
				{
					return true;
				}
			}
			
			return result;
		}});
		
		//
		Object.defineProperty(TypedArray, 'is' + type.name, { value: type['is' + type.name] });

		//
		global['is' + type.name] = type['is' + type.name];
	}

	Object.defineProperty(TypedArray, 'type', { value: function(_item)
	{
		if(typeof _item.type === 'string')
		{
			return _item.type;
		}

		return null;
	}});

	Object.defineProperty(TypedArray, 'typeOf', { value: function(_item)
	{
		if(TypedArray.isTypedArrayClass(_item))
		{
			return _item.name;
		}
		else if(TypedArray.isTypedArray(_item))
		{
			return _item.constructor.name;
		}

		return '';
	}});

	Object.defineProperty(TypedArray.prototype, 'typeOf', { value: function()
	{
		return this.constructor.name;
	}});
	
	//
	Object.defineProperty(TypedArray.prototype, 'BITS_PER_ELEMENT', { get: function()
	{
		return (this.BYTES_PER_ELEMENT * 8);
	}});

	Object.defineProperty(TypedArray, 'BITS_PER_ELEMENT', { get: function()
	{
		return (this.BYTES_PER_ELEMENT * 8);
	}});

	//
	Object.defineProperty(TypedArray, 'isTypedArrayClass', { value: Array.isTypedArrayClass });
	Object.defineProperty(TypedArray, 'isTypedArray', { value: Array.isTypedArray });

	Object.defineProperty(TypedArray, 'typedArray', { get: function()
	{
		return Array.typedArray;
	}});

	Object.defineProperty(TypedArray, 'typedArrays', { get: function()
	{
		return Array.typedArrays;
	}});
	
	//
	const _toString = TypedArray.prototype.toString;

	Object.defineProperty(TypedArray.prototype, 'toString', { value: function(_options)
	{
		var isEnc;

		if(_options === null)
		{
			return _toString.call(this);
		}
		else if(_options === '')
		{
			_options = encoding;
		}
		
		if(String.isEncoding(_options, false, true, false))
		{
			isEnc = true;
		}
		else
		{
			isEnc = false;
		}

		if(isEnc)
		{
			const array = this.valueOf();
			var result = '';

			for(var i = 0; i < array.length; ++i)
			{
				result += String.fromCodePoint(array[i]);
			}

			return result.encode(_options, true, false, true);
		}

		return this.render(_options);
	}});
	
	(function()
	{
		for(const arr of ta)
		{
			Object.defineProperty(arr, 'fromArray', { value: function(_array, _offset, _length, _bigint = DEFAULT_BIGINT, _throw = false)
			{
				return TypedArray.fromArray(_array, _offset, _length, arr, _bigint, _throw);
			}});
		}
		
		Object.defineProperty(TypedArray, 'fromArray', { value: function(_array, _offset, _length, _type = Uint8Array, _bigint = DEFAULT_BIGINT, _throw = false)
		{
			if(String.isString(_type))
			{
				const str = _type.toLowerCase();
				_type = null;
				
				for(const arr of ta)
				{
					if(arr.name.toLowerCase() === str)
					{
						_type = arr;
						break;
					}
				}
				
				if(_type === null)
				{
					return x('Your % selection via % \'%\' didn\'t match', null, 'TypeArray', 'String', str);
				}
			}
			else if(! TypedArray.isTypedArrayClass(_type))
			{
				_type = Uint8Array;
			}
			
			if(Array.isArray(_array, true, false, false))
			{
				if(_array.length === 0)
				{
					return new _type(0);
				}
			}
			else
			{
				return x('Invalid % argument (not an %)', null, '_array', 'Array');
			}

			if(! Number.isInt(_offset))
			{
				_offset = 0;
			}
			else if(_offset >= _array.length)
			{
				return new _type(0);
			}
			else if(_offset < 0)
			{
				if((_offset = _array.length + _offset) < 0)
				{
					return new _type(0);
				}
			}

			if(! Number.isInt(_length))
			{
				if((_length = _array.length - _offset) <= 0)
				{
					return new _type(0);
				}
			}
			else if((_length + _offset) >= _array.length)
			{
				if((_length = (_array.length - _offset)) <= 0)
				{
					return new _type(0);
				}
			}
			else if(_length < 0)
			{
				if((_length = _array.length + _length) <= 0)
				{
					return new _type(0);
				}
			}

			for(var i = _offset, j = 0; i < _array.length && j < _length; ++i, ++j)
			{
				if(! Number.isNumber(_array[i]))
				{
					if(_bigint && typeof _array[i] === 'bigint' && _array[i] < BigInt.from(Number.MAX_SAFE_INTEGER) && _array[i] > BigInt.from(Number.MIN_SAFE_INTEGER))
					{
						continue;
					}
					else if(_throw)
					{
						return x('Your input %[%] element value is not a %' + (_bigint ? ' and also no % [with maximum (( % ^ %) - 1)]' : ''), null, '_array', i, 'Number', 2, 53, -1);
					}
					else
					{
						--_length;
					}
				}
			}

			if(_length <= 0)
			{
				return new _type(0);
			}

			const result = new _type(_length);

			for(var i = _offset, j = 0; i < _array.length && j < _length; ++i)
			{
				if(Number.isNumber(_array[i]))
				{
					result[j++] = _array[i];
				}
				else if(typeof _array[i] === 'bigint')
				{
					result[j++] = Number.from(_array[i]);
				}
			}

			return result;
		}});
	})();
	
	//
	(function()
	{
		const ta = TypedArray.typedArray;

		for(const arr of ta)
		{
			Object.defineProperty(TypedArray.prototype, ('to' + arr.name), { value: function()
			{
				return new arr(this.valueOf());
			}});

			Object.defineProperty(Array.prototype, ('to' + arr.name), { value: function()
			{
				return new arr(this.valueOf());
			}});
		}

		Object.defineProperty(TypedArray.prototype, 'to', { value: function(_target)
		{
			if(String.isString(_target))
			{
				const str = _target.toLowerCase();
				_target = null;

				for(const arr of ta)
				{
					if(arr.name.toLowerCase() === str)
					{
						_target = arr;
						break;
					}
				}

				if(_target === null)
				{
					return x('Your % % was not found via %; try again or call with the % class itself', null, '_target', 'TypedArray', 'String', 'TypedArray');
				}
			}
			else if(! TypedArray.isTypedArrayClass(_target))
			{
				return x('Invalid % argument (expecting a % class or a % for the class name)', null, '_target', 'TypedArray', 'String');
			}

			return new _target(this);
		}});

		Object.defineProperty(Array.prototype, 'toTypedArray', { value: function(_target)
		{
			if(String.isString(_target))
			{
				const str = _target.toLowerCase();
				_target = null;

				for(const arr of ta)
				{
					if(arr.name.toLowerCase() === str)
					{
						_target = arr;
						break;
					}
				}

				if(_target === null)
				{
					return x('Your % % was not found via %; try again or call with the % class itself', null, '_target', 'TypedArray', 'String', 'TypedArray');
				}
			}
			else if(! TypedArray.isTypedArrayClass(_target))
			{
				return x('Invalid % argument (expecting a % class or a % for the class name)', null, '_target', 'TypedArray', 'String');
			}

			return new _target(this.valueOf());
		}});
	})();

	Object.defineProperty(TypedArray.prototype, 'adaptByteLength', { value: function(_target, _only_adaption = false)
	{
		return TypedArray.adaptByteLength(this.byteLength, _target, _only_adaption);
	}});

	Object.defineProperty(TypedArray, 'adaptByteLength', { value: function(_length, _target, _only_adaption = false)
	{
		if(TypedArray.isTypedArray(_length, true, true))
		{
			_length = _length.byteLength;
		}
		
		if(Number.isInt(_length) && _length >= 0)
		{
			if(_length === 0)
			{
				return 0;
			}
		}
		else
		{
			return x('Invalid % argument (expecting a positive %)', null, '_length', 'Integer');
		}

		if(TypedArray.isTypedArray(_target, true, true))
		{
			_target = _target.BYTES_PER_ELEMENT;
		}
		else if(Number.isInt(_target) && _target >= 0)
		{
			if(_target === 0)
			{
				return 0;
			}
		}
		else
		{
			return x('Invalid % argument (expecting either a % or a positive %)', null, '_target', 'TypedArray', 'Integer');
		}

		//
		const rest = (_length % _target);

		if(_only_adaption)
		{
			return rest;
		}
		else if(rest === 0)
		{
			return _length;
		}

		return (_length + _target - rest);
	}});

	Object.defineProperty(TypedArray.prototype, 'render', { value: function(_options)
	{
		return String.render(this, _options);
	}});

	//
	Object.defineProperty(TypedArray, 'equal', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(! TypedArray.isTypedArray(_args[i]))
			{
				return x('Invalid %[%] argument (expecting only %s)', null, '..._args', i, 'TypedArray');
			}
		}

		if(_args.length === 1)
		{
			return true;
		}

		const type = Object.typeOf(_args[0]);

		for(var i = 1; i < _args.length; ++i)
		{
			if(_args[i] === _args[0])
			{
				_args.splice(i--, 1);
			}
			else if(_args[i].length !== _args[0].length)
			{
				return false;
			}
			else if(Object.typeOf(_args[i]) !== type)
			{
				return false;
			}
		}

		_args.uniq();

		for(var i = 1; i < _args.length; ++i)
		{
			for(var j = 0; j < _args[i].length; ++j)
			{
				if(_args[i][j] !== _args[0][j])
				{
					return false;
				}
			}
		}

		return true;
	}});

	Object.defineProperty(TypedArray, 'equalBytes', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(! TypedArray.isTypedArray(_args[i]))
			{
				return x('Invalid %[%] argument (expecting only %s)', null, '..._args', i, 'TypedArray');
			}
		}

		if(_args.length === 1)
		{
			return true;
		}
		else for(var i = 1; i < _args.length; ++i)
		{
			if(_args[i] === _args[0])
			{
				_args.splice(i--, 1);
			}
			else if(_args[i].byteLength !== _args[0].byteLength)
			{
				return false;
			}
		}

		_args.uniq();

		const a = new Uint8Array(_args[0].buffer);
		var b;

		for(var i = 1; i < _args.length; ++i)
		{
			b = new Uint8Array(_args[i].buffer);

			for(var j = 0; j < b.length; ++j)
			{
				if(a[j] !== b[j])
				{
					return false;
				}
			}
		}

		return true;
	}});

	Object.defineProperty(TypedArray, 'create', { value: function(_type, _length)
	{
		if(Number.isInt(_length))
		{
			_length = Math.abs(_length);
		}
		else
		{
			_length = 0;
		}

		const arrays = TypedArray.typedArray;

		if(String.isString(_type))
		{
			_type = _type.toLowerCase();

			for(var i = 0; i < arrays.length; ++i)
			{
				if(arrays[i].name.toLowerCase() === _type)
				{
					return new (arrays[i])(_length);
				}
			}

			return x('Invalid % argument (couldn\'t find the % type \'%\'', null, '_type', 'TypedArray', _type);
		}
		else if((result = arrays.indexOf(_type)) > -1)
		{
			return new (_type)(_length);
		}

		return x('Invalid % argument (neither a non-empty % nor an instance of one %)', null, '_type', 'String', 'TypedArray');
	}});

	Object.defineProperty(TypedArray.prototype, 'emptyInstance', { value: function(_length)
	{
		if(Number.isInt(_length))
		{
			_length = Math.abs(_length);
		}
		else if(_length === null)
		{
			_length = 0;
		}
		else
		{
			_length = this.length;
		}

		return new this.constructor(_length);
	}});


	Object.defineProperty(TypedArray.prototype, 'clone', { value: function()
	{
		return new this.constructor(this);
	}});

	Object.defineProperty(TypedArray.prototype, 'setLength', { value: function(_length = 0, _grow = DEFAULT_GROW)
	{
		if(! Number.isInt(_length))
		{
			return x('Invalid % argument (expecting an -/+ %)', null, '_length', 'Integer');
		}
		else if(_length === 0)
		{
			return this.emptyInstance(0);
		}

		const abs = Math.abs(_length);

		if(abs === this.length)
		{
			return this.clone();
		}
		else if(abs > this.length)
		{
			if(!_grow)
			{
				return this.clone();
			}

			const result = this.emptyInstance(abs);

			if(_length > 0)
			{
				result.set(this);
			}
			else
			{
				result.set(this.subarray(0, this.length), abs - this.length);
			}

			return result;
		}
		else if(_length < 0)
		{
			return this.subarray(abs);
		}

		return this.subarray(0, abs);
	}});

	Object.defineProperty(TypedArray.prototype, 'getIndex', { value: function(_index = -1, _length = this.length, _return = null, _throw = false)
	{
		return getIndex(_index, _length, _return, _throw);
	}});
	
	Object.defineProperty(TypedArray.prototype, 'getNegativeIndex', { value: function(_index = -1, _length = this.length, _return = null, _throw = false)
	{
		return getNegativeIndex(_index, _length, _return, _throw);
	}});

	Object.defineProperty(TypedArray.prototype, 'getByteIndex', { value: function(_index = -1, _length = this.byteLength, _return = null, _throw = false)
	{
		return getIndex(_index, _length, _return, _throw);
	}});

	Object.defineProperty(TypedArray.prototype, 'getNegativeByteIndex', { value: function(_index = -1, _length = this.byteLength, _return = null, _throw = false)
	{
		return getNegativeIndex(_index, _length, _return, _throw);
	}});

	Object.defineProperty(TypedArray.prototype, 'getRandomIndex', { value: function(_crypto = CRYPTO)
	{
		return Math.random.int(this.length - 1, 0, _crypto);
	}});

	Object.defineProperty(TypedArray.prototype, 'getRandomByteIndex', { value: function(_crypto = CRYPTO)
	{
		return Math.random.int(this.byteLength - 1, 0, _crypto);
	}});

	Object.defineProperty(TypedArray.prototype, 'getRandom', { value: function(_count = this.length, _repeat = false, _crypto = CRYPTO)
	{
		if(typeof _crypto !== 'boolean')
		{
			_crypto = CRYPTO;
		}
		
		if(! Number.isInt(_count))
		{
			_count = this.length;
		}
		else
		{
			_count = Math.abs(_count);
		}

		if(_count === 0)
		{
			return this.emptyInstance(0);
		}
		else if(_count > 1 && typeof _repeat !== 'boolean')
		{
			return x('Invalid % argument (expecting a %)', null, '_repeat', 'Boolean');
		}

		var result;

		if(_count === 1)
		{
			result = this.emptyInstance(1);
			result[0] = this[this.getRandomIndex(_crypto)];
		}
		else
		{
			result = this.emptyInstance(_count);
			var index = 0;

			if(_repeat) while(index < _count)
			{
				result[index++] = this[this.getRandomIndex(_crypto)];
			}
			else while(index < _count)
			{
				const copy = this.toArray();
				var idx;

				while(copy.length > 0 && index < _count)
				{
					idx = copy.getRandomIndex(_crypto);
					result[index++] = copy[idx];
					copy.splice(idx, 1);
				}
			}
		}

		return result;
	}});

	Object.defineProperty(TypedArray.prototype, 'toArray', { value: function()
	{
		return Array.fromTypedArray(this);
	}});

	//
	Object.defineProperty(TypedArray.prototype, 'subarr', { value: function(_start, _length)
	{
		if(Number.isNumber(_start) && _start < 0)
		{
			_start = this.getNegativeIndex(_start);
		}

		if(! Number.isInt(_length))
		{
			_length = this.length - _start;
		}

		return this.subarray(_start, _start + _length);
	}});

	//
	Object.defineProperty(TypedArray.prototype, 'at', { value: function(_index, ... _args)
	{
		if(Number.isInt(_index))
		{
			_index = this.getIndex(_index);
		}
		else
		{
			return x('Invalid % argument (expecting -/+ %)', null, '_index', 'Integer');
		}

		if(_args.length === 0)
		{
			return this[_index];
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] !== 'number' && typeof _args[i] !== 'bigint')
			{
				return x('Invalid %[%] argument (expecting only %s or %s)', null, '..._args', i, 'Number', 'BigInt');
			}
		}

		while(_args.length > 0)
		{
			if(this[_index++] !== _args.shift())
			{
				return false;
			}
			else if(_index >= this.length)
			{
				break;
			}
		}

		return (_args.length === 0);
	}});

	//

})();

