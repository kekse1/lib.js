#!/usr/bin/env node.js

const a = new Uint8Array(4);
const b = new Uint8Array(4);
const c = new Uint8Array(3);

const res1 = Uint8Array.equal(a, b);
const res2 = Uint8Array.equal(a, b, c);

dir(res1, 'Uint8Array.equal(a, b)');
dir(res2, 'Uint8Array.equal(a, b, c)');

a[0] = 255;

const res3 = Uint8Array.equal(a, b);
dir(res3, 'Uint8Array.equal(a, b) // after changing a[0]');

b[0] = 255;

const res4 = Uint8Array.equal(a, b);
dir(res4, 'Uint8Array.equal(a, b) // after changing b[0]');

