module.exports = function _()
{

	//
	const DEFAULT_BRACKETS = true;
	const DEFAULT_TARGET = '_blank';
	
	//
	const DEFAULT_SIZE_PROTOCOL = '75%';
	const DEFAULT_SIZE_PROTOCOL_SEP = '70%';
	const DEFAULT_SIZE_HOSTNAME = '100%';
	const DEFAULT_SIZE_PORT = '85%';
	const DEFAULT_SIZE_PATHNAME = '90%';
	const DEFAULT_SIZE_SEARCH = '80%';
	const DEFAULT_SIZE_HASH = '80%';
	const DEFAULT_SIZE_SYMBOL = '105%';

	//
	const DEFAULT_CODE = ((typeof CODE === 'number' || typeof CODE === 'string') ? CODE : 2);
	CODE = DEFAULT_CODE;

	//
	if(typeof Address === 'undefined')
	{
		require('network/address');
	}

	//
	var _encodeURI, _decodeURI, _encodeURIComponent, _decodeURIComponent;

	if(typeof __URI_XYZ !== 'boolean')
	{
		__URI_XYZ = true;

		_encodeURI = encodeURI;
		_decodeURI = decodeURI;
		_encodeURIComponent = encodeURIComponent;
		_decodeURIComponent = decodeURIComponent;

		encodeURI = function(_string)
		{
			if(typeof _string === 'string')
			{
				return _encodeURI(_string);
			}

			return _string;
		}

		encodeURIComponent = function(_string)
		{
			if(typeof _string === 'string')
			{
				return _encodeURIComponent(_string);
			}

			return _string;
		}

		decodeURI = function(_string)
		{
			if(typeof _string === 'string')
			{
				return _decodeURI(_string);
			}

			return _string;
		}

		decodeURIComponent = function(_string)
		{
			if(typeof _string === 'string')
			{
				return _decodeURIComponent(_string);
			}

			return _string;
		}
	}

	//
	return Uniform = uniform = class Uniform
	{
		constructor(_href, _base, _scheme)
		{
			//
			if(typeof _href === 'string' || typeof _href === 'number')
			{
				if(_href.length === 0)
				{
					this.pathname = '/';
				}
				else
				{
					this.href = _href;
				}
			}
			else if(_href instanceof Uniform) for(var i = 0; i < Uniform.attr.length; i++)
			{
				this[Uniform.attr[i]] = _href[Uniform.attr[i]];
			}
			else
			{
				this.reset();
			}

			//
			if(typeof _base === 'string' && _base.length > 0)
			{
				this.base = _base;
			}

			//
			if(typeof _scheme === 'string' && _scheme.length > 0)
			{
				this.scheme = _scheme;
			}

			//
		}

		static toHTML(_href, _target = DEFAULT_TARGET, _anchor = true)
		{
			const uniform = (Uniform.isUniform(_href) ? _href : Uniform.create(_href));
			return uniform.toHTML(_target, _anchor);
		}

		toHTML(_target = DEFAULT_TARGET, _anchor = true, _brackets = DEFAULT_BRACKETS)
		{
			if(! String.isString(_target))
			{
				_target = null;
			}

			if(typeof _anchor !== 'boolean')
			{
				_anchor = true;
			}

			var result = '<span style="white-space: nowrap;">';

			if(_brackets)
			{
				result += '&lt;';
			}

			if(_anchor)
			{
				result += '<a href="' + this.href + '"';

				if(_target)
				{
					result += ' target="' + _target + '"';
				}

				result += '>';
			}

			//
			var sub;

			if(this.protocol)
			{
				sub = '<span style="font-size: ' + DEFAULT_SIZE_PROTOCOL + ';">' + this.protocol + '</span><span style="font-size: ' + DEFAULT_SIZE_PROTOCOL_SEP + ';">://</span> ';
			}
			else
			{
				sub = '';
			}

			if(this.hostname)
			{
				sub += '<span style="font-size: ' + DEFAULT_SIZE_HOSTNAME + ';">' + this.hostname + '</span>';

				if(this.port)
				{
					sub += '<span style="font-size: ' + DEFAULT_SIZE_PORT + ';"><span style="font-size: ' + DEFAULT_SIZE_SYMBOL + ';">:</span>' + this.port + '</span> ';
				}

				sub += ' ';
			}

			if(this.pathname)
			{
				sub += '<span style="font-size: ' + DEFAULT_SIZE_PATHNAME + ';">' + this.pathname + '</span>';
			}

			if(this.search)
			{
				sub += ' <span style="font-size: ' + DEFAULT_SIZE_SEARCH + ';"><span style="font-size: ' + DEFAULT_SIZE_SYMBOL + ';">?</span>' + this.search.removeFirst() + '</span>';
			}

			if(this.hash)
			{
				sub += ' <span style="font-size: ' + DEFAULT_SIZE_HASH + ';"><span style="font-size: ' + DEFAULT_SIZE_SYMBOL + ';">?</span>' + this.hash.removeFirst() + '</span>';
			}

			//
			if(sub.length === 0)
			{
				result = '';
			}
			else
			{
				result += sub;

				if(_anchor)
				{
					result += '</a>';
				}
			}

			if(_brackets)
			{
				result += '&gt;';
			}

			return result + '</span>';
		}

		static isUniform(_value)
		{
			return (_value instanceof Uniform);
		}

		static isFullUniform(_value, _check_path = true)
		{
			if(_value instanceof Uniform)
			{
				return true;
			}
			else if(String.isString(_value))
			{
				for(var i = 0; i < _value.length; ++i)
				{
					if(_value.at(i, '://'))
					{
						break;
					}
					else if(_value[i] === '/')
					{
						return false;
					}
					else if(_value[i] === ':')
					{
						return false;
					}
					else if(i === (_value.length - 1))
					{
						return false;
					}
				}

				if(_check_path)
				{
					return (path.isValid(_value = Uniform.create(_value).pathname, false) === true, true);//FIXME: last (true) correct, or infinite recursion!??
				}

				return true;
			}

			return false;
		}

		static clone(_uniform)
		{
			if(! (_uniform instanceof Uniform))
			{
				return x('Invalid _uniform argument (not an instance of Uniform)');
			}

			var result = new Uniform();

			for(var i = 0; i < Uniform.attr.length; i++)
			{
				result[Uniform.attr[i]] = _uniform[Uniform.attr[i]];
			}

			return result;
		}

		clone()
		{
			return Uniform.clone(this);
		}

		static get attr()
		{
			return [
				'_ipv6',
				'_type',
				'_protocol',
				'_username',
				'_password',
				'_hostname',
				'_port',
				'_pathname',
				'_search',
				'_hash',
				'_code'
			];
		}

		static get readableAttr()
		{
			return [
				'ipv6',
				'type',
				'protocol',
				'scheme',
				'username',
				'password',
				'auth',
				'host',
				'hostname',
				'port',
				'pathname',
				'base',
				'url',
				'search',
				'hash',
				'code'
			];
		}

		static colorize(_url, _url_only = true)
		{
			if(typeof _url === 'string' && _url.length > 0)
			{
				_url = Uniform.create(_url);
			}
			else if(! (_url instanceof Uniform))
			{
				return x('Invalid _url (expecting a Uniform or an address string)');
			}

			//
			var result = '';

			//
			if(_url_only)
			{
				//
				var pathname = _url.pathname;
				var search = _url.search;
				var hash = _url.hash;

				//
				if(pathname)
				{
					result += pathname.brightWhite.bold;
				}

				if(search)
				{
					search = '?'.brightWhite.bold;

					const args = _url.ARGS;
					const props = Object.keys(args, true, false);

					for(var i = 0; i < props.length; i++)
					{
						if(typeof props[i] === 'number')
						{
							search += args[props[i]].brightYellow;
						}
						else
						{
							search += props[i].brightGreen + '='.brightWhite + args[props[i]].brightYellow;
						}

						if(i < (props.length - 1))
						{
							search += '&'.brightWhite;
						}
					}

					result += search;
				}

				if(hash)
				{
					result += hash.brightCyan;
				}
			}
			else
			{
throw new Error('TODO');
			}

			//
			return result;
		}

		colorize(_url_only = false)
		{
			return Uniform.colorize(this, _url_only);
		}

		split(_object = false)
		{
			var result;

			if(_object)
			{
				result = Object.create(null);

				result.base = this.base;
				result.pathname = this.pathname;
				result.rest = this.rest;
			}
			else
			{
				result = new Array(3);

				result[0] = this.base;
				result[1] = this.pathname;
				result[2] = this.rest;
			}

			return result;
		}

		get rest()
		{
			var result = '';

			if(this.search)
			{
				result += this.search;
			}

			if(this.hash)
			{
				result += this.hash;
			}

			return result;
		}

		get url()
		{
			var result = '';

			if(this.pathname)
			{
				result += this.pathname;
			}

			if(this.search)
			{
				result += this.search;
			}

			if(this.hash)
			{
				result += this.hash;
			}

			return result;
		}

		set url(_value)
		{
			if(typeof _value !== 'string')
			{
				return this.url;
			}
			else if(_value.length === 0)
			{
				this._pathname = null;
				this._search = null;
				this._hash = null;

				return this.url;
			}

			//
			const idx1 = _value.indexOf('?');
			const idx2 = _value.indexOf('#', idx1 + 1);

			if(idx2 > -1)
			{
				this.hash = _value.substr(idx2);
				_value = _value.substr(0, idx2);
			}
			else
			{
				this.hash = null;
			}

			if(idx1 > -1)
			{
				this.search = _value.substr(idx1);
				_value = _value.substr(0, idx1);
			}
			else
			{
				this.search = null;
			}

			if(_value[0] !== '/')
			{
				_value = ('/' + _value);
			}

			this.pathname = _value;

			//
			return this.url;
		}

		get base()
		{
			var result = '';

			if(this.scheme)
			{
				result = this.scheme + '://';
			}

			if(this.host)
			{
				result += this.host;
			}

			return result;
		}

		set base(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				const idx = _value.indexOf('://');

				if(idx > -1)
				{
					this.scheme = _value.substr(0, idx);
					this.host = _value.substr(idx + 3);
				}
				else
				{
					this._type = this._protocol = null;
					this.host = _value;
				}
			}

			return this.base;
		}

		reset()
		{
			for(var attr of Uniform.attr)
			{
				this[attr] = null;
			}
		}

		toJSON(_readable = true)
		{
			return JSON.stringify(this.toObject(_readable));
		}

		toObject(_readable = true)
		{
			const result = Object.create(null);

			if(_readable) for(var attr of Uniform.readableAttr)
			{
				result[attr] = this[attr];
			}
			else for(var attr of Uniform.attr)
			{
				result[attr.substr(1)] = this[attr];
			}

			return result;
		}

		static create(_href_url, _base, _scheme)
		{
			if(typeof _href_url === 'string')// && _href_url.length > 0)
			{
				return new Uniform(_href_url, _base, _scheme);
			}
			else if(_href_url instanceof Uniform)
			{
				return _href_url.clone();
			}

			return x('Invalid argument(s) (expecting String or Uniform)');
		}

		static parse(_href)
		{
			if(typeof _href !== 'string' || _href.length === 0)
			{
				return x('Invalid _href argument (expecting non-empty String)');
			}

			return new Uniform(_href);
		}

		render()
		{
			return this.href;
		}

		toString(_colors = false)
		{
			if(_colors)
			{
				return this.colorize();
			}

			return this.href;
		}

		get href()
		{
			var result = '';

			if(this.hostname)
			{
				if(this.type)
				{
					result += this.type + '://';
				}
				else if(this.protocol)
				{
					result += this.protocol + '://';
				}

				if(this.ipv6)
				{
					result += '[' + this.hostname + ']';
				}
				else
				{
					result += this.hostname;
				}

				if(this.hasPort)
				{
					result += ':' + this.port;
				}
			}

			if(this.pathname)
			{
				if(this.pathname[0] !== '/' && this.pathname[0] !== '.')
				{
					result += '/';
				}

				result += this.pathname;
			}

			if(this.search)
			{
				if(this.search[0] !== '?')
				{
					result += '?';
				}

				result += this.search;
			}

			if(this.hash)
			{
				if(this.hash[0] !== '#')
				{
					result += '#';
				}

				result += this.hash;
			}

			return result;
		}

		set href(_value)
		{
			//
			this.reset();

			//
			if(typeof _value === 'number')
			{
				this.port = _value;
				return this.href;
			}
			else if(typeof _value !== 'string' || _value.length === 0)
			{
				return null;
			}

			//
			if(typeof _value === 'number')
			{
				this.port = _value;
				return this;
			}
			else
			{
				const tmp = Number(_value);

				if(isInt(tmp))
				{
					this.port = tmp;
					return this;
				}
			}

			//
			var open = null;
			var idx;

			if((idx = _value.indexOf('://')) > -1)
			{
				//
				const sub = _value.substr(0, idx).toLowerCase();

				switch(sub)
				{
					case 'tcp':
					case 'tls':
						this.type = sub;
						break;
					default:
						this.protocol = sub;
						break;
				}

				_value = _value.substr(idx + 3);
			}
			//TODO/UNSURE..!?!
			/*else if(_value.indexOf('/') > -1)
			{
				open = 'pathname';
			}*/

			const res = {
				hostname: '',
				port: '',
				pathname: '',
				search: '',
				hash: ''
			};

			if(_value[0] === '[' && (idx = _value.indexOf(']')) > -1)
			{
				this.ipv6 = true;
				res.hostname = _value.substr(1, idx - 1);
				_value = _value.substr(idx + 1);
			}
			else
			{
				this.ipv6 = false;
			}

			switch(_value[0])
			{
				case ':':
					open = 'port';
					break;
				case '.':
				case '/':
					open = 'pathname';
					break;
				case '?':
					open = 'search';
					break;
				case '#':
					open = 'hash';
					break;
				default:
					if(open === null)
					{
						open = 'hostname';
					}
					break;
			}

			if(open === 'hostname' && ((idx = _value.indexOf('@')) > -1))
			{
				//
				this.auth = _value.substr(0, idx);
				_value = _value.substr(idx + 1);
			}

			//
			for(var i = 0; i < _value.length; i++)
			{
				switch(_value[i])
				{
					case ':':
					case ' ':
						if(open === 'hostname')
						{
							open = 'port';
						}
						break;
					case '/':
						if(open === 'port' || open === 'hostname')
						{
							open = 'pathname';
						}
						break;
					case '?':
						if(open === 'hostname' || open === 'port' || open === 'pathname')
						{
							open = 'search';
						}
						break;
					case '#':
						if(open === 'hostname' || open === 'port' || open === 'pathname' || open === 'search')
						{
							open = 'hash';
						}
						break;
				}

				if(open === 'port' && (_value[i] === ':' || _value[i] === ' '))
				{
					continue;
				}

				res[open] += _value[i];
			}

			//
			if(this.protocol === 'file')
			{
				if(res.hostname && !res.port.isInt() && !res.pathname)
				{
					res.pathname = res.hostname;
					res.hostname = '';
				}

				this.ipv6 = null;
			}
			else if(! res.hostname)
			{
				this.ipv6 = null;
			}

			//
			for(var idx in res)
			{
				this[idx] = res[idx];
			}

			//
			return this.href;
		}

		get scheme()
		{
			if(this.protocol)
			{
				return this.protocol;
			}
			else if(this.type)
			{
				return this.type;
			}

			return null;
		}

		set scheme(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				if((_value = _value.toLowerCase()).endsWith('://'))
				{
					_value = _value.removeLast(3);
				}

				switch(_value)
				{
					case 'tcp':
					case 'tls':
						this._protocol = null;
						return this._type = _value;
					default:
						this._type = null;
						return this._protocol = _value;
				}
			}

			return this.scheme;
		}

		get ipv6()
		{
			return this._ipv6;
		}

		set ipv6(_value)
		{
			if(typeof _value === 'boolean')
			{
				return this._ipv6 = _value;
			}

			return this._ipv6 = null;
		}

		get type()
		{
			return this._type;
		}

		set type(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				switch(_value = _value.toLowerCase())
				{
					case 'tcp':
					case 'tls':
						return this._type = _value;
				}
			}

			return this._type = null;
		}

		get protocol()
		{
			return this._protocol;
		}

		set protocol(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				return this._protocol = (_value.toLowerCase().removeEnding('://').removeEnding(':'));
			}

			return this._protocol = null;
		}

		get auth()
		{
			var result = null;

			if(this.username)
			{
				result = this.username;

				if(this.password)
				{
					result += ':' + this.password;
				}
			}

			return result;
		}

		set auth(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				const [ user, pass ] = _value.split(':', 2, true);

				if(user)
				{
					this._username = user;

					if(pass)
					{
						this._password = pass;
						return this._username + ':' + this._password;
					}
					else
					{
						return this._username;
					}
				}
			}

			return this._username = this._password = null;
		}

		get username()
		{
			return this._username;
		}

		set username(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				return this._username = _value;
			}

			return this._username = null;
		}

		get password()
		{
			return this._password;
		}

		set password(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				return this._password = _value;
			}

			return this._password = null;
		}

		get isLocalhost()
		{
			if(! this.hostname)
			{
				return null;
			}

			return require('network/address').isLocalhost(this.hostname);
		}

		get hostname()
		{
			return decodeURI(this._hostname);
		}

		set hostname(_value)
		{
			if(typeof _value === 'string' && _value.length > 0 && Address.isHostname(_value = _value.toLowerCase(), true))
			{
				return this._hostname = encodeURI(_value);
			}

			return this._hostname = null;
		}

		get host()
		{
			var result = '';

			if(this.hostname)
			{
				result += this.hostname;
			}

			if(this.hasPort)
			{
				result += ':' + this.port;
			}

			return result;
		}

		set host(_value)
		{
			if(typeof _value === 'string' && _value.length > 0 && Address.isHost(_value = _value.toLowerCase(), true))
			{
				const split = (_value = _value.toLowerCase()).split(':', 2, true);

				if(split.length === 2 && split[1].length > 0 && split[1].isInt())
				{
					this._port = parseInt(split[1]);
				}
				else
				{
					this._port = null;
				}

				if(split[0].length > 0)
				{
					this._hostname = encodeURI(split[0].toLowerCase());
				}
				else
				{
					this._hostname = null;
				}
			}
			else
			{
				this._host = this._port = null;
			}

			return this.host;
		}

		get isLocalhost()
		{
			return Address.isLocalhost(this.hostname);
		}

		get hasPort()
		{
			return (typeof this.port === 'number');
		}

		get port()
		{
			if(typeof this._port === 'number')
			{
				if(this._port < -65536 || this._port >= 65536)
				{
					this._port = null;
				}
			}

			return this._port;
		}

		set port(_value)
		{
			if(typeof _value === 'string' && _value.length > 0 && _value.isInt())
			{
				_value = parseInt(_value);
			}

			if(typeof _value === 'number' && _value >= -65536 && _value < 65536)
			{
				return this._port = _value;
			}

			return this._port = null;
		}

		get pathname()
		{
			return decodeURI(this._pathname);
		}

		set pathname(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				_value = '/' + _value.removeStarting('/');

				if(path.isValid((_value = encodeURI(path.normalize(_value)))))
				{
					return this._pathname = _value;
				}
			}

			return this._pathname = null;
		}

		get search()
		{
			if(this.isEncoded)
			{
				return decodeURIComponent(this.decode(this._search));
			}

			return decodeURIComponent(this._search);
		}

		set search(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				if((_value = ('?' + _value.removeStarting('?'))).length === 1)
				{
					return this._search = null;
				}
				else
				{
					_value = _value.replaces('&&', '&');
				}

				return this._search = encodeURIComponent(_value);
			}

			return this._search = null;
		}

		get hash()
		{
			return decodeURIComponent(this._hash);
		}

		set hash(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				if((_value = ('#' + _value.removeStarting('#'))).length === 1)
				{
					return this._hash = null;
				}

				return this._hash = encodeURIComponent(_value);
			}

			return this._hash = null;
		}

		get argv()
		{
			if(! this.search)
			{
				return [];
			}

			const search = this.search.substr(1);
			const result = search.split('&');

			for(var i = 0; i < result.length; i++)
			{
				result[i] = String.parse(decodeURIComponent(result[i]));
			}

			return result;
		}

		set argv(_value)
		{
			if(! Array.isArray(_value))
			{
				return this._search = null;
			}
			else if(_value.length === 0)
			{
				return this._search = null;
			}

			var result = '';

			for(var i = 0; i < _value.length; i++)
			{
				var [ key, value ] = String.render(_value[i]).split('=', 2, true);

				key = encodeURIComponent(key);
				value = encodeURIComponent(value);

				if(value)
				{
					value = String.render(key) + '=' + String.render(value);
				}
				else
				{
					value = String.render(key);
				}

				result += '&' + value;
			}

			return this._search = '?' + result.substr(1);
		}

		get args()
		{
			if(! this.search)
			{
				return [];
			}

			const argv = this.argv;
			const result = [];

			for(var i = 0, j = 0; i < argv.length; i++)
			{
				var [ key, value ] = argv[i].split('=', 2, true);

				key = decodeURIComponent(key);

				if(typeof value === 'undefined')
				{
					if(typeof result[key] === 'number')
					{
						value = result[key] + 1;
					}
					else
					{
						value = 1;
					}

					result[j++] = key;
				}
				else
				{
					value = String.parse(decodeURIComponent(value));
				}

				result[key] = value;
			}

			return result;
		}

		set args(_value)
		{
			if(! Object.isObject(_value))
			{
				return this._search = null;
			}

			const array = [];
			var count = 0;

			if(Array.isArray(_value))
			{
				count = _value.length;

				for(var i = 0, j = 0; i < _value.length; i++)
				{
					array[j++] = encodeURIComponent(String.render(_value[i]));
				}

				_value.length = 0;
			}

			for(var idx in _value)
			{
				if(idx !== 'length')
				{
					array.push(encodeURIComponent(idx) + '=' + encodeURIComponent(String.render(_value[idx])));
					count++;
				}
			}

			if(count === 0)
			{
				return this._search = null;
			}

			return this.argv = array;
		}

		get ARGS()
		{
			return Uniform.cleanArgs(this.args);
		}

		static cleanArgs(_args)
		{
			if(! Object.isObject(_args))
			{
				return x('Invalid _args argument (expecting some Object or Array)');
			}

			for(var i = 0; i < _args.length; i++)
			{
				delete _args[_args[i]];
			}

			return _args;
		}

		static parseSearch(_search)
		{
			var q = '';
			var r = '';
			var open = false;

			for(var i = 0; i < _search.length; i++)
			{
				if(open)
				{
					if(_search[i] === '&')
					{
						open = false;
					}
					else
					{
						q += _search[i];
					}
				}
				else
				{
					if(_search.substr(i, 3) === '?q=' || _search.substr(i, 3) === '&q=')
					{
						open = true;
						i += 2;
					}
					else
					{
						r += _search[i];
					}
				}
			}

			return [ q, r ];
		}

		static encodeString(_string, _code = DEFAULT_CODE)
		{
			if(typeof _string !== 'string')
			{
				return null;
			}

			return (_string.toBigInt().toString(_code));
		}

		static decodeString(_string, _code = DEFAULT_CODE)
		{
			if(typeof _string !== 'string')
			{
				return null;
			}

			return String.fromBigInt(parseBigInt(_string, _code));
		}

		static mergeSearch(_string)
		{
			const map = [];
			const split = _string.removeStarting('?').split('&');
			var key, value;

			for(var i = 0; i < split.length; i++)
			{
				if(split[i].length === 0)
				{
					continue;
				}

				[ key, value ] = split[i].split('=', 2, true);

				if(! (key in map))
				{
					if(typeof value === 'undefined')
					{
						map[key] = 1;
					}
					else
					{
						map[key] = encodeURIComponent(value);
					}
				}
				else if(typeof map[key] === 'number')
				{
					if(typeof value === 'undefined')
					{
						map[key]++;
					}
					else
					{
						map[key] = encodeURIComponent(value);
					}
				}
				else
				{
					if(typeof value === 'undefined')
					{
						map[key] = 1;
					}
					else
					{
						map[key] = encodeURIComponent(value);
					}
				}
			}

			//
			var result = '?';

			for(var idx in map)
			{
				result += idx + '=' + map[idx] + '&';
			}

			return result.removeLast();
		}

		static encode(_search, _code = DEFAULT_CODE)
		{
			if(typeof _search !== 'string')
			{
				return null;
			}

			const [ q, r ] = Uniform.parseSearch(_search);
			return ('?q=' + Uniform.encodeString(Uniform.mergeSearch(Uniform.decodeString(q, _code) + '&' + r), _code));
		}

		static decode(_search, _code = DEFAULT_CODE)
		{
			if(typeof _search !== 'string')
			{
				return null;
			}

			const [ q, r ] = Uniform.parseSearch(_search);
			return Uniform.mergeSearch(Uniform.decodeString(q, _code) + '&' + r);
		}

		static hasEncoded(_search)
		{
			if(typeof _search !== 'string')
			{
				return null;
			}

			const [ q, r ] = Uniform.parseSearch(_search);
			return (q.length > 0);
		}

		static isEncoded(_search)
		{
			if(typeof _search !== 'string')
			{
				return null;
			}

			const [ q, r ] = Uniform.parseSearch(_search);
			return (q.length > 0 && r.length === 0);
		}

		get isEncoded()
		{
			return Uniform.isEncoded(this._search);
		}

		get hasEncoded()
		{
			return Uniform.hasEncoded(this._search);
		}

		encode(_code = this.code)
		{
			return Uniform.encode(this._search, _code);
		}

		decode(_code = this.code)
		{
			return Uniform.decode(this._search, _code);
		}

		get code()
		{
			if(typeof this._code === 'number')
			{
				return this._code;
			}

			return DEFAULT_CODE;
		}

		set code(_value)
		{
			if(typeof _value === 'number' && _value >= -257 && _value <= 256)
			{
				return this._code = _value;
			}
			else
			{
				delete this._code;
			}

			return this.code;
		}
	}

	//

}
