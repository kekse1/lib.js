(function()
{

	//
	const DEFAULT_DHPARAM = '/etc/dhparam.pem';
	const DEFAULT_KEYS = '/etc/letsencrypt/live/*/privkey.pem';
	const DEFAULT_CERTS = '/etc/letsencrypt/live/*/fullchain.pem';

	//
	SNI = module.exports = class SNI extends NODE
	{
		constructor(_options)
		{
			super(_options);
		}

		get dhparam()
		{
			if(typeof this.options.dhparam === 'string' && this.options.dhparam.length > 0)
			{
				return this.options.dhparam;
			}

			return DEFAULT_DHPARAM;
		}

		set dhparam(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				return this.options.dhparam = _value;
			}
			else
			{
				delete this.options.dhparam;
			}

			return this.dhparam;
		}

		get keys()
		{
			if(typeof this.options.keys === 'string' && this.options.keys.length > 0)
			{
				return this.options.keys;
			}

			return DEFAULT_KEYS;
		}

		set keys(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				return this.options.keys = _value;
			}
			else
			{
				delete this.options.keys;
			}

			return this.keys;
		}

		get certs()
		{
			if(typeof this.options.certs === 'string' && this.options.certs.length > 0)
			{
				return this.options.certs;
			}

			return DEFAULT_CERTS;
		}

		set certs(_value)
		{
			if(typeof _value === 'string' && _value.length > 0)
			{
				return this.options.certs = _value;
			}
			else
			{
				delete this.options.certs;
			}

			return this.certs;
		}

		static getPath(_path, _domain)
		{
			if(typeof _path !== 'string' || typeof _domain !== 'string')
			{
				return x('Both arguments need to be Strings');
			}

			var result = '';

			for(var i = 0; i < _path.length; i++)
			{
				if(_path[i] === '*')
				{
					if(i >= _path.length && _path[i + 1] === '*')
					{
						result += '*';
						i++;
					}
					else
					{
						result += _domain;
					}
				}
				else
				{
					result += _path[i];
				}
			}

			return result;
		}

		getDhParamPath(_domain)
		{
			const result = SNI.getPath(this.dhparam, _domain);

			if(fs.exists.file(result, true))
			{
				return result;
			}

			return null;
		}

		getKeyPath(_domain)
		{
			const result = SNI.getPath(this.keys, _domain);

			if(fs.exists.file(result, true))
			{
				return result;
			}

			return null;
		}

		getCertPath(_domain)
		{
			const result = SNI.getPath(this.certs, _domain);

			if(fs.exists.file(result, true))
			{
				return result;
			}

			return null;
		}

		hasDomain(_domain)
		{
			if(! this.getKeyPath(_domain))
			{
				return false;
			}

			if(! this.getCertPath(_domain))
			{
				return false;
			}

			return true;
		}

		SNICallback(_domain, _callback, _callback_error, _server = this)
		{
			var ctx, error;

			if(this.hasDomain(_domain))
			{
				try
				{
					ctx = this.getSecureContext(_domain);
					error = null;
				}
				catch(_error)
				{
					ctx = null;
					error = _error;
				}
			}
			else
			{
				ctx = null;
				error = new Error(`Domain '${_domain}' not available`);
			}

			if(error || ctx === null)
			{
				if(error instanceof Error)
				{
					error.domain = _domain;
				}
				else if(!error && ctx === null)
				{
					error = true;
				}

				if(_callback_error)
				{
					_callback_error.call(_server, error, _domain, ctx, this);
				}

				if(_callback)
				{
					_callback();
				}
			}
			else
			{
				if(_callback)
				{
					_callback(null, ctx);
				}

				return ctx;
			}
		}

		getSecureContext(_domain)
		{
			if(! this.hasDomain(_domain))
			{
				return null;
			}

			const dh = this.getDhParamPath(_domain);

			return tls.createSecureContext({
				key: fs.readFileSync(this.getKeyPath(_domain)),
				cert: fs.readFileSync(this.getCertPath(_domain)),
				dhparam: (dh ? fs.readFileSync(dh) : null)
			});
		}

		getSocketOptions(_options, _callback_error, _server = this)
		{
			return Object.assign(_options, {
				SNICallback: this.getSNICallback(_callback_error, _server)
			});
		}

		getSNICallback(_callback_error, _server = this)
		{
			return (_domain, _callback) => {
				return this.SNICallback.call(this, _domain, _callback, _callback_error, _server);
			};
		}
	}

	//
	
})();

