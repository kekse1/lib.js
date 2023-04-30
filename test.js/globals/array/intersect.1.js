#!/usr/bin/env node.js

const arr1 = [ 'eins', 'zwei', 'vier', 'acht' ];
const arr2 = [ 'eins', 'zwei', 'vier' ];
const arr3 = [ 'eins', 'zwei', 'acht' ];
const arr4 = [ 'zwei' ];

const res1 = Array.intersect(arr1, arr2);
const res2 = Array.intersect(arr1, arr3);
const res3 = Array.intersect(arr1, arr2, arr3);
const res4 = Array.intersect(arr1, arr2, arr3, arr4);

dir(arr1, '#1');
dir(arr2, '#2');
dir(arr3, '#3');
dir(arr4, '#4');
console.eol(3);
dir(res1, 'Array.intersect(#1, #2)');
dir(res2, 'Array.intersect(#1, #3)');
dir(res3, 'Array.intersect(#1, #2, #3)');
dir(res4, 'Array.intersect(#1, #2, #3, #4)');

