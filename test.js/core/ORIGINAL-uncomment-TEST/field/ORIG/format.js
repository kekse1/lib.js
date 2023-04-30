#!/usr/bin/env node.js

const field = FIELD.format('./2k.256', '2k');
dir(field.path, field.size);

/*
field.toBytes(0, 512, (_error, _data) => {
	if(_error)
	{
		return x(_error);
	}

	dir(_data, typeOf(_data) + ' (' + _data.length.toText() + ')');
});
 */

