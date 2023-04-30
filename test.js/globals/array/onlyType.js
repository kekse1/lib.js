#!/usr/bin/env node.js

const arr1 = [ 'abc', 'def' ];
const arr2 = [ 'ghi', 3.14 ];

const res1 = arr1.onlyType();
const res2 = arr2.onlyType();
const res3 = arr2.onlyType('Number');
const res4 = arr1.onlyType('String');
const res5 = arr2.onlyType('Number', 'String');
const res6 = arr1.onlyType('Number', 'String');

dir(arr1, '(array #1)');
dir(arr2, '(array #2)');
console.eol(4);
dir(res1, '(array #1).onlyType()');
dir(res2, '(array #2).onlyType()');
dir(res3, '(array #2).onlyType("Number")');
dir(res4, '(array #1).onlyType("String")');
dir(res5, '(array #2).onlyType("Number", "String")');
dir(res6, '(array #1).onlyType("Number", "String")');

