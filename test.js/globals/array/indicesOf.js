#!/usr/bin/env node.js

const arr = [ 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2 ];

const res = arr.indicesOf(0, 1);

dir(arr, '(array)');
console.eol(3);
dir(res, '(array).indicesOf(0, 1)');

