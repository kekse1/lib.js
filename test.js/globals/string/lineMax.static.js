#!/usr/bin/env node.js

const arr = [ '123456', '123', '12345', '123456789', '1234567\n123456789abc', 'abcdefghijklmnopqrstuvwxyz' ];
const res1 = String.lineMax(arr);
const res2 = String.lineMax(arr.at(-2));

dir(arr, '(array)');
console.eol(3);
dir(res1, 'String.lineMax(array)');
dir(res2, 'String.lineMax(array.at(-2))');

