(function()
{

	//
	const DEFAULT_HASH_ROUNDS = 64;
	const DEFAULT_HASH_SIZE = 16;
	const DEFAULT_HASH_EXTEND = 64;
	const DEFAULT_HASH_XOR = true;
	const DEFAULT_HASH_INC = true;
	const DEFAULT_HASH_MOVE = true;

	const DEFAULT_HASH_SHA3 = true;

	//
	crypt = module.exports = {};

	//
	crypt.createRandomPassword = function(_length = KEYS)
	{
		if(! Number.isInt(_length, KEYS))
		{
			return x('Invalid % argument (expecting an % >= %)', null, '_length', 'Integer', KEYS);
		}

		return (alphabet.ALPHABET + String.specialCharacters).getRandom(_length, true, true);
	}

	//
	crypt.createHash = function(_string, _rounds = DEFAULT_HASH_ROUNDS, _sha3 = DEFAULT_HASH_SHA3)
	{
		//
		if(! keyLength(_string, false))
		{
			return x('Your % needs to be a % with at least % chars', null, 'key', 'String', KEYS);
		}

		if(typeof _rounds === 'boolean' || (Number.isInt(_sha3) && _sha3 > 0))
		{
			[ _rounds, _sha3 ] = [ _sha3, _rounds ];
		}

		//
		if(! (Number.isInt(_rounds) && _rounds > 0))
		{
			_rounds = DEFAULT_HASH_ROUNDS;
		}

		if(typeof _sha3 !== 'boolean')
		{
			_sha3 = DEFAULT_HASH_SHA3;
		}

		//
		if(_sha3)
		{
			return _string.hash('sha3-512', null);
		}

		//
		return Uint8Array.fromArray(_string.ownHash({
			size: DEFAULT_HASH_SIZE,
			move: DEFAULT_HASH_MOVE,
			inc: DEFAULT_HASH_INC,
			xor: DEFAULT_HASH_XOR,
			rounds: _rounds,
			extend: DEFAULT_HASH_EXTEND,
			radix: null
		}));
	}

	//
	crypt.encrypt = function(_string, _pre_shared_key, _rounds)
	{
		var key;

		if(String.isString(_pre_shared_key))
		{
			key = crypt.createHash(_pre_shared_key);
		}
		else if(Uint8Array.isUint8Array(_pre_shared_key, false))
		{
			key = _pre_shared_key;
		}
		else if(_pre_shared_key.length > 0)
		{
			key = _pre_shared_key;
		}
		else
		{
			return x('Invalid % argument (not a non-empty % or %)', null, '_pre_shared_key', 'String', 'Uint8Array');
		}

		if(typeof _string !== 'string')
		{
			return x('Invalid % argument (not a non-empty %)', null, '_string', 'String');
		}
		else if(! (Number.isInt(_rounds) && _rounds > 0))
		{
			_rounds = _pre_shared_key.length;
		}

		var bigint = 0n;
		var result = _string;

		for(var r = 0; r < _rounds; ++r)
		{
			for(var i = 0, j = 0, mul = 1n; i < result.length; ++i, ++j)
			{
				if(j >= key.length)
				{
					j = 0;
				}

				bigint += BigInt.from(result.codePointAt(i)) * mul;
				mul *= BigInt.from(key[j] + 256);
			}

			result = '';

			while(bigint >= 256n)
			{
				result += String.fromCodePoint(Number.from(bigint % 256n));
				bigint /= 256n;
			}

			if(bigint >= 1n)
			{
				result += String.fromCodePoint(Number.from(bigint));
			}

			bigint = 0n;
		}

		return result;
	}

	crypt.decrypt = function(_string, _pre_shared_key, _rounds = 1)
	{
		var key;

		if(String.isString(_pre_shared_key))
		{
			key = crypt.createHash(_pre_shared_key);
		}
		else if(Uint8Array.isUint8Array(_pre_shared_key, false))
		{
			key = _pre_shared_key;
		}
		else if(_pre_shared_key.length > 0)
		{
			key = _pre_shared_key;
		}
		else
		{
			return x('Invalid % argument (not a non-empty % or %)', null, '_pre_shared_key', 'String', 'Uint8Array');
		}

		if(typeof _string !== 'string')
		{
			return x('Invalid % argument (not a non-empty %)', null, '_string', 'String');
		}
		else if(! (Number.isInt(_rounds) && _rounds > 0))
		{
			_rounds = _pre_shared_key.length;
		}

		var bigint = 0n;
		var result = _string;

		for(var r = 0; r < _rounds; ++r)
		{
			for(var i = 0, mul = 1n; i < result.length; ++i)
			{
				bigint += BigInt.from(result.codePointAt(i)) * mul;
				mul *= 256n;
			}

			var v, i = 0;
			result = '';

			while(bigint >= 1n)
			{
				v = BigInt.from(key[i] + 256);
				result += String.fromCodePoint(Number.from(bigint % v));
				bigint /= v;

				if(++i >= key.length)
				{
					i = 0;
				}
			}
		}

		return result;
	}

})();
