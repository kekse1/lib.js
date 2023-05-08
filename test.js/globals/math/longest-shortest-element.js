#!/usr/bin/env node.js

const arr = [ 6, 99, '12345678', '123', '1234', '1234567890', 'abc' ];

const res0 = Math.shortest(arr, true);
const res1 = Math.shortest(arr);
const res2 = Math.longest(arr);

dir(res0, 'Math.shortest(array, true)');
dir(res1, 'Math.shortest(array)');
dir(res2, 'Math.longest(array)');

