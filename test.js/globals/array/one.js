#!/usr/bin/env node.js

const arr1 = [ 1, 2, [ 3, [ 4, [ 5, 6, 7 ], 8 ], 9 ], 10 ];
const arr2 = [ [ [ -1, -2 ], -3 ], -4 ];

const res = Array.one(arr1, arr2, null, undefined);

dir(arr1, '(array #1)');
dir(arr2, '(array #2)');
console.eol(2);
dir(res, 'Array.one(#1, #2, null, undefined');

