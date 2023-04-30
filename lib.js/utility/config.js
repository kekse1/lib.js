// diesmal bitte NUR MIT STRINGS arbeiten, statt einem stack o.ae..
//
// sprich, die pfade direkt zusammen setzen zu passenden strings, und das eine objekt benutzen dafuer.

(function()
{

	//
	const DEFAULT_FLAT = true;
	const DEFAULT_RENDER_FLAT = false;

	//
	Config = config = module.exports = class Configuration extends require('core/item')//was 'core/node'...
	{
		constructor(_options)
		{
			super(_options);
		}

		get renderFlat()
		{
			if(typeof this.options.renderFlat === 'boolean')
			{
				return this.options.renderFlat;
			}

			return DEFAULT_RENDER_FLAT;
		}

		set renderFlat(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.renderFlat = _value;
			}
			else
			{
				delete this.options.renderFlat;
			}

			return this.renderFlat;
		}

		get flat()
		{
			if(typeof this.options.flat === 'boolean')
			{
				return this.options.flat;
			}

			return DEFAULT_FLAT;
		}

		set flat(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this.options.flat = _value;
			}
			else
			{
				delete this.options.flat;
			}

			return this.flat;
		}

		get path()
		{
			if(typeof this.options.path === 'string')
			{
				return this.options.path;
			}

			return null;
		}

		set path(_value)
		{
			if(typeof _value === 'string' && _value.length > 0 && fs.exists.file(_value = path.resolve(_value), true))
			{
				return this.options.path = _value;
			}
			else
			{
				delete this.options.path;
			}

			return this.path;
		}

		static create(_options, _path)
		{
			const options = Object.assign(_options);

			if(typeof _path === 'string' && _path.length > 0)
			{
				options.path = _path;
			}

			return new this(options);
		}

		static parse(_data)
		{
			if(typeof _data === 'undefined' || _data === null)
			{
				return null;
			}
			else
			{
				if((_data = dataToString(_data)).length === 0)
				{
					return null;
				}
			}

			//
			const result = Object.create(null);

			//
throw new Error('TODO');

			//
			return result
		}

		static render(_object, _flat = DEFAULT_RENDER_FLAT)
		{
			if(! Object.isObject(_object))
			{
				return null;
			}

			//
			var result = '';

			//
			if(_flat)
			{
				for(var idx in _object)
				{
					result += idx + ' = ' + String.render(_object[idx], { quote: '"' }) + ';' + EOL;
				}
			}
			else
			{
				throw new Error('TODO');
			}

			//
			return result;
		}

		render(_flat = this.renderFlat)
		{
			return Configuration.render(Configuration.parse(this.read()), _flat);
		}

		parse(_path = this.path)
		{
			return Configuration.parse(this.read(_path));
		}

		read(_path = this.path, _throw = false)
		{
			if(fs.exists.file(_path, true))
			{
				return fs.readFileSync(_path, { encoding });
			}
			else if(_throw)
			{
				return x('File \'' + _path + '\' not specified or not found');
			}

			return null;
		}

		write(_path = this.path, _data = null)
		{
			if(Object.isObject(_data))
			{
				_data = Configuration.render(_data);
			}
			else if((_data = dataToString(_data)).length === 0)
			{
				return null;
			}

			return fs.writeFileSync(_path, data);
		}
	}

	//

})();

