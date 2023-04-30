#!/usr/bin/env node.js

const arr = new Uint32Array([ 97, 98, 99 ]);
const str = 'def';

const res1 = dataToUint8Array(arr);
const res2 = dataToUint8Array(str);

dir(arr, 'new Uint32Array([ 97, 98, 99 ])');
dir(res1, 'dataToUint8Array(array)');
console.eol(2);
dir(res2, 'dataToUint8Array("def")');

