#!/usr/bin/env node.js

const arr = [ 1, 2, 3.14, 4096n, true, null, undefined, '123' ];

dir(arr, '(array)');
console.eol(2);

const res = arr.removeType('Number', 'BigInt');

dir(res, '(array).removeType("Number", "BigInt")');
console.eol();
dir(arr, '(array) after .removeType(...)');

