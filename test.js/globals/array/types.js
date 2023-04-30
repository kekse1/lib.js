#!/usr/bin/env node.js

const arr = [ 1, 2, 'a', 'b' ];

const res1 = arr.types();
const res2 = arr.types('Number');
const res3 = arr.types('Number', 'BigInt');
const res4 = arr.types('Number', 'String');
const res5 = arr.types('Number', 'String', 'BigInt');

dir(arr, '(array)');
console.eol(3);
dir(res1, '(array).types()');
dir(res2, '(array).types("Number")');
dir(res3, '(array).types("Number", "BigInt")');
dir(res4, '(array).types("Number", "String")');
dir(res5, '(array).types("Number", "String", "BigInt")');

