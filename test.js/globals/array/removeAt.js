#!/usr/bin/env node.js

const arr = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
const remove = [ 6, 8, 4, 2 ];

dir(arr, '(array)');

//sowohl arrayS als auch multiple numbers are supported..
const res = arr.removeAt(... remove);

dir(arr, '(array).removeAt(2, 4, 6, 8)');
dir(res, 'removeAt()-result-array w/ removed values');

