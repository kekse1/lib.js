module.exports = function _()
{

	//
	Address = address = { punycode: require('network/punycode') };

	//
	if(typeof IP === 'undefined')
	{
		require('network/ip');
	}

	Address.IP = IP;

	//
	const checkNetModule = () => {
		var result;

		if(BROWSER)
		{
			return null;
		}
		else if(typeof net === 'undefined')
		{
			try
			{
				result = require('+net');
			}
			catch(_error)
			{
				return null;
			}
		}
		else
		{
			return net;
		}

		return net = result;
	};

	//
	Address.isLocalhost = function(_string)
	{
		if(typeof _string !== 'string' || _string.length === 0)
		{
			return null;
		}
		else if(_string === 'localhost')
		{
			return true;
		}
		else if(_string.indexOf('.') === -1)
		{
			return true;
		}
		else if(_string.startsWith('127.'))
		{
			return Address.isIPv4(_string);
		}
		else if(_string === '::1' || _string === '[::1]')
		{
			return true;
		}
		else if(_string === '0:0:0:0:0:0:0:1' || _string === '[0:0:0:0:0:0:0:1]')
		{
			return true;
		}

		return false;
	}

	//
	Address.splitHost = function(_string, _port_fallback = null)
	{
		if(typeof _string !== 'string' || _string.length === 0)
		{
			return null;
		}
		else if(! Address.isHost(_string))
		{
			return null;
		}
		else if(_string.indexOf(':') === -1)
		{
			return [ _string, _port_fallback ];
		}

		const split = _string.split(':', 2);

		if(split[0].length === 0)
		{
			return null;
		}
		else if(split.length === 1)
		{
			return [ split[0], _port_fallback ];
		}
		else if(! split[1].isInt())
		{
			return [ split[0], _port_fallback ];
		}

		return [ split[0], parseInt(split[1]) ];
	}

	//
	Address.isHost = function(_string, _ip = true)
	{
		if(typeof _string !== 'string')
		{
			return null;
		}
		else if(_string.length === 0)
		{
			return false;
		}
		else if(_string.length > 253)
		{
			return false;
		}
		else if(_string.indexOf('/') > -1)
		{
			return false;
		}
		else if(_ip && Address.isIP(_string))
		{
			return true;
		}
		else if((split = _string.split(':')).length > 2)
		{
			return false;
		}
		else
		{
			split = (_string = split[0]).split('.');

			for(const s of split)
			{
				if(s.length === 0)
				{
					return false;
				}
				else if(s.length > 63)
				{
					return false;
				}
			}
		}

		var b = _string.charCodeAt(0);

		if(! ((b > 64 && b < 91) || (b > 96 && b < 123)))
		{
			return false;
		}

		b = _string.charCodeAt(_string.length - 1);

		if(! ((b > 64 && b < 91) || (b > 96 && b < 123)))
		{
			return false;
		}

		for(var i = 0; i < _string.length; ++i)
		{
			if(_string[i] !== '-' && _string[i] !== '.')
			{
				b = _string.charCodeAt(i);

				if(! ((b > 64 && b < 91) || (b > 96 && b < 123)))
				{
					return false;
				}
			}
		}

		return true;
	}

	Address.isHostname = function(_string, _ip = true)
	{
		if(typeof _string !== 'string')
		{
			return null;
		}
		else if(_string.length === 0)
		{
			return false;
		}
		else if(_ip && Address.isIP(_string))
		{
			return true;
		}
		else if(! Address.isHost(_string))
		{
			return false;
		}
		else if(_string.split(':').length > 1)
		{
			return false;
		}

		return true;
	}

	Address.isIP = isIP = function(_string, _encoding)
	{
		if(checkNetModule())
		{
			return net.isIP(_string);
		}

		return (Address.isIPv4(_string, _encoding) || Address.isIPv6(_string, _encoding));
	}

	Address.isIPv4 = isIPv4 = function(_string, _encoding)
	{
		if(checkNetModule())
		{
			return net.isIPv4(_string);
		}
		else if(typeof _string !== 'string' || _string.length === 0)
		{
			return null;
		}
		else if(_string[0] === '[' && _string[_string.length -1] === ']')
		{
			return false;
		}
		else if(_string.indexOf('..') > -1)
		{
			return false;
		}

		const split = _string.split('.');

		if(split.length > 4)
		{
			return false;
		}
		else for(var i = 0; i < split.length; i++)
		{
			if(split[i].length === 0 || split[i].length > 3)
			{
				return false;
			}
			else if(isNaN(split[i] = parseInt(split[i])))
			{
				return false;
			}
			else if(split[i] < 0 || split[i] > 255)
			{
				return false;
			}
		}

		return true;
	}

	Address.isIPv6 = isIPv6 = function(_string, _encoding)
	{
		if(checkNetModule())
		{
			return net.isIPv6(_string);
		}
		else if(typeof _string !== 'string' || _string.length === 0)
		{
			return null;
		}
		else
		{
			if(_string[0] === '[')
			{
				_string = _string.slice(1);
			}

			if(_string[_string.length - 1] === ']')
			{
				_string = _string.slice(0, -1);
			}
		}

		const split = _string.split(':');

		if(split.length < 2 || split.length > 8)
		{
			return false;
		}

		var hadDouble = false;
		var firstDouble = false;

		for(var i = 0; i < split.length; ++i)
		{
			if(split[i].length === 0)
			{
				if(hadDouble)
				{
					return false;
				}
				else if(firstDouble)
				{
					hadDouble = true;
					firstDouble = null;
				}
				else
				{
					firstDouble = true;
				}
			}
			else if(split[i].length > 4)
			{
				return false;
			}
			else if(isNaN(split[i] = parseInt(split[i], 16)))
			{
				return false;
			}
			else if(split[i] < 0 || split[i] > 65535)
			{
				return false;
			}
		}

		return true;
	}

	Address.isPort = isPort = function(_port, _negative = true, _zero = true)
	{
		if(! isInt(_port))
		{
			return false;
		}
		else if(_port === 0)
		{
			return _zero;
		}
		else if(_port < 0)
		{
			if(_negative)
			{
				return (_port >= -65536);
			}

			return false;
		}

		return (_port <= 65535);
	}

	//
	return Address;

}

