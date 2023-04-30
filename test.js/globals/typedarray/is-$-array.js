#!/usr/bin/env node.js

const a = Uint8ClampedArray;
const A = new a();

const b = Int32Array;
const B = new b();

const c = Float64Array;
const C = new c();

const d = BigUint64Array;
const D = new d();

dir(a.isFloatArray, 'Uint8ClampedArray.isFloatArray');
dir(A.isIntArray, '(Uint8ClampedArray).isIntArray');
dir(a.isUintArray, '(Uint8ClampedArray).isUintArray');

dir(b.isBigIntArray, 'Int32Array.isBigIntArray');
dir(B.isUintArray, '(Int32Array).isUintArray');
dir(b.isIntArray, 'Int32Array.isIntArray');

dir(c.isFloatArray, 'Float64Array.isFloatArray');
dir(C.isFloatArray, '(Float64Array).isFloatArray');

dir(d.isBigIntArray, 'BigUint64Array.isBigIntArray');
dir(D.isUintArray, '(BigUint64Array).isUintArray');
dir(D.isBigUintArray, '(BigUint64Array).isBigUintArray');

