#!/usr/bin/env node.js

const arr = [ 1, 2, 3, 4 ];

const res1 = arr.getLength(6);
const res2 = arr.getLength(4, 2);
const res3 = arr.getLength(arr.length, 1);

dir(res1, '(4).getLength(6) // 4');
dir(res2, '(4).getLength(4, 2) // 2');
dir(res3, '(4).getLength(.length, 1) // 3');

