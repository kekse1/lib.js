#!/usr/bin/env node.js

const a = [ 1, 2, [ 3, 4, [ 5, 6, 7, [ 8, 9 ] ] ] ];
const b = [ 1, 2, [ 3, 4, [ 5, 6, 7, [ 8, 9 ] ] ] ];
const c = [ 1, 2, [ 3, 4, [ 5, 6, 7, [ 'A', 'B' ] ] ] ];

const r1 = Array.equal(a, b);
const r2 = Array.equal(a, b, 1);
const r3 = Array.equal(a, b, 2);
const r4 = Array.equal(a, b, 3);
const r5 = Array.equal(a, b, null);
const r6 = Array.equal(a, c);
const r7 = Array.equal(a, c, null);

dir(a, '(array #1)', true);
dir(b, '(array #2)', true);
dir(c, '(array #3)', true);
console.eol(3);
dir(r1, 'Array.equal(a, b) // false');
dir(r2, 'Array.equal(a, b, 1) // false');
dir(r3, 'Array.equal(a, b, 2) // false');
dir(r4, 'Array.equal(a, b, 3) // true');
dir(r5, 'Array.equal(a, b, null) // true');
console.eol();
dir(r6, 'Array.equal(a, c) // false');
dir(r7, 'Array.equal(a, c, null) // false');

