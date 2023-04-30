(function()
{

	//
	PasswordPrompt = module.exports = class Password extends Prompt
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
				conceal: {
					type: [ 'Boolean' ],
					optional: false,
					default: false
				},
				asterisk: {
					type: [ 'String' ],
					optional: false,
					default: '*'
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

		get conceal()
		{
			return this.options.conceal;
		}

		get asterisk()
		{
			return this.options.asterisk;
		}
	}

	//

})();
