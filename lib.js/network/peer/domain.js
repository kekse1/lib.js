(function()
{

	//
	if(typeof Entity === 'undefined')
	{
		require('net/peer/entity');
	}

	//
	Domain = module.exports = class Domain extends Entity
	{
		constructor(_options)
		{
			constructor(_options);
		}

		reset()
		{
			this.map = {};
			this.count = 0;
			return super.reset();
		}

		destroy(_reset = true)
		{
			if(this.destroyed)
			{
				return false;
			}
			else if(_reset)
			{
				this.reset();
			}

			return super.destroy();
		}

		// .. _owner => mail (best) ...
		addDomain(_name, _owner, _options)
		{
			//
			if(! String.isString(_name))
			{
				return x('Invalid % argument (expecting non-empty %)', null, '_name', 'String');
			}
			else if(! String.isString(_owner))
			{
				return x('Invalid % argument (expecting non-empty % or %)', null, '_owner', 'String', 'Array');
			}

			//
			if(_name in this.map)
			{
				return this.map[_name];
			}
			else
			{
				++this.count;
			}

			//
			const result = Object.assign({ group: {
				root: [],
				owner: [],
				mod: [],
				voice: [],
				user: [],
				guest: [],
				bot: []
			} }, _options);

			//
			result.name = _name;
			result.owner = (isString(_owner, 1) ? [ _owner ] : (isArray(_owner, 1) ? _owner : []));
			result.birthday = new Date();

			//
			return (this._map[_name] = result);
		}

		removeDomain(_name)
		{
			if(! (_name in this.map))
			{
				return false;
			}
			else
			{
				--this.count;
				delete this._map[_name];
			}

			return true;
		}
	}

	//
	Domain.INDEX = [];

	//

})();

