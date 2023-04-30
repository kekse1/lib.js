#!/usr/bin/env node.js

const arr = [ 'eins', 'zwei', 3 ];

const res1 = arr.only('eins');
const res2 = arr.only('eins', 'zwei', 3, 4, 5);

dir(arr, '(array)');
console.eol(3);
dir(res1, '(array).only("eins")');
dir(res2, '(array).only("eins", "zwei", 3, 4, 5)');

