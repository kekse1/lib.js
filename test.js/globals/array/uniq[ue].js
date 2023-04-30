#!/usr/bin/env node.js

const arr = [ 1, 0, 2, 1, 3, 2, 4, 3, 1, 2, 3, 4, 5, 6, 7, 8 ];

dir(arr, '(array)');

console.eol(6);
const res1 = arr.unique();

dir(arr, '(array) AFTER .unique()');
dir(res1, '(array).unique()');
console.eol(3);

const res2 = arr.uniq();

dir(arr, '(array) AFTER .uniq()');
dir(res2, '(array).uniq()');
console.eol(3);

const res3 = arr.uniq();
dir(arr, '(array) AFTER SECOND .uniq()');
dir(res3, '(array).uniq() the SECOND TIME');

