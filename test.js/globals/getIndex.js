#!/usr/bin/env node.js

const res1 = getIndex(-20, 12);
const res2 = getIndex(-20n, 12);
const res3 = getIndex(-20, 12n);

dir(res1, 'getIndex(-20, 12)');
dir(res2, 'getIndex(-20n, 12)');
dir(res3, 'getIndex(-20, 12n)');

