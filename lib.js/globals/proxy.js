(function()
{

	//
	module.exports = Proxy;

	//
	Object.defineProperty(Proxy, 'trap', { enumerable: true, get: function()
	{
		return [
			'apply',
			'construct',
			'defineProperty',
			'deleteProperty',
			'get',
			'getOwnPropertyDescriptor',
			'getPrototypeOf',
			'has',
			'isExtensible',
			'ownKeys',
			'preventExtensions',
			'set',
			'setPrototypeOf'
		];
	}});

	//

})();

