(function()
{

	//
	if(typeof EVENT === 'undefined')
	{
		require('core/event');
	}
	
	//
	const DEFAULT_INITIALIZATION_EXCEPTION = true;

	//
	ITEM = module.exports = class ITEM extends EVENT
	{
		constructor(_options)
		{
			//
			super();

			//
			this.finish(_options);

			//
			ITEM.toIndex(this);
		}

		finish(_options)
		{
			this.__INIT = true;
			this.initializeOptions(_options);
			this.applyOptions(_options);
			this.reset();
			this.__INIT = false;
		}

		applyOptions(_options)
		{
			//
		}

		initializeOptions(... _args)
		{
			//
			if(this.OPTIONS && this.MISSING)
			{
				return 0;
			}
			else if(_args.length === 0)
			{
				return -1;
			}
			else
			{
				this.ID = randomID();
			}
			
			//
			this.OPTIONS = Object.create(null);
			this.MISSING = Object.create(null);
			
			//
			var opts;
			
			if(_args.length === 1)
			{
				if(Object.isObject(_args[0]))
				{
					opts = _args.pop();
				}
				else
				{
					return x('Invalid % argument (not an %)', null, 'first', 'Object');
				}
			}
			else
			{
				opts = Object.assign(... _args);
			}
			
			if(! Object.isObject(this._options))
			{
				this._options = opts;
			}
			
			//
			var result = 0;
			var cont;
			
			for(const idx in opts)
			{
				switch(idx.toLowerCase())
				{
					case 'options':
					case 'missing':
						cont = true;
						break;
					default:
						cont = false;
						break;
				}
				
				if(cont)
				{
					continue;
				}
				else try
				{
					this[idx] = opts[idx];
					++result;
				}
				catch(_error)
				{
					//
					this.MISSING[idx] = opts[idx];
					
					//
					if(DEFAULT_INITIALIZATION_EXCEPTION)
					{
						return x(_error);
					}
					else
					{
						continue;
					}
				}
			}
			
			return result;
		}
		
		get options()
		{
			if(! this.OPTIONS)
			{
				this.OPTIONS = Object.create(null);
			}
			
			return this.OPTIONS;
		}
		
		get missing()
		{
			if(! this.MISSING)
			{
				this.MISSING = this.options.MISSING = Object.create(null);
			}
			
			return this.MISSING;
		}

		//
		//todo/
		//
		static get mergeKeys()
		{
			return [];
		}

		morph(_item = null, _additional_options = null)
		{
			//
			if(! (_item instanceof ITEM))
			{
				return x('Invalid % argument (not an instanceof %)', null, '_item', 'ITEM');
			}

			//
			_item.finish(Object.assign(this.options, _additional_options));

			//
			return _item;
		}

		reset()
		{
			return super.reset();
		}

		destroy(_callback)
		{
			//
			ITEM.fromIndex(this);

			//
			return super.destroy(_callback);
		}

		static toIndex(_item)
		{
			if(! (_item instanceof ITEM))
			{
				return x('Invalid % argument (not an instance of %)', null, '_item', 'ITEM');
			}

			const index = ITEM.INDEX.indexOf(_item);

			if(index > -1)
			{
				return index;
			}

			return (ITEM.INDEX.push(_item) - 1);
		}

		static fromIndex(_item)
		{
			if(! (_item instanceof ITEM))
			{
				return x('Invalid % argument (not an instance of %)', null, '_item', 'ITEM');
			}

			const index = ITEM.INDEX.indexOf(_item);

			if(index === -1)
			{
				return -1;
			}
			else
			{
				ITEM.INDEX.splice(index, 1);
			}

			return index;
		}
	}

	//
	ITEM.INDEX = [];

	//

})();
