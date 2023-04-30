(function()
{

	//
	const DEFAULT_THROW = true;

	//
	const INDEX = [];

	//
	ScrollBox = module.exports = class ScrollBox extends BarBox
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

		get value()
		{
			if(typeof this.options.value === 'number')
			{
				return this.options.value;
			}

			return 0;
		}

		set value(_value)
		{
			if(Number.isInt(_value) && _value >= this.min && _value <= this.max)
			{
				return this.options.value = _value;
			}
			else
			{
				delete this.options.value;
			}

			return this.value;
		}

		get min()
		{
			if(typeof this.options.min === 'number')
			{
				return this.options.min;
			}

			return 0;
		}

		set min(_value)
		{
			if(Number.isInt(_value) && _value >= 0)
			{
				return this.options.min = _value;
			}
			else
			{
				delete this.options.min;
			}

			return this.min;
		}

		get max()
		{
			if(typeof this.options.max === 'number')
			{
				return this.options.max;
			}

			return 0;
		}

		set max(_value)
		{
			if(Number.isInt(_value) && _value >= 0)
			{
				return this.options.max = _value;
			}
			else
			{
				delete this.options.max;
			}

			return this.max;
		}

		get percent()
		{
			if(this.value === 0 || this.range === 0)
			{
				return 0;
			}

			return (this.value / this.range * 100);
		}
		
		get range()
		{
			var result = (this.max - this.min);

			if(result < 1)
			{
				if((result = (this.min - this.max)) >= 1)
				{
					[ this.min, this.max ] = [ this.max, this.min ];
				}
				else
				{
					return 0;
				}
			}

			return result;
		}

		set percent(_value)
		{
			if(Number.isInt(_value) && _value >= this.min && _value <= this.max)
			{
		throw new Error('TODO');
			}
			else
			{
				delete this.options.value;
			}

			return this.percent;
		}
	}

	//
	
})();

