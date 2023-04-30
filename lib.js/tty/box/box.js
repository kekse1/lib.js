(function()
{

	//
	const DEFAULT_THROW = true;

	const DEFAULT_CENTER = true;

	const DEFAULT_COLORS = 'hex';

	const DEFAULT_WIDTH = null;
	const DEFAULT_HEIGHT = null;

	const DEFAULT_BORDER = '#aaa';

	//
	if(typeof ansi === 'undefined')
	{
		require('tty/ansi');
	}

	if(typeof color === 'undefined')
	{
		require('utility/color');
	}

	//
	const INDEX = [];

	//
	Box = module.exports = class Box extends FIELD
	{
		constructor(_options)
		{
			//
			super(_options);

			//
			if(! tty(true))
			{
				return null;
			}
			else
			{
				Box.addToIndex(this);
			}
		}

		static get INDEX()
		{
			return INDEX;
		}

		get colors()
		{
			if(typeof this.options.colors === 'string')
			{
				return this.options.colors;
			}

			return DEFAULT_COLORS;
		}

		set colors(_value)
		{
			if(Box.isColorType(_value))
			{
				return this.options.colors = _value;
			}
			else
			{
				delete this.options.colors;
			}

			return this.colors;
		}

		destroy()
		{
			//
			Box.removeFromIndex(this);

			//
			return super.destroy(... arguments);
		}

		reset()
		{
			return super.reset(... arguments);
		}

		static addToIndex(_box)
		{
			return Box.INDEX.pushUnique(_box);
		}

		static removeFromIndex(_box)
		{
			return Box.INDEX.remove(_box);
		}

		static create(... _args)
		{
			const options = Object.assign(... _args);

			for(var i = 0; i < _args.length; ++i)
			{
				//
			}

			return new this(options);
		}

		get width()
		{
			if(typeof this.options.width === 'number')
			{
				return this.options.width;
			}
			else if(typeof DEFAULT_WIDTH === 'number')
			{
				return DEFAULT_WIDTH;
			}
			else if(this.screen)
			{
				return this.screen.width;
			}

			return Screen.width;
		}

		set width(_value)
		{
			if(Number.isNumber(_value) || String.isString(_value))
			{
				_value = Box.getX(_value);
				this.setSize(this.options.width = _value, this.height, false);
				return _value;
			}

			return this.width;
		}

		get height()
		{
			if(typeof this.options.height === 'number')
			{
				return this.options.height;
			}
			else if(typeof DEFAULT_HEIGHT === 'number')
			{
				return DEFAULT_HEIGHT;
			}
			else if(this.screen)
			{
				return this.screen.height;
			}

			return Screen.height;
		}

		set height(_value)
		{
			if(Number.isNumber(_value) || String.isString(_value))
			{
				_value = Box.getY(_value);
				this.setSize(this.width, this.options.height = _value, false);
				return _value;
			}

			return this.height;
		}

		setSize(_width = this.width, _height = this.height, _apply = true)
		{
			if((Number.isNumber(_width) || String.isString(_width)) && (Number.isNumber(_height) || String.isString(_height)))
			{
				_width = Box.getX(_width);
				_height = Box.getY(_height);

				if(_apply)
				{
					this.options.width = _width;
					this.options.height = _height;
				}
			}
			else
			{
				return x('Invalid % or % argument (expecting % or %)', null, '_width', '_height', 'Number', 'String');
			}
	throw new Error('TODO');
		}

		setPosition(_left, _top, _right, _bottom, _apply = true)
		{
		}

		get tree()
		{
			var parent;
			const result = [ parent = this ];

			while(parent = parent.parentBox)
			{
				result.unshift(parent);
			}

			return parent;
		}

		hasParent(_optional)
		{
			if(! (_optional instanceof Box))
			{
				_options = null;
			}

			if(! _optional)
			{
				return Box.isBox(this.parentBox);
			}

			var parent = this;
			var depth = 0;

			do
			{
				if(parent === _optional)
				{
					return depth;
				}
				else
				{
					++depth;
				}
			}
			while(parent = parent.parentBox);

			return -1;
		}

		get parentBox()
		{
			if(this.options.parentBox)
			{
				return this.options.parentBox;
			}

			return null;
		}

		set parentBox(_value)
		{
			if(_value instanceof Box)
			{
				return this.options.parentBox = _value;
			}
			else
			{
				delete this.options.parentBox;
			}

			return this.parentBox;
		}

		get parentWidth()
		{
			if(this.parentBox)
			{
				return this.parentBox.width;
			}
			else if(this.screen)
			{
				return this.screen.width;
			}

			return Screen.width;
		}

		get parentHeight()
		{
			if(this.parentBox)
			{
				return this.parentBox.height;
			}
			else if(this.screen)
			{
				return this.screen.height;
			}

			return Screen.height;
		}

		static getX(_value, _parent = Screen.width)
		{
			return String.getX(_value, _parent, false, null, false);
		}

		getX(_value)
		{
			return Box.getX(_value, this.parentWidth);
		}

		static getY(_value, _parent = Screen.height)
		{
			return String.getY(_value, _parent, false, null, false);
		}

		getY(_value)
		{
			return Box.getY(_value, this.parentHeight);
		}

		get left()
		{
		}

		set left(_value)
		{
		}

		get top()
		{
		}

		set top(_value)
		{
		}

		get right()
		{
		}

		set right(_value)
		{
		}

		get bottom()
		{
		}

		set bottom(_value)
		{
		}

		get center()
		{
			if(typeof this.options.center === 'boolean')
			{
				return this.options.center;
			}

			return DEFAULT_CENTER;
		}

		set center(_value)
		{
			if(typeof _value === 'boolean')
			{
				this.options.center = _value;
			}
			else
			{
				delete this.options.center;
			}

			return this.setCenter(this.center, false);
		}

		setCenter(_value, _apply = true)
		{
			if(typeof _value !== 'boolean')
			{
				return x('Invalid % argument (not a % type)', null, '_value', 'Boolean');
			}
			else if(_apply)
			{
				this.options.center = _value;
			}

			//
			//TODO
			//

			//
			return _value;
		}

		get screen()
		{
			if(this.options.screen)
			{
				return this.options.screen;
			}

			return null;
		}

		set screen(_value)
		{
			if(Box.Screen.isScreen(_value))
			{
				return this.options.screen = _value;
			}

			return this.screen;
		}

		static isBox(_item)
		{
			return (_item instanceof Box);
		}

		static draw()
		{
			if(Box.isDrawing)
			{
				return false;
			}
			else
			{
				Box.isDrawing = true;
			}

			var result = 0;

			for(const b of Box.INDEX)
			{
				b.draw();
				++result;
			}

			//
			Box.isDrawing = false;

			//
			return result;
		}

		draw(_depth = 1)
		{
			//
			if(this.isDrawing)
			{
				return false;
			}
			else
			{
				this.isDrawing = true;
			}

			//
			this.drawRectangle(_depth);
			//
			//TODO/
			//

			//
			this.drawChildren(_depth);

			//
			//TODO/
			//

			//
			return !(this.isDrawing = false);
		}

		drawChildren(_depth = 1)
		{
			var result = 0;

			for(const c of this.children)
			{
				c.draw(_depth + 1);
				++result;
			}

			return result;
		}

		drawRectangle(_depth = 1)
		{
	throw new Error('TODO');
		}

		get children()
		{
			if(this.options.children)
			{
				return [ ... this.options.children ];
			}
			else
			{
				this.options.children = [];
			}

			return [ ... this.options.children ];
		}

		set children(_value)
		{
			if(Array.isArray(_value, true))
			{
				this.options.children = [ ... _value ];
			}

			return this.children;
		}

		static get dock()
		{
			return [ 'none', 'full', 'fill', 'left', 'top', 'right', 'bottom' ];
		}

		static isDock(_value, _empty = true)
		{
			if(String.isString(_value))
			{
				if(_empty && _value.length === 0)
				{
					return true;
				}

				return (Box.dock.indexOf(_value.toLowerCase()) > -1);
			}

			return null;
		}

		get dock()
		{
			if(typeof this.options.dock === 'string')
			{
				return this.options.dock;
			}

			return 'none';
		}

		set dock(_value)
		{
			const orig = this.dock;

			if(_value === '')
			{
				this.options.dock = _value = 'none';
			}
			else if(Box.isDock(_value, false))
			{
				this.options.dock = _value.toLowerCase();
			}
			else
			{
				return x('Invalid % % (needs to be one of [ %, %, %, %, %, %, % ])', null, 'dock', '_value', 'none', 'full', 'fill', 'left', 'top', 'right', 'bottom');
			}

			const result = this.dock;

			if(orig !== result)
			{
				return this.setDock(result);
			}

			return result;
		}

		setDock(_dock)
		{
			if(_dock === '')
			{
				_dock = 'none';
			}
			else if(! Box.isDock(_dock, false))
			{
				return x('Invalid % argument (needs to be one of [ %, %, %, %, %, %, % ])', null, '_dock', 'none', 'full', 'fill', 'left', 'top', 'right', 'bottom');
			}
		}

		static isColorType(_value, _empty = true)
		{
			return color.isColorType(_value, _empty);
		}

		static colorType(_value)
		{
			return color.type(_value);
		}

		static isColor(_value)
		{
			return ansi.isColor(_value);
		}

		static isRandomColor(_value)
		{
			return ansi.isRandomColor(_value);
		}

		static getColor(_value)
		{
			return color[this.colors](_value);
		}

		static getRandomColor(_value)
		{
			return color.random[this.colors](_value);
		}

		static color(_value)
		{
			if(Box.isRandomColor(_value))
			{
				return _value;
			}
			else if(Box.isColor(_value))
			{
				return Box.getColor(_value);
			}

			return null;
		}

		get border()
		{
			if(Box.isColor(this.options.border))
			{
				return Box.color(this.options.border);
			}

			return Box.color(DEFAULT_BORDER);
		}

		set border(_value)
		{
			if(Box.isColor(_value))
			{
				this.options.border = _value;
			}
			else
			{
				delete this.options.border;
			}

			return this.border;
		}

		remove()
		{
		}

		removeChild(_child)
		{
		}

		appendChild(_child)
		{
		}

		insertChild(_child, _index = 0)
		{
		}

		hasChild(_child, _depth = null)
		{
		}

		hasParent(_parent)
		{
		}
	}

	//
	Box.isDrawing = false;

	//

})();
