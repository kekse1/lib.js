(function()
{

	//
	//TODO/see 'TODO.txt'.. ^_^ ...
	//

	//
	const DEFAULT_THROW = true;

	//
	JSOFF = module.exports = {};

	//
	JSOFF.parse = function(_string, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	//
	//TODO/ALWAYS use MY 'Object.getOwnPropertyNames(object, true, false)'; if empty array, no need for recursion..! ;-)
	//TODO/maybe also 'String.render()' for not supported types!? => '_render'?!?
	//
	JSOFF.render = JSOFF.stringify = function(_object, _pretty = false, _throw = DEFAULT_THROW)
	{
throw new Error('TODO');
	}

	//
	_JSON = JSON;
	JSON = {};

	Object.defineProperty(JSON, 'parse', { get: function()
	{
		if(OFF)
		{
			return JSOFF.parse;
		}

		return _JSON.parse;
	}});

	Object.defineProperty(JSON, 'stringify', { get: function()
	{
		if(OFF)
		{
			return JSOFF.stringify;
		}

		return _JSON.stringify;
	}});

	Object.defineProperty(JSON, 'render', { get: function()
	{
		return JSON.stringify;
	}});

	//
	
})();

