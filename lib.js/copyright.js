(function()
{
	//
	KUCHEN = module.exports = {
		YEAR: {
			rip: 2001,
			bib: 2005,
			sebastian: 1985,
			norbert: 1956,
			julitta: 1961,
			natalie: 1987
		},
		NAME: 'Sebastian Kucharczyk',
		MAIL: 'kuchen@kekse.biz',
		LINK: 'https://libjs.de/'
	};

	//
	const DEFAULT_RADIX_RANGE = [ 16, 2 ];

	const getRadix = (_max = DEFAULT_RADIX_RANGE[0], _min = DEFAULT_RADIX_RANGE[1]) => {
		if(typeof radix === 'function')
		{
			return checkRadix(radix());
		}

		return checkRadix(Math.floor(Math.random(true) * (_max - _min + 1) + _min));
	};

	const checkRadix = (_value) => {
		if(typeof alphabet === 'undefined')
		{
			if(_value < 2)
			{
				_value = 2;
			}
			else if(_value > 36)
			{
				_value = 36;
			}

			return _value;
		}

		if(_value < 0)
		{
			_value = 0;
		}
		else if(_value > alphabet.MAX_REGULAR)
		{
			_value = alphabet.MAX_REGULAR;
		}

		return _value;
	};

	//
	var maybeLoadedCSS = false;

	//
	Object.defineProperty(global, 'COPYRIGHT', { value: function(_with_years = null, _current_year = null, _mail = true, _colors = COLORS)
	{
		//
		if(typeof _with_years === 'string')
		{
			years = _with_years;
		}
		else if(_with_years === true)
		{
			_with_years = 10;
		}
		else if(isInt(_with_years))
		{
			_with_years = checkRadix(Math.abs(_with_years));
		}
		else if(_with_years === null)
		{
			_with_years = getRadix();
		}
		else
		{
			_with_years = null;
		}

		//
		var c = (_with_years === null ? 'c' : (_with_years === 10 ? 'c' : _with_years.toString()));

		//
		if(_with_years === null)
		{
			years = '';
		}
		else
		{
			if(typeof _current_year === 'string')
			{
				if(_current_year.toLowerCase() in KUCHEN.YEAR)
				{
					_current_year = '-' + KUCHEN.YEAR[_current_year.toLowerCase()].toString(_with_years);
				}
				else if(_current_year.length > 0)
				{
					_current_year = '-' + _current_year;
				}
			}
			else if(_current_year === true)
			{
				_current_year = '-' + new Date().getFullYear().toString(_current_year = 10);
			}
			else if(_current_year === null)
			{
				if(isInt(_with_years))
				{
					_current_year = _with_years;
				}
				else
				{
					_current_year = getRadix();
				}

				if(c === 'c' && _current_year !== 10)
				{
					c = _current_year.toString();
				}

				_current_year = '-' + new Date().getFullYear().toString(_current_year);
			}
			else if(isInt(_current_year))
			{
				_current_year = checkRadix(Math.abs(_current_year));

				if(c === 'c' && _current_year !== 10)
				{
					c = _current_year.toString();
				}

				_current_year = '-' + new Date().getFullYear().toString(_current_year);
			}
			else
			{
				_current_year = '';
			}

			years = KUCHEN.YEAR.sebastian.toString(_with_years) + _current_year + ' ';
		}
		
		//
		if(_colors && years.length > 0 && typeof String.prototype.colorizeAs === 'function')
		{
			//
			years = years.split('-', 2);
			
			for(var i = 0; i < years.length; ++i)
			{
				if(years[i].length > 0)
				{
					years[i] = years[i].colorizeAs('Number');
				}
			}
			
			years = years.join('-');

			//
			if(c !== 'c')
			{
				c = c.colorizeAs('BigInt');
			}
		}

		//
		var name = KUCHEN.NAME;
		var mail = KUCHEN.MAIL;

		if(_mail)
		{
			if(BROWSER)
			{
				mail = ('&lt;' + mail + '&gt;').replaceAll('@', '<span class="copyrightMailAt">@</span>') + '<br />';
			}
			else
			{
				mail = '<' + mail + '>';
			}
		}
		else
		{
			mail = '';
		}

		//
		var result;

		if(BROWSER)
		{
			//
			const space = '&nbsp;&nbsp;';
			result = `<span class="copyright">Copyright${space}<span class="copyrightC">(${c})</span>${space}<span class="copyrightYear">${years}</span>${space}<span class="copyrightName">${name}</span><br /><span class="copyrightMail">${mail}</span></span>`;

			//
			if(! maybeLoadedCSS && typeof page?.loadCSS === 'function')
			{
				page.loadCSS(null, 'page/copyright');
				maybeLoadedCSS = true;
			}
		}
		else
		{
			result = `Copyright (${c}) ${years} ${name} ${mail}`;
		}

		//
		if(typeof String.prototype.replaces === 'function')
		{
			result = result.replaces('  ', ' ', null);
		}
		else while(result.indexOf('  ') > -1)
		{
			result = result.replaceAll('  ', ' ');
		}
		
		return result;
	}});

	//
	
})();

