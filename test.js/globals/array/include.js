#!/usr/bin/env node.js

const arr = 'dies ist ein test'.split('');

dir(arr, '(array)');
console.eol(4);

const include  = [ ' ', 't', 'tes' ];
const res = arr.include(... include);

dir(res, '(array).include(" ", "t", "tes")');
console.eol(2);
dir(arr, '(array) after .include()');
console.eol();

