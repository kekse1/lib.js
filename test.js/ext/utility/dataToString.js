#!/usr/bin/env node.js

const arr = new Uint32Array([ 97, 98, 99 ]);
const res = dataToString(arr);

dir(arr, 'new Uint32Array([ 97, 98, 99 ])');
dir(res, 'dataToString(array)');

