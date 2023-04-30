#!/usr/bin/env node.js

const matrix = MATRIX.create(2, 2, 2);

dir(matrix.array, 'MATRIX.create(2, 2, 2)');

for(var i = 0, j = 1; i < matrix.length; i++)
{
	matrix.set(j *= 2, i);
}

dir(matrix.array, 'MATRIX.create(2, 2, 2) w/ some (matrix).set(..)');

matrix.arrayType = 'Uint8Array';//Uint8Array is possible, too.. so not as string ;-)

dir(matrix.array, '(matrix).arrayType = "Uint8Array"');

matrix.resetArray();

dir(matrix.array, '(matrix).resetArray()');

matrix.arrayType = Array;

//bemerke: 0 werden uebernommen, nicht mehr "unset items"... (ununterscheidbarkeit theor..);
dir(matrix.array, '(matrix).arrayType = Array');

