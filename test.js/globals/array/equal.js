#!/usr/bin/env node.js

const a = [ 1, 2, 3, 4 ];
const b = [ 1, 2, 3, 4 ];
const c = [ 2, 1, 3, 4 ];
const d = [ 1, 2, 3, 4 ];
const e = [ 1, 2, 3 ];
const f = [ 1, 2, 3, 4, 5 ];
const g = [ 1, 2, [ 3, 4, [ 5, 6 ] ] ];
const h = [ 1, 2, [ 3, 4, [ 5, 6 ] ] ];
const i = [ 1, 2, [ 3, 4, [ 5, 6, 7 ] ] ];

const r1 = Array.equal(a, b);
const r2 = Array.equal(a, c);
const r3 = Array.equal(a, b, c);
const r4 = Array.equal(a, b, d);
const r5 = Array.equal(a, a, a, a);
const r6 = Array.equal(a, e);
const r7 = Array.equal(a, f);
const r8 = Array.equal(g, h, null);
const r9 = Array.equal(g, i, null);

dir(a, '(a)', true);
dir(b, '(b)', true);
dir(c, '(c)', true);
dir(d, '(d)', true);
dir(e, '(e)', true);
dir(f, '(f)', true);
dir(g, '(g)', true);
dir(h, '(h)', true);
dir(i, '(i)', true);

console.eol(3);

dir(r1, 'Array.equal(a, b) // true');
dir(r2, 'Array.equal(a, c) // false');
dir(r3, 'Array.equal(a, b, c) // false');
dir(r4, 'Array.equal(a, b, d) // true');
dir(r5, 'Array.equal(a, a, a, a) // true');
dir(r6, 'Array.equal(a, e) // false');
dir(r7, 'Array.equal(a, f) // false');
dir(r8, 'Array.equal(g, h) // true');
dir(r9, 'Array.equal(g, i) // false');

