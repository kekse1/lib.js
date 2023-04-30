(function()
{

	//
	ProgressPrompt = module.exports = class Progress extends Prompt
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

		get minimum()
		{
			return this.options.minimum;
		}

		get maximum()
		{
			return this.options.maximum;
		}

		static create(... _args)
		{
			const options = Object.assign(... _args);

			for(var i = 0; i < _args.length; ++i)
			{
				if(Number.isNumber(_args[i]))
				{
					if(typeof options.maximum === 'number')
					{
						if(typeof options.minimum === 'number')
						{
							options.value = _args[i];
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
		}
	}

	//

})();
