#!/usr/bin/env node.js

const array = [ 1, 2, 3, 4, 5, 6, 7, 8 ];

const res1 = array.getRandom(16);
const res2 = array.getRandom(16, true);

dir(res1, '(array).getRandom(16)');
dir(res2, '(array).getRandom(16, true)');

