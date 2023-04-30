(function()
{

	//
	const DEFAULT_LIMIT_RATIO = false;
	const DEFAULT_NULL_RATIO = true;
	const DEFAULT_MAX_CHAR_APPEND_LENGTH = 256;

	//
	if(typeof ansi === 'undefined')
	{
		ansi = require('tty/ansi');
	}

	//
	vector = module.exports = {};
	
	//
	Object.defineProperty(vector, 'size', { get: function() { return console.size; }});
	Object.defineProperty(vector, 'width', { get: function() { return console.width; }});
	Object.defineProperty(vector, 'height', { get: function() { return console.height; }});
	Object.defineProperty(vector, 'depth', { get: function() { return console.depth; }});
	Object.defineProperty(vector, 'colors', { get: function() { return console.colors; }});

	//
	function createNumberArray(... _args)
	{
		const result = [];
		
		for(var i = 0, j = 0; i < _args.length; i++)
		{
			if(Number.isNumber(_args[i]))
			{
				result[j++] = _args[i];
			}
			else if(Array.isArray(_args[i]))
			{
				for(var k = 0; k < _args[i].length; k++)
				{
					if(Number.isNumber(_args[i][k]))
					{
						result[j++] = _args[i][k];
					}
				}
			}
		}

		return result;
	}
	
	vector.ratio = function(... _args)
	{
		const result = createNumberArray(... _args);
		
		if(result.length === 0)
		{
			return null;
		}

		if(DEFAULT_LIMIT_RATIO) for(var i = 0; i < result.length; i++)
		{
			if(result[i] < -1)
			{
				result[i] = -1;
			}
			else if(result[i] > 1)
			{
				result[i] = 1;
			}
		}
		
		if(DEFAULT_NULL_RATIO) for(var i = 0; i < result.length; i++)
		{
			if(result[i] === 0)
			{
				result[i] = 0;
			}
		}
		
		if(result.length === 1)
		{
			return result[0];
		}

		return result;
	}
	
	vector.ratio.x = function(... _args)
	{
		var result = vector.ratio(... _args);
		
		if(result === null)
		{
			return null;
		}
		else if(Number.isNumber(result))
		{
			result = [ result ];
		}

		for(var i = 0; i < result.length; i++)
		{
			result[i] *= vector.width;
		}
		
		if(result.length === 1)
		{
			return result[0];
		}
		
		return result;
	}
	
	vector.ratio.y = function(... _args)
	{
		var result = vector.ratio(... _args);
		
		if(result === null)
		{
			return null;
		}
		else if(Number.isNumber(result))
		{
			result = [ result ];
		}
		
		for(var i = 0; i < result.length; i++)
		{
			result[i] *= vector.height;
		}
		
		if(result.length === 1)
		{
			return result[0];
		}
		
		return result;
	}

	
	vector.ratio.createX = function(... _args)
	{
		const result = createNumberArray(... _args);
		
		if(result.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < result.length; i++)
		{
			result[i] = vector.ratio((result[i] / vector.width));
		}
		
		if(result.length === 1)
		{
			return result[0];
		}
		
		return result;
	}
	
	vector.ratio.createY = function(... _args)
	{
		const result = createNumberArray(... _args);
		
		if(result.length === 0)
		{
			return null;
		}
		else for(var i = 0; i < result.length; i++)
		{
			result[i] = vector.ratio((result[i] / vector.height));
		}

		if(result.length === 1)
		{
			return result[0];
		}
		
		return result;
	}

	vector.x = function(... _args)
	{
		for(var i = 0; i < _args.length; i++)
		{
			if(! Number.isNumber(_args[i]))
			{
				_args.splice(i--, 1);
			}
		}

		if(_args.length === 0)
		{
			return x('Expecting at least one -/+ Integer');
		}
		else for(var i = 0; i < _args.length; i++)
		{
			_args[i] = ansi.x(_args[i]);
		}

		if(_args.length === 1)
		{
			return _args[0];
		}

		return _args;
	}

	vector.y = function(... _args)
	{
		for(var i = 0; i < _args.length; i++)
		{
			if(! Number.isNumber(_args[i]))
			{
				_args.splice(i--, 1);
			}
		}

		if(_args.length === 0)
		{
			return x('Expecting at least one -/+ Integer');
		}
		else for(var i = 0; i < _args.length; i++)
		{
			_args[i] = ansi.y(_args[i]);
		}

		if(_args.length === 1)
		{
			return _args[0];
		}

		return _args;
	}

	//
	var charPool = '';
	var charAppend = '';
	var lastChars = '';

	const randomCharPool = (_chars, _crypto = true) => {
		var result = '';

		if(! String.isString(_chars))
		{
			if(charAppend.length > 0)
			{
				_chars = charAppend;
				charAppend = '';
			}
			else
			{
				_chars = vector.pixel.ALPHABET;
			}
		}

		while(result.length < _chars.length)
		{
			var copy = _chars;
			var idx;

			while(copy.length > 0 && result.length < _chars.length)
			{
				result += copy[idx = copy.getRandomIndex(_crypto)];
				copy = copy.substr(0, idx) + copy.substr(idx + 1);
			}
		}

		return result;
	};

	const randomChar = (_chars, _crypto = true) => {
		if(! String.isString(_chars))
		{
			if(charPool.length === 0)
			{
				charPool = randomCharPool(null, _crypto);
			}
		}
		else if(_chars.length === 1)
		{
			return _chars[0];
		}
		else if(charPool.length === 0)
		{
			if(_chars.length === 0)
			{
				if(charAppend.length > 0)
				{
					charPool = randomCharPool(charAppend, _crypto);
					charAppend = '';
				}
				else
				{
					charPool = randomCharPool(vector.pixel.ALPHABET, _crypto);
				}
			}
			else
			{
				charPool = randomCharPool(_chars, _crypto);
			}
		}
		else if(_chars !== lastChars)
		{
			const diff = (DEFAULT_MAX_CHAR_APPEND_LENGTH - charAppend.length) % DEFAULT_MAX_CHAR_APPEND_LENGTH;
			
			if(diff > 0)
			{
				charAppend += _chars.substr(0, diff);
			}

			lastChars = _chars;
		}

		const idx = charPool.getRandomIndex(_crypto);
		const result = charPool[idx];
		charPool = charPool.substr(0, idx) + charPool.substr(idx + 1);
		return result;
	};

	vector.pixel = function(_x, _y, _ratio = false, _char, _bg, _fg, _styles = 0, _random = true, _end = true, _state = true)
	{
		if(String.isString(_char))
		{
			//
		}
		else if(Number.isInt(_char))
		{
			_char = String.fromCodePoint(_char % 256);
		}
		else if(charAppend.length > 0)
		{
			_char = charAppend;
			charAppend = '';
		}
		else
		{
			_char = vector.pixel.ALPHABET;
		}

		if(String.isString(_char))
		{
			if(_random)
			{
				_char = randomChar(_char);
			}
		}
		else
		{
			return x('Invalid _char(s)');
		}

		var __x, __y;
		
		if(Number.isNumber(_x))
		{
			if(_ratio)
			{
				_x = Math.round((__x = vector.ratio(_x)) * vector.width);
			}
			else
			{
				_x = vector.x(__x = _x);
			}
		}
		else
		{
			return x('Invalid _x coordinate (expecting -/+ Number)');
		}

		if(Number.isNumber(_y))
		{
			if(_ratio)
			{
				_y = Math.round((__y = vector.ratio(_y)) * vector.height);
			}
			else
			{
				_y = vector.y(__y = _y);
			}
		}
		else
		{
			return x('Invalid _y coordinate (expecting -/+ Integer)');
		}

		if(_state)
		{
			ansi.cursor.save();
		}

		var result = ansi.color(_fg, _bg);
		var styles;

		if(_styles)
		{
			if(Number.isInt(_styles))
			{
				styles = vector.style.array(_styles);
			}
			else if(Array.isArray(_styles))
			{
				styles = vector.style.array.check(_styles, true);
			}
			else if(Object.isObject(_styles))
			{
				styles = vector.style.object.array(_styles);
			}
			else
			{
				styles = null;
			}

			if(styles) for(var i = 0; i < styles.length; i++)
			{
				result += ansi.style[styles[i]]();
			}
		}

		result += _char;

		if(_end && (styles && styles.length > 0) || _fg || _bg)
		{
			result += ansi.none;
		}

		result = ansi.cursor(_y, _x, null) + result;
		ansi.write(result);

		if(_state)
		{
			ansi.cursor.load();
		}

		return { x: _x, y: _y, char: _char, _x: __x, _y: __y };
	}

	vector.pixel.ALPHABET = alphabet.LOWER;//LETTER;

	vector.style = function(_styles, _array = true)
	{
		if(typeof _styles === 'object' && _styles !== null)
		{
			return vector.style.byte(_styles);
		}
		else if(Number.isInt(_styles))
		{
			return vector.style.object(_styles, _array);
		}

		return x('Invalid argument (expecting an Object or a Byte, so a Number between 0 and 255)');
	}

	vector.style.object = function(_byte, _array = false)
	{
		if(! Number.isInt(_byte))
		{
			return x('Invalid argument (expecting a Byte, so a Number between 0 and 255)');
		}
		else if(_array)
		{
			return vector.style.array(_byte, false);
		}

		const result = Object.create(null);

		for(var idx in STYLES)
		{
			if(_byte & STYLES[idx])
			{
				result[idx] = true;
			}
			else
			{
				result[idx] = false;
			}
		}

		return result;
	}

	vector.style.array = function(_byte, _object = false)
	{
		if(! Number.isInt(_byte))
		{
			return x('Invalid argument (expecting a Byte, so a Number between 0 and 255)');
		}
		else if(_object)
		{
			return vector.style.object(_byte, false);
		}

		const result = [];

		for(var idx in STYLES)
		{
			if(_byte & STYLES[idx])
			{
				result.push(idx);
			}
		}

		return result;
	}

	vector.style.byte = function(_object, _byte = 0)
	{
		if(typeof _object !== 'object' || _object === null)
		{
			return x('Invalid argument (expecting an Object)');
		}
		else if(! Number.isInt(_byte))
		{
			_byte = 0;
		}

		var result = _byte;

		if(Array.isArray(_object)) for(var i = 0; i < _object.length; i++)
		{
			if(_object[i] in STYLES)
			{
				result ^= STYLES[_object[i]];
			}
		}
		else for(var idx in _object)
		{
			if(_object[idx] && (idx in STYLES))
			{
				result ^= STYLES[idx];
			}
		}

		return result;
	}

	vector.style.array.check = function(_array, _delete = true)
	{
		if(! Array.isArray(_array))
		{
			return x('Invalid argument (expecting an Array)');
		}

		const result = [];

		for(var i = 0, j = 0; i < _array.length; i++)
		{
			if(_delete && (_array[i] in STYLES))
			{
				result[j++] = _array[i];
			}
			else if(! _delete)
			{
				return false;
			}
		}

		if(_delete)
		{
			return result;
		}

		return true;
	}

	vector.style.array.object = function(_array)
	{
		if(! Array.isArray(_array))
		{
			return x('Invalid argument (expecting an Array)');
		}

		const result = Object.create(null);

		for(var i = 0, j = 0; i < _array.length; i++)
		{
			if(_array[i] in STYLES)
			{
				result[j++] = _array[i];
			}
		}

		return result;
	}

	vector.style.object.check = function(_object, _delete = true)
	{
		if(! Object.isObject(_object))
		{
			return x('Invalid argument (expecting an Object)');
		}

		const result = (_delete ? Object.create(null) : null);

		for(var idx in _object)
		{
			if(_delete && (idx in STYLES) && typeof _object[idx] === 'boolean')
			{
				result[idx] = _object[idx];
			}
			else if(! _delete)
			{
				return false;
			}
		}

		if(_delete)
		{
			return result;
		}

		return true;
	}

	vector.style.object.array = function(_object)
	{
		if(! Object.isObject(_object))
		{
			return x('Invalid argument (expecting an Object)');
		}

		const result = [];

		for(var idx in _object)
		{
			if(_object[idx] && (idx in STYLES))
			{
				result.push(idx);
			}
		}

		return result;
	}

	const STYLES = Object.create(null);

	(function()
	{
		var bit = 1;

		for(var i = 0; i < ansi.styles.length; i++)
		{
			STYLES[ansi.styles[i]] = bit;
			bit *= 2;
		}
	})();

	Object.defineProperty(vector, 'styles', { get: function()
	{
		return STYLES;
	}});

	//
	vector.isColor = ansi.isColor;
	vector.isRandomColor = ansi.isRandomColor;
	vector.getRandomColor = ansi.getRandomColor;
	
	//
	vector.line = function(_x1, _y1, _x2, _y2, _ratio = false, _chars, _bg, _fg, _rainbow = false, _styles = 0, _anti_aliasing = true, _smooth = false, _state = true)
	{
		var x1, x2, y1, y2;

		if(! (Number.isNumber(_x1) && Number.isNumber(_y1) && Number.isNumber(_x2) && Number.isNumber(_y2)))
		{
			return x('All coordinates (for two points) needs to be numeric values');
		}
		else
		{
			if(_ratio)
			{
				const xs = vector.ratio(_x1, _x2);
				const ys = vector.ratio(_y1, _y2);

				for(var i = 0; i < xs.length; i++)
				{
					xs[i] = Math.round(xs[i] * vector.width);
				}

				for(var i = 0; i < ys.length; i++)
				{
					ys[i] = Math.round(ys[i] * vector.height);
				}

				[ x1, x2 ] = xs;
				[ y1, y2 ] = ys;
			}
			else
			{
				[ x1, x2 ] = vector.x(_x1, _x2);
				[ y1, y2 ] = vector.y(_y1, _y2);
			}
		}
		
		//
		var fg, bg;
		var isRandomFG;
		var isRandomBG;
		
		if(vector.isColor(_fg))
		{
			if(isRandomFG = vector.isRandomColor(_fg))
			{
				if(_rainbow)
				{
					fg = _fg;
				}
				else
				{
					isRandomFG = false;
					fg = vector.randomColor(_fg);
				}
			}
			else
			{
				fg = _fg;
			}
		}
		else
		{
			isRandomFG = false;
			fg = _fg = false;
		}
		
		if(vector.isColor(_bg))
		{
			if(isRandomBG = vector.isRandomColor(_bg))
			{
				if(_rainbow)
				{
					bg = _bg;
				}
				else
				{
					isRandomFG = false;
					bg = vector.randomColor(_bg);
				}
			}
			else
			{
				bg = _bg;
			}
		}
		else
		{
			isRandomBG = false;
			bg = _bg = false;
		}
		
		const getFG = () => {
			if(isRandomFG)
			{
				return (fg = vector.randomColor(_fg));
			}
			
			return fg;
		};
		
		const getBG = () => {
			if(isRandomBG)
			{
				return (bg = vector.randomColor(_bg));
			}
			
			return bg;
		};
		
		//
		if(typeof _rainbow !== 'boolean')
		{
			return x('Invalid _rainbow argument (not a Boolean)');
		}
		else if(typeof _anti_aliasing !== 'boolean')
		{
			return x('Invalid _anti_aliasing argument (not a Boolean)');
		}
		else if(typeof _smooth !== 'boolean')
		{
			return x('Invalid _smooth argument (expecting a Boolean)');
		}
		else if(typeof _state !== 'boolean')
		{
			return x('Invalid _state argument (expecting a Boolean)');
		}
		
		if(! Number.isInt(_styles))
		{
			_styles = 0;
		}

		//
		if(_state)
		{
			ansi.cursor.save();
		}

		const diff = { x: (x2 - x1), y: (y2 - y1) };
		const scale = { x: (diff.x / diff.y), y: (diff.y / diff.x) };
		const ratio = { x: (scale.x / diff.x), y: (scale.y / diff.y) };
		var mode;
		
		if(diff.x >= 0)
		{
			if(diff.y >= 0)
			{
				mode = '++';
			}
			else
			{
				mode = '+-';
			}
		}
		else
		{
			if(diff.y >= 0)
			{
				mode = '-+';
			}
			else
			{
				mode = '--';
			}
		}

		//todo: kann ich das nicht direkt in der ratio-berechnung mit einbringen?
		//..scheint mir ein wenig seltsam, das ohne richtige mathematik zu loesen gleich! ^_^ ..
		switch(mode)
		{
			case '++':
				ratio.x = ratio.x.toPositive();
				ratio.y = ratio.y.toPositive();
				break;
			case '+-':
				ratio.x = ratio.x.toPositive();
				ratio.y = ratio.y.toNegative();
				break;
			case '-+':
				ratio.x = ratio.x.toNegative();
				ratio.y = ratio.y.toPositive();
				break;
			case '--':
				ratio.x = ratio.x.toNegative();
				ratio.y = ratio.y.toNegative();
				break;
		}

		//
		var stop = false;
		var lastRoundX, lastRoundY;
		var lastX, lastY;
		var result = 0;
		var _x, _y;
		
		//
		if(x1 === x2 && y1 === y2)
		{
			// vector.pixel(_x, _y, _ratio = false, _char, _bg, _fg, _styles = 0, _random = true, _end = true, _state = true);
			vector.pixel(x1, y1, false, _chars, bg, fg, 0, true, false, false);
		}
		else if(x1 === x2 || y1 === y2) for(var i = (x1 === x2 ? y1 : x1);;)
		{
			if(isRandomFG)
			{
				fg = getFG();
			}
			
			if(isRandomBG)
			{
				bg = getBG();
			}

			switch(mode)
			{
				case '++':
					if(x1 === x2)
					{
						vector.pixel(x1, i++, false, _chars, bg, fg, 0, true, false, false);

						if(i >= y2)
						{
							stop = true;
						}
					}
					else
					{
						vector.pixel(i++, y1, false, _chars, bg, fg, 0, true, false, false);

						if(i >= x2)
						{
							stop = true;
						}
					}
					break;
				case '+-':
					if(x1 === x2)
					{
						vector.pixel(x1, i--, false, _chars, bg, fg, 0, true, false, false);

						if(i <= y2)
						{
							stop = true;
						}
					}
					else
					{
						vector.pixel(i++, y1, false, _chars, bg, fg, 0, true, false, false);

						if(i >= x2)
						{
							stop = true;
						}
					}
					break;
				case '-+':
					if(x1 === x2)
					{
						vector.pixel(x1, i++, false, _chars, bg, fg, 0, true, false, false);

						if(i >= y2)
						{
							stop = true;
						}
					}
					else
					{
						vector.pixel(i--, y1, false, _chars, bg, fg, 0, true, false, false);

						if(i <= x2)
						{
							stop = true;
						}
					}
					break;
				case '--':
					if(x1 === x2)
					{
						vector.pixel(x1, i--, false, _chars, bg, fg, 0, true, false, false);

						if(i <= y2)
						{
							stop = true;
						}
					}
					else
					{
						vector.pixel(i--, y1, false, _chars, bg, fg, 0, true, false, false);

						if(i <= x2)
						{
							stop = true;
						}
					}
					break;
			}

			if(stop)
			{
				break;
			}
		}
		else for(var x = 0, y = 0;;)
		{
//TODO/_rainbow...!!!
//
//TODO/ansi-alias..
//
//TODO/NEGATIVE nicht vergessen....

			/*
			//
			if(isRandomFG)
			{
				fg = getFG();
			}
			
			if(isRandomBG)
			{
				bg = getBG();
			}

			//
			const THRESHOLD = 0.1;

			//
			var floatX = Math.abs(x % 1);
			var floatY = Math.abs(y % 1);

			//
			var ratioX = ((floatX % 0.5) / 0.5);
			var ratioY = ((floatY % 0.5) / 0.5);

			//
			var upX = (1 - floatX);
			var upY = (1 - floatY);

			//
			var fgX, fgY;
			var bgX, bgY;

			if(fg)
			{
				fgX = color.ratio(fg, ratioX);
				fgY = color.ratio(fg, ratioY);
			}
			else
			{
				fgX = fgY = false;
			}

			if(bg)
			{
				bgX = color.ratio(bg, ratioX);
				bgY = color.ratio(bg, ratioY);
			}
			else
			{
				bgX = bgY = false;
			}*/


			//TODO/
	//bedenke: bei absolut horiz/vert ganz breiter text-anteil.. evtl richtung line.width denken so!???


			//TODO: THRESHOLD, ETC.. ANTI ALIASING..
			//
			//UVA *DIFFERENZ*-ZEICHNUNG.. durch 'tty/screen' w/ 'pixel'... EFFIZIENZ W/O RUCKELN!
			//
			//
			//
			_x = Math.round(x);
			_y = Math.round(y);

			if((_smooth && (_x !== lastRoundX && _y !== lastRoundY))
				|| (!_smooth && (_x !== lastRoundX || _y !== lastRoundY)))
			{
				//
				vector.pixel(x1 + _x, y1 + _y, false, _chars, bg, fg, 0, true, false, false);

				//
				lastRoundX = _x;
				lastRoundY = _y;
			}

			/*
			if(floatX < THRESHOLD || upX < THRESHOLD)
			{
				vector.pixel(x1 + x, y1 + y, false, _chars, bg, fg, 0, true, false, false);
			}
			else
			{
				// float @ color.. 0.5 ... 0 ganz schwarz, 1 ganz schwarz, 0.5 weiß!
				//
				// ... 1/2 @ 0.5, ..
				// wenn 0.25, viertel, 0.75 auch viertel..
				//
				// ((%1) % 0.5)
				//
				// 0.5 % 0.5 = 0
				// 0.25 % 0.5 = 0.25 / 0.5 = 0.5
				// 0.75 % 0.5 = 0.25 / 0.5 ..
				// 0.6 % 0.5 = 0.1 / 0.5 = 0.2..
				// 0.9 % 0.5 = 0.4 / 0.5 = 0.8...
				//
				// 0.2 / 0.5 = 0.4
				// 0.25 / 0.5 = 0.5
			}

			if(floatY < THRESHOLD || upY < THRESHOLD)
			{
				vector.pixel(x1 + x, y1 + y, false, _chars, bg, fg, 0, true, false, false);
			}
			else
			{
			}*/


			//x,y,char,bg,fg
			// vector.pixel(_x, _y, _ratio = false, _char, _bg, _fg, _styles = 0, _random = true, _end = true, _state = true);
		//	vector.pixel(x1 + x, y1 + y, false, _chars, getBG(), getFG(), 0, false, false, false);
			
//nach rechts/links bei der uhr ziehen sich die strings ueber viele spalten mit nur wenig zeilen..
//und nach oben/unten entsprechend anders herum, viele zeilen, wenig spalten...
//
//und genau hier setzt anti-aliasing an: z.b. zeiger nach "oben" (more/less" hat wenige spalten, viele zeilen,
//d.h. mehrere y-spruenge ueber wenige x-spruenge...
//
//d.h. die verteilung.. also wir muessen die laengeren strings quasi miteinander nochmals verbinden, darueber,
//dass wir sie *NOCH* laenger zeichnen als sowieso schon.. nur dann - je nach ratio/anteils-faktor - mit den
//immer helleren/dunkleren farben (egal ob bg oder gar fg! ;-) ...
//
//als "mitte" haben wir so gesehen den SPRUNG bei den geringen (hier:) spalten. die aendern sich kaum, gehen
//brauchen also laenger durch geringere faktoren-addition, um den naechsten "zyklus", also eine neue koord.
//auf der jew. anderen achse...
//
//somit klar: wir muessen nur gucken, ob 'ratio.x' oder 'ratio.y' geringer/groeszer ist. der geringere wert
//betrifft dann die achse, auf welcher weniger bewegungen sind, also nach oben/unten die x-achse, die laenger
//den ""gleichen"" wert behaelt als die vielen y-achsen-spruenge...
//
//ich stelle mir auch vor, warum auch immer xD .. dass ich die MUL-zyklen-spruenge mit abzaehlen koennte.....
//.. also jedes mal je achse, wenn dort die naechste ganzzahl erreicht ist, der naechste mul-sprung. WOZU!??
//...(TODO);
//
//nun, die anti-aliasing-logik sollte ganz easy sein.. da ich mich entschieden habe, mit jedem schleifen-schritt
//einmal mehr 'vector.line()' zu zeichnen.. AAABER wir muessen sogar MEHR zeichnen nunmehr... also zuerst theor.
//die einfache nutzung der float-anteile, die zw. links/rechts vom (0.5)-mittelpunkt ausgehen wuerde, diese so
//in (0 bis 1) einzudividieren oder so.. und dann blosz 'utility/color::ratio(floating, fg|bg)'; ...
//
//nun aber das "ueberzeichnen"... EVTL SOGAR "LINE-*WIDTH*"-moeglichkeit hier!? das ist auch noch TODO!!! wichtig...
//
//hierzu sorge ich nur dafuer, dass ich auf einer achse den gleichen wert behalte, auf der anderen achse (allgemein
//die mit dne laengern strichen!) eine sub-schleife kurz mal, um .. am ende, kurz vor ganzzahl-umschaltung (WOHL??),
//noch ein paar zusaetzliche pixel weiter zu laufen, wo schrittweise ... und das kann der schleifen-zaehler sein ..
//immer dunklere pixel zu zeichnen...

			/*
			//
			const abs = { x: Math.abs(x), y: Math.abs(y) };

			if((_smooth && (abs.x >= last.x && abs.y >= last.y)) || (!_smooth && (abs.x >= last.x || abs.y >= last.y)))
			{
				//TODO/_threshold...
				result++;
				// vector.pixel = function(_x, _y, _char, _bg, _fg, _styles, _ratio = false, _random = true, _state = true, _end = true)
				// color.ratio[.*](_color, _ratio); .. @ anti-aliasing..
				//
				vector.pixel(x1 + x, y1 + y, _chars, false, false, null, false, true, false);

				//TODO/BALD WEG! ;-D ...
				last.x = Math.ceil(Math.abs(x));
				last.y = Math.ceil(Math.abs(y));
			}
			*/

			//
			if(Math.abs(x) > Math.abs(diff.x) || Math.abs(y) > Math.abs(diff.y))
			{
				break;
			}

			//
			x += ratio.x;
			y += ratio.y;
		}
		
		//
		ansi.reset();

		//
		if(_state)
		{
			ansi.cursor.load();
		}

		return result;
	}

	//
	vector.arc = function()
	{
throw new Error('TODO');
	}

	vector.rect = function()
	{
throw new Error('TODO');
	}

	//
	//TODO/much todo...
	
	//

})();

