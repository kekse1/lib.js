#!/usr/bin/env node.js

const str1 = '12345678';
const str2 = '12345678n';

const res1 = str1.isBigInt();
const res2 = str2.isBigInt();

dir(res1, str1.quote('"') + '.isBigInt()');
dir(res2, str2.quote('"') + '.isBigInt()');

