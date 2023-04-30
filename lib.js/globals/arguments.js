(function()
{

	//
	Arguments = module.exports = (arguments.__proto__);

	//
	Object.defineProperty(Arguments, 'toString', { value: function(_options, ... _args)
	{
		const options = { arguments: true };

		if(_options === null || (Number.isInt(_options) && _options >= 0))
		{
			return [ ... this.valueOf() ].toString(options.assign({ depth: _options }));
		}
		else if(Object.isObject(_options) && ('depth' in _options))
		{
			return [ ... this.valueOf() ].toString(options.assign(_options));
		}

		return String.render(this, _options);
	}});

	//

})();

module.exports = Arguments;

