#!/usr/bin/env node.js

const arr = [ 1, 2, 3, 4, 5, 6, 7, 8 ];

const res1 = arr.indexOf(3, 3);
const res2 = arr.indexOf(3, 2);
const res3 = arr.lastIndexOf(3, 1);
const res4 = arr.lastIndexOf(3);

dir(arr, '(array)');
console.eol(4);
dir(res1, '(array).indexOf(3, 3)');
dir(res2, '(array).indexOf(3, 2)');
dir(res3, '(array).lastIndexOf(3, 1)');
dir(res4, '(array).lastIndexOf(3)');

