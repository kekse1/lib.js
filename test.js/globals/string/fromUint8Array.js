#!/usr/bin/env node.js

const arr = new Uint8Array([ 97, 32, 98, 32, 99 ]);

const res1 = String.fromUint8Array(arr);
const res2 = String.fromUint8Array(arr, 'base64');
const res3 = String.fromUint8Array(arr, 'hex');
const res4 = String.fromUint8Array(arr, 1);
const res5 = String.fromUint8Array(arr, 'xyz');
const res6 = String.fromUint8Array(arr, null);

dir(arr, 'new Uint8Array([ 97, 32, 98, 32, 99 ])');
console.eol(4);

dir(res1, 'String.fromUint8Array((Uint8Array))');
dir(res2, 'String.fromUint8Array((Uint8Array), "base64")');
dir(res3, 'String.fromUint8Array((Uint8Array), "hex")');
dir(res4, 'String.fromUint8Array((Uint8Array), 1)');
dir(res5, 'String.fromUint8Array((Uint8Array), "xyz")');
dir(res6, 'String.fromUint8Array((Uint8Array), null)');

