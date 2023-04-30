(function()
{

	//
	const DEFAULT_MAX_INCLUSIVE = true;

	//
	if(typeof crypto === 'undefined')
	{
		require('+crypto');
	}

	//
	crypto.randomBigInt = function(_max, _min, _callback, _max_inclusive = DEFAULT_MAX_INCLUSIVE)
	{
throw new Error('TODO');
	}

	crypto.randomFloat = function(_max, _min, _callback, _max_inclusive = false)
	{
throw new Error('TODO');
	}

	//
	
})();

