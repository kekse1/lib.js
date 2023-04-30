#!/usr/bin/env node.js

const arr = [ 'eins\n\ndrei', 'vier\n' ];
const res1 = String.lineCount(arr);
const res2 = String.lineCount(arr[0]);

dir(arr, '(array)');
console.eol(3);
dir(res1, 'String.lineCount(array)');
dir(res2, 'String.lineCount(array[0])');

