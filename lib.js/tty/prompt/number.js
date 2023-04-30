(function()
{

	//
	NumberPrompt = module.exports = class Number extends Prompt
	{
		constructor(_options)
		{
			super(_options);
		}

		static get keys()
		{
			return {
				value: {
					type: [ 'Number', 'BigInt' ],
					optional: false,
					default: 0
				},
				minimum: {
					type: [ 'Number', 'BigInt' ],
					optional: true,
					default: null
				},
				maximum: {
					type: [ 'Number', 'BigInt' ],
					optional: true,
					default: null
				},
				radix: {
					type: [ 'Number', 'String' ],
					optional: false,
					default: 10
				}
			};
		}

		static items()
		{
			return Prompt.items(this.name);
		}

		static create(... _args)
		{
			//
			const options = Object.assign({
				//
			}, ... _args);

			//
			return new this(options);
		}

		get minimum()
		{
			return this.options.minimum;
		}

		get maximum()
		{
			return this.options.maximum;
		}

		get radix()
		{
			return this.options.radix;
		}
	}

	//

})();
