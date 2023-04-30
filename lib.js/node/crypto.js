(function()
{

	//
	const DEFAULT_MAX_INCLUSIVE = true;

	//
	const c = module.exports = require('node:crypto');

	Object.defineProperty(global, 'crypto', {
		get: function()
		{
			return c;
		},
		set: function(_value)
		{
			return c = _value;
		}
	});

	//
	crypto.getRandomValues = function(_typed_array, _offset, _size, _callback)
	{
		if(typeof _callback === 'function')
		{
			return crypto.randomFill(_typed_array, _offset, _size, _callback);
		}

		return crypto.randomFillSync(_typed_array, _offset, _size);
	}

	//
	_randomInt = crypto.randomInt.bind(crypto);

	crypto.randomInt = function(_min, _max, _callback, _max_inclusive = DEFAULT_MAX_INCLUSIVE)
	{
		if(typeof _max_inclusive !== 'boolean')
		{
			_max_inclusive = DEFAULT_MAX_INCLUSIVE;
		}

		var min, max;

		if(typeof _max === 'function')
		{
			_callback = _max;
		}
		else if(typeof _callback !== 'function')
		{
			_callback = undefined;
		}

		if(Number.isInt(_min) && Number.isInt(_max))
		{
			//
		}
		else if(Number.isInt(_min))
		{
			_max = _min;
			_min = 0;
		}
		else
		{
			return x('Invalid %/% argument (no %(s))', null, '_min', '_max', 'Integer');
		}

		min = Math._min(_min, _max);
		max = Math._max(_max, _min);

		if(_max_inclusive)
		{
			++max;
		}

		return _randomInt(min, max, _callback);
	}

	//
	
})();

