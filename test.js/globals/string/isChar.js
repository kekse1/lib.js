#!/usr/bin/env node.js

const str1 = 'abc';
const str2 = 'ab\0';

const res1 = str1.isChar(-1);
const res2 = str2.isChar();

dir(res1, str1.toString('"') + '.isChar(-1)');
dir(res2, str2.toString('"') + '.isChar()');

