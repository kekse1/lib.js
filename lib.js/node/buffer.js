(function()
{

	//
	Buffer = (module.exports = require('node:buffer')).Buffer;

	//
	Buffer._encoding = [
		'utf8',
		'utf-8',
		'utf16le',
		'utf-16le',
		'latin1',
		'base64',
		'base64url',
		'hex',
		'ascii',
		'binary',
		'ucs2',
		'ucs-2'
	];

	Object.defineProperty(Buffer, 'encoding', { get: function()
	{
		return [ ... Buffer._encoding ];
	}});

	//

})();

