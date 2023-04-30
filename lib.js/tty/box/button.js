(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_STATES = 2;

	//
	const INDEX = [];

	//
	ButtonBox = module.exports = class ButtonBox extends Box
	{
		constructor(_options)
		{
			super(_options);
		}

		static create(... _args)
		{
			//
		}

		static get INDEX()
		{
			return INDEX;
		}

		get states()
		{
			if(typeof this.options.states === 'number')
			{
				return this.options.states;
			}

			return DEFAULT_STATES;
		}

		set states(_value)
		{
			if(Number.isInt(_value) && _value >= 0)
			{
				return this.options.states = _value;
			}
			else
			{
				delete this.options.states;
			}

			return this.states;
		}
	}

	//
	
})();

