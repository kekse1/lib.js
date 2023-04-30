(function()
{

	//
	const DEFAULT_COMPLETION = true;

	//
	PathPrompt = module.exports = class Path extends Prompt
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
				file: {
					type: [ 'Array', 'String' ],
					optional: true,
					default: null
				},
				exists: {
					type: [ 'Boolean' ],
					optional: true,
					default: false
				},
				completion: {
					type: [ 'Boolean' ],
					optional: true,
					default: DEFAULT_COMPLETION
				}
			};
		}

		static items()
		{
			return Prompt.items(this.name);
		}

		static validatePath(_item)
		{
			if(path.isValid(_item.value))
			{
				_item.value = fs.resolve(_item.value);

				if(_item.exists)
				{
					if(! fs.exists(_item.value, null, true))
					{
						return false;
					}
				}

				if(_item.file)
				{
					return (fs.types.indexOf(_item.file.toLowerCase()) > -1);
				}

				return true;
			}

			return null;
		}

		static create(... _args)
		{
			//
			const options = Object.assign({
				validate: PathPrompt.validatePath
			}, ... _args);

			//
			return new this(options);
		}

		get file()
		{
			return this.options.file;
		}

		get exists()
		{
			return this.options.exists;
		}

		get completion()
		{
			return this.options.completion;
		}
	}

	//

})();
