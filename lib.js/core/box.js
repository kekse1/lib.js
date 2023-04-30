//dummy class (because of browser/box ;)~

(function()
{

	//
	BOX = Box = HTMLBoxElement = class Box
	{
		constructor(... _args)
		{
			return this;
		}

		static create(... _args)
		{
			return new this(... _args);
		}

		identifyAs(_as)
		{
			if(typeof _as !== 'string')
			{
				return null;
			}
			else if(! this.TYPE)
			{
				this.TYPE = _as;
				return true;
			}

			return false;
		}

		reset(... _args)
		{
			this.destroyed = false;
		}

		connectedCallback(... _args)
		{
			Box.INDEX.pushUnique(this);
		}

		disconnectedCallback(... _args)
		{
			Box.INDEX.remove(this);
		}

		adoptedCallback(... _args)
		{
		}

		attributeChangedCallback(... _args)
		{
		}

		//get observedAttributes() { return []; }//!??

		static get observedAttributes()
		{
			return [];
		}

		//
	}

	//
	Box.INDEX = [];

	//

})();

