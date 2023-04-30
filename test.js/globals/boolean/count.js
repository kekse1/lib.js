#!/usr/bin/env node.js

const args = [ true, true, true, false, false, true, true, false ];

const count = Boolean.count(... args);
const countTrue = Boolean.true(... args);
const countFalse = Boolean.false(... args);

console.eol();
dir(args, '(args)');
console.eol(3);
dir(count, 'Boolean.count(... args)');
console.eol(2);
dir(countTrue, 'Boolean.true(... args)');
dir(countFalse, 'Boolean.false(... args)');
console.eol();

