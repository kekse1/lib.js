#!/usr/bin/env node.js

const arr = [ 1, 2, 3, 4 ];

const res1 = arr.emptyInstance(null);
const res2 = arr.emptyInstance(2);
const res3 = arr.emptyInstance();

dir(arr, '(array)');
console.eol(4);
dir(res1, '(array).emptyInstance(null)');
dir(res2, '(array).emptyInstance(2)');
dir(res3, '(array).emptyInstance()');

