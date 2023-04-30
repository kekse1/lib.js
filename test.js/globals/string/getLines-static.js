#!/usr/bin/env node.js

const arr = [ '123456', '123', '12345', '123456789', '1234567\n123456789abc', 'abcdefghijklmnopqrstuvwxyz' ];
const res = String.getLines(arr, -3, true);

dir(arr, '(array)');
console.eol(3);
dir(res, 'String.getLines(array, -3, true)');

