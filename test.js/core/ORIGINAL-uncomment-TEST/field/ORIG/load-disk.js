#!/usr/bin/env node.js

const field = FIELD.load('./2k.256');
return dir(field.length, '.length');
field.toBytes(0, 512, (_error, _data) => {
	if(_error)
	{
		return x(_error);
	}

	dir(_data, typeOf(_data) + ' (' + _data.length.toText() + ')');
});

