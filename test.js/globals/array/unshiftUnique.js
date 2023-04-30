#!/usr/bin/env node.js

const arr = [ 1, 2, 3, 4, 5, 6, 7, 8 ];

dir(arr, '(array)');

const res = arr.unshiftUnique(2, 4, 6, 8, 10, 12, 14, 16);
dir(res, '(array).unshiftUnique(2, 4, 6, 8, 10, 12, 14, 16)');
dir(arr, '(array) AFTER');

