#!/usr/bin/env node.js

const arr = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
const inc = [ 1, 3, 5, 7 ];

dir(arr, '(array)');
console.eol(4);

const res = arr.includeAt(... inc);

dir(res, '(array).includeAt(1, 3, 5, 7)');
console.eol(2);
dir(arr, '(array) after .includeAt()');
console.eol();

