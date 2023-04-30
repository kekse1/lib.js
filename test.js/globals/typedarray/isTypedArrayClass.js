#!/usr/bin/env node.js

const a = Uint8ClampedArray;

const res1 = TypedArray.isTypedArrayClass(new a());
const res2 = TypedArray.isTypedArrayClass(a);

dir(res1, '// false');
dir(res2, '// true');

