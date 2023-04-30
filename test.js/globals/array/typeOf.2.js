#!/usr/bin/env node.js

const arr1 = [ 'abc', 'def', 4096n ];
const arr2 = [ 'ghi', 3.14, 1024n, 'jkl' ];

const res1 = arr1.typeOf();
const res2 = arr2.typeOf();
const res3 = arr2.typeOf('Number', 'BigInt');
const res4 = arr1.typeOf('Boolean');
const res5 = arr1.typeOf('String');

dir(arr1, '(array #1)');
dir(arr2, '(array #2)');
console.eol(4);
dir(res1, '(array #1).typeOf()');
dir(res2, '(array #2).typeOf()');
console.eol(2);
dir(res3, '(array #2).typeOf("Number", "BigInt")');
dir(res4, '(array #1).typeOf("Boolean")');
dir(res5, '(array #1).typeOf("String")');
console.eol();


