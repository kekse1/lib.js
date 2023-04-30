#!/usr/bin/env node.js

const res1 = TypedArray.create(Uint8Array, 4);
const res2 = TypedArray.create('uint32array', 2);

dir(res1, 'TypedArray.create(Uint8Array, 4)');
dir(res2, 'TypedArray.create("uint32array", 2)');

