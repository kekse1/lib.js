(function()
{

	//
	ConfirmPrompt = module.exports = class Confirm extends Prompt
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
				list: {
					type: [ 'Array' ],
					optional: false,
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

		get list()
		{
			return this.options.list;
		}
	}

	//

})();
