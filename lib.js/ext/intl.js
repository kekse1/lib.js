(function()
{

	//
	intl = module.exports = function(_lang, _type, _options)
	{
		if(! Object.isObject(_options))
		{
			_options = {};
		}
		
		if(! String.isString(_type))
		{
			return x('Invalid % argument (see %.%)', null, '_type', 'intl', 'type');
		}
		else
		{
			_type = _type.toLowerCase();
		}

		var type = null;
		const t = intl.type;

		for(const tt of t)
		{
			if(tt.toLowerCase() === _type)
			{
				type = tt;
				break;
			}
		}
		
		if(type === null)
		{
			return x('Invalid % argument (not available, see %.%)', null, '_type', 'intl', 'type');
		}
		else
		{
			if(! Object.isObject(_options))
			{
				_options = {};
			}

			if(! String.isString(_lang))
			{
				_lang = LANGUAGE;
			}
		}

		return new Intl[type](_lang, _options);
	};

	intl.DateTimeFormat = function(_value, _lang, _options)
	{
		return intl(_lang, 'DateTimeFormat', _options).format(_value);
	}

	intl.NumberFormat = function(_value, _lang, _options)
	{
		return intl(_lang, 'NumberFormat', _options).format(_value);
	}

	intl.Collator = function(_value, _lang, _options)
	{
		return intl(_lang, 'Collator', _options).format(_value);
	}

	intl.ListFormat = function(_value, _lang, _options)
	{
		return intl(_lang, 'ListFormat', _options).format(_value);
	}

	intl.PluralRules = function(_value, _lang, _options)
	{
		return intl(_lang, 'PluralRules', _options).format(_value);
	}

	intl.RelativeTimeFormat = function(_value, _lang, _options)
	{
		if(! String.isString(_options))
		{
			return x('Invalid % argument (needs to be a % here)', null, '_options', 'String');
		}
		else
		{
			_options = _options.toLowerCase();
		}

		return intl(_lang, 'RelativeTimeFormat').format(_value, _options);
	}

	//
	Object.defineProperty(intl, 'type', { get: function()
	{
		return [
			'Collator',
			'DateTimeFormat',
			'ListFormat',
			'NumberFormat',
			'PluralRules',
			'RelativeTimeFormat'
		];
	}});

	//
	intl.currency = function(_value, _currency, _lang = LANGUAGE)
	{
		if(! Number.isNumber(_value))
		{
			return x('Invalid % argument (not a %)', null, '_value', 'Number');
		}
		else if(! String.isString(_currency))
		{
			return x('Invalid % argument (not a non-empty %)', null, '_currency', 'String');
		}
		else if(! String.isString(_lang))
		{
			_lang = LANGUAGE;
		}

		return new Intl.NumberFormat(_lang, { style: 'currency', currency: _currency }).format(_value);
	}

	//

})();

