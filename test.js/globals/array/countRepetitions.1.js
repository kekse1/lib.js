#!/usr/bin/env node.js

const AMOUNT = 3;

const arr = [ 2, 4, 8n, 2, 2, 8, 12n, 4, 16, 0, 1, 2, 3, 4 ];
const res = arr.countRepetitions(AMOUNT);

dir(arr, '(array) => .countRepetitions(' + AMOUNT + ')');
console.eol(3);
console.log(res.toString(null) + EOL);

