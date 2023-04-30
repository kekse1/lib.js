#!/usr/bin/env node.js

//
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8 ];

dir(arr, '(array)');
console.eol(6);

const resStarting = arr.removeStarting(2, 3, 1);
const resEnding = arr.removeEnding(7, 6, 8);

//
dir(resStarting, '(array).removeStarting(2, 3, 1)');
console.eol();
dir(resEnding, '(array).removeEnding(7, 6, 8)');
console.eol(4);
dir(arr, '(array) [after .remove*()]');

