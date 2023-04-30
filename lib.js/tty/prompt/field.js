(function()
{

	//
	const DEFAULT_MULTIPLE = false;

	//
	FieldPrompt = module.exports = class Field extends Prompt
	{
		constructor(_options)
		{
			super(_options);
		}

		static get keys()
		{
			return {
				value: {
					type: [ 'Array', 'Number' ],
					optional: false,
					default: []
				},
				multiple: {
					type: [ 'Boolean', 'Number' ],
					optional: false,
					default: DEFAULT_MULTIPLE
				},
				dimensions: {
					type: [ 'Array' ],
					optional: false,
					default: []
				},
				list: {
					type: [ 'Array' ],
					optional: true,
					default: []
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

		get multiple()
		{
			return this.options.multiple;
		}

		get dimensions()
		{
			return this.options.dimensions;
		}
	}

	//

})();
