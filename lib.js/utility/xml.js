(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_READ_ONLY = true;
	const DEFAULT_COUNT_FILTER = false;

	//
	xml = module.exports = function(_xml_string, _header_string, _throw = true, ... _replaces)
	{
		return xml.process(_xml_string, _header_string, _throw, ... _replaces);
	}

	//
	//TODO/
	//
	xml.process = function(_xml_string, _header_string, _throw = true, ... _replaces)
	{
		return _xml_string.eol(EOL);
	}

	xml.replace = function(_xml_string, ... _context)
	{
throw new Error('TODO');//maybe..
		if(typeof _xml_string !== 'string')
		{
			return x('Invalid % argument (not a %)', null, '_xml_string', 'String');
		}
		else if(_xml_string.length === 0)
		{
			return '';
		}

		const context = (typeof web === 'undefined' ? {} : web.REPLACES());
		context.merge(... _context);

		if(context.LEN === 0)
		{
			return _xml_string;
		}

		return String.print(_xml_string, context);
	}

	//
	if(BROWSER)
	{
		return Date.now();
	}

	//
	XML = class XML extends FILE
	{
		constructor(_options)
		{
			super(_options);
		}

		static get voidElements()
		{
			// < https://html.spec.whatwg.org/multipage/syntax.html#void-elements > ..
			return [ 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr' ];
		}

		idList(_callback)
		{
		}

		countTags(_callback, _filter = DEFAULT_COUNT_FILTER)
		{
			if(typeof _callback !== 'function')
			{
				return x('Invalid % argument (not a %)', null, '_callback', 'Function')
			}
			else if(typeof _filter !== 'boolean')
			{
				_filter = DEFAULT_COUNT_FILTER;
			}

			const voidElements = XML.voidElements;
			const excludeTags = this.excludeTags;
			const includeTags = this.includeTags;
			var allTags;

			if(includeTags.length === 0)
			{
				allTags = true;
			}
			else
			{
				allTags = false;
			}

			const result = Object.create(null);
			const buffers = [];

			const callback = (_event) => {
				buffers.push(_event.buffer);

				if(_event.finish)
				{
					proceed(_event.buffer);

					if(_filter) for(const idx in result)
					{
						if(result[idx] === 0)
						{
							delete result[idx];
						}
					}

					_callback(null, result, buffers);
				}
				else if(_event.error)
				{
					_callback(_event.error, null, buffers);
				}
				else
				{
					proceed(_event.buffer);
				}
			};

			const checkTag = (_tag) => {
				if(excludeTags.indexOf(_tag) > -1)
				{
					return false;
				}
				else if(allTags)
				{
					return true;
				}

				return (includeTags.indexOf(_tag) > -1);
			};

			var open = '';
			var sub = '';
			var hadSep = false;
			var closed = false;
			var pause = false;

			const proceed = (_buffer) => {
				//
				var at;

				if(this.encoding === null) at = (_index, _string) => {
					if(typeof _string !== 'string')
					{
						return String.fromCharCode(_buffer[_index]);
					}
					else if(_string.length === 1)
					{
						return (String.fromCharCode(_buffer[_index]) === _string);
					}
					
					var tmp = '';

					for(var i = _index, j = 0; i < _buffer.length && j < _string.length; ++i, ++j)
					{
						tmp += String.fromCharCode(_buffer[i]);
					}

					return (tmp === _string);
				}; else at = (_index, _string) => {
					if(typeof _string !== 'string')
					{
						return _buffer[_index];
					}
					else if(_string.length === 1)
					{
						return (_buffer[_index] === _string);
					}

					return _buffer.at(_index, _string);
				};

				//
				for(var i = 0; i < _buffer.length; ++i)
				{
					if(pause)
					{
						if(at(i, '-->'))
						{
							if(typeof result['-->'] === 'number')
							{
								++result['-->'];
							}
							else
							{
								result['-->'] = 1;
							}
						}
					}
					else if(open.length > 0)
					{
						if(at(i, ' ') || at(i, '\t') || at(i, '>'))
						{
							sub = sub.toLowerCase();

							if(at(i, '>') && sub.length > 0 && voidElements.indexOf(sub) > -1)
							{
								if(typeof result[sub] !== 'number')
								{
									result[sub] = 0;
								}
							}
							else if(sub.length > 0 && checkTag(sub))
							{
								if(typeof result[sub] === 'number')
								{
									if(closed)
									{
										--result[sub];
									}
									else
									{
										++result[sub];
									}
								}
								else if(! closed)
								{
									result[sub] = 1;
								}

								sub = '';
							}

							if(at(i, '>'))
							{
								open = '';
							}
							else
							{
								hadSep = true;
							}
						}
						else if(at(i, ' />'))
						{
							open = '';
							i += 2;
							
							if(sub.length > 0 && checkTag(sub))
							{
								if(typeof result[sub = sub.toLowerCase()] === 'number')
								{
									--result[sub];
								}
								
								sub = '';
							}
						}
						else if(at(i, open))
						{
							open = '';
						}
						else if(! hadSep)
						{
							sub += at(i);
						}
					}
					else if(at(i, '<!--'))
					{
						pause = true;
						i += 3;

						if(typeof result['<!--'] === 'number')
						{
							++result['<!--'];
						}
						else
						{
							result['<!--'] = 1;
						}
					}
					else if(at(i, '</'))
					{
						closed = true;
						open = '>';
						sub = '';
						hadSep = null;
						++i;
					}
					else if(at(i, '<'))
					{
						closed = false;
						sub = '';
						open = '>';
						hadSep = false;
					}
					else if(at(i, '&'))
					{
						closed = false;
						sub = '';
						open = ';';
						hadSep = false;
					}
					else
					{
						sub += at(i);
					}
				}
			};

			return this.chunkRead(callback);
		}

		get excludeTags()
		{
			if(Array.isArray(this.options.excludeTags, false))
			{
				return [ ... this.options.excludeTags ];
			}

			return [];
		}

		set excludeTags(_value)
		{
			if(String.isString(_value))
			{
				_value = [ _value ];
			}

			if(Array.isArray(_value, false) && _value.onlyType('String'))
			{
				for(var i = 0; i < _value.length; ++i)
				{
					_value[i] = _value[i].toLowerCase();
				}

				return this.options.excludeTags = [ ... _value ];
			}
			else
			{
				delete this.options.excludeTags;
			}

			return this.excludeTags;
		}

		get includeTags()
		{
			if(Array.isArray(this.options.includeTags, false))
			{
				return [ ... this.options.includeTags ];
			}

			return [];
		}

		set includeTags(_value)
		{
			if(String.isString(_value))
			{
				_value = [ _value ];
			}

			if(Array.isArray(_value, false) && _value.onlyType('String'))
			{
				for(var i = 0; i < _value.length; ++i)
				{
					_value[i] = _value[i].toLowerCase();
				}

				return this.options.includeTags = [ ... _value ];
			}
			else
			{
				delete this.options.includeTags;
			}

			return this.includeTags;
		}
	}

	//

})();
