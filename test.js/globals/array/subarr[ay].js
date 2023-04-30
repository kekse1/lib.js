#!/usr/bin/env node.js

const arr = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

const res1 = arr.subarr(2, 3);
const res2 = arr.subarr(-4, 2);
const res3 = arr.subarr(-4);

const res4 = arr.subarray(-4, -2);
const res5 = arr.subarray(3);
const res6 = arr.subarray(3, 6);

dir(arr, '(array)');
console.eol(4);

dir(res1, '(array).subarr(2, 3) // [2,3,4]');
dir(res2, '(array).subarr(-4, 2) // [6,7]');
dir(res3, '(array).subarr(-4) // [6,7,8,9]');

console.eol(2);

dir(res4, '(array).subarray(-4, -2) // [6,7]');
dir(res5, '(array).subarray(3) // [3,4,5,6,7,8,9]');
dir(res6, '(array).subarray(3, 6) // [3,4,5]');

