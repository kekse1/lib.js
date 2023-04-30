#!/usr/bin/env node.js

const a = new Uint8Array([1, 2, 3, 4]);
const b = new Uint32Array(a.buffer);
const c = new Uint32Array(4);

const res1 = TypedArray.equalBytes(a, a);
const res2 = TypedArray.equalBytes(a, b);
const res3 = TypedArray.equalBytes(a, b, c);

dir(res1);
dir(res2);
dir(res3);

