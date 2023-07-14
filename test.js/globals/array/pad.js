#!/usr/bin/env node.js

const arr = [ ansi.bold('ein test') + ' .... ', '', 'drei' ];
const len = 25;

dir(arr, '(array)');
console.eol(4);
dir(arr.pad(len, '...', true));

