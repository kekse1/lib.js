#!/usr/bin/env node.js

const val1 = 3.6;
const val2 = -3.6;

const res1 = Math.floor(val1);
const res2 = Math.floor(val2);
const res3 = val2.int;

dir(res1, 'Math.floor(3.6)');
dir(res2, 'Math.floor(-3.6)');
dir(res3, '(-3.6).int');

