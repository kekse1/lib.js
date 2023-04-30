(function()
{

	//
	const DEFAULT_THROW = true;
	const DEFAULT_TEXT = '-/-';

	//
	const INDEX = [];

	//
	LabelBox = module.exports = class LabelBox extends BarBox
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

		get text()
		{
			if(typeof this.options.text === 'string')
			{
				return this.options.text;
			}

			return DEFAULT_TEXT;
		}

		set text(_value)
		{
			if(typeof _value === 'string')
			{
				return this.options.text = _value;
			}
			else
			{
				delete this.options.text;
			}

			return this.text;
		}
	}

	//
	
})();

