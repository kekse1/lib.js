(function()
{

	//
	const DEFAULT_THROW = true;

	//
	const INDEX = [];

	//
	const Screen = module.exports = class Screen extends Box
	{
		constructor(_options)
		{
			//
			super(Object.assign(_options, {
				dimensions: [ 2, Screen.width, Screen.height ],
				array: Uint32Array
			}));

			//
			if(! tty(true))
			{
				return null;
			}
		}

		static get stream()
		{
			return process.findStream(1, null, true, true, false, false);
		}

		get stream()
		{
			if(this.options.stream)
			{
				return this.options.stream;
			}

			return Screen.stream;
		}

		set stream(_value)
		{
			if(process.isStream(_value) && _value.isTTY)
			{
				return this.options.stream = _value;
			}
			else if((_value = process.getStream(_value, null, true, false, false)) !== null)
			{
				return this.options.stream = _value;
			}
			else
			{
				delete this.options.stream;
			}

			return this.stream;
		}

		static get INDEX()
		{
			return INDEX;
		}

		static create(... _args)
		{
			//
		}

		static isScreen(_item)
		{
			return (_item instanceof Screen);
		}

		static get width()
		{
			return console.width;
		}

		static get height()
		{
			return console.height;
		}

		get width()
		{
			return Screen.width;
		}

		get height()
		{
			return Screen.height;
		}
	}

	//

})();
