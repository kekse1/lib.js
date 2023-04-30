#!/usr/bin/env node.js

const a = [ 'eins', 3.14, 2048n, true, undefined, null, {}, [] ];

const res1 = a.typeOf();
const res2 = a.typeof();

const res3 = a.typeOf('String', 'Number', 'BigInt');
const res4 = a.typeof('string', 'number', 'bigint');

dir(a, '(array)');
console.eol(3);

dir(res1, 'a.typeOf()');
dir(res2, 'a.typeof()');
console.eol();
dir(res3, 'a.typeOf("String", "Number", "BigInt")');
dir(res4, 'a.typeof("string", "number", "bigint")');

