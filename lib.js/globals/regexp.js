(function()
{

	//
	Object.defineProperty(RegExp.prototype, '_toString', { value: RegExp.prototype.toString });

	Object.defineProperty(RegExp.prototype, 'toString', { value: function(_options)
	{
		return String.render(this, _options);
	}});

	//
	Object.defineProperty(RegExp, 'isRegExp', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		else try
		{
			for(var i = 0; i < _args.length; ++i)
			{
				if(_args[i].constructor.name !== 'RegExp')
				{
					return false;
				}
			}
		}
		catch(_error)
		{
			return false;
		}

		return true;
	}});

	isRegExp = RegExp.isRegExp;

	//
	Object.defineProperty(RegExp, 'modifier', { get: function()
	{
		return 'igm';
	}});

	Object.defineProperty(RegExp, 'parse', { value: function(_string, _modifiers)
	{
		if(! String.isString(_string))
		{
			return x('Invalid _string argument (expecting non-empty String)');
		}
		else if(typeof _modifiers !== 'string')
		{
			_modifiers = '';
		}

		if(_string[0] === '/')
		{
			_string = _string.substr(1);
		}

		if(_string.last() === '/')
		{
			_string = _string.removeLast();
		}

		const modifier = RegExp.modifier;
		var source = '';
		var modifiers = '';
		var mods = false;

		for(var i = 0; i < _string.length; i++)
		{
			if(_string[i] === '\\')
			{
				if(mods)
				{
					return x('Invalid RegExp');
				}
				else if(i < (_string.length - 1) && _string[i + 1] === '/')
				{
					source += '/';
					i++;
				}
				else
				{
					source += '\\';
				}
			}
			else if(_string[i] === '/')
			{
				if(mods)
				{
					return x('Invalid RegExp');//TODO/TEST, too!!
				}
				else
				{
					mods = true;
				}
			}
			else if(mods)
			{
				if(modifier.indexOf(_string[i]) > -1)
				{
					modifiers += _string[i];

					if(modifiers.length > modifier.length)
					{
						return x('Too many modifiers (got % / #)', null, modifiers.length, modifier.length);
					}
				}
				else
				{
					return x('Invalid modifier \'%\'', null, _string[i]);
				}
			}
			else
			{
				source += _string[i];
			}
		}

		for(var i = 0; i < _modifiers.length; i++)
		{
			if(modifiers.indexOf(_modifiers[i]) === -1)
			{
				modifiers += _modifiers[i];
			}
		}

		return new RegExp(source, modifiers);
	}});

	Object.defineProperty(global, 'parseRegExp', { value: RegExp.parse });

	//
	Object.defineProperty(RegExp.prototype, 'setFlags', { value: function(_flags, _this = false)
	{
		if(typeof _flags !== 'string')
		{
			return x('Missing or invalid _flags argument (expecting String)');
		}

		const flags = _flags.unique();

		if(flags === this.flags)
		{
			return (_this ? this : new RegExp(this.source, this.flags));
		}

		return new RegExp(this.source, flags);
	}});

	Object.defineProperty(RegExp.prototype, 'addFlags', { value: function(_flags, _this = false)
	{
		if(! String.isString(_flags))
		{
			return x('Missing or invalid _flags argument (expecting non-empty String)');
		}

		var flags = this.flags;

		for(var i = 0; i < _flags.length; i++)
		{
			if(flags.indexOf(_flags[i]) === -1)
			{
				flags += _flags[i];
			}
		}

		if(flags === this.flags)
		{
			return (_this ? this : new RegExp(this.source, this.flags));
		}

		return new RegExp(this.source, flags);
	}});

	Object.defineProperty(RegExp.prototype, 'removeFlags', { value: function(_flags, _this = false)
	{
		if(! String.isString(_flags))
		{
			return x('Missing or invalid _flags argument (expecting non-empty String)');
		}

		var flags = '';

		for(var i = 0; i < this.flags.length; i++)
		{
			if(_flags.indexOf(this.flags[i]) === -1)
			{
				flags += this.flags[i];
			}
		}

		if(flags === this.flags)
		{
			if(_this)
			{
				return this;
			}

			return new RegExp(this.source, this.flags);
		}

		return new RegExp(this.source, flags);
	}});

	Object.defineProperty(RegExp.prototype, 'hasFlags', { value: function(_flags)
	{
		if(! String.isString(_flags))
		{
			return x('Invalid _flags argument (expecting non-empty String)');
		}

		const flags = this.flags;

		for(var i = 0; i < _flags.length; i++)
		{
			if(flags.indexOf(_flags[i]) === -1)
			{
				return false;
			}
		}

		return true;
	}});

	//
	Object.defineProperty(RegExp, 'equal', { value: function(... _args)
	{
		if(_args.length === 0)
		{
			return null;
		}
		
		var same = 0;

		for(var i = 0; i < _args.length; ++i)
		{
			if(RegExp.isRegExp(_args[i]))
			{
				if(_args[i] === _args[0])
				{
					++same;
				}

				_args[i] = _args[i].toString();
			}
			else
			{
				return x('Invalid %[%] argument (expecting any amount of % only)', null, '..._args', i, 'RegExp');
			}
		}

		if(same === _args.length)
		{
			return true;
		}
		else if(_args.length === 0)
		{
			return null;
		}
		else if(_args.length === 1)
		{
			return true;
		}
		else if(same > 1)
		{
			_args.uniq();
		}

		for(var i = 1; i < _args.length; ++i)
		{
			if(_args[i] !== _args[0])
			{
				return false;
			}
		}

		return true;
	}});
	
	Object.defineProperty(RegExp.prototype, 'clone', { value: function()
	{
		return new RegExp(this.source, this.flags);
	}});

	//

})();

//
module.exports = RegExp;
