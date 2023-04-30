#!/usr/bin/env node.js

const a = [];
const b = [ 1 ];
const c = [ 1, 2 ];

const ra1 = Array.isArray(a);
const ra2 = Array.isArray(a, true);
const rb = Array.isArray(b);
const rc1 = Array.isArray(c);
const rc2 = Array.isArray(c, 2);
const rc3 = Array.isArray(c, 3);

dir(a, '(a)');
dir(b, '(b)');
dir(c, '(c)');
console.eol(4);
dir(ra1, 'Array.isArray(a)');
dir(ra2, 'Array.isArray(a, true)');
dir(rb, 'Array.isArray(b)');
dir(rc1, 'Array.isArray(c)');
dir(rc2, 'Array.isArray(c, 2)');
dir(rc3, 'Array.isArray(c, 3)');

