#!/usr/bin/env node.js

const arr1 = [ 1, 2, 3, 4 ];
const arr2 = [ 2, 4 ];

dir(arr1, 'array #1');
dir(arr2, 'array #2');

const res = arr1.setValue(arr2, true);

console.eol(4);
dir(res, '(array #1).setValue((array #2), true)');
console.eol(4);

dir(arr1, 'array #1');
dir(arr2, 'array #2');


