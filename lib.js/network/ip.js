module.exports = function _()
{

	//
	//TODO/aus 'network/address' hier uebernehmen:
	//(a) .isIP
	//(b) .isIPv4
	//(c) .isIPv6
	//
	//
	//
	//
	//
	//	< https://www.hacksparrow.com/tools/converters/ip-address.html >
	//
	// 192.168.0.1 (decimal)
	// 0300.0250.0000.0001 (octal)
	// 0xc0.0xa8.0x0.0x1 (hexadecimal)
	// 3232235521 (number)
	// 11000000101010000000000000000001 (binary)
	//
	//
	//
	// TODO: IPv6, too...!!!
	// 	< https://de.wikipedia.org/wiki/IPv6 >
	//
	//

	//
	const DEFAULT_RADIX = 10;
	const DEFAULT_THROW = true;
	const DEFAULT_MAX4 = 4294967295;
	const DEFAULT_MAX6 = 340282366920938463463374607431768211455n;

	//
	IP = ip = { v4: {}, v6: {} };

	//
	if(typeof Address === 'undefined')
	{
		require('network/address');
	}

	//
	IP.validRadix = (_radix, _return_int = false) => {
		if(String.isString(_radix)) switch(_radix = _radix.toLowerCase())
		{
			case 'decimal':
				if(_return_int)
				{
					return 10;
				}

				return true;
			case 'octal':
				if(_return_int)
				{
					return 8;
				}

				return true;
			case 'hexadecimal':
				if(_return_int)
				{
					return 16;
				}

				return true;
			case 'binary':
				if(_return_int)
				{
					return 2;
				}

				return true;
			default:
				if(_return_int)
				{
					return null;
				}

				return false;
		}
		else if(Number.isInt(_radix)) switch(_radix)
		{
			case 2:
			case 8:
			case 10:
			case 16:
				if(_return_int)
				{
					return _radix;
				}

				return true;
			default:
				if(_return_int)
				{
					return null;
				}

				return false;
		}

		if(_return_int)
		{
			return null;
		}

		return false;
	};

	//
	//TODO/siehe 'network/address' (wo noch nicht so "groszer" support.. sprich, nur strings und nur decimaler radix..)
	//
	/*IP.isIP = Address.isIP;
	IP.isIPv4 = Address.isIPv4;
	IP.isIPv6 = Address.isIPv6;*/
	//
	IP.isIP = function(_ip)
	{
		//
	}

	IP.isIPv4 = IP.v4.isIP = IP.isIP.v4 = function(_ip)
	{
		//
	}

	IP.isIPv6 = IP.v6.isIP = IP.isIP.v6 = function(_ip)
	{
		//
	}

	//
	IP.toString = function(_ip, _radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
	{
	}

	IP.v4.toString = IP.toString.v4 = function(_ip, _radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
	{

	}

	IP.v6.toString = IP.toString.v6 = function(_ip, _radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
	{

	}

	IP.parse = function(_ip, _radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
	{
		const result = [];

		if(! String.isString(_ip))
		{
			if(Array.isArray(_ip))
			{
				if(IP.type.array(_ip))
				{
					return _ip;
				}
				else if(_throw)
				{
					return x('Invalid % argument (not a real % %)', null, '_ip', 'IP', 'address');
				}

				return null;
			}
			else if(Number.isInt(_ip))
			{
				if(_ip < 0 || _ip > DEFAULT_MAX4)
				{
					if(_throw)
					{
						return x('Invalid % argument (not a real % %)', null, '_ip', 'IP', 'address');
					}

					return null;
				}

				//TODO/ipv6, too!!!
				//TODO/convert here...
			}
			else if(_throw)
			{
				return x('Invalid % argument (not a real % %)', null, '_ip', 'IP', 'address');
			}
			else
			{
				return null;
			}
		}

	}

	IP.v4.parse = IP.parse.v4 = function(_ip, _radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
	{

	}

	IP.v6.parse = IP.parse.v6 = function(_ip, _radix = DEFAULT_RADIX, _throw = DEFAULT_THROW)
	{

	}

	IP.toNumber = function(_ip, _throw = DEFAULT_THROW)
	{
		if(typeof _ip === 'bigint')
		{
			_ip = Number.from(_ip);
		}

		if(String.isString(_ip))
		{
		}
		else if(Number.isInt(_ip))
		{
		}
		else if(Array.isArray(_ip))
		{
		}
		else if(_throw)
		{
			return x('Invalid % argument (not a real % %)', null, '_ip', 'IP', 'address');
		}

		return null;
	}

	IP.v4.toNumber = IP.toNumber.v4 = function(_ip, _throw = DEFAULT_THROW)
	{

	}

	IP.v6.toNumber = IP.toNumber.v6 = function(_ip, _throw = DEFAULT_THROW)
	{

	}

	IP.toArray = function(_ip, _throw = DEFAULT_THROW)
	{
		if(String.isString(_ip))
		{
		}
		else if(Number.isInt(_ip))
		{
		}
		else if(Array.isArray(_ip))
		{
			if(! IP.type.array)
			{
				if(_throw)
				{
					return x('Invalid % argument (not a real % %)', null, '_ip', 'IP', 'address');
				}

				return null;
			}

			return _ip;
		}

		if(! Array.isArray(_ip))
		{
			if(_throw)
			{
				return x('Invalid % argument (not a real % %)', null, '_ip', 'IP', 'address');
			}

			return null;
		}
	}

	IP.v4.toArray = IP.toArray.v4 = function(_ip, _throw = DEFAULT_THROW)
	{

	}

	IP.v6.toArray = IP.toArray.v6 = function(_ip, _throw = DEFAULT_THROW)
	{

	}

	IP.type = function(_ip, _type)
	{
		if(String.isString(_type))
		{
			_type = _type.toLowerCase();
		}
		else
		{
			_type = null;
		}

		if(typeof _ip === 'bigint')
		{
			if(_ip < 0n || _ip > BigInt(DEFAULT_MAX4))
			{
				return '';
			}
			else if(_type)
			{
				return (_type === 'number');
			}

			return 'number';
		}
		else if(Number.isNumber(_ip))
		{
			if(_ip < 0 || _ip > DEFAULT_MAX4)
			{
				return '';
			}
			else if(_type)
			{
				return (_type === 'number');
			}

			return 'number';
		}
		else if(typeof _ip === 'string')
		{
			if(_ip.length === 0)
			{
				if(_type)
				{
					return false;
				}

				return '';
			}
			else if(_type) switch(_type)
			{
				case 'octal':
					break;
				case 'hexadecimal':
					break;
				case 'decimal':
					break;
				case 'binary':
					break;
				default:
					return false;
			}
			else
			{
				//
			}
		}
		else if(Array.isArray(_ip))
		{
			if(_ip.length < 1 || _ip.length > 8)
			{
				return '';
			}

			var family = '';

			for(var i = 0; i < _ip.length; ++i)
			{
				if(! Number.isInt(_ip[i]))
				{
					return '';
				}
				else if(_ip[i] < 0)
				{
					return '';
				}
				else if(_ip[i] > 255)
				{
					family = 6;

					if(_ip[i] > 65535)
					{
						return '';
					}
				}
				else if(i > 4)
				{
					if(family === 4)
					{
						return '';
					}

					family = 6;
				}
				else if(! family)
				{
					family = 4;
				}
			}

			if(_type)
			{
				return (_type === 'array');
			}

			return 'array';
		}

		if(_type)
		{
			return false;
		}

		return '';
	}

	IP.v4.type = IP.type.v4 = function(_ip, _type)
	{

	}

	IP.v6.type = IP.type.v6 = function(_ip, _type)
	{

	}

	IP.type.octal = function(_ip)
	{
		return IP.type(_ip, 'octal');
	}

	IP.v4.type.octal = IP.type.octal.v4 = function(_ip)
	{

	}

	IP.v6.type.octal = IP.type.octal.v6 = function(_ip)
	{
	}

	IP.type.hexadecimal = function(_ip)
	{
		return IP.type(_ip, 'hexadecimal');
	}

	IP.v4.type.hexadecimal = IP.type.hexadecimal.v4 = function(_ip)
	{

	}

	IP.v6.type.hexadecimal = IP.type.hexadecimal.v6 = function(_ip)
	{

	}

	IP.type.decimal = function(_ip)
	{
		return IP.type(_ip, 'decimal');
	}

	IP.v4.type.decimal = IP.type.decimal.v4 = function(_ip)
	{

	}

	IP.v6.type.decimal = IP.type.decimal.v6 = function(_ip)
	{

	}

	IP.type.binary = function(_ip)
	{
		return IP.type(_ip, 'binary');
	}

	IP.v4.type.binary = IP.type.binary.v4 = function(_ip)
	{

	}

	IP.v6.type.binary = IP.type.binary.v6 = function(_ip)
	{

	}

	IP.type.array = function(_ip)
	{
		return IP.type(_ip, 'array');
	}

	IP.v4.type.array = IP.type.array.v4 = function(_ip)
	{

	}

	IP.v6.type.array = IP.type.array.v6 = function(_ip)
	{

	}

	IP.type.number = function(_ip)
	{
		return IP.type(_ip, 'number');
	}

	IP.v4.type.number = IP.type.number.v4 = function(_ip)
	{

	}

	IP.v6.type.number = IP.type.number.v6 = function(_ip)
	{

	}

	IP.octal = function(_ip)
	{
		return IP.toString(_ip, 8);
	}

	IP.v4.octal = IP.octal.v4 = function(_ip)
	{

	}

	IP.v6.octal = IP.octal.v6 = function(_ip)
	{

	}

	IP.hexadecimal = function(_ip)
	{
		return IP.toString(_ip, 16);
	}

	IP.v4.hexadecimal = IP.hexadecimal.v4 = function(_ip)
	{

	}

	IP.v6.hexadecimal = IP.hexadecimal.v6 = function(_ip)
	{

	}

	IP.decimal = function(_ip)
	{
		return IP.toString(_ip, 10);
	}

	IP.v4.decimal = IP.decimal.v4 = function(_ip)
	{

	}

	IP.v6.decimal = IP.decimal.v6 = function(_ip)
	{

	}

	IP.binary = function(_ip)
	{
		return IP.toString(_ip, 2);
	}

	IP.v4.binary = IP.binary.v4 = function(_ip)
	{

	}

	IP.v6.binary = IP.binary.v6 = function(_ip)
	{

	}

	//
	return IP;

}

