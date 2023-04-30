#!/usr/bin/env node.js

const arr = [ 3.14, 0.5, null, 1, 3, 6, 9, 12n, 18, 24n, 31n, 29 ];

const min = Math.min(... arr);
const max = Math.max(... arr);

dir(min, 'Math.min(...)');
dir(max, 'Math.max(...)');

