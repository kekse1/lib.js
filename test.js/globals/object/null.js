#!/usr/bin/env node.js

const tmp = Object.null();

dir(tmp, 'Object.null()');
console.eol(4);

const o1 = { 'eins': 'EINS' };
const o2 = { 'zwei': 'ZWEI' };

dir(o1, '(o1)');
dir(o2, '(o2)');
console.eol(3);

const r = Object.null(o1, o2);
dir(r, 'Object.null(o1, o2)');

