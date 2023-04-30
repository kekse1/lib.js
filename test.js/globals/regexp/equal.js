#!/usr/bin/env node.js

const r1 = /test/gi;//RegExp.parse('/test/gi');
const r2 = /test/gi;//RegExp.parse('/test/gi');
const r3 = /test/gi;//RegExp.parse('/test/gi');
const r4 = /test/g;//RegExp.parse('/test/g');

const res1 = RegExp.equal(r1, r2, r3);
const res2 = RegExp.equal(r1, r2, r4);

dir(res1, 'RegExp.equal(/test/gi, /test/gi, /test/gi)');
dir(res2, 'RegExp.equal(/test/gi, /test/gi, /test/g)');
console.eol(2);

