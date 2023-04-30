#!/usr/bin/env node.js

const a = new Uint32Array([2,4,6,8]);
dir(a);
const b = a.toUint8ClampedArray();
dir(b);

