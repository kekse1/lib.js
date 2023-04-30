#!/usr/bin/env node.js

const arr = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
const or = [ 10, 20, 30, 40 ];

const arr1 = [ ... arr ];
const res1 = arr1.overwrite(or, -4);

const arr2 = [ ... arr ];
const res2 = arr2.overwrite(or, -2, false);

const arr3 = [ ... arr ];
const res3 = arr3.overwrite(or, -2, true);

//
dir(arr, '(array)');
dir(or, '(overwrite array)');
console.eol(4);

dir(res1, '(array).overwrite(or, -4)');
dir(arr1, '(array) after overwrite()');
console.eol(2);

dir(res2, '(array).overwrite(or, -2, false)');
dir(arr2, '(array) after overwrite()');
console.eol(2);

dir(res3, '(array).overwrite(or, -2, true)');
dir(arr3, '(array) after overwrite()');

