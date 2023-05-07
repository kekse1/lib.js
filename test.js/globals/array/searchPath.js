#!/usr/bin/env node.js

const o1 = { abc: { def: 'DEF' } };
const o2 = { abc: { def: 'def' } };
const o3 = {};

const arr = [ o1, o2, o3 ];

const res1 = arr.searchPath('abc.def', 'def');
const res2 = arr.searchPath('abc.def', 'DEF', true);

dir(arr, '(array)');
console.eol(4);
dir(res1, '(array).searchPath("abc.def", "def")');
console.eol();
dir(res2, '(array).searchPath("abc.def", "DEF", true)');

