#!/usr/bin/env node.js

//
const dim = [ 2, 2, 2, 2 ];

//
const matrix = MATRIX.create(Uint32Array.name, dim);

dir(matrix.array, 'matrix.array');

for(var i = 0; i < matrix.arrayLength; i++)
{
	matrix.set(i * 2, i);
}

dir(matrix.array, 'matrix.array after adaption');

//
matrix.arrayType = Uint8Array;

//
dir(matrix.array, 'matrix.array after .arrayType = Uint8Array..');

//
matrix.arrayType = 'Array';

dir(matrix.array, 'matrix.array after .arrayType = "Array"');

//
matrix.arrayType = 'Int16Array';

dir(matrix.array, 'matrix.array after .arrayType = "Int16Array"');

