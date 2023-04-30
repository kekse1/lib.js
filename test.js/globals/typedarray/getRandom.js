#!/usr/bin/env node.js

const a = new Uint32Array([1024, 2048, 4096, 8192, 16384, 32768, 65536]);

dir(a);

const b = a.getRandom();
const c = a.getRandom(null, true);

dir(b, '..getRandom()');
dir(c, '..getRandom(null, true)');

