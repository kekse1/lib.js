(function()
{

	//
	const Processor = module.exports = class Processor extends require('core/node')
	{
		constructor(_options)
		{
			super(_options);
		}

		static create(_parent, _options)
		{
		}

		reset()
		{
			this.children = [];
		}

		get parent()
		{
			if(this.options.parent instanceof Processor)
			{
				return this.options.parent;
			}

			return null;
		}

		set parent(_value)
		{
			if(_value instanceof Processor)
			{
				this.options.parent = _value;
			}
			else
			{
				delete this.options.parent;
			}

			return this.parent;
		}

		draw(... _dimensions)
		{
			//
			var result = this.drawChildren(... _dimensions);

			//
			//..and up again, w/in every process step...
		}

		//TODO/...! je ebene den eigenen parent.children[]-index einmal mehr mit weiter
		//reichen, um nach unten die pfad-struktur von oben in einen (relationen-)
		//baum hinein wachsen zu lassen..
		//
		//.. jede ebene als eine haupt-traeger-achse mehr, und eine raumzeit-
		//dimensionalität gemäß dieser (ueberlagerungs-ebenen-)tiefe(n), um so
		//je max tiefe mit 1d-zeit (träger-prozess-.children[]-index) zu starten,
		//bis höhere dimensionalität entsteht. zwei ebenen nach oben bilden schon
		//aus erster 1d-zeit eine 2d-xy-raumzeit; etc... ^_^
		drawChildren(... _dimensions)
		{
			var result = 0;

			for(var i = 0; i < this.children.length; i++)
			{
				if(this.children[i].weight === 0)
				{
					continue;
				}
				else
				{
					this.children[i].draw(... _dimensions, i);
					result++;
				}
			}
		}

		get weight()
		{
			if(typeof this.options.enabled === 'number')
			{
				return this.options.enabled;
			}

			return 1;
		}

		//'.enabled' (transparency, qubit, radix, ..?)
		set weight(_value)
		{
			if(typeof _value === 'number')
			{
				this.options.enabled = _value;
			}
			else
			{
				delete this.options.enabled;
			}

			return this.enabled;
		}
	}

	// (a) je repolarisation eine weitere hauptachse zum mitzählen, um das als feld-hauptachse(%)
	// (b) bei zählung der 3d-achse die nested depth, bei 2d verz, bei 1d file und 0/4 mod wert?
	// (c) .. TODO ..!
	// (d) quer-bits 8x erzeugen bytes für die achsen?
	// (e) calls als summe.. .children[] als prozesse selbst bzw. takte..?
	// (f) weights als func-params (+/- 1 mehr je call); oder als "transparenz" oder sys-abstand
	// (g) ... TODO! ..
	//
	// jedenfalls virtuelles zeichnen der prozesse... etc.//TODO/...
	//
	// //TODO/...

	//
	Processor.Tree = require('script/tree');

	//

})();

