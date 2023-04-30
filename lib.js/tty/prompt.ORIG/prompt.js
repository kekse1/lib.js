(function()
{

	//
	const DEFAULT_THROW = true;

	//
	prompt = module.exports = EVENT.create();

	//
	if(typeof ansi === 'undefined')
	{
		require('tty/ansi');
	}

	if(typeof raw === 'undefined')
	{
		require('tty/raw/');
	}

	//
	prompt.prompts = function(_vector, _throw = DEFAULT_THROW)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = DEFAULT_THROW;
		}

		//
		if((_vector = prompt.checkVector(_vector, false, _throw)) === null)
		{
			return null;
		}
		else if(typeof _vector === 'undefined')
		{
			return Object.create(null);
		}

		//
		const result = Object.create(null);
	}

	//
	Object.defineProperty(prompt, 'getSymbols', { value: function(_colors = COLORS)
	{
		const result = Object.null({
			error: '✘',
			success: '✔',
			question: '❓'
		});

		if(typeof _colors !== 'boolean')
		{
			_colors = COLORS;
		}

		if(!!_colors)
		{
			result.error = result.error.color('rgb(210, 45, 25)');//red
			result.success = result.success.color('rgb(170, 230, 70)');//green
			result.question = result.question.color('rgb(30, 160, 210)');//blue
		}

		return result;
	}});

	//
	prompt.checkVector = function(_vector, _deep = false, _throw = DEFAULT_THROW)
	{
		//
		if(! Array.isArray(_vector, false))
		{
			if(_throw)
			{
				return x('Your % is not a non-empty %', null, '_vector', 'Array');
			}

			return null;
		}

		//
		/*if(_deep) for(var i = 0; i < _vector.length; ++i)
		{
			if((_vector[idx] = prompt.checkVectorItem(_vector[idx], _deep, _throw)) === null)
			{
				delete _vector[idx];
			}
		}*/
	}

	prompt.checkVectorItem = function(_item, _deep = false, _throw = DEFAULT_THROW)
	{
		//
		if(! Object.isObject(_item))
		{
			if(_throw)
			{
				return x('Your % is not an %', null, '_item', 'Object');
			}

			return null;
		}
		else if(_vector.LEN === 0)
		{
			if(_throw)
			{
				return x('Your % is %', null, '_vector', 'EMPTY');
			}

			return null;
		}

		//
	}

	//
	prompt.event = function(_type, _item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
		switch(_type)
		{
			default:
				break;
		}
	}

	prompt.render = function(_type, _item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
		switch(_type)
		{
			default:
				break;
		}
	}

	prompt.render.confirm = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	prompt.render.date = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	prompt.render.list = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	prompt.render.map = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	prompt.render.number = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	prompt.render.password = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	prompt.render.path = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	prompt.render.range = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	prompt.render.string = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	//
	function cloneObject(_object)
	{
		return JSON.parse(JSON.stringify(_object));
	}

	//
	Object.defineProperty(prompt, 'events', { get: function()
	{
		return [ 'cancel', 'enter', 'item', 'ready', 'render', 'update' ];
	}});

	Object.defineProperty(prompt, 'types', { get: function()
	{
		return [ 'confirm', 'date', 'list', 'map', 'number', 'password', 'path', 'range', 'string' ];
	}});

	(function()
	{
		const events = prompt.events;
		const types = prompt.types;

		for(const e of events)
		{
			prompt.event[e] = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
			{
				return prompt.event(e, _item, _index, _vector, _throw);
			}
		}

		for(const t of types)
		{
			prompt[t] = function(_item, _index, _vector = null, _throw = DEFAULT_THROW)
			{
				return prompt.render(t, _item, _index, _vector, _throw);
			}
		}
	})();

	//
	Object.defineProperty(prompt, 'item', { get: function()
	{
		const result = {};
	}});

	//
	Object.defineProperty(prompt.confirm, 'item', { get: function()
	{
		//
		const result = cloneObject(prompt.item);

		//

		//
		return result;
	}});

	Object.defineProperty(prompt.date, 'item', { get: function()
	{
		//
		const result = cloneObject(prompt.item);

		//

		//
		return result;
	}});

	Object.defineProperty(prompt.list, 'item', { get: function()
	{
		//
		const result = cloneObject(prompt.item);

		//

		//
		return result;
	}});

	Object.defineProperty(prompt.map, 'item', { get: function()
	{
		//
		const result = cloneObject(prompt.item);

		//

		//
		return result;
	}});

	Object.defineProperty(prompt.number, 'item', { get: function()
	{
		//
		const result = cloneObject(prompt.item);

		//

		//
		return result;
	}});

	Object.defineProperty(prompt.password, 'item', { get: function()
	{
		//
		const result = cloneObject(prompt.item);

		//

		//
		return result;
	}});

	Object.defineProperty(prompt.path, 'item', { get: function()
	{
		//
		const result = cloneObject(prompt.item);

		//

		//
		return result;
	}});

	Object.defineProperty(prompt.range, 'item', { get: function()
	{
		//
		const result = cloneObject(prompt.item);

		//

		//
		return result;
	}});

	Object.defineProperty(prompt.string, 'item', { get: function()
	{
		//
		const result = cloneObject(prompt.item);

		//

		//
		return result;
	}});

	//

})();
