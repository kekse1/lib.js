#!/usr/bin/env node.js

var array = [ [ [ [ 1 ], [ 2 ], [ 3 ], [ 4 ] ] ], [ [ 1, 2 ], [ [ [ 3, 4 ] ] ] ] ];
const res0 = array.search(1, 1, 2, 3, 4);
const res1 = array.search(null, 1, 2, 3, 4);

dir(array, '(array)');
console.eol(4);
dir(res0, '(array).search(1, 1, 2, 3, 4)');
console.eol(2);
dir(res1, '(array).search(null, 1, 2, 3, 4)');

