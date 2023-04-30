#!/usr/bin/env node.js

const arr = [1,2,3,'4','5',6,7,8n];

const res1 = Uint8Array.fromArray(arr, 1, arr.length - 3, false);
const res2 = Uint32Array.fromArray(arr, 2);

dir(arr, '(array)');
dir(res1, 'Uint8Array.fromArray(array, 1, (array).length - 3, false)');
dir(res2, 'Uint32Array.fromArray(array, 2)');

