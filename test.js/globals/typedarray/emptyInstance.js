#!/usr/bin/env node.js

const a = new Uint8Array(4);

const r1 = a.emptyInstance();
const r2 = a.emptyInstance(null);
const r3 = a.emptyInstance(16);

dir(a);
console.eol(4);
dir(r1);
dir(r2);
dir(r3);

