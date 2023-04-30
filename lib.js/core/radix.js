(function()
{

	//
	const DEFAULT_MAX_BYTES = (1024 * 1024 * 64);

	//
	RADIX = module.exports = class RADIX extends NODE
	{
		constructor(_options)
		{
			super(_options);
		}

		static create(... _args)
		{
			const options = Object.assign(... _args);

			for(var i = 0; i < _args.length; ++i)
			{
				if(isInt(_args[i]))
				{
					options.maxBytes = _args[i];
				}
			}

			return new this(options);
		}

		reset()
		{
			this._bytes = '';
			return super.reset();
		}

		get maxBytes()
		{
			if(typeof this.options.maxBytes === 'number')
			{
				return this.options.maxBytes;
			}

			return DEFAULT_MAX_BYTES;
		}

		set maxBytes(_value)
		{
			if(Number.isInt(_value))
			{
				return this.options.maxBytes = _value;
			}

			return this.maxBytes;
		}

		get length()
		{
			return this._bytes.length;
		}

		append(_bytes)
		{
			const sum = (this._bytes.length + _bytes.length);
			const diff = (this.maxBytes - sum);

			if(diff <= 0)
			{
				const rest = (_bytes.length + diff);
				this._bytes += _bytes.substr(0, rest);
				return x('Maximum number of bytes exceeded (took % bytes from % new)', null, rest, _bytes.length);
			}
			else
			{
				this._bytes += _bytes;
			}

			return this._bytes.length;
		}

		remove(_index, _count = 1)
		{
			this._bytes = this._bytes.splice(_index, _count);
			return this.length;
		}

		replace(_index, _string)
		{
			this._bytes = this._bytes.splice(_index, _string.length, _string);
			return this.length;
		}

		readByte(_index)
		{
			return this.readBytes(_index, 1);
		}

		readBytes(_index, _count = 1)
		{
		}

		readBit(_index)
		{
			return this.readBits(_index, 1);
		}

		readBits(_index, _count = 8)
		{
			return this.readRadix(_index, 2, _count);
		}

		readRadix(_index, _radix = 2)
		{
	throw new Error('TODO');
		}

		read(_index, _count = 1)
		{
			if(isInt(_index))
			{
				return this.readBytes(_index, _count);
			}
			else if(typeof _index === 'bigint')
			{
			}

		throw new Error('TODO');
		}
	}

	//
	
})();

