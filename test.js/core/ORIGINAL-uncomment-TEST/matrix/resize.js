#!/usr/bin/env node.js

//
const dim1 = [ 3, 3, 3 ];
const dim2 = [ 2, 2, 2, 2 ];

//
const matrix = MATRIX.create(... dim1);

//
console.eol();
dir(matrix.length, '(matrix) = MATRIX.create(3, 3, 3)');
console.eol(2);

//
matrix.dimensions = dim2;
dir(matrix.length, '(matrix).coordinates = [ 2, 2, 2, 2 ]');
console.eol();

