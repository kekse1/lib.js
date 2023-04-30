#!/usr/bin/env node.js

//
const dim = [ 2, 2, 2, 2 ];
const RANDOMS = 4;

//
const matrix = MATRIX.create(dim);//(... dim) possible, too ;-)

for(var i = 0, j = 1; i < matrix.length; i++)
{
	matrix.set(j, i);
	j *= 2;
}

dir(matrix.array, 'MATRIX.create(2, 2, 2, 2) w/ some matrix.set()');

matrix.setAt(1, 1, 1, 1);

dir(matrix.array, 'matrix.setAt(1, 1, 1, 1)');

const got = matrix.getAt(1, 1, 1);

dir(got, 'matrix.getAt(1, 1, 1)');

