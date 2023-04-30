#!/usr/bin/env node.js

const a = NaN;
const b = Infinity;
const c = 3.14;
const d = 1024;

const ra1 = a.type;
const rb1 = b.type;
const rc1 = c.type;
const rd1 = d.type;

const ra2 = Number.type(a);
const rb2 = Number.type(b);
const rc2 = Number.type(c);
const rd2 = Number.type(d);

const gg1 = Number.type(null);
const gg2 = Number.type('3.14');

console.eol();
dir(a, '(a)');
dir(b, '(b)');
dir(c, '(c)');
dir(d, '(d)');
console.eol(4);
dir(ra1, '(a).type');
dir(rb1, '(b).type');
dir(rc1, '(c).type');
dir(rd1, '(d).type');
console.eol(2);
dir(ra2, 'Number.type(a)');
dir(rb2, 'Number.type(b)');
dir(rc2, 'Number.type(c)');
dir(rd2, 'Number.type(d)');
console.eol(3);
dir(gg1, 'Number.type(null)');
dir(gg2, 'Number.type("3.14")');
console.eol();

