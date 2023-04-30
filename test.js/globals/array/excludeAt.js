#!/usr/bin/env node.js

const arr = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
const exc = [ 1, 3, 5, 7 ];

dir(arr, '(array)');
console.eol(4);

const res = arr.excludeAt(... exc);

dir(res, '(array).excludeAt(1, 3, 5, 7)');
console.eol(2);
dir(arr, '(array) after .excludeAt()');
console.eol();

