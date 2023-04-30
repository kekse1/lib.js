#!/usr/bin/env node.js

const num = 3.14;

const res1 = num.pad(0);
const res2 = num.pad(1);
const res3 = num.pad(4);

dir(res1, '(3.14).pad(0)');
dir(res2, '(3.14).pad(1)');
dir(res3, '(3.14).pad(4)');

const big = 2048;
const res = big.pad(8);

dir(res, '(2048n).pad(8)');

