
//FIXME!!!

(function()
{

	//
	//TODO/ "Bionic Reading"
	//
	//< https://bionic-reading.com/de/ >
	//
	
	//
	const DEFAULT_LENGTH_MINIMUM = 1;

	const DEFAULT_FIXATION = 0.39;

	const DEFAULT_SAKKADE_WORDS = 2;
	const DEFAULT_SAKKADE_CHARS = 12;

	const DEFAULT_DARKEN_REST = true;
	const DEFAULT_DARKEN_COLOR = '#888';
	const DEFAULT_DARKEN_BOLD = false;

	//
	bionic = module.exports = function(_string, _output, _input = _output, _throw = true)
	{
		const getInputComplexType = (_value) => {
			if(typeof _value === 'boolean')
			{
				if(_value)
				{
					return (BROWSER ? 'html' : 'ansi');
				}

				return 'text';
			}
			else if(typeof _value === 'string') switch(_value.toLowerCase())
			{
				case 'text':
					return 'text';
				case 'ansi':
					return 'ansi';
				case 'html':
				case 'xml':
					return 'html';
			}

			return _output;//(BROWSER ? 'html' : 'ansi');
		};

		const getOutputComplexType = (_value) => {
			if(typeof _value === 'string') switch(_value.toLowerCase())
			{
				case 'ansi':
					return 'ansi';
				case 'html':
				case 'xml':
					return 'html';
			}

			return (BROWSER ? 'html' : 'ansi');
		};

		if(typeof _throw !== 'boolean')
		{
			_throw = true;
		}

		const opts = {};

		if(Object.isObject(_string))
		{
			opts.assign(_string);
		}

		if(Object.isObject(_output))
		{
			opts.assign(_output);
		}

		if(typeof opts.string === 'string')
		{
			_string = opts.string;
		}
		else if(typeof opts.text === 'string')
		{
			_string = opts.text;
		}
		else if(typeof opts.value === 'string')
		{
			_string = opts.value;
		}
		else if(typeof _string !== 'string')
		{
			if(_throw)
			{
				return x('Invalid % argument/option (expecting a %)', null, '_string', 'String');
			}

			return null;
		}
		else if(_string.length < DEFAULT_LENGTH_MINIMUM)
		{
			return _string;
		}

		if('output' in opts)
		{
			_output = opts.output;
		}

		if('input' in opts)
		{
			_input = opts.input;
		}

		if(typeof opts.throw === 'boolean')
		{
			_throw = opts.throw;
		}

		if(typeof _string !== 'string')
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting a %)', null, '_string', 'String');
			}

			return _string;
		}
		else if(_string.length === 0)
		{
			return '';
		}
		else
		{
			_output = getOutputComplexType(_output);
			_input = getInputComplexType(_input);
		}

		return processString(_string, _output, _input, _throw);
	}

	//
	var query = null;

	const getQuery = (_key) => {
		if(typeof window.location.query === 'undefined')
		{
			require('web/globals/location');
		}

		if(query === null)
		{
			query = window.location.query;
		}

		var result;

		if(Object.isObject(query.bionic))
		{
			result = query.bionic;

			switch(_key)
			{
				case 'fixation':
					result = result.fixation;
					break;
				case 'sakkadeWords':
					if(Object.isObject(result.sakkade))
					{
						result = result.sakkade.words;
					}
					else if('sakkadeWords' in result)
					{
						result = result.sakkadeWords;
					}
					else if('words' in result)
					{
						result = result.words;
					}
					else
					{
						result = null;
					}

					break;
				case 'sakkadeChars':
					if(Object.isObject(result.sakkade))
					{
						result = result.sakkade.chars;
					}
					else if('sakkadeChars' in result)
					{
						result = result.sakkadeChars;
					}
					else if('chars' in result)
					{
						result = result.chars;
					}
					else
					{
						result = null;
					}

					break;
				default:
					return null;
			}

			if(Array.isArray(result, false))
			{
				return result.last();
			}
			else if(Number.isNumber(result))
			{
				return result;
			}
		}
		
		switch(_key)
		{
			case 'fixation':
				result = query.bionicFixation;
				break;
			case 'sakkadeWords':
				result = query.bionicSakkadeWords;
				break;
			case 'sakkadeChars':
				result = query.bionicSakkadeChars;
				break;
			default:
				return null;
		}

		if(Array.isArray(result, false))
		{
			return result.last();
		}
		else if(Number.isNumber(result))
		{
			return result;
		}

		return null;
	};

	//
	Object.defineProperty(bionic, 'FIXATION', {
		get: function()
		{
			var result;

			if(BROWSER && Number.isNumber(getQuery('fixation')))
			{
				result = getQuery('fixation');
			}
			else if(Number.isNumber(BIONIC_FIXATION))
			{
				result = BIONIC_FIXATION;
			}
			else
			{
				result = DEFAULT_FIXATION;
			}

			if(result <= 0)
			{
				result = 0;
			}
			else if(result > 1)
			{
				result = 1;
			}

			return result;
		},
		set: function(_value)
		{
			if(Number.isNumber(_value))
			{
				if(_value <= 0)
				{
					_value = 0;
				}
				else if(_value > 1)
				{
					_value = 1;
				}

				return BIONIC_FIXATION = _value;
			}

			return bionic.FIXATION;
		}
	});

	Object.defineProperty(bionic, 'SAKKADE_WORDS', {
		get: function()
		{
			var result;

			if(BROWSER && Number.isNumber(getQuery('sakkadeWords')))
			{
				result = getQuery('sakkadeWords');
			}
			else if(Number.isNumber(BIONIC_SAKKADE_WORDS))
			{
				result = BIONIC_SAKKADE_WORDS;
			}
			else
			{
				result = DEFAULT_SAKKADE_WORDS;
			}

			return Math.round(result);
		},
		set: function(_value)
		{
			if(Number.isNumber(_value) && _value >= 0)
			{
				return BIONIC_SAKKADE_WORDS = Math.round(_value);
			}

			return bionic.SAKKADE_WORDS;
		}
	});

	Object.defineProperty(bionic, 'SAKKADE_CHARS', {
		get: function()
		{
			var result;

			if(BROWSER && Number.isNumber(getQuery('sakkadeChars')))
			{
				result = getQuery('sakkadeChars');
			}
			else if(Number.isNumber(BIONIC_SAKKADE_CHARS))
			{
				result = BIONIC_SAKKADE_CHARS;
			}
			else
			{
				result = DEFAULT_SAKKADE_CHARS;
			}

			return Math.round(result);
		},
		set: function(_value)
		{
			if(Number.isNumber(_value) && _value >= 0)
			{
				return BIONIC_SAKKADE_CHARS = Math.round(_value);
			}

			return bionic.SAKKADE_CHARS;
		}
	});

	//
	const processString = function(_string, _output, _input, _throw)
	{
		var result = processString[_input](_string, _output, _throw);

		if(DEFAULT_DARKEN_REST && _output === 'ansi')
		{
			result = result.colorFG(DEFAULT_DARKEN_COLOR);
		}

		return result;
	}

	processString.text = (_string, _output, _throw) => {
		var result = '';
		var word = '';
		var words = bionic.SAKKADE_WORDS;
		var chars = 0;
		var eol = '';

		for(var i = 0; i < _string.length; ++i)
		{
			if(_string.at(i) === ' ' || _string.at(i) === '\t' || _string.at(i) === '-' || _string.at(i) === '_' || _string.at(i) === '.' || _string.at(i) === ',' || _string.at(i) === ';' || (eol = _string.isEOL(i)))
			{
				if(word.length > 0)
				{
					if(++words >= bionic.SAKKADE_WORDS || i <= word.length)
					{
						result += bold(word, _output);
						words = 0;
					}
					else if(word.length >= bionic.SAKKADE_CHARS)
					{
						result += bold(word, _output);
						words = 0;
					}
					else
					{
						result += word;
					}

					word = '';
				}

				if(eol.length > 0)
				{
					i += (eol.length - 1);
					result += eol;
					eol = '';
				}
				else
				{
					result += _string.at(i);
				}
			}
			else
			{
				word += _string.at(i);
			}
		}

		if(word.length > 0)
		{
			if(++words >= bionic.SAKKADE_WORDS)
			{
				result += bold(word, _output);
			}
			else if(word.length >= bionic.SAKKADE_CHARS)
			{
				result += bold(word, _output);
			}
			else
			{
				result += word;
			}
		}

		//
		return result;
	};

	processString.ansi = (_string, _output, _throw) => {
		var result = '';
		var word = '';
		var words = bionic.SAKKADE_WORDS;
		var chars = 0;
		var open = false;
		var eol = '';

		for(var i = 0; i < _string.length; ++i)
		{
			if(open)
			{
				//
				if(_string.at(i) === NUL)
				{
					open = false;
				}

				//
				if(word.length > 0)
				{
					if(chars >= bionic.SAKKADE_CHARS)
					{
						result += bold(word, _output);
					}
					else
					{
						result += word;
					}

					word = '';
					words = chars = 0;
				}

				//
				result += _string.at(i);
			}
			else if(_string.at(i) === ESC || _string.at(i) === ' ' || _string.at(i) === '\t' || _string.at(i) === '-' || _string.at(i) === '_' || _string.at(i) === '.' || _string.at(i) === ',' || _string.at(i) === ';' || (eol = _string.isEOL(i)))
			{
				//
				if(chars > 0)
				{
					if(_string.at(i) === ESC)
					{
						result += word;
					}
					else if(eol.length > 0)
					{
						result += word;
						words = 0;
					}
					else if(++words >= bionic.SAKKADE_WORDS || i <= word.length)
					{
						result += bold(word, _output);
						words = 0;
					}
					else if(chars >= bionic.SAKKADE_CHARS)
					{
						result += bold(word, _output);
						words = 0;
					}
					else
					{
						result += word;
					}

					chars = 0;
					word = '';
				}
				
				//
				if(_string.at(i) === ESC)
				{
					open = true;
					result += ESC;
				}
				else if(eol.length > 0)
				{
					i += (eol.length - 1);
					result += eol;
					eol = '';
				}
				else
				{
					result += _string.at(i);
				}
			}
			else
			{
				word += _string.at(i);
				++chars;
			}
		}

		if(word.length > 0)
		{
			if(++words >= bionic.SAKKADE_WORDS)
			{
				result += bold(word, _output);
			}
			else if(chars >= bionic.SAKKADE_CHARS)
			{
				result += bold(word, _output);
			}
			else
			{
				result += word;
			}
		}

		//
		return result;
	};

	processString.html = (_string, _output, _throw) => {
		var result = '';
		var word = '';
		var words = bionic.SAKKADE_WORDS;
		var chars = 0;
		var open = '';

		for(var i = 0; i < _string.length; ++i)
		{
			if(open.length > 0)
			{
				if(_string.at(i) === open)
				{
					open = '';
				}

				if(word.length > 0)
				{
					if(chars >= bionic.SAKKADE_CHARS)
					{
						result += bold(word, _output);
					}
					else
					{
						result += word;
					}

					word = '';
					words = chars = 0;
				}

				result += _string.at(i);
			}
			else if(_string.at(i, '&nbsp;', false) || _string.at(i) === ' ' || _string.at(i) === '\t' || _string.at(i) === '-' || _string.at(i) === '_' || _string.at(i) === '.' || _string.at(i) === ',' || _string.at(i) === ';' || _string.at(i) === '<' || _string.at(i) === '&')
			{
				if(word.length > 0)
				{
					if(++words >= bionic.SAKKADE_WORDS || i <= word.length)
					{
						result += bold(word, _output);
						words = 0;
					}
					else if(chars >= bionic.SAKKADE_CHARS)
					{
						result += bold(word, _output);
						words = 0;
					}
					else
					{
						result += word;
					}

					chars = 0;
					word = '';
				}

				if(_string.at(i, '&nbsp;', false))
				{
					result += '&nbsp;';
					i += 5;
				}
				else
				{
					if(_string.at(i, '<'))
					{
						open = '>';
					}
					else if(_string.at(i, '&'))
					{
						open = ';';
					}

					result += _string.at(i);
				}
			}
			else
			{
				word += _string.at(i);
				++chars;
			}
		}

		if(word.length > 0)
		{
			if(++words >= bionic.SAKKADE_WORDS)
			{
				result += bold(word, _output);
			}
			else if(chars >= bionic.SAKKADE_CHARS)
			{
				result += bold(word, _output);
			}
			else
			{
				result += word;
			}
		}

		//
		return result;
	};

	//
	const bold = (_string, _output) => {
		return bold[_output](_string, Math.round(_string.length * bionic.FIXATION));
	};

	bold.ansi = (_string, _fixation) => {
		if(_fixation === 0)
		{
			return _string;
		}

		var first = (ESC + '[1m' + NUL);
		var boldPart = _string.substr(0, _fixation);

		if(DEFAULT_DARKEN_REST)
		{
			if(! DEFAULT_DARKEN_BOLD)
			{
				first = '';
			}

			boldPart = boldPart.colorFG('#fff');
		}

		return (first + boldPart + (ESC + '[0m' + NUL) + _string.substr(_fixation));
	};

	bold.html = (_string, _fixation) => {
		if(_fixation === 0)
		{
			return _string;
		}

		return '<b>' + _string.substr(0, _fixation) + '</b>' + _string.substr(_fixation);
	};

})();

