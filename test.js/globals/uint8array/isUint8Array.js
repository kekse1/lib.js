#!/usr/bin/env node.js

const a = new Uint8Array();
const b = new Uint8Array(2);

const r1 = Uint8Array.isUint8Array(a);
const r2 = Uint8Array.isUint8Array(a, true);
const r3 = Uint8Array.isUint8Array(b);
const r4 = Uint8Array.isUint8Array([1,2,3,4]);

dir(r1);
dir(r2);
dir(r3);
dir(r4);

