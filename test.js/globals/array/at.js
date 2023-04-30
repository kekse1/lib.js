#!/usr/bin/env node.js

const arr = [ 2, 4, 6, 8 ];
const res1 = arr.at(-1);
const res2 = arr.at(-2, 4);
const res3 = arr.at(-2, 6, 8);
const res4 = arr.at(-2, 6, 8, 10);
const res5 = arr.at(1, 4, 6, 8);
const res6 = arr.at(1, 4, 6, 9);

dir(arr, '(array)');
console.eol(3);
dir(res1, '(array).at(-1)');
dir(res2, '(array).at(-2, 4)');
dir(res3, '(array).at(-2, 6, 8)');
dir(res4, '(array).at(-2, 6, 8, 10)');
dir(res5, '(array).at(1, 4, 6, 8)');
dir(res6, '(array).at(1, 4, 6, 9)');
console.eol();

