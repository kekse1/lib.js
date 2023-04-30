(function()
{

	//
	const DEFAULT_CASE_SENSITIVE = false;
	const DEFAULT_WITH_DISTANCES = true;

	//
	levenshtein = module.exports = (_word, ... _compare) => {
		var CASE_SENSITIVE = DEFAULT_CASE_SENSITIVE;
		var WITH_DISTANCES = DEFAULT_WITH_DISTANCES;
		var booleans = 0;
		
		if(! String.isString(_word))
		{
			if(typeof _word === 'boolean')
			{
				CASE_SENSITIVE = _word;
				_word = _compare.shift();
				booleans = 1;
			}
			
			if(! String.isString(_word))
			{
				return x('Invalid % argument (not a non-empty %)', null, '_word', 'String');
			}
		}
		
		if(_compare.length === 0)
		{
			return x('You need to define words to compare them against the %', null, '_word');
		}
		else for(var i = 0; i < _compare.length; ++i)
		{
			if(typeof _compare[i] === 'boolean')
			{
				if(booleans === 0)
				{
					CASE_SENSITIVE = _compare.splice(i--, 1)[0];
					booleans = 1;
				}
				else if(booleans === 1)
				{
					WITH_DISTANCES = _compare.splice(i--, 1)[0];
					booleans = 2;
				}
				else
				{
					return x('Too many % types (% is the maximum)', null, 'Boolean', 2);
				}
			}
			else if(! String.isString(_compare[i]))
			{
				return x('Invalid %[%] argument (not a non-empty %)', null, '..._compare', i, 'String');
			}
		}
		
		//
		_compare.uniq();

		//
		const result = [];
		
		for(var i = 0; i < _compare.length; ++i)
		{
			result[i] = [
				_compare[i],
				levenshtein.compare(_word, _compare[i], CASE_SENSITIVE)
			];
		}
		
		result.sort(1, true);
		
		if(! WITH_DISTANCES) for(var i = 0; i < result.length; ++i)
		{
			result[i] = result[i][0];
		}
		
		return result;
	};
	
	levenshtein.compare = (_word_a, _word_b, _case_sensitive = DEFAULT_CASE_SENSITIVE) => {
		//
		if(typeof _case_sensitive !== 'boolean')
		{
			_case_sensitive = DEFAULT_CASE_SENSITIVE;
		}
		
		if(! String.isString(_word_a) || ! String.isString(_word_b))
		{
			return x('Invalid %* argument(s) (expecting two non-empty %s)', null, '_word_', 'String');
		}
		else if(! _case_sensitive)
		{
			_word_a = _word_a.toLowerCase();
			_word_b = _word_b.toLowerCase();
		}
		
		//
		const result = new Array(_word_b.length + 1);
		
		for(var i = 0; i < result.length; ++i)
		{
			result[i] = new Array(_word_a.length);
		}
		
		for(var i = 0; i <= _word_a.length; ++i)
		{
			result[0][i] = i;
		}
		
		for(var i = 0; i <= _word_b.length; ++i)
		{
			result[i][0] = i;
		}
		
		for(var j = 1; j <= _word_b.length; ++j)
		{
			for(var i = 1; i <= _word_a.length; ++i)
			{
				result[j][i] = Math._min(
					// deletion
					result[j][i - 1] + 1,
					// insertion
					result[j - 1][i] + 1,
					// substitution
					result[j - 1][i - 1] + (_word_a[i - 1] === _word_b[j - 1] ? 0 : 1)
				);
			}
		}
		
		return result[_word_b.length][_word_a.length];
	};
	
	//

})();
