(function()
{

	//
	RangePrompt = module.exports = class Range extends Prompt
	{
		constructor(_options)
		{
			super(_options);
		}

		static get keys()
		{
			return {
				value: {
					type: [ 'Number' ],
					optional: false,
					default: ''
				},
				radix: {
					type: [ 'Number', 'String' ],
					optional: true,
					default: null
				},
				minimum: {
					type: [ 'Number' ],
					optional: true,
					default: null
				},
				maximum: {
					type: [ 'Number' ],
					optional: true,
					default: null
				}
			};
		}

		static items()
		{
			return Prompt.items(this.name);
		}

		static create(... _args)
		{
			const options = Object.assign(... _args);

			for(var i = 0; i < _args.length; ++i)
			{
				if(Number.isInt(_args[i]))
				{
					if(typeof options.maximum === 'number')
					{
						if(typeof options.minimum === 'number')
						{
							if(typeof options.radix === 'number')
							{
								options.value = _args[i];
							}
							else
							{
								options.radix = _args[i];
							}
						}
						else
						{
							options.minimum = _args[i];
						}
					}
					else
					{
						options.maximum = _args[i];
					}
				}
			}

			return new this(options);
		}

		get radix()
		{
			return this.options.radix;
		}

		get minimum()
		{
			return this.options.minimum;
		}

		get maximum()
		{
			return this.options.maximum;
		}

		get percent()
		{
			const range = (this.maximum - this.minimum);

			if(range < 1)
			{
				return 0;
			}
			else if(this.value < 1)
			{
				return 0;
			}

			return (this.value / range * 100);
		}
	}

	//

})();
