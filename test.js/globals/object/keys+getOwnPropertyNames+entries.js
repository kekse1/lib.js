#!/usr/bin/env node.js

//
const arr = [ 2, 4, 6, 8 ];
arr.eins = 'EINS';
arr.zwei = 'ZWEI';
Object.defineProperty(arr, 'drei', { get: function() { return 'DREI'; } });

//
dir(arr, '(array+object)');
console.eol(3);

//
const res1 = Object.entries(arr);
const res2 = Object.entries(arr, true);

const res3 = Object.keys(arr);
const res4 = Object.keys(arr, true);

const res5 = Object.getOwnPropertyNames(arr);
const res6 = Object.getOwnPropertyNames(arr, true);
const res7 = Object.getOwnPropertyNames(arr, true, true);

//
dir(res1, 'Object.entries(ao)');
dir(res2, 'Object.entries(ao, true)');
console.eol();
dir(res3, 'Object.keys(ao)');
dir(res4, 'Object.keys(ao, true)');
console.eol();
dir(res5, 'Object.getOwnPropertyNames(ao)');
dir(res6, 'Object.getOwnPropertyNames(ao, true)');
dir(res7, 'Object.getOwnPropertyNames(ao, true, true)');

console.eol();

