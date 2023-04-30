#!/usr/bin/env node.js

const arr1 = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
const arr2 = arr1.clone();

dir(arr2, '(array)s');
console.eol(4);

const res1 = arr1.applyLength(3);
const res2 = arr2.applyLength(-3);

dir(res1, '(#1).applyLength(3)');
dir(res2, '(#2).applyLength(-3)');

console.eol(3);

dir(arr1, 'rest (#1)');
dir(arr2, 'rest (#2)');

console.eol(3);
console.dir('now .applyLength(12 / -12) [greater than was before]');
arr1.applyLength(12, true);
arr2.applyLength(-12, true);

console.eol();
stdout(arr1.toString(2));
console.eol();
stdout(arr2.toString(2));
console.eol();

