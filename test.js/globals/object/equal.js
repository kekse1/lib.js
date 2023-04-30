#!/usr/bin/env node.js

const a = { eins: 'EINS', zwei: { drei: 'DREI', vier: { five: 'FIVE' } } };
const b = { ... a };
const c = { eins: 'eINs', zwei: 'zwei' };
const d = { eins: 'EINS', zwei: { vier: { five: 'FIVE' }, drei: 'DREI' } };
const e = { eins: 'EINS', zwei: { drei: 'drei', vier: { five: 'FIVE' } } };

dir(a, '(a)', true);
dir(b, '(b)', true);
dir(c, '(c)', true);
dir(d, '(d)', true);
dir(e, '(e)', true);

const r1 = Object.equal(a, a);
const r2 = Object.equal(a, b);
const r3 = Object.equal(a, c);
const r4 = Object.equal(a, d);
const r5 = Object.equal(a, d, null);
const r6 = Object.equal(a, e);

console.eol(4);
dir(r1, 'Object.equal(a, a) // true');
dir(r2, 'Object.equal(a, b) // true');
dir(r3, 'Object.equal(a, c) // false');
dir(r4, 'Object.equal(a, d) // false');
dir(r5, 'Object.equal(a, d, null) // true');
dir(r6, 'Object.equal(a, e) // false');

