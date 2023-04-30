(function()
{

	//
	const DEFAULT_TO_STRING_COMPACT = true;
	const DEFAULT_TO_STRING_SPACES = (TABS || 4);
	const DEFAULT_TO_STRING_SPACES_COMPACT = 1;
	const DEFAULT_TO_STRING_INDEX = true;
	const DEFAULT_TO_STRING_INDEX_COMPACT = false;
	const DEFAULT_TO_STRING_RADIX = 10;
	const DEFAULT_TO_STRING_QUOTE = true;

	const DEFAULT_OVERWRITE_OVER_LENGTH = false;

	const DEFAULT_TRIM_REMOVE_EMPTY = false;

	const DEFAULT_GROW = true;

	const DEFAULT_COUNT_MULTIPLY = true;
	
	const DEFAULT_SORT_RADIX = 16;
	const DEFAULT_MUTABLE = false;

	const DEFAULT_ISARRAY_EMPTY = 1;
	const DEFAULT_ISARRAY_TYPED = true;
	const DEFAULT_ISARRAY_CLASS = false;

	//
	Object.defineProperty(Array, 'isArrayClass', { value: function(_item, _typed = true)
	{
		if(_item === Array)
		{
			return true;
		}
		else if(_typed && Array.isTypedArrayClass(_item))
		{
			return true;
		}

		return false;
	}});

	isArrayClass = Array.isArrayClass.bind(Array);

	//
	const _concat = Array.prototype.concat;

	Object.defineProperty(Array.prototype, '_concat', { get: function() { return _concat; }});
	
	Object.defineProperty(Array, 'concat', { value: function()
	{
		const result = [];
		result.concat.apply(result, arguments);
		return result;
	}});

	Object.defineProperty(Array.prototype, 'concat', { value: function()
	{
		const result = this;//.valueOf();

		for(var i = 0, j = result.length; i < arguments.length; i++)
		{
			if(Array.isArray(arguments[i]))
			{
				for(var k = 0; k < arguments[i].length; k++)
				{
					result[j++] = arguments[i][k];
				}
			}
			else
			{
				result[j++] = arguments[i];
			}
		}

		return result;
	}});

	Object.defineProperty(Array, 'concatUnique', { value: function()
	{
		const result = [];
		result.concatUnique.apply(result, arguments);
		return result;
	}});

	Object.defineProperty(Array.prototype, 'concatUnique', { value: function()
	{
		const result = this.valueOf();

		for(var i = 0, j = result.length; i < arguments.length; i++)
		{
			if(Array.isArray(arguments[i]))
			{
				for(var k = 0; k < arguments[i].length; k++)
				{
					if(result.indexOf(arguments[i][k]) === -1)
					{
						result[j++] = arguments[i][k];
					}
				}
			}
			else if(result.indexOf(arguments[i]) === -1)
			{
				result[j++] = arguments[i];
			}

		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'lengthSort', { value: function(_asc = true, _mutable = DEFAULT_MUTABLE, _radix = DEFAULT_SORT_RADIX)
	{
		return this.sort('length', _asc, _mutable, _radix);
	}});

	//
	Object.defineProperty(Array.prototype, 'divide', { value: function(_div = 1, _offset = 0)
	{
		if(typeof _div !== 'number')
		{
			_div = 1;
		}
		else if(_div === 0)
		{
			return x('The divide value needs to be non-zero');
		}
		else if(_div < 0)
		{
			_div = -_div;
		}

		if(typeof _offset !== 'number')
		{
			_offset = 0;
		}
		else
		{
			_offset = this.getIndex(_offset);
		}

		const result = [];

		for(var i = _offset, j = 0; i < this.length; i += _div, j++)
		{
			result[j] = [];

			for(var k = 0; k < _div; k++)
			{
				if((i + k) < this.length)
				{
					result[j].push(this[i + k]);
				}
				else
				{
					if(result[j].length === 0)
					{
						result.splice(j, 1);
					}

					return result;
				}
			}
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'modulo', { value: function(_mod = 2, _count = 1, _offset = 0)
	{
		if(_count === 0)
		{
			return x('_count value may not be zero..');
		}

		_offset = this.getIndex(_offset);

		const result = Array.fill(_mod, [[]]);

		for(var x = _offset, t = 0; x < this.length;)
		{
			for(var y = 0; y < _mod; t++)
			{
				for(var z = 0; z < _count; z++, y++, x++)
				{
					if(x < this.length)
					{
						result[t % _mod].push(this[x]);
					}
					else
					{
						return result;
					}
				}
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'remove', { value: function(... _args)
	{
		const result = [];

		if(this.length === 0)
		{
			return result;
		}
		else if(_args.length === 0)
		{
			return result;
		}

		for(var i = this.length - 1, k = 0; i >= 0; i--)
		{
			for(var j = 0; j < _args.length; j++)
			{
				if(this[i] === _args[j])
				{
					result[k++] = this.splice(i--, 1)[0];
					break;
				}
			}
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'removeAt', { value: function(... _args)
	{
		//
		if(this.length === 0)
		{
			return [];
		}
		else if(_args.length === 0)
		{
			return [];
		}
		else for(var i = 0; i < _args.length; i++)
		{
			if(Number.isNumber(_args[i]))
			{
				_args[i] = this.getIndex(_args[i]);
			}
			else if(typeof _args[i] === 'bigint')
			{
				_args[i] = this.getIndex(Number.from(_args[i]));//because String..removeAt() supports bigint's (as count argument(s))... not the same here.
			}
			else
			{
				return x('Invalid %[%] argument (not a %)', null, '..._args', i, 'Number');
			}
		}

		_args.uniq();
		_args.sort(false);

		for(var i = 0; i < _args.length; i++)
		{
			_args[i] = this.splice(_args[i], 1)[0];
		}

		_reverse.call(_args);
		return _args;
	}});

	//
	Object.defineProperty(Array.prototype, 'has', { value: function(... _args)
	{
		const DEFAULT_CASE_SENSITIVE = false;

		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(! String.isString(_args[i]))
			{
				return x('Invalid %[%] argument (not a non-empty %)', null, '..._args', i, 'String');
			}
			else if(! DEFAULT_CASE_SENSITIVE)
			{
				_args[i] = _args[i].toLowerCase();
			}
		}

		if(this.length === 0)
		{
			return null;
		}

		var found, string;

		for(var i = 0; i < _args.length; ++i)
		{
			found = false;

			for(var j = 0; j < this.length; ++j)
			{
				if(typeof this[j] !== 'string')
				{
					continue;
				}
				else if(this[j].has(_args[i]) === true)
				{
					found = true;
					break;
				}
			}

			if(! found)
			{
				return false;
			}
		}

		return true;
	}});

	//
	Object.defineProperty(Array, 'switch', { value: function(_a, _b, _this = true)
	{
		Array.transfer(_a, _b, true, _this);
		return [ _a, _b ];
	}});

	Object.defineProperty(Array, 'transfer', { value: function(_target, _source, _switch = false, _this = true)
	{
		//
		if(typeof _switch !== 'boolean')
		{
			_switch = false;
		}

		if(typeof _this !== 'boolean')
		{
			_this = true;
		}

		if(! (Array.isArray(_target, true) && Array.isArray(_source, true)))
		{
			return x('Both arguments need to be %s', null, 'Array');
		}
		else if(_target === _source)
		{
			return _target;
		}
		else if(_target.length !== _source.length)
		{
			_target.length = _source.length;
		}

		//
		const result = (_target.length - _source.length);

		//
		var backup;

		if(_switch)
		{
			backup = [ ... _target ];
		}
		else
		{
			backup = null;
		}

		//
		for(var i = 0; i < _source.length; i++)
		{
			if((_target[i] = _source[i]) === _source[i] && _this)
			{
				_target[i] = _target;
			}
		}

		//
		if(_switch)
		{
			if(_source.length !== backup.length)
			{
				_source.length = backup.length;
			}

			for(var i = 0; i < backup.length; ++i)
			{
				if((_source[i] = backup[i]) === _target && _this)
				{
					_source[i] = _source;
				}
			}
		}

		//
		return result;
	}});

	Object.defineProperty(Array.prototype, 'transferFrom', { value: function(_source, _switch = false, _this = true)
	{
		return Array.transfer(this, _source, _switch, _this);
	}});

	Object.defineProperty(Array.prototype, 'transferTo', { value: function(_target, _switch = false, _this = true)
	{
		return Array.transfer(_target, this, _switch, _this);
	}});

	// immutable
	Object.defineProperty(Array.prototype, 'unique', { value: function(_path)
	{
		if(! (String.isString(_path) || Number.isInt(_path)))
		{
			_path = null;
		}

		const result = [];

		if(this.length === 0)
		{
			return result;
		}

		var a, b, found;

		for(var i = 0, k = 0; i < this.length; ++i)
		{
			found = false;

			for(var j = i - 1; j >= 0; --j)
			{
				a = Object.get(_path, this[i]);
				b = Object.get(_path, this[j]);

				if(a === b)
				{
					found = true;
					break;
				}
			}

			if(! found)
			{
				result[k++] = this[i];
			}
		}

		return result;
		return result.sort(0).select(1);
	}});

	// mutable
	Object.defineProperty(Array.prototype, 'uniq', { value: function(_path)
	{
		if(! (String.isString(_path) || Number.isInt(_path)))
		{
			_path = null;
		}
		else if(this.length === 0)
		{
			return this;
		}

		const result = [];
		var a, b;

		for(var i = this.length - 1, k = 0; i >= 0; --i)
		{
			for(var j = 0; j < i; ++j)
			{
				a = Object.get(_path, this[i]);
				b = Object.get(_path, this[j]);

				if(a === b)
				{
					result[k++] = this.splice(i, 1)[0];
					break;
				}
			}
		}

		return result.reverse();
	}});

	Object.defineProperty(Array.prototype, 'select', { value: function(_path, _function, _copy = true)
	{
		if(typeof _function === 'boolean')
		{
			const tmp = _copy;
			_copy = _function;
			_function = tmp;
		}

		if(typeof _function !== 'function')
		{
			_function = null;
		}

		const result = (_copy ? new Array(this.length) : this);
		var item;

		for(var i = 0; i < this.length; i++)
		{
			item = Object.get(_path, this[i]);

			if(_function)
			{
				item = _function(item, _path);
			}

			result[i] = item;
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'isUnique', { get: function()
	{
		return (this.length === this.unique().length);
	}});

	Object.defineProperty(Array.prototype, 'getIndex', { value: function(_index = -1, _length = this.length, _return = null, _throw = false)
	{
		return getIndex(_index, _length, _return, _throw);
	}});

	Object.defineProperty(Array.prototype, 'getNegativeIndex', { value: function(_index = -1, _length = this.length, _return = null, _throw = false)
	{
		return getNegativeIndex(_index, _length, _return, _throw);
	}});

	Object.defineProperty(Array.prototype, 'getRandomIndex', { value: function(_crypto = CRYPTO)
	{
		return Math.random.int(this.length - 1, 0, _crypto);
	}});

	Object.defineProperty(Array.prototype, 'getRandom', { value: function(_count = this.length, _repeat = false, _crypto = CRYPTO)
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
			return [];
		}
		else if(_count === 1)
		{
			return this[this.getRandomIndex(_crypto)];
		}
		else if(typeof _repeat !== 'boolean')
		{
			return x('Invalid % argument (expecting a %)', null, '_repeat', 'Boolean');
		}

		const result = new Array(_count);
		var index = 0;

		if(_repeat) while(index < _count)
		{
			result[index++] = this[this.getRandomIndex(_crypto)];
		}
		else while(index < _count)
		{
			const copy = this.clone();
			var idx;

			while(copy.length > 0 && index < _count)
			{
				idx = copy.getRandomIndex(_crypto);
				result[index++] = copy[idx];
				copy.splice(idx, 1);
			}
		}

		return result;
	}});

	//
	const _reverse = Array.prototype.reverse;

	//
	//TODO/more reverse arguments... innere/aeszere rots...!!
	//
	/*Object.defineProperty(Array.prototype, 'reverse', { value: function(... _args)
	{
		//
		if(this.length === 0)
		{
			return this;
		}
		else if(_args.length <= 1 && ((!Number.isInt(_args[0])) || _args[0] === 0 || _args[0] === 1))
		{
			return _reverse.call(this);
		}
		else if(! Number.isInt(_args[0]))
		{
			return x('Invalid argument (expecting a %)', null, 'Integer');
		}

		const rev = _args[0];
		const div = this.divide(rev);

		//[ [ 2, 4 ], [ 6, 8 ], [ 10, 12 ], [ 14, 16 ] ] => [ 4, 2, 8, 6, 12, 10, 16, 14 ];
		//

		for(var i = 0, j = 0; i < this.length && j < div.length; ++j)
		{
			for(var k = div[j].length - 1; k >= 0; --k, ++i)
			{
				this[i] = div[j][k];
			}
		}

		return this;
	}});*/

	//
	Object.defineProperty(Array.prototype, 'removeFirst', { value: function(_count = 1, ... _args)
	{
		//
		if(typeof _count !== 'number')
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return undefined;
		}

		//
		var result;

		//
		if(_args.length > 0)
		{
			//
			_args.lengthSort(false);

			//
			result = [];
			var found;

			//
			for(var i = 0, j = 0; i < this.length; i++)
			{
				found = false;

				for(var k = 0; k < _args.length; k++)
				{
					if(this[i] === _args[k])
					{
						found = true;
						break;
					}
				}

				if(found)
				{
					result[j++] = this.splice(i--, 1)[0];

					if(j >= _count)
					{
						break;
					}
				}
			}

			//
			return result;
		}

		//
		result = this.splice(0, Math.abs(_count));

		if(result.length === 0)
		{
			if(Math.abs(_count) === 1)
			{
				return undefined;
			}
			else
			{
				return result;
			}
		}
		else if(Math.abs(_count) === 1)
		{
			return result[0];
		}
		else if(_count < 0)
		{
			return result.reverse();
		}

		//
		return result;
	}});

	Object.defineProperty(Array.prototype, 'removeLast', { value: function(_count = 1, ... _args)
	{
		//
		if(typeof _count !== 'number')
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return [];
		}

		//
		var result;

		//
		if(_args.length > 0)
		{
			//
			_args.lengthSort(false);

			//
			result = [];
			var found;

			//
			for(var i = this.length - 1, j = 0; i >= 0; i--)
			{
				found = false;

				for(var k = 0; k < _args.length; k++)
				{
					if(this[i] === _args[k])
					{
						found = true;
						break;
					}
				}

				if(found)
				{
					result[j++] = this.splice(i, 1)[0];

					if(j >= _count)
					{
						break;
					}
				}
			}

			//
			return _reverse.call(result);
		}

		//
		result = this.splice(this.length - Math.abs(_count), Math.abs(_count));

		//
		if(result.length === 0)
		{
			if(Math.abs(_count) === 1)
			{
				return undefined;
			}
			else
			{
				return result;
			}
		}
		else if(Math.abs(_count) === 1)
		{
			return result[0];
		}
		else if(_count < 0)
		{
			return result.reverse();
		}

		//
		return result;
	}});

	Object.defineProperty(Array.prototype, 'peek', { value: function(_count = 1)
	{
		if(typeof _count !== 'number')
		{
			_count = 1;
		}
		else if(_count < 0)
		{
			return this.first(-_count.int);
		}

		return this.last(_count.int);
	}});

	Object.defineProperty(Array.prototype, 'pop', { value: function(_count = 1)
	{
		if(typeof _count !== 'number')
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return [];
		}

		const result = this.removeLast(Math.abs(_count));

		if(Math.abs(_count) === 1)
		{
			return result;
		}
		else if(_count < 0)
		{
			return result.reverse();
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'shift', { value: function(_count = 1)
	{
		if(typeof _count !== 'number')
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return [];
		}

		const result = this.removeFirst(Math.abs(_count));

		if(Math.abs(_count) === 1)
		{
			return result;
		}
		else if(_count < 0)
		{
			return result.reverse();
		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'pushUnique', { value: function(... _args)
	{
		const result = [];

		for(var i = 0, j = this.length, k = 0; i < _args.length; i++)
		{
			if(! this.includes(_args[i]))
			{
				result[k++] = this[j++] = _args[i];
			}
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'unshiftUnique', { value: function(... _args)
	{
		const result = [];

		for(var i = 0, j = 0; i < _args.length; i++)
		{
			if(! this.includes(_args[i]))
			{
				result[j++] = _args[i];
				this.splice(0, 0, _args[i]);
			}
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'only', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < this.length; i++)
		{
			var found = false;

			for(var j = 0; j < _args.length; j++)
			{
				if(this[i] === _args[j])
				{
					found = true;
					break;
				}
			}

			if(! found)
			{
				return false;
			}
		}

		return true;
	}});

	Object.defineProperty(Array.prototype, 'all', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
			//return x('Expecting at least one argument');
		}
		else for(var i = 0; i < _args.length; i++)
		{
			if(this.indexOf(_args[i]) === -1)
			{
				return false;
			}
		}

		return true;
	}});

	//
	Object.defineProperty(Array.prototype, 'removeStarting', { value: function()
	{
		if(arguments.length === 0)
		{
			return [];
		}
		else for(var i = 0; i < arguments.length; i++)
		{
			if(! Array.isArray(arguments[i]))
			{
				arguments[i] = [ arguments[i] ];
			}
		}

		const count = this.startsWith.apply(this, arguments);

		if(count === 0)
		{
			return [];
		}
		else if(count === 1)
		{
			return [ this.removeFirst(1) ];
		}

		return this.removeFirst(count);
	}});

	Object.defineProperty(Array.prototype, 'removeEnding', { value: function()
	{
		if(arguments.length === 0)
		{
			return [];
		}
		else for(var i = 0; i < arguments.length; i++)
		{
			if(! Array.isArray(arguments[i]))
			{
				arguments[i] = [ arguments[i] ];
			}
		}

		const count = this.endsWith.apply(this, arguments);

		if(count === 0)
		{
			return [];
		}
		else if(count === 1)
		{
			return [ this.removeLast(1) ];
		}

		return this.removeLast(count);
	}});

	Object.defineProperty(Array.prototype, 'startsWith', { value: function()
	{
		if(arguments.length === 0)
		{
			return 0;
		}
		else for(var i = 0; i < arguments.length; i++)
		{
			if(! Array.isArray(arguments[i]))
			{
				arguments[i] = [ arguments[i] ];
			}
		}

		const args = Array.from(arguments).lengthSort(false);

		var result = 0;
		var found;

		for(var i = 0; i < this.length; i++)
		{
			for(var j = 0; j < args.length; j++)
			{
				found = true;

				for(var k = 0; k < args[j].length; k++)
				{
					if(this[i + k] !== args[j][k])
					{
						found = false;
						break;
					}
				}

				if(found)
				{
					found = args[j].length;
					break;
				}
				else
				{
					found = 0;
				}
			}

			if(found > 0)
			{
				result += found;
				i += found - 1;
			}
			else
			{
				break;
			}
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'endsWith', { value: function()
	{
		if(arguments.length === 0)
		{
			return 0;
		}
		else for(var i = 0; i < arguments.length; i++)
		{
			if(! Array.isArray(arguments[i]))
			{
				arguments[i] = [ arguments[i] ];
			}
		}

		const args = Array.from(arguments).lengthSort(false);

		var result = 0;
		var found;

		for(var i = this.length - 1; i >= 0; i--)
		{
			for(var j = 0; j < args.length; j++)
			{
				found = true;

				for(var k = 0, l = args[j].length - 1; k < args[j].length; k++, l--)
				{
					if(this[i - k] !== args[j][l])
					{
						found = false;
						break;
					}
				}

				if(found)
				{
					found = args[j].length;
					break;
				}
				else
				{
					found = 0;
				}
			}

			if(found > 0)
			{
				result += found;
				i -= found - 1;
			}
			else
			{
				break;
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'first', { value: function(_count = 1)
	{
		if(typeof _count !== 'number')
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return undefined;
		}

		const result = this.slice(0, Math.abs(_count));

		if(result.length === 0)
		{
			if(Math.abs(_count) === 1)
			{
				return undefined;
			}
			else
			{
				return result;
			}
		}
		else if(Math.abs(_count) === 1)
		{
			return result[0];
		}
		else if(_count < 0)
		{
			return result.reverse();
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'last', { value: function(_count = 1)
	{
		if(typeof _count !== 'number')
		{
			_count = 1;
		}
		else if(_count === 0)
		{
			return undefined;
		}

		const result = this.slice(this.length - Math.abs(_count));

		if(result.length === 0)
		{
			if(Math.abs(_count) === 1)
			{
				return undefined;
			}
			else
			{
				return result;
			}
		}
		else if(Math.abs(_count) === 1)
		{
			return result[0];
		}
		else if(_count < 0)
		{
			return result.reverse();
		}

		return result;
	}});

	//
	Object.defineProperty(Array, 'fill', { value: function(_length, _pad, _clone = true)
	{
		if(typeof _length !== 'number')
		{
			return x('First _length parameter needs to be an Integer');
		}
		else if(typeof _pad !== 'string' && !Number.isNumber(_pad) && typeof _pad !== 'bigint' && !Array.isArray(_pad))
		{
			return x('_pad Argument expected as String, Number, BigInt or Array');
		}
		else if(typeof _pad === 'string' && _pad.length === 0)
		{
			return x('_pad String may not be empty');
		}
		else if(Array.isArray(_pad) && _pad.length === 0)
		{
			return x('_pad Array may not be empty');
		}

		if(typeof _clone !== 'boolean')
		{
			_clone = true;
		}

		const result = new Array(_length = Math.abs(_length.int));
		var counter = ((Number.isNumber(_pad) || typeof _pad === 'bigint') ? _pad : null);

		for(var i = 0, j = 0; i < _length; ++i, ++j)
		{
			try
			{
				if(Array.isArray(_pad))
				{
					if(_clone && Object.isObject(_pad[j % _pad.length]))
					{
						result[i] = _pad[j % _pad.length].clone();
					}
					else
					{
						result[i] = _pad[j % _pad.length];
					}
				}
				else if(isNumeric(_pad))
				{
					result[i] = counter++;
				}
				else
				{
					result[i] = _pad[j % _pad.length];
				}
			}
			catch(_error)
			{
				result[i] = _pad[j % _pad.length];
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Array, 'flat', { value: function(_object, _depth = 0)
	{
		if(_depth === null)
		{
			_depth = 0;
		}

		const result = [];
		var index = 0;

		const traverse = (_object, _path = '', _current_depth = 0) => {
			if(_depth > 0 && _current_depth > _depth)
			{
				return;
			}
			else if(_path.length > 0)
			{
				result[index++] = _path;
			}

			if(typeof _object !== 'string')
			{
				const properties = Object.getOwnPropertyNames(_object, false, false);

				for(var i = 0; i < properties.length; i++)
				{
					traverse(_object[properties[i]], (_path + (_path.length === 0 ? '' : '.') + properties[i]), _current_depth + 1);
				}
			}
		};

		//
		traverse(_object);

		//
		return result;
	}});

	//
	Object.defineProperty(Array, 'fromTypedArray', { value: function(_typed_array)
	{
		if(! TypedArray.isTypedArray(_typed_array))
		{
			return x('Invalid % argument (expecting a % instance)', null, '_typed_array', 'Typed Array');
		}
		else if(_typed_array.length === 0)
		{
			return [];
		}

		const result = new Array(_typed_array.length);

		for(var i = 0; i < _typed_array.length; ++i)
		{
			result[i] = _typed_array[i];
		}

		return result;
	}});

	//
	Object.defineProperty(Array, 'equal', { value: function(... _args)
	{
		//
		if(_args.length === 0)
		{
			return null;
		}

		//
		var depth = 0;
		var same = 0;

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
			else if(Array.isArray(_args[i], true))
			{
				if(_args[i] === _args[0])
				{
					++same;
				}
				else if(_args[i].length !== _args[0].length)
				{
					return false;
				}
			}
			else
			{
				return x('Invalid %[%] argument (not an %)', null, '..._args', i, 'Array');
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
			for(var i = 0; i < _a[0].length; ++i)
			{
				if(Array.isArray(_a[0][i], true) && (depth === null || (_current_depth < depth)))
				{
					const sub = [ _a[0][i] ];
					var s = 1;

					for(var j = 1; j < _a.length; ++j)
					{
						if(Array.isArray(_a[j][i], true))
						{
							if(_a[j][i] === _a[0][i])
							{
								++s;
							}
							else if(_a[j][i].length !== _a[0][i].length)
							{
								return false;
							}
							else
							{
								sub[j] = _a[j][i];
							}
						}
						else
						{
							return false;
						}
					}

					if(s === _a.length)
					{
						return true;
					}

					return traverse(_current_depth + 1, ... sub);
				}

				for(var j = 1; j < _a.length; ++j)
				{
					if(_a[j][i] !== _a[0][i])
					{
						return false;
					}
				}
			}

			return true;
		};

		return traverse(0, ... _args);
	}});

	Object.defineProperty(Array, 'equalValues', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else if(Array.equal(... _args))
		{
			return true;
		}

		var depth = 0;
		var same = 0;

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
			else if(Array.isArray(_args[i], true))
			{
				if(_args[i] === _args[0])
				{
					++same;
				}
				else if(_args[i].length !== _args[0].length)
				{
					return false;
				}
			}
			else
			{
				return x('Invalid %[%] argument (not an %)', null, '..._args', i, 'Array');
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
			for(var i = 0; i < _a.length; ++i) if(Array.isArray(_a[i], true))
			{
				_a[i] = [ ... _a[i] ];
			}

			for(var i = _a[0].length - 1; i >= 0; --i)
			{
				if(Array.isArray(_a[0][i], true) && (depth === null || (_current_depth < depth)))
				{
					const sub = [ [ ... _a[0][i] ] ];
					var s = 1;

					for(var j = 1; j < _a.length; ++j)
					{
						if(Array.isArray(_a[j][i], true))
						{
							if(_a[j][i] === _a[0][i])
							{
								++s;
							}
							else if(_a[j][i].length !== _a[0][i].length)
							{
								return false;
							}
							else
							{
								sub[j] = [ ... _a[j][i] ];
							}
						}
						else
						{
							return false;
						}
					}

					if(s === _a.length)
					{
						return true;
					}

					return traverse(_current_depth + 1, ... sub);
				}

				var idx;

				for(var j = 1; j < _a.length; ++j)
				{
					idx = _a[j].indexOf(_a[0][i]);

					if(idx === -1)
					{
						return false;
					}
					else
					{
						_a[j].splice(idx, 1);
					}
				}
			}

			return true;
		};

		return traverse(0, ... _args);
	}});

	//
	Object.defineProperty(Array.prototype, 'onlyType', { value: function(... _types)
	{
		if(this.length === 0)
		{
			return null;
		}

		if(_types.length === 0)
		{
			for(var i = 1; i < this.length; ++i)
			{
				if(Object.typeOf(this[i]) !== Object.typeOf(this[0]))
				{
					return false;
				}
			}

			return true;
		}

		for(var i = 0; i < _types.length; ++i)
		{
			if(! String.isString(_types[i]))
			{
				return x('Invalid %[%] argument (expecting only non-empty %s)', null, '..._types', i, 'String');
			}
		}

		var t, found;

		for(var i = 0; i < this.length; ++i)
		{
			found = false;

			for(var j = 0; j < _types.length; ++j)
			{
				if(_types[j].isLowerCase)
				{
					t = (typeof this[i]);
				}
				else
				{
					t = Object.typeOf(this[i]);
				}

				if(t === _types[j])
				{
					found = true;
					break;
				}
			}

			if(! found)
			{
				return false;
			}
		}

		return true;
	}});

	Object.defineProperty(Array.prototype, 'removeType', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return x('Expecting at least one argument, which has to be a non-empty %', null, 'String');
		}
		else for(var i = 0; i < _args.length; i++)
		{
			if(! String.isString(_args[i]))
			{
				return x('Invalid argument[%] (expecting only non-empty %s)', null, i, 'String');
			}
		}

		const result = [];
		var found;
		var lowerType, upperType;

		for(var i = 0, k = 0; i < this.length; i++)
		{
			found = false;

			upperType = Object.typeOf(this[i]);
			lowerType = (typeof this[i]);

			for(var j = 0; j < _args.length; j++)
			{
				if(_args[j].isLowerCase)
				{
					if(lowerType === _args[j])
					{
						found = true;
						break;
					}
				}
				else if(upperType === _args[j])
				{
					found = true;
					break;
				}
			}

			if(found)
			{
				result[k++] = this.splice(i--, 1)[0];
			}
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'filterType', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return x('Expecting at least one argument, which has to be a non-empty %', null, 'String');
		}
		else for(var i = 0; i < _args.length; i++)
		{
			if(! String.isString(_args[i]))
			{
				return x('Invalid argument[%] (expecting only non-empty %s)', null, i, 'String');
			}
		}

		const result = [];
		var found;
		var lowerType, upperType;

		for(var i = 0, k = 0; i < this.length; i++)
		{
			found = false;

			upperType = Object.typeOf(this[i]);
			lowerType = (typeof this[i]);

			for(var j = 0; j < _args.length; j++)
			{
				if(_args[j].isLowerCase)
				{
					if(lowerType === _args[j])
					{
						found = true;
						break;
					}
				}
				else if(upperType === _args[j])
				{
					found = true;
					break;
				}
			}

			if(! found)
			{
				result[k++] = this.splice(i--, 1)[0];
			}
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'types', { value: function(... _types)
	{
		if(this.length === 0)
		{
			return [];
		}

		const result = this.typeOf();
		result.uniq();

		if(_types.length === 0)
		{
			return result;
		}
		else for(var i = 0; i < _types.length; ++i)
		{
			if(! String.isString(_types[i]))
			{
				return x('Invalid %[%] argument (not a non-empty %)', null, '..._types', i, 'String');
			}
		}

		for(const c of result)
		{
			if(_types.indexOf(c) === -1)
			{
				return false;
			}
			else
			{
				_types.remove(c);
			}
		}

		return (_types.length === 0);
	}});

	Object.defineProperty(Array.prototype, 'typeOf', { value: function(... _args)
	{
		if(this.length === 0)
		{
			return [];
		}
		else for(var i = 0; i < _args.length; i++)
		{
			if(! String.isString(_args[i]))
			{
				return x('Invalid %[%] (expecting only non-empty %s)', null, '..._args', i, 'String');
			}
		}

		var result;

		if(_args.length === 0)
		{
			result = new Array(this.length);

			for(var i = 0; i < this.length; i++)
			{
				result[i] = Object.typeOf(this[i]);
			}
		}
		else
		{
			result = [];
			var type;

			for(var i = 0, k = 0; i < this.length; i++)
			{
				type = Object.typeOf(this[i]);

				for(var j = 0; j < _args.length; j++)
				{
					if(_args[j] === type)
					{
						result[k++] = this[i];
						break;
					}
				}
			}
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'typeof', { value: function(... _args)
	{
		if(this.length === 0)
		{
			return [];
		}
		else for(var i = 0; i < _args.length; i++)
		{
			if(! String.isString(_args[i]))
			{
				return x('Invalid %[%] (expecting only non-empty %s)', null, '..._args', i, 'String');
			}
		}

		var result;

		if(_args.length === 0)
		{
			result = new Array(this.length);

			for(var i = 0; i < this.length; i++)
			{
				result[i] = (typeof this[i]);
			}
		}
		else
		{
			result = [];
			var type;

			for(var i = 0, k = 0; i < this.length; i++)
			{
				type = (typeof this[i]);

				for(var j = 0; j < _args.length; j++)
				{
					if(_args[j] === type)
					{
						result[k++] = this[i];
						break;
					}
				}
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'trim', { value: function(_options_or_both = false, _remove_empty = DEFAULT_TRIM_REMOVE_EMPTY, _throw = false)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = false;
		}

		const options = Object.assign(... arguments);

		if(typeof options.removeEmpty === 'boolean')
		{
			_remove_empty = options.removeEmpty;
		}
		else if(typeof _remove_empty === 'boolean')
		{
			options.removeEmpty = _remove_empty;
		}
		else
		{
			_remove_empty = options.removeEmpty = DEFAULT_TRIM_REMOVE_EMPTY;
		}

		for(var i = 0; i < this.length; i++)
		{
			if(typeof this[i] === 'string')
			{
				if((this[i] = this[i].trim(_options_or_both)).length === 0 && _remove_empty)
				{
					this.splice(i--, 1);
				}
			}
			else if(_throw)
			{
				return x('Your element[%] is not a % (disable this warning by argument % = %)', null, i, 'String', '_throw', false);
			}
		}

		return this;
	}});

	//
	Object.defineProperty(Array, 'intersect', { value: function(... _args)
	{
		//TODO/(see below..)
		var UNIQUE = false;

		//
		for(var i = 0; i < _args.length; i++)
		{
			if(typeof _args[i] === 'boolean')
			{
				UNIQUE = _args.splice(i--, 1)[0];
			}
			else if(! Array.isArray(_args[i], true))
			{
				return x('Your %[%] is not an % (and also no %)', null, '..._args', i, 'Array', 'Boolean');
			}
			else if(_args.indexOf(_args[i]) < i)
			{
				_args.splice(i--, 1);
			}
		}

		if(_args.length === 0)
		{
			return [];
		}
		else if(_args.length === 1)
		{
			return [ ... _args[0] ];
		}

		var shortestLength = _args[0].length;
		var shortest = 0;

		for(var i = 1; i < _args.length; i++)
		{
			if(_args[i].length < shortestLength)
			{
				shortestLength = _args[i].length;
				shortest = i;
			}
		}

		//
		const shortestArray = _args[shortest];
		const indices = Array.fill(_args.length, [[]], true);
		indices[shortest] = null;
		const result = [];
		var idx, found;

		//
		for(var i = 0, k = 0; i < shortestArray.length; i++)
		{
			found = 0;

			for(var j = 0; j < _args.length; j++)
			{
				if(j === shortest)
				{
					continue;
				}
				else do
				{
					if((idx = _args[j].indexOf(shortestArray[i], idx + 1)) > -1)
					{
						if(indices[j].indexOf(idx) === -1)
						{
							indices[j].push(idx);
							found++;
							idx = -1;
						}
						//TODO/..!! and TEST..
						else if(UNIQUE)
						{
							idx = -1;
						}
					}
				}
				while(idx > -1);
			}

			if(found === (_args.length - 1))
			{
				result[k++] = shortestArray[i];
			}
		}

		//
		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'getLength', { value: function(_length, _start = 0)
	{
		return getLength(_length, this.length, _start);
	}});

	//
	Object.defineProperty(Array.prototype, 'subarr', { value: function(_start, _length)
	{
		if(Number.isInt(_start))
		{
			if(_start < 0)
			{
				_start = this.length + _start;
			}

			if(_start < 0)
			{
				return [];
			}
			else if(_start >= this.length)
			{
				return [];
			}
		}
		else
		{
			_start = 0;
		}

		if(Number.isInt(_length))
		{
			if(_length <= 0)
			{
				return [];
			}
			else if((_start + _length) >= this.length)
			{
				_length = this.length - _start;
			}
		}
		else if((_length = this.length - _start) <= 0)
		{
			return [];
		}

		return this.slice(_start, _start + _length);
	}});

	Object.defineProperty(Array.prototype, 'subarray', { value: function(_start, _stop)
	{
		return this.subarr(_start, _stop - _start);
	}});

	//
	Object.defineProperty(Array.prototype, 'applyLength', { value: function(_length = 0, _grow = DEFAULT_GROW)
	{
		if(! Number.isInt(_length))
		{
			return x('Invalid % argument (expecting an -/+ %)', null, '_length', 'Integer');
		}
		else if(_length === 0)
		{
			return this.splice(0, this.length);
		}
		else if(Math.abs(_length) === this.length)
		{
			return [];
		}
		else if(Math.abs(_length) > this.length)
		{
			if(_grow)
			{
				if(_length > 0)
				{
					this.length = Math.abs(_length);
				}
				else
				{
					this.splice(0, 0, ... new Array(-_length - this.length));
				}
			}

			return [];
		}
		else if(_length > 0)
		{
			return this.splice(_length, this.length - _length);
		}

		return this.splice(0, this.length + _length);
	}});

	Object.defineProperty(Array.prototype, 'setLength', { value: function(_length = 0, _grow = DEFAULT_GROW)
	{
		if(! Number.isInt(_length))
		{
			return x('Invalid % argument (expecting a -/+ %)', null, '_length', 'Integer');
		}
		else if(_length === 0)
		{
			return [];
		}
		else if(Math.abs(_length) === this.length)
		{
			return [ ... this.valueOf() ];
		}
		else if(Math.abs(_length) > this.length)
		{
			if(_grow)
			{
				const result = new Array(Math.abs(_length));

				if(_length > 0)
				{
					for(var i = 0; i < this.length; ++i)
					{
						result[i] = this[i];
					}
				}
				else
				{
					for(var i = result.length - this.length, j = 0; i < Math.abs(_length); ++i, ++j)
					{
						result[i] = this[j];
					}
				}

				return result;
			}

			return [ ... this.valueOf() ];
		}
		else if(_length > 0)
		{
			const result = new Array(_length);

			for(var i = 0; i < _length; ++i)
			{
				result[i] = this[i];
			}

			return result;
		}

		const result = new Array(Math.abs(_length));
		const diff = (this.length + _length);

		for(var i = diff, j = 0; i < this.length; ++i, ++j)
		{
			result[j] = this[i];
		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'index', { value: function(_index, _path)
	{
		//
		if(! (String.isString(_path) || Number.isInt(_path)))
		{
			if(Array.isArray(_path))
			{
				if(_path.length === 0)
				{
					_path = null;
				}
				else for(var i = 0; i < _path.length; i++)
				{
					if(! (String.isString(_path[i]) || Number.isInt(_path[i])))
					{
						return x('Invalid _path[' + i + '] (neither String nor Integer)');
					}
				}
			}
			else
			{
				_path = null;
			}
		}

		if(Array.isArray(_index))
		{
			if(_index.length === 0)
			{
				return x('Invalid _index Array (is empty)');
			}
			else for(var i = 0; i < _index.length; i++)
			{
				if(! (String.isString(_index[i]) || Number.isInt(_index[i])))
				{
					return x('Invalid _index[' + i + '] item (neither String nor Integer))');
				}
			}
		}
		else if(String.isString(_index) || Number.isInt(_index))
		{
			_index = [ _index ];
		}
		else
		{
			return x('Invalid _index argument (expecting String, Integer or Array of Strings and/or Integers)');
		}

		//
		const getIndex = (_item) => {
			if(typeof _item === 'undefined')
			{
				return 'undefined';
			}
			else if(_item === null)
			{
				return 'null';
			}
			else if(typeof _item === 'string')
			{
				return _item.valueOf();
			}
			else if(typeof _item === 'number')
			{
				return _item.toString();
			}
			else if(typeof _item === 'bigint')
			{
				return _item.toString();
			}
			else if(typeof _item === 'boolean')
			{
				return (_item ? 'true' : 'false');
			}
			else if(Date.isDate(_item))
			{
				return _item.getTime().toString();
			}
			else if(RegExp.isRegExp(_item))
			{
				return _item.toString();
			}
			else if(Array.isArray(_item))
			{
				return 'array';
			}

			var type = Object.className(_item);

			if(type.length > 0)
			{
				return type;
			}
			else if((type = Object.typeOf(_item)).length > 0)
			{
				return type;
			}

			return '';
		};

		const result = {};
		var index, value;

		for(var i = 0; i < this.length; i++)
		{
			for(var j = 0; j < _index.length; j++)
			{
				index = getIndex(Object.get(_index[j], value = this[i]));

				if(Object.isObject(_path))
				{
					const tmp = new Array(_path.length);

					for(var k = 0; k < _path.length; k++)
					{
						tmp[k] = Object.get(_path[k], value);
					}

					if(tmp.length === 1)
					{
						value = tmp[0];
					}
					else
					{
						value = tmp;
					}
				}
				else if(_path !== null)
				{
					value = Object.get(_path, value);
				}

				if(index in result)
				{
					result[index].push(value);
				}
				else
				{
					result[index] = [ value ];
				}
			}
		}

		for(var idx in result)
		{
			if(Array.isArray(result[idx]) && result[idx].length === 1)
			{
				result[idx] = result[idx][0];
			}
		}

		return result;
	}});

	//
	const _at = Array.prototype.at;

	Object.defineProperty(Array.prototype, 'at', { value: function(_offset, ... _args)
	{
		if(Number.isInt(_offset))
		{
			_offset = this.getIndex(_offset);
		}
		else
		{
			return x('Invalid % argument (expecting a -/+ %)', null, '_offset', 'Integer');
		}

		if(_args.length === 0)
		{
			return _at.call(this, _offset);
		}
		
		while(_args.length > 0)
		{
			if(_at.call(this, _offset++) !== _args.shift())
			{
				return false;
			}
			else if(_offset >= this.length)
			{
				break;
			}
		}

		return (_args.length === 0);
	}});

	//
	const _from = Array.from;

	Object.defineProperty(Array, 'from', { value: function(... _args)
	{
		if((typeof _args[0] === 'number' || typeof _args[0] === 'bigint'))
		{
			const result = [];
			const bigint = (typeof _args[0] === 'bigint');
			const rdx = (bigint ? 256n : 256);
			var rest = _args[0];

			while(rest >= (bigint ? 1n : 1))
			{
				result.unshift(rest % rdx);
				rest = (rest / rdx).int;
			}

			return result;
		}

		return _from(... _args);
	}});

	Object.defineProperty(Array.prototype, 'setValue', { value: function(_array, _switch = false)
	{
		if(! Array.isArray(_array))
		{
			return x('Invalid _array argument (not an Array)');
		}
		else if(typeof _switch !== 'boolean')
		{
			return x('Invalid _switch argument (not a Boolean)');
		}

		const orig = this.clone();
		this.length = _array.length;

		for(var i = 0; i < _array.length; i++)
		{
			this[i] = _array[i];
		}

		if(_switch)
		{
			_array.setValue(orig, false);
		}

		return orig;
	}});

	//
	Object.defineProperty(Array.prototype, 'search', { value: function(_path, _value, _values = false)
	{
		if(typeof _values !== 'boolean')
		{
			return x('Do you want the values or the indices (Boolean expected for _values argument)');
		}
		else if(! String.isString(_path))
		{
			//then directly search for the _value..!
			_path = null;
		}

		//
		const result = [];
		var item;

		for(var i = 0, j = 0; i < this.length; i++)
		{
			if(_path)
			{
				item = Object.get(_path, this[i]);
			}
			else
			{
				item = this[i];
			}

			if(item === _value)
			{
				if(_values)
				{
					result[j++] = this[i];
				}
				else
				{
					result[j++] = i;
				}
			}
		}

		//
		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'switch', { value: function(_a, _b)
	{
		if(Number.isInt(_a))
		{
			_a = this.getIndex(_a);
		}
		else
		{
			return x('Invalid index _a (not a -/+ Integer)');
		}

		if(Number.isInt(_b))
		{
			_b = this.getIndex(_b);
		}
		else
		{
			return x('Invalid index _b (not a -/+ Integer)');
		}

		if(_a === _b)
		{
			return x('Your selected items are the same (both point to the offset %)', null, _a);
		}

		const [ a, b ] = [ this[_a], this[_b] ];

		this[_b] = a;
		this[_a] = b;

		return this;
	}});

	//
	Object.defineProperty(Array, 'clone', { value: function(_array, _depth = null, _bind = false, _replace = _bind, _target = null)
	{
		//
		if(! Array.isArray(_array))
		{
			return x('First argument is not an %', null, 'Array');
		}
		else if(Number.isInt(_depth))
		{
			_depth = Math.abs(_depth);
		}
		else if(typeof _depth === 'boolean')
		{
			if(_depth)
			{
				_depth = null;
			}
			else
			{
				_depth = 0;
			}
		}
		else if(_depth !== null)
		{
			_depth = 0;
		}

		//
		if(_depth === 0 && !_bind)
		{
			return [ ... _array ];
		}

		var result;

		if(Array.isArray(_target))
		{
			result = _target;
		}
		else
		{
			result = new Array(_array.length);
		}

		var index = 0;

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

		const traverse = (_item, _current_depth = 0) => {
			const res = new Array(_item.length);

			for(var i = 0; i < _item.length; i++)
			{
				if(_replace === true && _item[i] === _array)
				{
					res[i] = result;
				}
				else if(_bind !== false && typeof _item[i] === 'function')
				{
					res[i] = _item[i].bind(_bind);
				}
				else
				{
					res[i] = _item[i];
				}

				if(Array.isArray(res[i]) && (_depth === null || _current_depth < _depth))
				{
					res[i] = traverse(res[i], _current_depth + 1);
				}
			}

			return res;
		}

		return traverse(_array);
	}});

	//
	Object.defineProperty(Array, 'one', { value: function(... _args)
	{
		const result = [];
		var index = 0;
		var traverse;

		(traverse = (_arg) => {
			if(Array.isArray(_arg))
			{
				for(var i = 0; i < _arg.length; i++)
				{
					traverse(_arg[i]);
				}
			}
			else
			{
				result[index++] = _arg;
			}
		})(_args);

		return result;
	}});

	//
	Object.defineProperty(Array, 'sameStart', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return [];
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(Array.isArray(_args[i], true))
			{
				if(_args[i].length === 0)
				{
					return [];
				}
				else
				{
					_args[i].uniq();
				}
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s)', null, '..._args', i, 'Array');
			}
		}

		_args.uniq();

		var result = 0;
		var same;

		for(var i = 0;; ++i)
		{
			same = true;

			if(i >= _args.length)
			{
				break;
			}
			else for(var j = 1; j < _args.length; ++j)
			{
				if(i >= _args.length)
				{
					break;
				}
				else if(_args[j][i] !== _args[0][i])
				{
					same = false;
					break;
				}
			}

			if(same)
			{
				++result;
			}
			else
			{
				break;
			}
		}

		return _args[0].subarr(0, result);
	}});

	Object.defineProperty(Array, 'sameEnd', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return [];
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(Array.isArray(_args[i], true))
			{
				if(_args[i].length === 0)
				{
					return [];
				}
				else
				{
					_args[i] = [ ... _args[i] ].reverse();
				}
			}
			else
			{
				return x('Invalid %[%] argument (expecting only non-empty %s)', null, '..._args', i, 'Array');
			}
		}

		return Array.sameStart(... _args).reverse();
	}});

	//
	Object.defineProperty(Array.prototype, 'getStarting', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return [];
		}

		return this.first(this.startsWith.apply(this, _args.lengthSort(false)));
	}});

	Object.defineProperty(Array.prototype, 'getEnding', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return [];
		}

		return this.last(this.endsWith.apply(this, _args.lengthSort(false)));
	}});

	//
	const _toString = Array.prototype.toString;

	Object.defineProperty(Array.prototype, 'toString', { value: function(_depth, _compact, _index, _colors, _width, _radix, _spaces, _spaces_index)
	{
		//
		if(_depth === '')
		{
			_depth = encoding;
		}

		if(_depth === '' || _depth === 'utf8' || _depth === 'utf-8')
		{
			var res = '';

			if(this.length === 0)
			{
				return res;
			}

			for(var i = 0; i < this.length; ++i)
			{
				if(String.isString(this[i]))
				{
					res += this[i];
				}
				else if(Number.isInt(this[i]))
				{
					res += String.fromCharCode(Math.abs(this[i]) % 256);
				}
			}

			return res;
		}

		//
		const options = Object.assign(... arguments);

		if('depth' in options)
		{
			_depth = options.depth;
		}

		if('compact' in options)
		{
			_compact = options.compact;
		}

		if('index' in options)
		{
			_index = options.index;
		}

		if('colors' in options)
		{
			_colors = options.colors;
		}

		if('width' in options)
		{
			_width = options.width;
		}

		if('radix' in options)
		{
			_radix = options.radix;
		}

		if('spaces' in options)
		{
			_spaces = options.spaces;
		}

		if('indexSpaces' in options)
		{
			_spaces_index = options.indexSpaces;
		}

		//
		if(_depth === true)
		{
			_colors = true;
			_depth = 0;
		}
		else if(_depth === null)
		{
			_depth = null;
		}
		else if(_depth === false)
		{
			_colors = false;
			_depth = 0;
		}
		else if(! (Number.isInt(_depth) && _depth >= 0))
		{
			_depth = 0;
		}

		if(typeof _compact !== 'boolean')
		{
			_compact = DEFAULT_TO_STRING_COMPACT;
		}

		if(typeof _index !== 'boolean')
		{
			if(_compact)
			{
				_index = DEFAULT_TO_STRING_INDEX_COMPACT;
			}
			else
			{
				_index = DEFAULT_TO_STRING_INDEX;
			}
		}

		if(typeof _colors !== 'boolean')
		{
			if(_depth === 0)
			{
				_colors = false;
			}
			else
			{
				_colors = COLORS;
			}
		}

		var consoleWidth;

		if(BROWSER)
		{
			consoleWidth = 0;
		}
		else
		{
			consoleWidth = console.width;
		}

		if(typeof options.toText !== 'boolean')
		{
			if('width' in options)
			{
				options.toText = true;
			}
			else
			{
				options.toText = false;
			}
		}

		if(typeof _width === 'boolean')
		{
			_width = (_width ? consoleWidth : 0);
		}
		else if(_width === null)
		{
			_width = 0;
		}
		else if(! Number.isInt(_width))
		{
			_width = consoleWidth;
		}
		else if(_width < 0)
		{
			if(consoleWidth)
			{
				_width = ((consoleWidth + (_width % (consoleWidth + 1))) % (consoleWidth + 1));
			}
			else
			{
				return x('Can\'t calculate % (due to missing %)', null, '_width', 'console width');
			}
		}

		if(! isRadix(_radix, true))
		{
			_radix = DEFAULT_TO_STRING_RADIX;
		}

		if(typeof options.textRadix !== 'boolean')
		{
			options.textRadix = false;
		}

		if(_spaces === false)
		{
			_spaces = 0;
		}
		else if(_spaces === true)
		{
			_spaces = 1;
		}
		else if(! (Number.isInt(_spaces) && _spaces >= 0))
		{
			if(_compact)
			{
				_spaces = DEFAULT_TO_STRING_SPACES_COMPACT;
			}
			else
			{
				_spaces = DEFAULT_TO_STRING_SPACES;
			}
		}

		if(! (Number.isInt(_spaces_index) && _spaces_index >= 0))
		{
			_spaces_index = 1;
		}

		if(typeof options.indexOpen !== 'string')
		{
			options.indexOpen = '[';
		}

		if(typeof options.indexClose !== 'string')
		{
			options.indexClose = ']';
		}

		if(_colors)
		{
			if(options.indexOpen.length > 0)
			{
				options.indexOpen = options.indexOpen.debug;
			}

			if(options.indexClose.length > 0)
			{
				options.indexClose = options.indexClose.debug;
			}
		}

		if(typeof options.open !== 'string')
		{
			options.open = '[';
		}

		if(typeof options.close !== 'string')
		{
			options.close = ']';
		}

		if(typeof options.arguments !== 'boolean')
		{
			options.arguments = false;
		}

		if(_colors)
		{
			if(options.open.length > 0)
			{
				options.open = options.open.colorizeAs(options.arguments ? 'Arguments' : 'Array');
			}

			if(options.close.length > 0)
			{
				options.close = options.close.colorizeAs(options.arguments ? 'Arguments' : 'Array');
			}
		}

		if(typeof options.sep !== 'string')
		{
			options.sep = ',';
		}

		if(! ('quote' in options))
		{
			options.quote = DEFAULT_TO_STRING_QUOTE;
		}

		const alpha = alphabet(_radix);

		if(typeof options.pad === 'string')
		{
			if(options.pad.length === 0)
			{
				options.pad = ' ';
			}
		}
		else
		{
			options.pad = alpha[0];
		}


		//
		const getIndexString = (_idx, _max) => {
			if(! _index || !Number.isInt(_idx))
			{
				return '';
			}

			const isZero = (_idx === 0);
			var idx = _idx.toString(_radix);

			if(Number.isInt(_max) && !_compact)
			{
				_max = _max.toString(_radix).length;

				if(_max > 1)
				{
					if(_colors && options.pad === alpha[0])
					{
						if(isZero)
						{
							idx = idx.padStart(_max - 1, options.pad).colorizeAs('Date') + options.pad.colorizeAs('Number').bold;
						}
						else
						{
							var pad = idx;
							idx = '';

							for(var i = pad.length - 1; i < _max - 1; ++i)
							{
								idx += options.pad;
							}

							idx = idx.colorizeAs('Date') + pad.colorizeAs('Number').bold;
						}
					}
					else
					{
						idx = idx.padStart(_max, options.pad);
					}
				}
				else if(_colors)
				{
					idx = idx.colorizeAs('Number').bold;
				}
			}
			else if(_colors)
			{
				idx = idx.colorizeAs('Number').bold;
			}

			return options.indexOpen + idx + options.indexClose + space(_spaces_index);
		};

		const traverse = (_array, _current_depth = 1) => {
			//
			if(_array.length === 0)
			{
				return options.open + options.close;
			}

			//
			var res = options.open;

			//
			var prefix, item, index;

			//
			if(_compact)
			{
				prefix = space(_spaces);
			}
			else
			{
				prefix = EOL + space(_spaces * _current_depth);
			}

			//
			for(var i = 0; i < _array.length; ++i)
			{
				index = getIndexString(i, _array.length - 1);

				if(Array.isArray(_array[i], true) && (_depth === null || (_current_depth < _depth)))
				{
					res += (prefix + index);
					res += traverse(_array[i], _current_depth + 1);
				}
				else
				{
					item = String.render(_array[i], { colors: _colors, radix: _radix, textRadix: options.textRadix, quote: options.quote });
					item = item.toText({ width: (_compact ? 0 : (prefix.textLength + index.textLength)), prefix: (prefix + index), all: false });
					res += item;
				}

				if(i < (_array.length - 1))
				{
					res += options.sep;
				}
			}

			//
			if(_compact)
			{
				res += prefix;
			}
			else
			{
				res += EOL + space(_spaces * (_current_depth - 1));
			}

			//
			return (res + options.close);
		};

		//
		if(_depth === 0)
		{
			return String.render(this, { colors: _colors, radix: _radix, quote: options.quote });
		}
		else if(this.length === 0)
		{
			var item = options.open + options.close;

			if(_colors)
			{
				item = item.colorizeAs(options.arguments ? 'Arguments' : 'Array');
			}

			return item;
		}

		const result = traverse(this);

		if(_width !== 0 && options.toText === true)
		{
			return result.toText({ width: _width });
		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'overwrite', { value: function(_array, _offset = 0, _over_length = DEFAULT_OVERWRITE_OVER_LENGTH)
	{
		if(Array.isArray(_array, true))
		{
			if(_array.length === 0)
			{
				return this.valueOf();
			}
		}
		else
		{
			return x('Invalid % argument (expecting an %)', null, '_array', 'Array');
		}

		if(Number.isInt(_offset))
		{
			_offset = this.getIndex(_offset);
		}
		else
		{
			_offset = 0;
		}

		if(typeof _over_length !== 'boolean')
		{
			_over_length = DEFAULT_OVERWRITE_OVER_LENGTH;
		}

		const result = [];

		for(var i = _offset, j = 0; j < _array.length; ++i, ++j)
		{
			if(i < this.length)
			{
				result[j] = this[i];
			}

			this[i] = _array[j];

			if(! _over_length && i >= this.length - 1)
			{
				break;
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'firstOccurrence', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else if(this.length === 0)
		{
			return -1;
		}
		else for(var i = 0; i < this.length; ++i)
		{
			for(var j = 0; j < _args.length; ++j)
			{
				if(this[i] === _args[j])
				{
					return i;
				}
			}
		}

		return -1;
	}});

	Object.defineProperty(Array.prototype, 'lastOccurrence', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else if(this.length === 0)
		{
			return -1;
		}
		else for(var i = this.length - 1; i >= 0; --i)
		{
			for(var j = 0; j < _args.length; ++j)
			{
				if(this[i] === _args[j])
				{
					return i;
				}
			}
		}

		return -1;
	}});

	//
	const _indexOf = Array.prototype.indexOf;
	const _lastIndexOf = Array.prototype.lastIndexOf;

	Object.defineProperty(Array.prototype, 'indexOf', { value: function(_needle, _offset)
	{
		if(Number.isInfinite(_offset))
		{
			_offset = 0;
		}
		else if(Number.isInt(_offset))
		{
			if(_offset >= this.length)
			{
				return -1;
			}
			else if(_offset < 0)
			{
				_offset = this.getIndex(_offset);
			}
		}
		else
		{
			_offset = 0;
		}

		return _indexOf.call(this, _needle, _offset);
	}});

	Object.defineProperty(Array.prototype, 'lastIndexOf', { value: function(_needle, _offset)
	{
		if(Number.isInfinite(_offset))
		{
			_offset = this.length - 1;
		}
		else if(Number.isInt(_offset))
		{
			if(_offset > this.length)
			{
				return -1;
			}
			else if(_offset < 0)
			{
				_offset = this.getIndex(_offset);
			}
		}
		else
		{
			_offset = this.length - 1;
		}

		return _lastIndexOf.call(this, _needle, _offset);
	}});

	Object.defineProperty(Array.prototype, 'indicesOf', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else if(this.length === 0)
		{
			return [];
		}
		else
		{
			_args.uniq();
		}

		const result = [];
		var lastIndex = -1;

		for(var i = 0; i < this.length; ++i)
		{
			for(var j = 0; j < _args.length; ++j)
			{
				if(this[i] === _args[j])
				{
					result.push(i);
					break;
				}
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'include', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else if(this.length === 0)
		{
			return [];
		}
		else
		{
			_args.uniq();
		}

		const result = [];
		var found;

		for(var i = 0, k = 0; i < this.length; ++i)
		{
			found = -1;

			for(var j = 0; j < _args.length; ++j)
			{
				if(this[i] === _args[j])
				{
					found = j;
					break;
				}
			}

			if(found === -1)
			{
				result[k++] = this.splice(i--, 1)[0];
			}
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'exclude', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else if(this.length === 0)
		{
			return [];
		}
		else
		{
			_args.uniq();
		}

		const result = [];

		for(var i = 0, k = 0; i < this.length; ++i)
		{
			for(var j = 0; j < _args.length; ++j)
			{
				if(this[i] === _args[j])
				{
					result[k++] = this.splice(i--, 1)[0];
					break;
				}
			}
		}

		return result;
	}});

	Object.defineProperty(Array.prototype, 'includeAt', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(Number.isNumber(_args[i]))
			{
				_args[i] = this.getIndex(_args[i]);
			}
			else
			{
				return x('Invalid %[%] argument (expecting only %s)', null, '..._args', i, 'Number');
			}
		}

		_args.uniq().sort(false);
		const result = [];

		for(var i = this.length - 1, j = 0; i >= 0; --i)
		{
			if(_args.last() === i)
			{
				_args.pop();
			}
			else
			{
				result[j++] = this.splice(i, 1)[0];
			}
		}

		return result.sort(true);
	}});

	Object.defineProperty(Array.prototype, 'excludeAt', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < _args.length; ++i)
		{
			if(Number.isNumber(_args[i]))
			{
				_args[i] = this.getIndex(_args[i]);
			}
			else
			{
				return x('Invalid %[%] argument (expecting only %s)', null, '..._args', i, 'Number');
			}
		}

		_args.uniq().sort(false);
		const result = [];

		for(var i = _args.length - 1, j = 0; i >= 0; --i, ++j)
		{
			result[j] = this.splice(_args[i], 1)[0];
		}

		return result.sort(true);
	}});

	//
	Object.defineProperty(Array.prototype, 'emptyInstance', { value: function(_length)
	{
		if(Number.isInt(_length))
		{
			return new Array(Math.abs(_length));
		}
		else if(_length === null)
		{
			return new Array(0);
		}

		return new Array(this.length);
	}});

	//
	Object.defineProperty(Array, 'findLongest', { value: function(_array, _numbers_to_string = 10)
	{
		if(! Array.isArray(_array, false))
		{
			return x('Invalid % argument (expecting non-empty %)', null, '_array', 'Array');
		}
		else if(_numbers_to_string === false || _numbers_to_string === false || typeof _numbers_to_string === 'undefined')
		{
			_numbers_to_string = null;
		}
		else if(! isRadix(_numbers_to_string))
		{
			_numbers_to_string = 10;
		}

		var result = 0;

		for(var i = 0; i < _array.length; ++i)
		{
			if(typeof _array[i] === 'string')
			{
				if(_array[i].length > result)
				{
					result = _array[i].length;
				}
			}
			else if(Number.isNumber(_array[i]) && _numbers_to_string !== null)
			{
				var item = _array[i].toString(_numbers_to_string).length;

				if(item > result)
				{
					result = item;
				}
			}
		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'countRepetitions', { value: function(_amount = null)
	{
		if(! (Number.isInt(_amount) && _amount >= 1) && _amount !== null)
		{
			return x('Invalid % argument (expecting % or an % greater than %)', null, '_amount', null, 'Integer', 0);
		}

		const map = new Map();
		var counting = 0;

		const updateCount = (_item) => {
			var result = map.get(_item);
			map.set(_item, ++result);
			return result;
		};

		const checkCount = (_item) => {
			if(map.has(_item))
			{
				return updateCount(_item);
			}

			map.set(_item, 1);
			return 1;
		};

		for(var i = 0; i < this.length; ++i)
		{
			checkCount(this[i]);
		}

		//
		const result = map.entriesSortedByValues(false);

		if(typeof _amount === 'number' && result.length > _amount)
		{
			result.applyLength(_amount, false);
		}

		return result;
	}});

	//
	Object.defineProperty(Array.prototype, 'count', { value: function(... _args)
	{
		//DEFAULT_COUNT_MULTIPLY

		if(_args.length === 0)
		{
			return null;
		}
		else if(! DEFAULT_COUNT_MULTIPLY)
		{
			_args.uniq();
		}

		var result = 0;

		for(var i = 0; i < this.length; ++i)
		{
			for(var j = 0; j < _args.length; ++j)
			{
				if(this[i] === _args[j])
				{
					++result;

					if(! DEFAULT_COUNT_MULTIPLY)
					{
						break;
					}
				}
			}
		}

		return result;
	}});
	
	//
	//
	//TODO/ in browser/-part uebernhemne..
	//TODO/ radixSort geht nur mit POSITIVEN integern.. TODO!
	//
	/*
	Object.defineProperty(Array.prototype, 'sort', { value: function(_path, _asc = true, _mutable = DEFAULT_MUTABLE, _radix = DEFAULT_SORT_RADIX)
	{
		if(typeof _path === 'function')
		{
			return this.sort(_path);
		}
		else
		{
			if(typeof _path !== 'string' && !Number.isNumber(_path))
			{
				_path = null;
			}
			
			if(typeof _asc !== 'boolean')
			{
				_asc = true;
			}
			
			if(typeof _mutable !== 'boolean')
			{
				_mutable = false;
			}
			
			if(! Number.isInt(_radix))
			{
				_radix = DEFAULT_SORT_RADIX;
			}
		}
		
		//
		const radixSort = (_array) => {
			var max = Math.max(... _array);
			var exp = 1;
			var buckets, digit;
			
			while((max / exp) > 1)
			{
				buckets = Array.from({ length: _radix }, () => []);
				
				for(var i = 0; i < _array.length; ++i)
				{
					digit = Math.floor((_array[i] / exp) % _radix);
					buckets[digit].push(_array[i]);
				}
				
				_array = _concat.call([], ... buckets);
				exp *= _radix;
			}
			
			return _array;
		};
		
		//
		//TODO/alle anpassen an eigene anforderungen.. pls.
		//
		const compareInt = (_a, _b) => {
			return (_asc ? _a - _b : _b - _a);
		};

		const compareFloat = (_a, _b) => {
			const aInt = _a.int;
			const aFloat = (_a % 1);
			const bInt = _b.int;
			const bFloat = (_b % 1);
			
			if(aInt !== bInt)
			{
				return compareInt(aInt, bInt);
			}
			else if(aFloat === bFloat)
			{
				return 0;
			}
			else if(aFloat < bFloat)
			{
				return (_asc ? -1 : 1);
			}
			else if(_asc)
			{
				return 1;
			}
			
			return -1;
		};
		
		const compareBigInt = (_a, _b) => {
			if(_a < _b) return (_asc ? -1 : 1);
			if(_a > _b) return (_asc ? 1 : -1);
			return 0;
		};
		
		const compareString = (_a, _b) => {
			if(_asc) return _a.localeCompare(_b);
			return _b.localeCompare(_a);
		};
		
		const compareDate = (_a, _b) => {
			if(_asc) return _a.getTime() - _b.getTime();
			return _b.getTime() - _a.getTime();
		};
		
		const compareObject = (_a, _b) => {
			_a = (Array.isArray(_a, true) ? _a.length : (('LENGTH' in _a) ? _a.LENGTH : (Object.getOwnPropertyNames(_a).length + Object.getOwnPropertySymbols(_a).length)));
			_b = (Array.isArray(_b, true) ? _b.length : (('LENGTH' in _b) ? _b.LENGTH : (Object.getOwnPropertyNames(_b).length + Object.getOwnPropertySymbols(_b).length)));

			if(_asc) return _a - _b;
			return _b - _a;
		};
		
		const compareTry = (_a, _b) => {
			try
			{
				if(_a < _b) return (_asc ? -1 : 1);
				if(_a > _b) return (_asc ? 1 : -1);
				return 0;
			}
			catch(_error)
			{
				return 0;
			}
		};
		
		const extractByPath = (_obj) => {
			if(_path === null)
			{
				return _obj;
			}
			
			return Object.get(_path, _obj);
		};
		
		const inputArrayOffsets = () => {
throw new Error('TODO');
		};
	
		
		//
		const result = new Array(this.length);
		
		//
		// ich wuerde zuerst aus dem eingabe-array ein array an ziel-zahlen (inkl path-betrachtung) mitsamt den original-index machen,
		// um dann im radixSort() .. hm, ich muesste am ende die [1]=INDEX bewegen, wenn ich nach [0]=zahlen-cast sortiere, um wohl am
		// ende dann das array an *neuen* index zu durchlaufen, um im result[]-array letztlich gemaesz der neuen index einzufuegen...
		//
		
		//
		if(! _asc)
		{
			result.reverse();
		}
		
		//
		if(_mutable)
		{
			for(var i = 0; i < result.length; ++i)
			{
				this[i] = result[i];
			}
			
			return this;
		}
		
		return result;
	}});*/


	//
	//temporarily...
	const _sort = Array.prototype.sort;

	Object.defineProperty(Array.prototype, '_sort', { get: function() { return _sort; }});
	
	Object.defineProperty(Array.prototype, 'sort', { value: function(_path = null, _asc = true)
	{
const SORT = false;
		if(typeof _path === 'boolean')
		{
			_asc = _path;
			_path = null;
		}

		if(typeof _path === 'function')
		{
			_sort.call(this, _path);
			return this;
		}
		else if(SORT)
		{
			if(typeof __SORT === 'number')
			{
				return sort(null, _path, _asc);
			}

			return x('Load the \'%/%.js\'...', null, 'ext', 'sort');
		}
		
		return _sort.call(this, (_a, _b) => {
			var a, b;

			if(typeof Object.has === 'function')
			{
				if(typeof _path === 'string' || Number.isNumber(_path))
				{
					//if not *both* objects have _path, do *not* compare (return 0 @ sort())
					if(!(Object.has(_path, _a) && Object.has(_path, _b)))
					{
						return 0;
					}

					//
					a = Object.get(_path, _a);
					b = Object.get(_path, _b);

					//
					if(typeof a === 'undefined' || typeof b === 'undefined')
					{
						return 0;
					}
					else if(a === null || b === null)
					{
						return 0;
					}
				}
				else
				{
					a = _a;
					b = _b;
				}
			}
			else
			{
				a = _a;
				b = _b;
			}

			//
			if(typeof a === 'number' && typeof b === 'number')
			{
				return (_asc ? a - b : b - a);
			}
			else if(typeof a === 'bigint' && typeof b === 'bigint')
			{
				if(a < b) return (_asc ? -1 : 1);
				if(a > b) return (_asc ? 1 : -1);
				return 0;
			}
			else if(typeof a === 'string' && typeof b === 'string')
			{
				if(_asc) return a.localeCompare(b);
				return b.localeCompare(a);
			}
			else if(Date.isDate(a) && Date.isDate(b))
			//else if(a instanceof Date && b instanceof Date)
			{
				if(_asc) return (a.getTime() - b.getTime());
				return (b.getTime() - a.getTime());
			}
			else if(Object.isObject(a) && Object.isObject(b))
			{
				if(Array.isArray(a, true))
				{
					a = a.length;
				}
				else
				{
					a = Object.LENGTH(a);
				}

				if(Array.isArray(b, true))
				{
					b = b.length;
				}
				else
				{
					b = Object.LENGTH(b);
				}

				return (_asc ? a - b : b - a);
			}

			try
			{
				if(a < b) return (_asc ? -1 : 1);
				if(a > b) return (_asc ? 1 : -1);
				return 0;
			}
			catch(_error)
			{
				return 0;
			}
		});
	}});
	
	//
	const _isArray = Array.isArray.bind(Array);
	
	Object.defineProperty(Array, 'isArray', { value: function(_item, _empty = DEFAULT_ISARRAY_EMPTY, _typed = DEFAULT_ISARRAY_TYPED, _class = DEFAULT_ISARRAY_CLASS)
	{
		if(typeof _empty !== 'boolean' && !(isInt(_empty) && _empty >= 0))
		{
			_empty = DEFAULT_ISARRAY_EMPTY;
		}
		
		if(typeof _empty === 'boolean')
		{
			_empty = (_empty ? 0 : 1);
		}
		
		if(typeof _typed !== 'boolean')
		{
			_typed = DEFAULT_ISARRAY_TYPED;
		}
		
		if(typeof _class !== 'boolean')
		{
			_class = DEFAULT_ISARRAY_CLASS;
		}
		
		if(_isArray(_item))
		{
			return (_item.length >= _empty);
		}
		else if(_typed && Array.isTypedArray(_item, _empty, _class))
		{
			return true;
		}
		else if(_class && Array.isArrayClass(_item, _typed))
		{
			return true;
		}
		
		return false;
	}});

	isArray = Array.isArray.bind(Array);

	//
	Object.defineProperty(Array.prototype, 'contains', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			if(this.length === 0)
			{
				return true;
			}

			return null;
		}

		const copy = [ ... this.valueOf() ];
		var has;

		for(var i = 0; i < _args.length; ++i)
		{
			has = false;

			for(var j = 0; j < copy.length; ++j)
			{
				if(_args[i] === copy[j])
				{
					copy.splice(j, 1);
					has = true;
					break;
				}
			}

			if(has)
			{
				_args.splice(i--, 1);

				if(_args.length === 0)
				{
					break;
				}
			}
			else
			{
				return false;
			}
		}

		return (_args.length === 0);
	}});

	//

})();

//
module.exports = Array;

