#!/usr/bin/env node.js

const arr1 = new Uint32Array(4);
const arr2 = new Uint8ClampedArray(0);

const res1 = TypedArray.isTypedArray(arr1);
const res2 = TypedArray.isUint8Array(arr1);
const res3 = Uint32Array.isUint32Array(arr1);
const res4 = isUint8ClampedArray(arr2);
const res5 = isUint8ClampedArray(arr2, false);
const res6 = TypedArray.isUint8ClampedArray(arr2, 0);
const res7 = Uint32Array.isUint32Array(arr1, arr1.length + 1);

dir(res1, '// true');
dir(res2, '// false');
dir(res3, '// true');
dir(res4, '// true');
dir(res5, '// false');
dir(res6, '// true');
dir(res7, '// false');

