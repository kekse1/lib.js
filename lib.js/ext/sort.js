__SORT = (function()
{

	//
	const DEFAULT_RADIX = 256;

	//
	sort = (_algorithm, ... _args) => {
		if(! String.isString(_algorithm))
		{
			_algorithm = SORT;
		}
		else if(typeof sort[_algorithm] !== 'function')
		{
			return x('Your % \'%\' doesn\'t seem to be implemented (yet)', null, '_algorithm', _algorithm);
		}

		return sort[_algorithm](... _args);
	};

	//
	sort.original = (_function, _array) => {
		if(! Array.isArray(_array, true))
		{
			return x('Your % argument is not an %', null, '_array', 'Array');
		}

		if(typeof Array.prototype._sort === 'function')
		{
			return Array.prototype._sort.call(_array, _function);
		}
		
		return Array.prototype.sort.call(_array, _function);
	};

	//
	sort.string = (_algorithm, ... _args) => {
		if(! String.isString(_algorithm))
		{
			_algorithm = SORT;
		}
		else if(typeof sort[_algorithm] !== 'function')
		{
			return x('Your % \'%\' doesn\'t seem to be implemented (yet)', null, '_algorithm', _algorithm);
		}
		
		if(typeof sort[_algorithm].string === 'function')
		{
			return sort[_algorithm].string(... _args);
		}
		
		return x('Your % \'%\' doesn\'t seem to support % types (yet)', null, '_algorithm', _algorithm, 'String');
	};

	sort.int = sort.integer = (_algorithm, ... _args) => {
		if(! String.isString(_algorithm))
		{
			_algorithm = SORT;
		}
		else if(typeof sort[_algorithm] !== 'function')
		{
			return x('Your % \'%\' doesn\'t seem to be implemented (yet)', null, '_algorithm', _algorithm);
		}
		
		if(typeof sort[_algorithm].integer === 'function')
		{
			return sort[_algorithm].integer(... _args);
		}
		else if(typeof sort[_algorithm].int === 'function')
		{
			return sort[_algorithm].int(... _args);
		}
		
		return x('Your % \'%\' doesn\'t seem to support % types (yet)', null, '_algorithm', _algorithm, 'Integer');
	};
	
	sort.bigint = (_algorithm, ... _args) => {
		if(! String.isString(_algorithm))
		{
			_algorithm = SORT;
		}
		else if(typeof sort[_algorithm] !== 'function')
		{
			return x('Your % \'%\' doesn\'t seem to be implemented (yet)', null, '_algorithm', _algorithm);
		}
		
		if(typeof sort[_algorithm].bigint === 'function')
		{
			return sort[_algorithm].bigint(... _args);
		}
		
		return x('Your % \'%\' doesn\'t seem to support % types (yet)', null, '_algorithm', _algorithm, 'BigInt');

	};

	sort.float = (_algorithm, ... _args) => {
		if(! String.isString(_algorithm))
		{
			_algorithm = SORT;
		}
		else if(typeof sort[_algorithm] !== 'function')
		{
			return x('Your % \'%\' doesn\'t seem to be implemented (yet)', null, '_algorithm', _algorithm);
		}
		
		if(typeof sort[_algorithm].float === 'function')
		{
			return sort[_algorithm].float(... _args);
		}
		
		return x('Your % \'%\' doesn\'t seem to support % types (yet)', null, '_algorithm', _algorithm, 'Float');
	};
	
	sort.date = (_algorithm, ... _args) => {
		if(! String.isString(_algorithm))
		{
			_algorithm = SORT;
		}
		else if(typeof sort[_algorithm] !== 'function')
		{
			return x('Your % \'%\' doesn\'t seem to be implemented (yet)', null, '_algorithm', _algorithm);
		}
		
		if(typeof sort[_algorithm].date === 'function')
		{
			return sort[_algorithm].date(... _args);
		}
		
		return x('Your % \'%\' doesn\'t seem to support % types (yet)', null, '_algorithm', _algorithm, 'Date');
	};

	//
	(function()
	{

		//
		sort.radix = (_path, _array, _radix = DEFAULT_RADIX) => {
			if(! Array.isArray(_array, true))
			{
				return x('Invalid % argument (not an %)', null, '_array', 'Array');
			}
			else if(_array.length === 0)
			{
				return [];
			}
			
			if(typeof _path !== 'string' && !Number.isNumber(_path))
			{
				_path = null;
			}
			
			if(! (Number.isInt(_radix) && _radix >= 2))
			{
				_radix = DEFAULT_RADIX;
			}

			const type = typeOf(obj = Object.get(_path, _array[0]), null);
			const search = [];
			const rest = [];
			var obj;

			switch(type)
			{
				case 'Integer':
				case 'BigInt':
				case 'String':
				case 'Date':
					break;
				default:
					return x('The RADIX'.bold + ' SORT algorithm can\'t handle % types (here/yet?)', null, type);
					break;
			}
			
			for(var i = 0, t = 0, r = 0; i < _array.length; ++i)
			{
				if(typeOf(obj = Object.get(_path, _array[i]), null) !== type)
				{
					rest[r++] = obj;
				}

				search[t++] = obj;
			}
			
			var result;
			
			switch(type)
			{
				case 'Integer':
				case 'BigInt':
					result = sort.radix.int(_path, _array, _radix);
					break;
				case 'Date':
					result = sort.radix.date(_path, _array, _radix);
					break;
				case 'String':
					result = sort.radix.string(_path, _array, _radix);
					break;
				default:
					return x('Unexpected...');
			}
			
			return result;
		};
		
		//
		sort.radix.integer = sort.radix.int = (_path, _array, _radix = DEFAULT_RADIX) => {
throw new Error('TODO');
		};
		
		sort.radix.bigint = sort.radix.integer;
		
		sort.radix.string = (_path, _array, _radix = DEFAULT_RADIX) => {
throw new Error('TODO');
		};
		
		sort.radix.date = (_path, _array, _radix = DEFAULT_RADIX) => {
			//
			const search = new Array(_array.length);
			
			for(var i = 0; i < _array.length; ++i)
			{
				if(Date.isDate(_array[i]))
				{
					search[i] = _array[i].getTime();
				}
				else if(Number.isInt(_array[i]))
				{
					search[i] = _array[i];
				}
				else
				{
					return x('Invalid %[%] (neither % nor %)', null, '_array', i, 'Date', 'Integer');
				}
			}
			
			//
			const result = new Array(search.length);
			search = sort.radix.integer(_path, search, _radix);
			
			for(var i = 0; i < search.length; ++i)
			{
				result[i] = new Date(search[i]);
			}
			
			return result;
		};
		
		//
		
	})();




	/*
			const big = (typeof _array[0] === 'bigint');
			var max = (big ? 0n : 0);
			var result = new Array(_array.length);

			for(var i = 0; i < _array.length; ++i)
			{
				if(_array[i] > max)
				{
					max = _array[i];
				}

				result[i] = [ _array[i], i ];
			}

			const rdx = _radix;

			if(big)
			{
				_radix = BigInt.from(_radix);
			}

			var exp = (big ? 1n : 1);
			var buckets;

			while((max / exp) > (big ? 1n : 1))
			{
				buckets = Array.from({ length: rdx }, () => []);

				for(var i = 0; i < result.length; ++i)
				{
					buckets[Math.floor(Number((result[i][0] / exp) % _radix))].push(result[i]);
				}

				array = []._concat(... buckets);
				exp *= _radix;
			}
			
			return result;
		};
		
		//
		sort.radix.integer = sort.radix.int => (_array, _radix = DEFAULT_RADIX) => {
			//
		};

		sort.radix.string = (_array) => {
			//
		};
		
		sort.radix.date = (_array, _radix = DEFAULT_RADIX) => {
			//
		};


		//
		const radixSort = (_array, _radix = DEFAULT_RADIX, _index = DEFAULT_INDEX) => {
			if(_array.length === 0)
			{
				return [];
			}

			const big = (typeof _array[0] === 'bigint');
			var max = (big ? 0n : 0);
			var result = new Array(_array.length);

			for(var i = 0; i < _array.length; ++i)
			{
				if(_array[i] > max)
				{
					max = _array[i];
				}

				result[i] = [ _array[i], i ];
			}

			const rdx = _radix;

			if(big)
			{
				_radix = BigInt.from(_radix);
			}

			var exp = (big ? 1n : 1);
			var buckets;

			while((max / exp) > (big ? 1n : 1))
			{
				buckets = Array.from({ length: rdx }, () => []);

				for(var i = 0; i < result.length; ++i)
				{
					buckets[Math.floor(Number((result[i][0] / exp) % _radix))].push(result[i]);
				}

				array = []._concat(... buckets);
				exp *= _radix;
			}

			return extract(result, _index);
		};

		const checkArguments = (_args) => {
			if(! (String.isString(_args[0]) || Number.isNumber(_args[0])))
			{
				_args[0] = null;
			}

			if(Array.isArray(_args[1], true))
			{
				_args[1] = [ ... _args[1] ];
			}
			else
			{
				return x('Invalid % argument (no %)', null, '_array', 'Array');
			}

			if(typeof _args[2] !== 'boolean')
			{
				_args[2] = true;
			}

			if(! (Number.isInt(_args[3]) && _args[3] >= 2))
			{
				_args[3] = DEFAULT_RADIX;
			}

			if(typeof _args[4] !== 'boolean' && typeof _args[4] !== null)
			{
				_args[4] = DEFAULT_INDEX;
			}

			return _args;
		};


		const extract = (_array, _index = DEFAULT_INDEX) => {
			const result = new Array(_array.length);

			if(_index === true) for(var i = 0; i < _array.length; ++i)
			{
				if(Array.isArray(_array[i], false))
				{
					result[i] = _array[i][1];
				}
			}
			else if(_index === false) for(var i = 0; i < _array.length; ++i)
			{
				if(Array.isArray(_array[i], false))
				{
					result[i] = _array[i][0];
				}
			}
			else
			{
				return [ ... _array ];
			}

			return result;
		};

		sort.radix = (... _args) => {
	throw new Error('TODO');
		};

		sort.radix.int = sort.radix.integer = sort.radix.bigint = (... _args) => {
			//
			[ _path, _array, _asc, _radix, _index ] = checkArguments(_args);

			//
			var positive = [];
			var negative = [];

			const big = (typeof _array[0] === 'bigint');

			for(var i = 0, p = 0, n = 0; i < _array.length; ++i)
			{
				if(Number.isInt(_array[i]))
				{
					if(big)
					{
						return x('Mixing BigInt and Number is not allowed');
					}
					else if(_array[i] < 0)
					{
						negative[n++] = [ _array[i] * -1, i ];
					}
					else
					{
						positive[p++] = [ _array[i], i ];
					}
				}
				else if(typeof _array[i] === 'bigint')
				{
					if(!big)
					{
						return x('Mixing BigInt and Number is not allowed');
					}
					else if(_array[i] < 0n)
					{
						negative[n++] = [ _array[i] * -1n, i ];
					}
					else
					{
						positive[p++] = [ _array[i], i ];
					}
				}
				else
				{
					return x('The %[%] argument is neither % nor %', null, '_array', i, 'BigInt', 'Integer');
				}
			}

			positive = radixSort(positive, _radix, null);
			negative = radixSort(negative, _radix, null);
return dir(negative,'negative');
			for(var i = 0; i < negative.length; ++i)
			{
				negative[i][0] *= (big ? -1n : -1);
			}

			if(typeof _index === 'boolean')
			{
				positive = extract(positive, _index);
				negative = extract(negative, _index);
			}

			const result = [];

			if(_asc)
			{
				result.concat(negative.reverse(), positive);
			}
			else
			{
				result.concat(positive.reverse(), negative);
			}

			return result;
		};

		sort.radix.string = (... _args) => {
			//
			[ _path, _array, _asc, _radix, _index ] = checkArguments(_args);

			//
			var maxLength = 0;
			var result = new Array(_array.length);

			for(var i = 0; i < _array.length; ++i)
			{
				if(_array[i].length > maxLength)
				{
					maxLength = _array[i].length;
				}

				result[i] = [ _array[i], i ];
			}

			var buckets;

			for(var i = maxLength - 1; i >= 0; --i)
			{
				buckets = Array.from({ length: 256 }, () => []);

				for(var j = 0; j < result.length; ++j)
				{
					if(i < result[j][0].length)
					{
						buckets[result[j][0].charCodeAt(i)].push(result[j]);
					}
				}

				result = []._concat(... buckets);
			}

			return extract(result, _index);
		};
		
		sort.radix.date = (... _args) => {
			//
			[ _path, _array, _asc, _radix, _index ] = checkArguments(_args);
			
			//
			for(var i = 0; i < _array.length; ++i)
			{
				if(Date.isDate(_array[i]))
				{
					_array[i] = _array[i].getTime();
				}
				else if(! Number.isInt(_array[i]))
				{
					return x('Your %[%] element is neither % nor %', null, '_array', i, 'Date', 'Integer');
				}
			}
			
			//
			const result = (sort.radix.integer || sort.radix.int)(_path, _array, _asc, _radix, null);
			
			//
			for(var i = 0; i < result.length; ++i)
			{
				result[i][0] = new Date(result[i][0]);
			}
			
			//
			return extract(result, _index);
		};
		
		//*/


	//

	//
	//TODO/
	//..
	//sort.bubble, etc... & bitte je algoirthmus eigenen "(function(){})()"-(sub-)block..! ;)~
	//..

	//
	return Date.now();
	
})();

