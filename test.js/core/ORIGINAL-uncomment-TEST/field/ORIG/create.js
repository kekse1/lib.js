#!/usr/bin/env node.js

const field = FIELD.create({
	path: './2k.256',
	size: '2k',
	//length: 2000,
	//size:
	radix: 256,
	reverse: false,
	chunk: 8192
});

dir(field.path, field.size);

