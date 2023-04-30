#!/usr/bin/env node.js

//
const matrix = MATRIX.create(3, 3);

//
for(var y = 0, i = 0; y < 3; y++)
{
	for(var x = 0; x < 3; x++, i++)
	{
		matrix.setAt(i, x, y);
	}
}

//
dir(matrix.array);
console.eol(7);

//
process.stdio[1].write(matrix.toTableString(0));

