(function()
{

	//
	const DEFAULT_CALL_GLOBAL_CONTEXT = true;
	const DEFAULT_CALL_FUNCTION_RESOLVE = true;
	const DEFAULT_CALL_PARSE = true;
	const DEFAULT_CALL_UNSHIFT_ARGS = false;

	//
	Utility = module.exports = {};

	//
	Utility.Uniform = require('network/uniform');

	//
	if(! BROWSER)
	{
		Utility.findClientBySocket = function(_socket, _clients, _limit = 0)
		{
			if(! (Utility.isNodeSocket(_socket) && Array.isArray(_clients) && typeof _limit === 'number'))
			{
				return x('Invalid argument(s)');
			}
			else if((_limit = Math.abs(_limit.int)) < 0)
			{
				_limit = 0;
			}

			const result = [];

			for(var i = 0, j = 0; i < _clients.length; i++)
			{
				if(_clients[i].socket === _socket || _clients[i] === _socket)
				{
					result[j++] = _clients[i];

					if(result.length === _limit)
					{
						break;
					}
				}
			}

			if(_limit === 1)
			{
				return result[0];
			}

			return result;
		}

		Utility.isNodeSocket = isNodeSocket = function(_item, _secure = false)
		{
			if(! (_item instanceof Utility.net.Socket))
			{
				return false;
			}

			if(_secure)
			{
				return (_item instanceof Utility.tls.TLSSocket);
				//return (_item.type === 'tls');
			}

			return true;
		}

		Utility.isNodeServer = isNodeServer = function(_item, _secure = false)
		{
			if(! (_item instanceof Utility.net.Server))
			{
				return false;
			}

			if(_secure)
			{
				return (_item instanceof Utility.tls.Server);
				//return (_item.type === 'tls');
			}

			return true;
		}
	}

	dataToEncoding = Utility.dataToEncoding = function(_data, _encoding)
	{
		if(_encoding !== null && !String.isString(_encoding))
		{
			return x('Invalid % argument (expecting a % or %)', null, '_encoding', 'String', null);
		}
		else if(_encoding === null)
		{
			return Utility.dataToUint8Array(_data, null);
		}

		return Utility.dataToString(_data, _encoding);
	}

	dataToUint8Array = Utility.dataToUint8Array = function(_data, _encoding = null)
	{
		if(typeof _data === 'undefined' || _data === null)
		{
			return new Uint8Array(0);
		}
		else if(Uint8Array.isUint8Array(_data, true))
		{
			return _data;
		}
		else if(typeof Buffer !== 'undefined' && Buffer.isBuffer(_data))
		{
			return new Uint8Array(_data.buffer.slice(_data.byteOffset, _data.byteOffset + _data.byteLength));
		}
		else if(typeof _data === 'string')
		{
			return _data.toUint8Array(_encoding);
		}
		else if(typeof _data === 'number' || typeof _data === 'bigint')
		{
			const result = new Uint8Array(1);
			result[0] = Math.abs(Number(_data).int);
			return result;
		}
		else if(TypedArray.isTypedArray(_data, true))
		{
			return _data.toUint8Array();
		}
		else if(Array.isArray(_data))
		{
			return new Uint8Array(_data);
		}

		return new Uint8Array(0);
	}

	dataToString = Utility.dataToString = function(_data, _encoding = 'utf8')
	{
		if(typeof _data === 'undefined' || _data === null)
		{
			return '';
		}
		else if(typeof _data === 'string')
		{
			return _data;
		}
		else if(typeof Buffer !== 'undefined' && Buffer.isBuffer(_data))
		{
			return _data.toString(_encoding || 'utf8');
		}
		else if(typeof _data === 'number' || typeof _data === 'bigint')
		{
			return String.fromCodePoint(Math.abs(Number(_data).int));
		}
		else if(TypedArray.isTypedArray(_data, true, false))
		{
			return _data.toString(_encoding);
		}
		else if(Array.isArray(_data))
		{
			return new Uint8Array(_data).toString(_encoding);
		}

		return '';
	}

	checkEncoding = Utility.checkEncoding = function(_encoding, _null = true, _numeric = false, _limited = _numeric, _unicode = !_limited)
	{
		if(_encoding === null)
		{
			return _null;
		}
		else if(typeof _encoding === 'string')
		{
			if(_encoding.length === 0)
			{
				return true;
			}
			else if(typeof Buffer !== 'undefined')
			{
				if(Buffer.isEncoding(_encoding))
				{
					return true;
				}
			}

			//
			const enc = String.encoding;

			if(enc.indexOf(_encoding/*.toLowerCase()*/) > -1)
			{
				return true;
			}
		}

		if(_numeric)
		{
			return isRadix(_encoding, _limited, _unicode);
		}

		return false;
	}

	//
	function prepareCallContext(_context, _global_context = DEFAULT_CALL_GLOBAL_CONTEXT)
	{
		if(typeof _global_context !== 'boolean')
		{
			_global_context = DEFAULT_CALL_GLOBAL_CONTEXT;
		}

		const result = [ ... _context ];

		if(_global_context && result[0] !== global)
		{
			var already = false;

			for(const ctx of result)
			{
				if(ctx === global)
				{
					already = true;
					break;
				}
			}

			if(! already)
			{
				result.push(global);
			}
		}

		return result;
	}

	function tryFunction(_string, _context)
	{
		var result;

		for(const ctx of _context)
		{
			if(Object.has(_string, ctx))
			{
				if(typeof (result = Object.get(_string, ctx)) === 'function')
				{
					break;
				}
				else
				{
					result = null;
				}
			}
		}

		if(result)
		{
			return result;
		}
		else try
		{
			if(typeof (result = eval.call(null, _string)) !== 'function')
			{
				result = _string;
			}
		}
		catch(_error)
		{
			result = _string;
		}

		return result;
	}

	function tryArgument(_string, _context, _resolve = DEFAULT_CALL_FUNCTION_RESOLVE, _parse = DEFAULT_CALL_PARSE)
	{
		const isRealString = () => {
			const quotes = [ '"', '`', '\'' ];

			for(const q of quotes)
			{
				if(_string[0] === q && _string.last() === q)
				{
					return true;
				}
			}

			return false;
		};

		if(! String.isString(_string))
		{
			return _string;
		}
		else if(! (_resolve || _parse))
		{
			return _string;
		}

		//
		var result;

		if(isRealString())
		{
			result = _string.removeFirst().removeLast();
		}
		else if(_resolve)
		{
			for(const ctx of _context)
			{
				if(Object.has(_string, ctx))
				{
					if(typeof (result = Object.get(_string, ctx)) === 'function')
					{
						break;
					}
					else
					{
						result = null;
					}
				}
			}

			if(result)
			{
				return result;
			}
			else try
			{
				if(typeof (result = eval.call(null, _string)) === 'undefined')
				{
					result = _string;

					if(_parse)
					{
						result = String.parse(result);
					}
				}
			}
			catch(_error)
			{
				result = _string;

				if(_parse)
				{
					result = String.parse(result);
				}
			}
		}
		else if(_parse)
		{
			result = String.parse(_string);
		}
		else
		{
			result = _string;
		}

		return result;
	}

	//
	tryCall = Utility.tryCall = function(_value, _args = null, _context, _parse = DEFAULT_CALL_PARSE, _global_context = DEFAULT_CALL_GLOBAL_CONTEXT, _unshift_args = DEFAULT_CALL_UNSHIFT_ARGS, _throw = true)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = true;
		}

		if(typeof _parse !== 'boolean')
		{
			_parse = DEFAULT_CALL_PARSE;
		}

		if(typeof _global_context !== 'boolean')
		{
			_global_context = DEFAULT_CALL_GLOBAL_CONTEXT;
		}

		if(typeof _unshift_args !== 'boolean')
		{
			_unshift_args = DEFAULT_CALL_UNSHIFT_ARGS;
		}

		//
		var result = prepareCall(_value, _args, _context, true, _parse, _global_context, _unshift_args, _throw);
		
		if(! Array.isArray(result, false))
		{
			result = undefined;
		}
		else if(String.isString(result[0]))
		{
			//
		}
		else if(typeof result[0] !== 'function')
		{
			result = undefined;
		}
		else
		{
			result = result.shift()(result.shift());
		}

		return result;
	}

	prepareCall = Utility.prepareCall = function(_value, _args = null, _context, _resolve = DEFAULT_CALL_FUNCTION_RESOLVE, _parse = DEFAULT_CALL_PARSE, _global_context = DEFAULT_CALL_GLOBAL_CONTEXT, _unshift_args = DEFAULT_CALL_UNSHIFT_ARGS, _throw = true)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = true;
		}

		if(typeof _global_context !== 'boolean')
		{
			_global_context = DEFAULT_CALL_GLOBAL_CONTEXT;
		}

		if(typeof _resolve !== 'boolean')
		{
			_resolve = DEFAULT_CALL_FUNCTION_RESOLVE;
		}

		if(typeof _parse !== 'boolean')
		{
			_parse = DEFAULT_CALL_PARSE;
		}

		if(typeof _unshift_args !== 'boolean')
		{
			_unshift_args = DEFAULT_CALL_UNSHIFT_ARGS;
		}

		//
		_context = prepareCallContext(_context, _global_context);

		//
		var result;

		if(String.isString(_value))
		{
			if(! (result = Utility.parseCallString(_value, _context, _resolve, _parse, _global_context, _throw)))
			{
				result = null;
			}
		}
		else if(typeof _value === 'function')
		{
			result = [ _value ];
		}
		else if(Array.isArray(_value, false))
		{
			result = [ ... _value ];

			if(String.isString(result[0]))
			{
				result[0] = tryFunction(result[0], _context);
			}
			else if(typeof _value[0] !== 'function')
			{
				if(_throw)
				{
					return x('Invalid %[%] (neither a % nor a non-empty %)', null, '_value', 0, 'Function', 'String');
				}

				result = null;
			}
		}

		if(Array.isArray(result, false) && Array.isArray(_args, false))
		{
			if(_unshift_args)
			{
				result = [ result[0], ... _args, ... result.subarr(1) ];
			}
			else
			{
				result.concat(_args);
			}
		}
		
		return result;
	}

	parseCallString = Utility.parseCallString = function(_string, _context, _resolve = DEFAULT_CALL_FUNCTION_RESOLVE, _parse = DEFAULT_CALL_PARSE, _global_context = DEFAULT_CALL_GLOBAL_CONTEXT, _throw = true)
	{
		//
		if(typeof _throw !== 'boolean')
		{
			_throw = true;
		}

		if(typeof _global_context !== 'boolean')
		{
			_global_context = DEFAULT_CALL_GLOBAL_CONTEXT;
		}

		if(typeof _resolve !== 'boolean')
		{
			_resolve = DEFAULT_CALL_FUNCTION_RESOLVE;
		}

		if(typeof _parse !== 'boolean')
		{
			_parse = DEFAULT_CALL_PARSE;
		}

		//
		_context = prepareCallContext(_context, _global_context);

		//
		const result = [];
		var func = '';
		var sub = '';
		var open = 0;

		for(var i = 0, j = 0; i < _string.length; ++i)
		{
			if(open > 0)
			{
				if(_string.at(i, '\\'))
				{
					if(i < (_string.length - 1))
					{
						if(_string.at(i + 1, '('))
						{
							sub += '(';
							++i;
						}
						else if(_string.at(i + 1, ')'))
						{
							sub += ')';
							++i;
						}
						else if(_string.at(i + 1, ','))
						{
							sub += ',';
							++i;
						}
						else
						{
							sub += _string[i];
						}
					}
					else
					{
						sub += '\\';
					}
				}
				else if(_string.at(i, ')'))
				{
					if(--open === 0)
					{
						result[j++] = sub.trim();
						sub = '';
						break;
					}
				}
				else if(_string.at(i, ','))
				{
					result[j++] = sub.trim();
					sub = '';
				}
				else
				{
					sub += _string[i];
				}
			}
			else if(_string.at(i, '\\'))
			{
				if(i < (_string.length - 1))
				{
					if(_string.at(i + 1, '('))
					{
						func += '(';
						++i;
					}
					else
					{
						func += _string[i];
					}
				}
				else
				{
					func += _string[i];
				}
			}
			else if(_string.at(i, '('))
			{
				open = 1;
			}
			else if(_string.at(i, ')'))
			{
				if(_throw)
				{
					return x('You can\'t use a close bracket before earlier opening');
				}

				return null;
			}
			else
			{
				func += _string[i];
			}
		}

		if(func.length === 0)
		{
			if(_throw)
			{
				return x('No % could be extracted from %', null, 'Function', '_string');
			}

			return null;
		}
		else if(sub.length > 0)
		{
			if(_throw)
			{
				return x('Closing bracket at the end of % is not optional', null, '_string');
			}

			return null;
		}
		else if(_resolve)
		{
			func = tryFunction(func, _context);
		}

		if(result.length === 0)
		{
			return [ func ];
		}
		else for(var i = 0; i < result.length; ++i)
		{
			result[i] = tryArgument(result[i], _context, _resolve, _parse);
		}
		
		result.unshift(func);
		return result;
	}

	//

})();
