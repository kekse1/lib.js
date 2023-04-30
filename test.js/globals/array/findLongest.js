#!/usr/bin/env node.js

const arr = [ 'abc', 'x', 123456789, 'vier' ];

const res1 = Array.findLongest(arr, 10);
const res2 = Array.findLongest(arr, false);

dir(arr, '(array)');
console.eol(3);
dir(res1, 'Array.findLongest(array, 10)');
dir(res2, 'Array.findLongest(array, false)');

