#!/usr/bin/env node.js

const a = [ 1, 2 ];
const b = [ 3, 2, 1 ];
a.one = 'eins';
a.two = 'zwei';
a.tre = 'drei';
b.two = 'ZWEI';
b.one = 'EINS';

dir(a, '(a)');
dir(b, '(b)');
console.eol(3);

const r = Object.intersect(a, b);
dir(r, 'Object.intersect(a, b)');

