#!/usr/bin/env node.js

const res1 = Array.isArrayClass([]);
const res2 = Array.isArrayClass(Array);
const res3 = Array.isArrayClass(Uint8Array, true);
const res4 = Array.isArrayClass(Uint8Array, false);

dir(res1, '// false');
dir(res2, '// true');
dir(res3, '// true');
dir(res4, '// false');

