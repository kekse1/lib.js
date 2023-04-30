#!/usr/bin/env node.js

const str1 = 'dies ist ein test';
const str2 = str1.toUpperCase();
const str3 = 'MiXeD';

const res1 = str1.oneCase;
const res2 = str2.oneCase;
const res3 = str3.oneCase;
const res4 = ''.oneCase;

dir(res1, str1.quote('"') + '.oneCase');
dir(res2, str2.quote('"') + '.oneCase');
dir(res3, str3.quote('"') + '.oneCase');
dir(res4, '"".oneCase');

