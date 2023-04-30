#!/usr/bin/env node.js

const o = { a: 'A', b: 'B', c: 'C', d: 'D' };

const r1 = o.missing('a', 'b', 'c', 'd');
const r2 = o.missing('a', 'e', 'f');

dir(o, '(object)');
console.eol(2);
dir(r1, '(object).missing("a", "b", "c", "d")');
dir(r2, '(object).missing("a", "e", "f")');
console.eol(3);
dir([].missing('concat'), '[].missing("concat")');
dir([].missing('concat', false), '[].missing("concat", true)');
console.eol();

