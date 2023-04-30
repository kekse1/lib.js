module.exports = function _()
{

	//
	const DEFAULT_EXTRACT = false;
	const DEFAULT_UNIQUE = true;

	//
	if(typeof address === 'undefined')
	{
		require('network/address');
	}

	//
	Mail = mail = function(... _args)
	{
		var EXTRACT = DEFAULT_EXTRACT;

		for(var i = 0; i < _args.length; ++i)
		{
			if(typeof _args[i] === 'boolean')
			{
				EXTRACT = _args.splice(i--, 1)[0];
			}
		}
		
		const result = [];

		for(var i = 0, j = 0; i < _args.length; ++i)
		{
			if(! String.isString(_args[i]))
			{
				_args.splice(i--, 1);
			}
			else if((_args[i] = mail.parse(_args[i], true, false)) !== null)
			{
				if(EXTRACT)
				{
					result[j++] = _args[i].mail;
				}
				else
				{
					result[j++] = _args[i];
				}
			}
		}

		if(DEFAULT_UNIQUE)
		{
			if(EXTRACT)
			{
				result.uniq();
			}
			else for(var i = 1; i < result.length; ++i)
			{
				if(Object.equal(result[i], result[0]))
				{
					result.splice(i--, 1);
				}
			}
		}

		return result;
	}

	//
	mail.validate = function(_addr, _parse = true, _throw = true)
	{
		if(! String.isString(_addr))
		{
			if(_throw)
			{
				return x('Invalid % argument (not a non-empty %)', null, '_addr', 'String');
			}

			return null;
		}
		else if(_parse)
		{
			if((_addr = mail.parse(_addr, false, _throw)) === null)
			{
				return false;
			}
			else if(String.isString(_addr.mail))
			{
				_addr = _addr.mail;
			}
		}

		const split = _addr.split('@', 2, true);

		if(split.length !== 2)
		{
			return false;
		}
		else if(! address.isHostname(split.pop()))
		{
			return false;
		}

		_addr = split.pop();
		var byte;

		for(var i = 0; i < _addr.length; ++i)
		{
			if((byte = _addr.charCodeAt(i)) <= 32 || byte === 127)
			{
				return false;
			}
		}

		return true;
	}

	mail.parse = function(_addr, _validate = true, _throw = true)
	{
		if(typeof _throw !== 'boolean')
		{
			_throw = true;
		}

		if(! String.isString(_addr))
		{
			if(_throw)
			{
				return x('Invalid % argument (expecting non-empty %)', null, '_addr', 'String');
			}

			return null;
		}

		const result = Object.null({ name: '', mail: '', orig: _addr });
		var open = 0;

		if(_addr.indexOf('<') === -1)
		{
			result.mail = _addr;
			result.name = '';
		}
		else for(var i = 0; i < _addr.length; ++i)
		{
			if(_addr.at(i, '\\'))
			{
				if(i < (_addr.length - 1) && (_addr.at(i + 1, '<') || _addr.at(i + 1, '>')))
				{
					if(open > 0)
					{
						result.mail += _addr[i + 1];
					}
					else
					{
						result.name += _addr[i + 1];
					}

					++i;
				}
				else if(open > 0)
				{
					result.mail += _addr[i];
				}
				else
				{
					result.name += _addr[i];
				}
			}
			else if(open > 0)
			{
				if(_addr[i] === '<')
				{
					++open;
				}
				else if(_addr[i] === '>')
				{
					if(--open <= 0)
					{
						open = 0;
					}
				}
				else
				{
					result.mail += _addr[i];
				}
			}
			else if(_addr[i] === '<')
			{
				++open;
			}
			else if(_addr[i] === '>')
			{
				if(--open <= 0)
				{
					open = 0;
				}

				result.name += '>';
			}
			else
			{
				result.name += _addr[i];
			}
		}

		result.name = result.name.trim();
		result.mail = result.mail.trim();

		if(_validate && !mail.validate(result.mail, _throw))
		{
			return null;
		}

		return result;
	}

	//
	return Mail;

}

