#!/usr/bin/env node.js

//
var A = '/.test';
var B = '/tmp/tmp/.test.tmp.tar.gz';

//
const a = path.extname(A);
const b = path.extname(B);

const c = path.extname(B, 0);

const d = path.extname(B, 1);
const e = path.extname(B, -1);

const f = path.extname(B, 2);
const g = path.extname(B, -2);

const h = path.extname(B, 99);

//
A = A.toString('"');
B = B.toString('"');
var x = 'path.extname(';

//
dir(a, x + A + ')');
dir(b, x + B + ')');
console.eol();
x += B;
dir(c, x + ', 0)');
console.eol();
dir(d, x + ', 1)');
dir(e, x + ', -1)');
console.eol();
dir(f, x + ', 2)');
dir(g, x + ', -2)');
console.eol();
dir(h, x + ', 99)');
console.eol();

