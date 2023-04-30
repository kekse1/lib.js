(function()
{

	//
	const DEFAULT_MISSING_OWN = true;
	const DEFAULT_MISSING_ALL = true;

	const DEFAULT_WITH_RESULT_NULL_OBJECT = true;
	const DEFAULT_WITHOUT_RESULT_NULL_OBJECT = true;

	const DEFAULT_PROPERTY_HELPER_BASE_ARRAY = false;
	const DEFAULT_PROPERTY_HELPER_BASE_LENGTH = false;
	const DEFAULT_PROPERTY_HELPER_THROW = false;
	const DEFAULT_PROPERTY_HELPER_CHECK_EXTENSIBILITY = true;
	const DEFAULT_PROPERTY_HELPER_ALLOW_STRINGS = false;
	
	const DEFAULT_FIND_TYPES = false;
	const DEFAULT_FIND_INDICES = false;
	const DEFAULT_FILTER_TYPES = false;
	const DEFAULT_FILTER_INDICES = false;

	//
	isExtensible = Object.isExtensible.bind(Object);

	//
	Object.defineProperty(Object.prototype, 'isError', { get: function() { return false; }});

	//
	//see 'CONFIG.DEPTH_CLONE'
	Object.defineProperty(Object, 'clone', { value: function(_object, _depth = 0, _bind = false, _replace = _bind, _target = null)
	{
		//
		if(BROWSER && typeof Node !== 'undefined'  && (_object instanceof Node))
		{
			return this.cloneNode(_depth !== false && _depth !== 0);
		}

		//
		if(Number.isInt(_depth))
		{
			_depth = Math.abs(_depth);
		}
		else if(_depth !== null)
		{
			_depth = 0;
		}

		//
		//TODO/ bitte "TypedArray" als basis, nicht alle Uint8Array etc. einzeln..!!
		//siehe am bessten zu, dass du .clone abstrakt fuer alle typed-array impleemtierst..! JA, duerfte gehen!!

		//
		const type = typeOf(_object);

		switch(type)
		{
			case 'Undefined': return undefined;
			case 'Null': return null;
			case 'Boolean': return _object.valueOf();
			case 'Number': return _object.valueOf();
			case 'BigInt': return _object.valueOf();
			case 'String': return _object.valueOf();
			case 'Date': return _object.clone();
			case 'RegExp': return _object.clone();
			case 'Error': return _object.clone(false);
			case 'Array': return Array.clone(_object, _depth, _bind, _replace);//_object.clone(_depth, _bind);
			case 'Object': return Object.prototype.clone.call(_object, _depth, _bind, _replace, _target);
			case 'Uint8Array': return _object.clone();
			case 'Function': return x('TODO?');//TODO/..
		}

		//
return x('TODO @ ' + type.toString('\''));
	}});

	clone = Object.clone;

	//see 'CONFIG.DEPTH_CLONE'
	Object.defineProperty(Object.prototype, 'clone', { value: function(_recursion = true, _bind = false, _replace = _bind, _target = null)
	{
		//
		if(BROWSER && typeof Node !== 'undefined'  && (this instanceof Node))
		{
			return this.cloneNode(_recursion !== false && _recursion !== 0);
		}

		//
		if(Number.isInt(_recursion))
		{
			_recursion = Math.abs(_recursion);
		}
		else if(typeof _recursion === 'boolean')
		{
			if(_recursion)
			{
				_recursion = null;
			}
			else
			{
				_recursion = 0;
			}
		}
		else if(_recursion !== null)
		{
			_recursion = 0;
		}

		//

		//
		var result;

		if(Object.isObject(_target))
		{
			result = _target;
		}
		else if(Array.isArray(this))
		{
			result = [];
		}
		else if(Object.isNull(this))
		{
			result = Object.create(null);
		}
		else if(Object.getPrototypeOf(this).constructor?.name === 'Object')
		{
			result = {};
		}
		else
		{
			result = Object.create(Object.getPrototypeOf(this));
		}

		const props = Object.getOwnPropertyNames(this, false, false);

		if(typeof _replace !== 'boolean')
		{
			_replace = (_bind === true);
		}

		if(_bind === true)
		{
			_bind = result;
		}
		else if(typeof _bind === 'undefined')
		{
			_bind = false;
		}

		for(var i = 0; i < props.length; i++)
		{
			const desc = Object.getOwnPropertyDescriptor(this, props[i]);

			if(_replace && desc.value === this)
			{
				desc.value = result;
			}
			else if(_bind !== false)
			{
				if(desc.value === this)
				{
					desc.value = _bind;
				}
				else if(typeof desc.value === 'function')
				{
					desc.value = desc.value.bind(_bind);
				}
				else if(typeof desc.get === 'function')
				{
					desc.get = desc.get.bind(_bind);

					if(typeof desc.set === 'function')
					{
						desc.set = desc.set.bind(_bind);
					}
				}
			}

			Object.defineProperty(result, props[i], desc);
		}

		//
		//TODO/use 'Array.clone()' w/ _depth, etc...!!!
		//
		if(Array.isArray(result, true))
		{
			result.concat(this);
		}

		//
		return result;

		//
		/*else if(Array.isArray(this))
		{
			//result = this.slice();
		}
		else
		{
			//result = Object.assign(this);
		}*/
	}});

	//
	Object.defineProperty(Object, 'className', { value: function(_object, _className = true)
	{
		if(typeof _className !== 'boolean')
		{
			_className = true;
		}

		try
		{
			if(String.isString(_object.constructor.name))
			{
				return _object.constructor.name;
			}
		}
		catch(_er)
		{
		}

		if(_className) try
		{
			if(String.isString(_object.name))
			{
				return _object.name;
			}
		}
		catch(_er)
		{
		}

		return '';
	}});

	className = Object.className;

	//
	Object.defineProperty(Object, 'was', { value: function(_object, ... _args)
	{
		var CASE_SENSITIVE = true;

		for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				CASE_SENSITIVE = _args.splice(i--, 1)[0];
			}
			else if(! String.isString(_args[i]))
			{
				return x('Invalid %[%] argument (not a non-empty %)', null, '..._args', i, 'String');
			}
		}

		if(_args.length > 0)
		{
			if(! CASE_SENSITIVE) for(var i = 0; i < _args.length; ++i)
			{
				_args[i] = _args[i].toLowerCase();
			}

			_args.uniq();
		}

		const result = [];
		const prototypes = Object.getPrototypesOf(_object);
		var name;

		for(var i = 0, j = 0; i < prototypes.length; ++i)
		{
			name = Object.className(prototypes[i]);

			if(typeof name === 'string' && name.length > 0)
			{
				result[j++] = name;

				if(_args.length > 0)
				{
					if(! CASE_SENSITIVE)
					{
						name = name.toLowerCase();
					}

					for(var k = 0; k < _args.length; ++k)
					{
						if(name === _args[k])
						{
							return true;
						}
					}
				}
			}
		}

		if(_args.length > 0)
		{
			return false;
		}

		return result;
	}});

	was = Object.was;

	Object.defineProperty(Object, 'getPrototypesOf', { value: function(_object)
	{
		const result = [];
		var proto = _object;

		try
		{
			while(proto = Object.getPrototypeOf(proto))
			{
				result.push(proto);

				if(String.isString(proto.constructor.name))
				{
					result[proto.constructor.name] = proto;
				}
			};
		}
		catch(_er)
		{
			return result;
		}

		return result;
	}});

	//
	function getPathArray(_path, _throw = true, _delim = '.', _radix = 10)
	{
		if(! (isNumber(_path) || typeof _path === 'string'))
		{
			return [];
		}
		else if(! isString(_delim, false))
		{
			return x('Invalid path delimiter');
		}
		else if(! isRadix(_radix))
		{
			return x('Invalid _radix argument');
		}

		const result = [];

		if(typeof _path === 'string')
		{
			if(_path.length === 0)
			{
				return [];
			}

			const split = _path.split(_delim);

			for(var i = 0, j = 0; i < split.length; ++i)
			{
				if(split[i].length === 0)
				{
					continue;
				}
				else if(split[i].isNumber(_radix))
				{
					result[j++] = parseNumber(split[i], _radix).int;
				}
				else
				{
					result[j++] = split[i];
				}
			}
		}
		else if(typeof _path === 'number')
		{
			result[0] = _path.int;
		}
		else if(_throw)
		{
			return x('The % argument needs to be a % or %', null, '_path', 'String', 'Number');
		}

		return result;
	}

	Object.defineProperty(Object, 'has', { value: function(_path, _context = global)
	{
		return Object.get(_path, _context, true);
	}});

	has = Object.has;

	Object.defineProperty(Object, 'get', { value: function(_path, _context = global, _has = false)
	{
		_path = getPathArray(_path, false);

		if(_path.length === 0)
		{
			if(_has)
			{
				return true;
			}

			return _context;
		}

		var obj = _context;

		for(var i = 0; i < _path.length - 1; ++i)
		{
			try
			{
				if(Number.isInt(_path[i]) && Array.isArray(obj, true))
				{
					if(obj.length === 0)
					{
						if(_has)
						{
							return false;
						}

						return undefined;
					}
					else if(_path[i] < 0)
					{
						if((Math.abs(_path[i]) - 1) >= obj.length)
						{
							if(_has)
							{
								return false;
							}

							return undefined;
						}
					}
					else if(_path[i] >= obj.length)
					{
						if(_has)
						{
							return false;
						}

						return undefined;
					}
					else
					{
						_path[i] = obj.getIndex(_path[i]);
					}
				}

				obj = obj[_path[i]];
			}
			catch(_error)
			{
				if(_has)
				{
					return false;
				}

				return undefined;
			}
		}

		try
		{
			if(Number.isInt(_path[_path.length - 1]) && Array.isArray(obj, true))
			{
				if(obj.length === 0)
				{
					if(_has)
					{
						return false;
					}

					return undefined;
				}
				else if(_path[_path.length - 1] < 0)
				{
					if((Math.abs(_path[_path.length - 1]) - 1) >= obj.length)
					{
						if(_has)
						{
							return false;
						}

						return undefined;
					}
				}
				else if(_path[_path.length - 1] >= obj.length)
				{
					if(_has)
					{
						return false;
					}

					return undefined;
				}

				if(_has)
				{
					return true;
				}

				return obj[obj.getIndex(_path[_path.length - 1])];
			}
			else if(_has)
			{
				return (_path[_path.length - 1] in obj);
			}

			return obj[_path[_path.length - 1]];
		}
		catch(_error)
		{
			if(_has)
			{
				return false;
			}
		}

		return undefined;
	}});

	Object.defineProperty(global, 'get', { value: Object.get });

	Object.defineProperty(Object, 'set', { value: function(_path, _value, _context = global, _null_object = false)
	{
		_path = getPathArray(_path);

		if(_path.length === 0)
		{
			return _context;
		}

		var obj = _context;

		if(! Object.isObject(obj))
		{
			_context = obj = (_null_object ? Object.create(null) : {});
		}

		var lastObj = obj;
		var nextKey;

		const preparePathItem = (_p, _o) => {
			if(typeof _p === 'undefined' || _p === null)
			{
				return null;
			}
			else if(Number.isInt(_p))
			{
				if(Array.isArray(_o, false))
				{
					return _o.getIndex(_p);
				}
				else if(_p <= 0)
				{
					return 0;
				}

				return _p;
			}
			else if(String.isString(_p))
			{
				return _p;
			}

			return null;
		};

		for(var i = 0; i < _path.length - 1; ++i)
		{
			_path[i] = preparePathItem(_path[i], obj);

			if(! Object.isObject(obj[_path[i]], true, true))
			{
				if(Number.isInt(nextKey = preparePathItem(_path[i + 1])))
				{
					obj = lastObj[_path[i]] = [];
				}
				else if(String.isString(nextKey))
				{
					obj = lastObj[_path[i]] = (_null_object ? Object.create(null) : {});
				}
				else
				{
					break;
				}
			}
			else
			{
				obj = obj[_path[i]];
			}

			lastObj = obj;
		}

		_path[_path.length - 1] = preparePathItem(_path[_path.length - 1], obj);

		if(typeof _value === 'undefined')
		{
			if(Array.isArray(obj, true))
			{
				if(obj.length > 0)
				{
					obj.splice(_path[_path.length - 1], 1);
				}
			}
			else
			{
				delete obj[_path[_path.length - 1]];
			}
		}
		else
		{
			obj[_path[_path.length - 1]] = _value;
		}

		return _context;
	}});

	Object.defineProperty(global, 'set', { value: Object.set });

	Object.defineProperty(Object, 'unset', { value: function(_path, _context = global)
	{
		return Object.set(_path, undefined, _context);
	}});

	Object.defineProperty(global, 'unset', { value: Object.unset });

	Object.defineProperty(Object, 'merge', { value: function()
	{
		return Object.prototype.merge.apply({}, arguments);
	}});

	Object.defineProperty(global, 'merge', { value: Object.merge });

	Object.defineProperty(Object.prototype, 'merge', { value: function()
	{
		//
		if(arguments.length === 0)
		{
			return this;
		}

		//
		var result = this;
		var props, desc;

		for(var i = 0; i < arguments.length; i++)
		{
			if(typeof arguments[i] === 'undefined' || arguments[i] === null || typeof arguments[i] === 'string')
			{
				continue;
			}
			else if(Array.isArray(arguments[i], true))
			{
				if(Array.isArray(result, true))
				{
					result.concat(arguments[i]);
				}
				else
				{
					result = Object.array(result, arguments[i]);
				}
			}

			try
			{
				if((props = Object.getOwnPropertyNames(arguments[i], false, false)).length === 0)
				{
					continue;
				}
			}
			catch(_error)
			{
				continue;
			}

			for(var j = 0; j < props.length; j++)
			{
				//
				const key = props[j];

				//
				try
				{
					desc = Object.getOwnPropertyDescriptor(arguments[i], key);
				}
				catch(_error)
				{
					continue;
				}

				if(typeof desc === 'undefined' || desc === null)
				{
					continue;
				}

				if(typeof desc.get === 'function')
				{
					desc.get = desc.get.bind(result);

					if(typeof desc.set === 'function')
					{
						desc.set = desc.set.bind(result);
					}
				}
				else if(typeof desc.value === 'function')
				{
					desc.value = desc.value.bind(result);
				}
				else if(Object.isObject(desc.value))
				{
					if(Object.isObject(result[key]))
					{
						if(result[key] !== desc.value)
						{
							Object.prototype.merge.call(result[key], desc.value);
						}

						continue;
					}
				}

				Object.defineProperty(result, key, desc);
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Object.prototype, 'LENGTH', { get: function()
	{
		return Object.LENGTH(this);
	}});

	Object.defineProperty(Object.prototype, 'LEN', { get: function()
	{
		return Object.LEN(this);
	}});

	Object.defineProperty(Object, 'getOwnProperties', { value: function(_object, _array = false, _length = false)
	{
		return Array.concat(Object.getOwnPropertyNames(_object, _array, _length), Object.getOwnPropertySymbols(_object));
	}});

	Object.defineProperty(Object, 'LENGTH', { value: function(... _objects)
	{
		var result = 0;

		for(var i = 0; i < _objects.length; ++i)
		{
			if(Object.isObject(_objects[i]))
			{
				result += (Object.getOwnPropertyNames(_objects[i], false, false).length +
					Object.getOwnPropertySymbols(_objects[i]).length);
			}
			else
			{
				return x('Argument %[%] is not an %', null, '..._objects', i, 'Object');
			}
		}

		return result;
	}});

	Object.defineProperty(Object, 'LEN', { value: function(... _objects)
	{
		var result = 0;

		for(var i = 0; i < _objects.length; ++i)
		{
			if(Object.isObject(_objects[i]))
			{
				result += Object.keys(_objects[i]).length;
			}
			else
			{
				return x('Argument %[%] is not an %', null, '..._objects', i, 'Object');
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Object.prototype, 'sort', { value: function(_asc = true, _bind = true, _array = true, _length = false)
	{
		const props = Object.getOwnPropertyNames(this, _array, _length).sort(null, _asc);
		const result = {};
		var desc;

		if(_bind === true)
		{
			_bind = result;
		}
		else if(_bind === false)
		{
			_bind = undefined;
		}

		for(var i = 0; i < props.length; i++)
		{
			desc = Object.getOwnPropertyDescriptor(this, props[i]);

			if(typeof _bind !== 'undefined')
			{
				if(desc.value === this)
				{
					desc.value = _bind;
				}
				else if(typeof desc.value === 'function')
				{
					desc.value = desc.value.bind(_bind);
				}
				else if(typeof desc.get === 'function')
				{
					desc.get = desc.get.bind(_bind);

					if(typeof desc.set === 'function')
					{
						desc.set = desc.set.bind(_bind);
					}
				}
			}

			Object.defineProperty(result, props[i], desc);
		}

		return result;
	}});

	Object.defineProperty(Object.prototype, 'getSortedArray', { value: function(_values = true, _asc = true, _all = false)
	{
		//
		if(typeof _values !== 'boolean')
		{
			return x('Invalid % argument (expecting a %)', null, '_values', 'Boolean');
		}
		else if(typeof _all !== 'boolean')
		{
			return x('Invalid % argument (expecting a %)', null, '_all', 'Boolean');
		}
		else if(typeof _asc !== 'boolean')
		{
			_asc = true;
		}

		//
		const keys = (_all ? Object.getOwnPropertyNames(this, false, false) : Object.keys(this, false, false));
		const list = new Array(keys.length);

		for(var i = 0; i < keys.length; i++)
		{
			list[i] = [ keys[i], this[keys[i]] ];
		}

		//
		list.sort(1, _asc);

		//
		const result = new Array(list.length);

		for(var i = 0; i < keys.length; i++)
		{
			if(_values)
			{
				result[i] = [ list[i][0], list[i][1] ];
			}
			else
			{
				result[i] = list[i][0];
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Object, 'flat', { value: function(_object, _depth = 0)
	{
		if(_depth === null)
		{
			_depth = 0;
		}

		const array = Array.flat(_object, _depth);
		const result = {};

		for(var i = 0; i < array.length; i++)
		{
			const got = Object.get(array[i], _object);

			if(Array.isArray(got))
			{
				result[array[i]] = Array.from(got);
			}
			else if(typeof got === 'string' || Object.LENGTH(got) === 0)
			{
				result[array[i]] = got;
			}
		}

		return result;
	}});

	Object.defineProperty(Object, 'deflat', { value: function(_flat_object)
	{
		const result = {};
		const props = Object.getOwnPropertyNames(_flat_object, false, false);

		for(var i = 0; i < props.length; i++)
		{
			if(Array.isArray(_flat_object[props[i]]))
			{
				Object.set(props[i], Array.from(_flat_object[props[i]]), result);
			}
			else
			{
				Object.set(props[i], _flat_object[props[i]], result);
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Object, 'null', { value: function(... _args)
	{
		const result = Object.create(null);

		if(_args.length === 0)
		{
			return result;
		}
		else for(var i = 0; i < _args.length; i++)
		{
			if(Object.isObject(_args[i]))
			{
				Object.prototype.clone.call(_args[i], true, true, true, result);
			}
		}

		return result;
	}});

	Object.defineProperty(Object, 'array', { value: function(_object, _array)
	{
		if(! Array.isArray(_array, true))
		{
			_array = [];
		}
		else
		{
			_array = [ ... _array ];
		}

		if(! Object.isObject(_object))
		{
			return [ ... _array ];
		}

		const result = [];

		Object.prototype.clone.call(_object, true, true, true, result);
		Array.prototype.concat.call(result, _array);

		return result;
	}});

	//
	Object.defineProperty(Object, 'equal', { value: function(... _args)
	{
		//
		if(_args.length === 0)
		{
			return null;
		}

		var firstArgIsArray = null;
		var depth = 0;
		var same = 0;

		for(var i = 0; i < _args.length; ++i)
		{
			if(Number.isInt(_args[i]) && _args[i] >= 0)
			{
				depth = _args.splice(i--, 1)[0];
			}
			else if(_args[i] === true || _args[i] === null)
			{
				depth = null;
				_args.splice(i--, 1);
			}
			else if(_args[i] === false)
			{
				depth = 0;
				_args.splice(i--, 1);
			}
			else if(Object.isObject(_args[i]))
			{
				if(firstArgIsArray === null)
				{
					firstArgIsArray = Array.isArray(_args[i], true);
				}

				if(_args[i] === _args[0])
				{
					++same;
				}
				else if(Array.isArray(_args[i], true))
				{
					if(firstArgIsArray === false)
					{
						return false;
					}
				}
				else if(firstArgIsArray === true)
				{
					return false;
				}
			}
			else
			{
				return x('Invalid %[%] argument (not an %)', null, '..._args', i, 'Object');
			}
		}

		if(same === _args.length)
		{
			return true;
		}
		else if(_args.length === 0)
		{
			return null;
		}
		else if(_args.length === 1)
		{
			return true;
		}
		else if(same > 1)
		{
			_args.uniq();
		}

		if(firstArgIsArray === true)
		{
			if(! Array.equal(... _args))
			{
				return false;
			}
		}

		//
		const traverse = (_current_depth = 0, ... _a) => {
			var firstArgIsArray = Array.isArray(_a[0], true);
			const props = new Array(_a.length);

			for(var i = 0; i < _a.length; ++i)
			{
				var s = 0;

				for(var j = 1; j < _a.length; ++j)
				{
					if(_a[j] === _a[0])
					{
						++s;
					}

					if(Array.isArray(_a[j], true))
					{
						if(! firstArgIsArray)
						{
							return false;
						}
						else if(_a[j].length !== _a[0].length)
						{
							return false;
						}
					}
					else if(firstArgIsArray === true)
					{
						return false;
					}
				}

				if(s === _a.length)
				{
					return true;
				}
				else if(s > 1)
				{
					_a.uniq();
				}

				for(var j = 0; j < _a.length; ++j)
				{
					if((props[j] = Object.getOwnPropertyNames(_a[j])).length !== props[0].length)
					{
						return false;
					}
					else
					{
						props[j].sort();
					}
				}

				if(! Array.equalValues(... props))
				{
					return false;
				}
			}

			//
			const firstArgIsObject = Object.isObject(_a[0]);

			for(var i = 0; i < props[0].length; ++i)
			{
				for(var j = 1; j < _a.length; ++j)
				{
					if(Object.isObject(_a[j][props[j][i]]))
					{
						if(firstArgIsObject === true)
						{
							if(depth === null || (_current_depth < depth))
							{
								return traverse(_current_depth + 1, { ... _a[j][props[i]] });
							}
						}
						else
						{
							return false;
						}
					}

					if(_a[j][props[j][i]] !== _a[0][props[j][i]])
					{
						return false;
					}
				}
			}

			return true;
		};

		return traverse(0, ... _args);
	}});

	Object.defineProperty(Object, 'equalKeys', { value: function(... _args)
	{
		//
		if(_args.length === 0)
		{
			return null;
		}

		var firstArgIsArray = null;
		var same = 0;
		var depth = 0;

		for(var i = 0; i < _args.length; ++i)
		{
			if(Number.isInt(_args[i]) && _args[i] >= 0)
			{
				depth = _args.splice(i--, 1)[0];
			}
			else if(_args[i] === null || _args[i] === true)
			{
				depth = null;
				_args.splice(i--, 1);
			}
			else if(_args[i] === false)
			{
				depth = 0;
				_args.splice(i--, 1);
			}
			else if(Object.isObject(_args[i]))
			{
				if(firstArgIsArray === null)
				{
					firstArgIsArray = Array.isArray(_args[i], true);
				}

				if(_args[i] === _args[0])
				{
					++same;
				}
				else if(Array.isArray(_args[i], true))
				{
					if(firstArgIsArray === false)
					{
						return false;
					}
					else if(_args[i].length !== _args[0].length)
					{
						return false;
					}
				}
				else if(firstArgIsArray === true)
				{
					return false;
				}
			}
			else
			{
				return x('Invalid %[%] argument (not an %)', null, '..._args', i, 'Object');
			}
		}

		if(same === _args.length)
		{
			return true;
		}
		else if(_args.length === 0)
		{
			return null;
		}
		else if(_args.length === 1)
		{
			return true;
		}
		else if(same > 1)
		{
			_args.uniq();
		}

		//
		const traverse = (_current_depth = 0, ... _a) => {
			const props = new Array(_a.length);

			for(var i = 0; i < _a.length; ++i)
			{
				if((props[i] = Object.getOwnPropertyNames(_a[i], false, false)).length !== props[0].length)
				{
					return false;
				}
				else
				{
					props[i].sort();
				}
			}

			if(! Array.equalValues(... props))
			{
				return false;
			}

			const list = [];

			for(var i = 0; i < props[0].length; ++i)
			{
				list.length = 0;

				for(var j = 0; j < _a.length; ++j)
				{
					if(Object.isObject(_a[j][props[0][i]]) && (depth === null || (_current_depth < depth)))
					{
						list[j] = _a[j][props[0][i]];
					}
					else
					{
						break;
					}
				}

				if(list.length === _a.length)
				{
					return traverse(_current_depth + 1, ... list);
				}
			}

			return true;
		};

		return traverse(0, ... _args);
	}});

	//
	Object.defineProperty(Object, 'isObject', { value: function(_object, _array_is_object = true, _empty_array = false, _typed_array = true)
	{
		if(_object === null)
		{
			return false;
		}
		else if(typeof _object === 'object')
		{
			if(Array.isArray(_object, _empty_array, _typed_array))
			{
				return _array_is_object;
			}

			return true;
		}

		return false;
	}});

	isObject = Object.isObject;

	//
	isExtensible = Object.isExtensible;

	//
	Object.defineProperty(Object.prototype, 'missing', { value: function(... _args)
	{
		//
		if(_args.length === 0)
		{
			return [];
		}

		var own = DEFAULT_MISSING_OWN;
		var all = DEFAULT_MISSING_ALL;

		const obj = [];

		for(var i = 0, j = 0; i < _args.length; ++i)
		{
			if(String.isString(_args[i]))
			{
				continue;
			}
			else if(Object.isObject(_args[i]))
			{
				obj[j++] = _args.splice(i--, 1)[0];
			}
			else if(typeof _args[i] === 'boolean')
			{
				own = _args.splice(i--, 1)[0];
			}
			else if(_args[i] === null)
			{
				all = false;
				_args.splice(i--, 1);
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s or %s)', null, '..._args', i, 'String', 'Object');
			}
		}

		for(var i = 0; i < obj.length; ++i)
		{
			if(all)
			{
				_args.concat(Object.getOwnPropertyNames(obj[i], false, false));
			}
			else
			{
				_args.concat(Object.keys(obj[i], false, false));
			}
		}

		//
		if(_args.length === 0)
		{
			return [];
		}

		//
		const result = [];

		for(var i = 0, j = 0; i < _args.length; ++i)
		{
			if(own)
			{
				if(! Object.hasOwn(this, _args[i]))
				{
					result[j++] = _args[i];
				}
			}
			else
			{
				if(! (_args[i] in this))
				{
					result[j++] = _args[i];
				}
			}
		}

		//
		return result;
	}});

	//
	Object.defineProperty(Object.prototype, 'without', { value: function(... _args)
	{
		//
		const obj = [];

		for(var i = 0, j = 0; i < _args.length; ++i)
		{
			if(String.isString(_args[i]))
			{
				continue;
			}
			else if(Object.isObject(_args[i]))
			{
				obj[j++] = _args.splice(i--, 1)[0];
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s or %s)', null, '..._args', i, 'String', 'Object');
			}
		}

		for(var i = 0; i < obj.length; ++i)
		{
			_args.concat(Object.getOwnPropertyNames(obj[i], false, false));
		}

		//
		const result = (DEFAULT_WITHOUT_RESULT_NULL_OBJECT ? Object.create(null) : {});

		if(_args.length === 0)
		{
			return result;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(! Object.hasOwn(this, _args[i]))
			{
				continue;
			}

			result[_args[i]] = this[_args[i]];
			delete this[_args[i]];
		}

		return result;
	}});

	Object.defineProperty(Object.prototype, 'with', { value: function(... _args)
	{
		//
		const obj = [];

		for(var i = 0, j = 0; i < _args.length; ++i)
		{
			if(String.isString(_args[i]))
			{
				continue;
			}
			else if(Object.isObject(_args[i]))
			{
				obj[j++] = _args.splice(i--, 1)[0];
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s or %s)', null, '..._args', i, 'String', 'Object');
			}
		}

		for(var i = 0; i < obj.length; ++i)
		{
			_args.concat(Object.getOwnPropertyNames(obj[i], false, false));
		}

		//
		const result = (DEFAULT_WITH_RESULT_NULL_OBJECT ? Object.create(null) : {});

		if(_args.length === 0)
		{
			return result;
		}

		//
		const remove = Object.getOwnPropertyNames(this, false, false);

		for(var i = remove.length - 1; i >= 0; --i)
		{
			if(_args.indexOf(remove[i]) > -1)
			{
				remove.splice(i, 1);
			}
		}

		for(var i = 0; i < remove.length; ++i)
		{
			result[remove[i]] = this[remove[i]];
			delete this[remove[i]];
		}

		//
		return result;
	}});

	//
	function propertyHelper(_type, _object, _array = DEFAULT_PROPERTY_HELPER_BASE_ARRAY, _length = DEFAULT_PROPERTY_HELPER_BASE_LENGTH, _throw = DEFAULT_PROPERTY_HELPER_THROW, _check_for_extensibility = DEFAULT_PROPERTY_HELPER_CHECK_EXTENSIBILITY, _allow_strings = DEFAULT_PROPERTY_HELPER_ALLOW_STRINGS)
	{
		//
		if(_array === null) switch(_type)
		{
			case 'keys':
			case 'getOwnPropertyNames':
			case 'entries':
				return Object['_' + _type].call(_object, _object);
			default:
				return x('Invalid % argument (expecting on of [ %, %, % ])', null, '_type', 'keys', 'getOwnPropertyNames', 'entries');
		}

		//
		if(typeof _allow_strings !== 'boolean')
		{
			_allow_strings = DEFAULT_PROPERTY_HELPER_ALLOW_STRINGS;
		}

		//
		if(typeof _object === 'string')
		{
			if(! _allow_strings)
			{
				return [];
			}

			const res = [];

			for(var i = 0; i < _object.length; ++i)
			{
				if(_type === 'entries')
				{
					res[i] = [ i, _object[i] ];
				}
				else
				{
					res[i] = i;
				}
			}

			return res;
		}

		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_PROPERTY_HELPER_THROW;
		}

		if(typeof _check_for_extensibility !== 'boolean')
		{
			_check_for_extensibility = DEFAULT_PROPERTY_HELPER_CHECK_EXTENSIBILITY;
		}

		//
		var func;

		if(String.isString(_type)) switch(_type)
		{
			case 'keys':
			case 'getOwnPropertyNames':
			case 'entries':
				func = Object['_' + _type];
				break;
			default:
				return x('Invalid % argument (expecting on of [ %, %, % ])', null, '_type', 'keys', 'getOwnPropertyNames', 'entries');
		}
		else
		{
			return x('Invalid % argument (expecting on of [ %, %, % ])', null, '_type', 'keys', 'getOwnPropertyNames', 'entries');
		}

		//
		if(_type === 'entries' || _type === 'keys')
		{
			_length = null;
		}
		else if(typeof _length !== 'boolean')
		{
			return x('The % argument needs to be a % type (see also %)', null, '_length', 'Boolean', 'DEFAULT_PROPERTY_HELPER_BASE_LENGTH');
		}

		if(typeof _array !== 'boolean')
		{
			return x('The % argument needs to be a % type (see also %)', null, '_array', 'Boolean', 'DEFAULT_PROPERTY_HELPER_BASE_ARRAY');
		}

		//
		if(_check_for_extensibility && !Object.isExtensible(_object))
		{
			if(_throw)
			{
				return x('Your % is ' + 'not extensible' + ' (see %.%)!', null, '_object', 'Object', 'isExtensible()');
			}

			return [];
		}

		//
		const array = (Array.isArray(_object, true) ? _object.splice(0, _object.length) : null);
		var result;

		try
		{
			result = func.call(_object, _object);
		}
		catch(_error)
		{
			if(_throw)
			{
				return x(_error);
			}

			return [];
		}

		//
		if(array !== null)
		{
			const adaptForEntries = () => {
				for(var i = 0, j = result.length; i < array.length; ++i, ++j)
				{
					result[j] = [ i, array[i] ];
				}
			};

			const adaptForOthers = () => {
				for(var i = 0, j = result.length; i < array.length; ++i, ++j)
				{
					result[j] = i;
				}
			};

			if(_type === 'getOwnPropertyNames')
			{
				result.remove('length');

				if(_length)
				{
					result.push('length');
				}
			}

			for(var i = 0; i < array.length; ++i)
			{
				_object[i] = array[i];
			}

			if(_array) switch(_type)
			{
				case 'entries':
					adaptForEntries();
					break;
				case 'keys':
				case 'getOwnPropertyNames':
					adaptForOthers();
					break;
			}
		}

		//
		return result;
	}

	Object.defineProperty(Object, '_keys', { value: Object.keys });
	Object.defineProperty(Object, '_getOwnPropertyNames', { value: Object.getOwnPropertyNames });
	Object.defineProperty(Object, '_entries', { value: Object.entries });

	Object.defineProperty(Object, 'keys', { value: function(_object, _array = DEFAULT_PROPERTY_HELPER_BASE_ARRAY, _length = DEFAULT_PROPERTY_HELPER_BASE_LENGTH)
	{
		return propertyHelper('keys', _object, _array, _length);
	}});

	Object.defineProperty(Object, 'getOwnPropertyNames', { value: function(_object, _array = DEFAULT_PROPERTY_HELPER_BASE_ARRAY, _length = DEFAULT_PROPERTY_HELPER_BASE_LENGTH)
	{
		return propertyHelper('getOwnPropertyNames', _object, _array, _length);
	}});

	Object.defineProperty(Object, 'entries', { value: function(_object, _array = DEFAULT_PROPERTY_HELPER_BASE_ARRAY, _length = DEFAULT_PROPERTY_HELPER_BASE_LENGTH)
	{
		return propertyHelper('entries', _object, _array, _length);
	}});

	Object.defineProperty(Object, 'getPropertyNames', { value: function(_object, _array = DEFAULT_PROPERTY_HELPER_BASE_ARRAY, _length = DEFAULT_PROPERTY_HELPER_BASE_LENGTH)
	{
		const result = [];
		var obj = _object;

		do
		{
			result.concat(Object.getOwnPropertyNames(obj, _array, _length));
		}
		while(obj = obj.__proto__);

		return result;
	}});

	//
	Object.defineProperty(Object, 'findLongestPropertyLength', { value: function(_object, _array = false, _keys = false)
	{
		if(typeof _keys !== 'boolean')
		{
			_keys = false;
		}

		if(_array === false || _array === null || typeof _array === 'undefined')
		{
			_array = null;
		}
		else if(_array === true)
		{
			_array = 10;
		}
		else if(! isRadix(_array))
		{
			_array = 10;
		}

		if(typeof _length !== 'boolean')
		{
			_length = true;
		}

		var keys;

		if(_keys)
		{
			keys = Object.keys(_object, _array !== null);
		}
		else
		{
			keys = Object.getOwnPropertyNames(_object, _array !== null, true);
		}

		for(var i = 0; i < keys.length; ++i)
		{
			if(_array && Number.isInt(keys[i]))
			{
				keys[i] = keys[i].toString(_array).length;
			}
			else
			{
				keys[i] = keys[i].length;
			}
		}

		var result = 0;

		for(const k of keys)
		{
			if(k > result)
			{
				result = k;
			}
		}

		return result;
	}});

	Object.defineProperty(Object, 'findLongestKeyLength', { value: function(_object, _array = false)
	{
		return Object.findLongestPropertyLength(_object, _array, true);
	}});

	//
	Object.defineProperty(Object, 'same', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 1; i < _args.length; ++i)
		{
			if(_args[i] !== _args[0])
			{
				return false;
			}
		}

		return true;
	}});

	same = Object.same;

	//
	Object.defineProperty(Object, 'intersect', { value: function(... _args)
	{
		var UNIQUE = false;
		
		for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				UNQIUE = _args.splice(i--, 1)[0];
			}
			else if(! Object.isObject(_args[i], true, false))
			{
				return x('Your %[%] is not an % (or %, and also no %)', null, '..._args', i, 'Object', 'Array', 'Boolean');
			}
			else if(_args.indexOf(_args[i]) < i)
			{
				_args.splice(i--, 1);
			}
			else if(Array.isArray(_args[i], true))
			{
				_args[i].concat(Object.getOwnPropertyNames(_args[i], false, false));

				if(_args[i].length === 0)
				{
					_args.splice(i--, 1);
				}
			}
			else
			{
				_args[i] = Object.getOwnPropertyNames(_args[i], false, false);
			}
		}

		return Array.intersect(UNIQUE, ... _args);
	}});

	//
	Object.defineProperty(Object.prototype, 'lookUp', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(String.isString(_args[i]))
			{
				_args[i] = _args[i].trim().toLowerCase();
			}
			else
			{
				return x('Invalid %[%] argument (not a non-empty %)', null, '..._args', i, 'String');
			}
		}

		if(_args.length > 1)
		{
			_args.uniq();
		}

		const isArray = Array.isArray(this, false);
		const result = (isArray ? [] : {});
		var found = 0;

		if(isArray) for(var i = 0, k = 0; i < this.length; ++i)
		{
			if(String.isString(this[i]))
			{
				for(var j = 0; j < _args.length; ++j)
				{
					if(this[i].toLowerCase() === _args[j])
					{
						++found;
						result[k++] = this[i];
						break;
					}
				}
			}
		}

		const keys = Object.getOwnPropertyNames(this, false, false);

		for(var i = 0; i < keys.length; ++i)
		{
			if(String.isString(this[keys[i]]))
			{
				for(var j = 0; j < _args.length; ++j)
				{
					if(keys[i].toLowerCase() === _args[j])
					{
						++found;
						result[keys[i]] = this[keys[i]];
						break;
					}
				}
			}
		}

		if(found === 0)
		{
			return null;
		}

		return result;
	}});

	//
	const _is = Object.is;

	Object.defineProperty(Object, 'is', { value: function(_item, _name, _class = true, _case_sensitive = true)
	{
		if(typeof _name !== 'string' || _name.length === 0)
		{
			_name = null;
		}
		else if(!_case_sensitive)
		{
			_name = _name.toLowerCase();
		}

		var compare;

		const tryConstructorName = () => {
			try
			{
				if(_name)
				{
					compare = _item.constructor.name;

					if(!_case_sensitive)
					{
						compare = compare.toLowerCase();
					}

					return (compare === _name);
				}
				else if(!_case_sensitive)
				{
					return _item.constructor.name.toLowerCase();
				}

				return _item.constructor.name;
			}
			catch(_error)
			{
				if(_name)
				{
					return false;
				}

				return '';
			}
		};

		const tryClassName = () => {
			try
			{
				if(_name)
				{
					compare = _item.name;

					if(!_case_sensitive)
					{
						compare = compare.toLowerCase();
					}

					return (compare === _name);
				}
				else if(!_case_sensitive)
				{
					return _item.name.toLowerCase();
				}

				return _item.name;
			}
			catch(_error)
			{
				if(_name)
				{
					return false;
				}

				return '';
			}
		};

		var result = tryConstructorName();

		if(result)
		{
			return result;
		}
		else if(_class && (result = tryClassName()))
		{
			return result;
		}
		else if(_name)
		{
			return false;
		}

		return result;
	}});

	is = Object.is;

	//
	const _assign = Object.assign;

	Object.defineProperty(Object, 'assign', { value: function(... _args)
	{
		return {}.assign(... _args);
	}});

	Object.defineProperty(Object.prototype, 'assign', { value: function(... _args)
	{
		const result = this;

		for(var i = 0; i < _args.length; ++i)
		{
			if(Object.isExtensible(_args[i]))
			{
				_assign.call(result, result, _args.splice(i--, 1)[0]);
			}
		}

		return result;
	}});

	//
	const _toString = Object.prototype.toString;

	Object.defineProperty(Object.prototype, '_toString', { get: function() { return _toString; }});

	Object.defineProperty(Object, 'typeOf', { value: function(_object, _class = false)
	{
		var result;

		if(_class === true)
		{
			result = Object.className(_object);
		}

		if(!_class || result.length === 0)
		{
			result = _toString.call(_object).slice(8, -1);
		}

		if(_class === null && result === 'Number')
		{
			if(Number.isInt(_object))
			{
				result = 'Integer';
			}
			else if(Number.isFloat(_object))
			{
				result = 'Float';
			}
			else if(Number.isNaN(_object))
			{
				result = 'NaN';
			}
			else if(! Number.isFinite(_object))
			{
				result = 'Infinity';
			}
			else
			{
				result = '(Unknown Number)';
			}
		}

		return result;
	}});

	typeOf = Object.typeOf;
	
	//
	Object.defineProperty(Object.prototype, 'filter', { value: function(_filter, _types = DEFAULT_FILTER_TYPES, _regular_typeof = false)
	{
		if(String.isString(_filter, true))
		{
			if(_filter.length === 0)
			{
				return true;
			}
			
			_filter = [ _filter ];
		}
		
		if(typeof _filter !== 'object' || _filter === null)
		{
			return x('Invalid % argument (no % or %)', null, '_filter', 'Object', 'Array');
		}
		else if(Array.isArray(_filter, true))
		{
			if(_filter.length === 0)
			{
				return true;
			}
			else if(_types)
			{
				return x('You can\'t use an % as % argument with % == %', null, 'Array', '_filter', '_types', true);
			}

			_types = null;
			_regular_typeof = null;
			_filter.uniq();
		}
		else
		{
			if(typeof _types !== 'boolean')
			{
				_types = DEFAULT_FILTER_TYPES;
			}

			if(typeof _regular_typeof !== 'boolean')
			{
				_regular_typeof = false;
			}
			
			if(Object.keys(_filter).length === 0)
			{
				return true;
			}
		}
		
		const array = () => {
			if(_filter.length === 0)
			{
				return null;
			}
			else for(var i = 0; i < _filter.length; ++i)
			{
				if(String.isString(_filter[i], false))
				{
					if(! (_filter[i] in this))
					{
						return false;
					}
				}
				else
				{
					return x('Invalid %[%] argument (not a non-empty %)', null, '_filter', i, 'String');
				}
			}
			
			return true;
		};
		
		const object = () => {
			var match, type;
			
			for(const idx in _filter)
			{
				if(! (idx in this))
				{
					return false;
				}
				else if(_types)
				{
					if(String.isString(_filter[idx], false))
					{
						_filter[idx] = [ _filter[idx] ];
					}
					else if(! Array.isArray(_filter[idx], false))
					{
						return x('Invalid %[%] argument (with %, all % values need to be %s or %s)', null, '_filter', idx, '_types', 'Array', 'String');
					}

					match = false;
					type = (_regular_typeof ? (typeof this[idx]) : typeOf(this[idx]));
					
					for(var i = 0; i < _filter[idx].length; ++i)
					{
						//if(_regular_typeof && !_filter[idx].isLowerCase()//..
						if(_filter[idx][i] === type)
						{
							match = true;
							break;
						}
					}
					
					if(! match)
					{
						return false;
					}
				}
				else if(this[idx] !== _filter[idx])
				{
					return false;
				}
			}
			
			return true;
		};
		
		if(Array.isArray(_filter))
		{
			return array();
		}
		
		return object();
	}});
	
	Object.defineProperty(Object, 'filter', { value: function(_filter, ... _args)
	{
		const _types = (typeof _args[0] === 'boolean' ? _args.shift() : DEFAULT_FILTER_TYPES);
		const _regular_typeof = (typeof _args[0] === 'boolean' ? _args.shift() : false);
		const result = [];
		var indices = DEFAULT_FILTER_INDICES;

		if(_args.length === 0)
		{
			return result;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(! Object.isObject(_args[i]))
			{
				if(typeof _args[i] === 'boolean')
				{
					indices = _args.splice(i--, 1)[0];
				}
				else if(_args[i] === null)
				{
					_args.splice(i--, 1);
					indices = !indices;
				}
				else
				{
					return x('Your %[%] is no %', null, '..._args', i, 'Object');
				}
			}
		}
		
		for(var i = 0, j = 0; i < _args.length; ++i)
		{
			if(_args[i].filter(_filter, _types, _regular_typeof))
			{
				if(indices)
				{
					result[j++] = i;
				}
				else
				{
					result[j++] = _args[i];
				}
			}
		}
		
		return result;
	}});

	//
	Object.defineProperty(Object, 'isNull', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] !== 'object' || _args[i] === null)
			{
				return false;
			}
			else if(Object.getPrototypeOf(_args[i]) !== null)
			{
				return false;
			}
		}

		return true;
	}});

	//

})();

//
module.exports = Object;

