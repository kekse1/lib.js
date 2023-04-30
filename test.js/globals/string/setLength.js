#!/usr/bin/env node.js

const str = '0123456789';

const res1 = str.setLength(3);
const res2 = str.setLength(-3);

dir(res1, str.toString('"') + '.setLength(3)');
dir(res2, str.toString('"') + '.setLength(-3)');

