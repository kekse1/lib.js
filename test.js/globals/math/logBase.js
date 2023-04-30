#!/usr/bin/env node.js

//
const res1 = Math.logBase(256, 256**2);
const res2 = Math.logBase(2, 2**32);
const res3 = Math.logBase(16, 2**32);
const res4 = Math.logBase(16, 16**2);

//
dir(res1, 'Math.logBase(256, 256**2)');
dir(res2, 'Math.logBase(2, 2**32)');
dir(res3, 'Math.logBase(16, 2**32');
dir(res4, 'Math.logBase(16, 16**2)');

