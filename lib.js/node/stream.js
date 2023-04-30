if(typeof __STREAM !== 'number') __STREAM = (function()
{
	
	//
	module.exports = stream = require('node:stream');
	Stream = stream.Stream;

	//
	Object.defineProperty(stream, 'isStream', { value: function(_item, _tty = false)
	{
		const result = (_item instanceof Stream);

		if(result && _tty)
		{
			return _item.isTTY;
		}

		return result;
	}});

	Object.defineProperty(stream, 'isReadStream', { value: function(_item, _tty = false)
	{
		const result = (_item instanceof Stream.Readable);

		if(result && _tty)
		{
			return _item.isTTY;
		}

		return result;
	}});

	Object.defineProperty(stream, 'isWriteStream', { value: function(_item, _tty = false)
	{
		const result = (_item instanceof Stream.Writable);

		if(result && _tty)
		{
			return _item.isTTY;
		}

		return result;
	}});

	isStream = stream.isStream;
	isReadStream = stream.isReadStream;
	isWriteStream = stream.isWriteStream;

	//
	
	//
	return Date.now();
	
})();

