#!/usr/bin/env node.js

const arr = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
const str = '012345678';
const uint8 = Uint8Array.from(arr);

dir(arr, '(Array)');
dir(str, '(String)');
dir(uint8, '(Uint8Array)');

const res1 = CARRIER.toBits(arr);
const res2 = CARRIER.toBits(str);
const res3 = CARRIER.toBits(uint8);

console.eol(4);

dir(res1, 'CARRIER.toBits(Array)');
dir(res2, 'CARRIER.toBits(String)');
dir(res3, 'CARRIER.toBits(Uint8Array)');

