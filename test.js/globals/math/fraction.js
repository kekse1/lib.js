#!/usr/bin/env node.js

const value = -(4/16);
const res1 = Math.fraction(value);
const res2 = Math.fraction(-4);

dir(res1, 'Math.fraction(' + value + ')');
dir(res2, 'Math.fraction(-4)');

