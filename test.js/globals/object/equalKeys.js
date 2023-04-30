#!/usr/bin/env node.js

const a = { eins: 'EINS', zwei: { drei: 'DREI', vier: { five: 'FIVE' } } };
const b = { ... a };
const c = { eins: 'eINs', zwei: 'zwei' };
const d = { eins: 'a', zwei: { drei: 'b', vier: { five: 'f', six: 's' } } };
const e = { EINS: 'AA', ZWEI: 'BB' };
const f = { eins: 'EINS', zwei: { drei: 'DREI' } };
const g = { eins: 'eins', zwei: { drei: 'drei' } };
const h = { eins: 'eins', zwei: { three: 'three' } };

dir(a, '(a)', true);
dir(b, '(b)', true);
dir(c, '(c)', true);
dir(d, '(d)', true);
dir(e, '(e)', true);
dir(f, '(f)', true);
dir(g, '(g)', true);
dir(h, '(h)', true);

const r1 = Object.equalKeys(a, a);
const r2 = Object.equalKeys(a, b);
const r3 = Object.equalKeys(a, b, null);
const r4 = Object.equalKeys(a, c);
const r5 = Object.equalKeys(a, c, null);
const r6 = Object.equalKeys(a, d);
const r7 = Object.equalKeys(a, d, null);
const r8 = Object.equalKeys(d, e);
const r9 = Object.equalKeys(d, e, null);
const ra = Object.equalKeys(f, g, null);
const rb = Object.equalKeys(g, h);
const rc = Object.equalKeys(g, h, null);

console.eol(4);
dir(r1, 'Object.equalKeys(a, a) // true');
dir(r2, 'Object.equalKeys(a, b) // true');
dir(r3, 'Object.equalKeys(a, b, null) // true');
dir(r4, 'Object.equalKeys(a, c) // true');
dir(r5, 'Object.equalKeys(a, c, null) // true');
dir(r6, 'Object.equalKeys(a, d) // true');
dir(r7, 'Object.equalKeys(a, d, null) // false');
dir(r8, 'Object.equalKeys(d, e) // false');
dir(r9, 'Object.equalKeys(d, e, null) // false');
dir(ra, 'Object.equalKeys(f, g, null) // true');
dir(rb, 'Object.equalKeys(g, h) // true');
dir(rc, 'Object.equalKeys(g, h, null) // false');

