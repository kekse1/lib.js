#!/usr/bin/env node.js

const one = new Uint8Array(2);
const two = new Uint8Array(2);
const tre = new Uint32Array(2);

const res1 = TypedArray.equal();
const res2 = TypedArray.equal(one, two);
const res3 = TypedArray.equal(one, two, tre);

dir(res1);
dir(res2);
dir(res3);

