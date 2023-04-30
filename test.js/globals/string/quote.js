#!/usr/bin/env node.js

const str = '[0] -> ``\n[1] = \'\'\'\n[2] = """"';

const res1 = str.quote(true);
const res2 = str.quote('"');
const res3 = str.quote('\'');
const res4 = str.quote('`');
const res5 = str.quote('-');

console.log(res1);
console.eol(2);
console.log(res2);
console.log(res3);
console.log(res4);
console.eol(2);
console.log(res5);

console.eol(2);
dir(String.quotes);

