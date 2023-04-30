#!/usr/bin/env node.js

const arr = 'dies ist ein test'.split('');
const exclude  = [ ' ', 't', 'tes' ];

dir(arr, '(array)');
console.eol(4);

const res = arr.exclude(... exclude);

dir(res, '(array).exclude(" ", "t", "tes")');
console.eol(2);
dir(arr, '(array) after .exclude()');
console.eol();

