#!/usr/bin/env node.js

const AMOUNT = 3;

const arr = [ 'drei', 'zwei', 'drei', 'eins', 'zwei', 'drei', 'vier', 'drei', 'zwei', 'drei', 'vier' ];
const res = arr.countRepetitions(AMOUNT);

dir(arr, '(array) => .countRepetitions(' + AMOUNT + ')');
console.eol(3);
console.log(res.toString(null) + EOL);

