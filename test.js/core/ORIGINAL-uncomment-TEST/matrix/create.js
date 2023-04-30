#!/usr/bin/env node.js

//
const dim = [ 2, 2, 2, 2 ];

//
const matrix1 = MATRIX.create(Uint32Array.name, dim);
const matrix2 = MATRIX.create('Uint8Array', ... dim);
const matrix3 = MATRIX.create(dim);

//
dir(dim, '(dimensions)');
console.eol(3);
dir(typeOf(matrix1.array), 'MATRIX.create(true, [ 2, 2, 2, 2 ])');
dir(typeOf(matrix2.array), 'MATRIX.create(false, ... [ 2, 2, 2, 2 ])');
dir(typeOf(matrix3.array), 'MATRIX.create(dim)');

//
console.eol(7);
const items = [ matrix1, matrix2, matrix3 ];

for(const item of items)
{
	dir(item.array, '(item).array');
}

