(function()
{

	//
	const DEFAULT_MULTIPLE = false;

	//
	ListPrompt = module.exports = class List extends Prompt
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
					default: 0
				},
				completion: {
					type: [ 'Array' ],
					optional: true,
					default: null
				},
				list: {
					type: [ 'Array' ],
					optional: false,
					default: []
				},
				multiple: {
					type: [ 'Boolean', 'Number' ],
					optional: false,
					default: DEFAULT_MULTIPLE
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

		get completion()
		{
			return this.options.completion;
		}

		get items()
		{
			return this.options.items;
		}

		get multiple()
		{
			return this.options.multiple;
		}
	}

	//

})();
