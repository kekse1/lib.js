#!/usr/bin/env node.js

const a = /abc/;
const b = /abc/;

const r1 = Object.same(a, a, a);
const r2 = Object.same(a, a, b);

dir(r1, 'Object.same(a, a, a)');
dir(r2, 'Object.same(a, a, b)');

