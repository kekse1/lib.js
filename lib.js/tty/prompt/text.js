(function()
{

	//
	const DEFAULT_TEXT = '';

	//
	TextPrompt = module.exports = class Text extends Prompt
	{
		constructor(_options)
		{
			super(_options);
		}

		static get keys()
		{
			return {
				value: {
					type: [ 'String' ],
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
				},
				include: {
					type: [ 'Array', 'String' ],
					optional: true,
					default: null
				},
				exclude: {
					type: [ 'Array', 'String' ],
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
			const options = Object.assign({
				text: ''
			}, ... _args);

			for(var i = 0; i < _args.length; ++i)
			{
				if(typeof _args[i] === 'string')
				{
					options.text = _args[i];
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

		get include()
		{
			return this.options.include;
		}

		get exclude()
		{
			return this.options.exclude;
		}

	}

	//

})();
