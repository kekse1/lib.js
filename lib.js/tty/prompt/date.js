(function()
{

	//
	DatePrompt = module.exports = class Date extends Prompt
	{
		constructor(_options)
		{
			super(_options);
		}

		static get keys()
		{
			return {
				value: {
					type: [ 'Date', 'Number' ],
					optional: false,
					default: new Date()
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
	}

	//

})();
