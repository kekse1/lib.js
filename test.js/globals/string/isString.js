#!/usr/bin/env node.js

const str1 = '';
const str2 = 'not empty';
const str3 = '123';

const res1 = String.isString(str1); // false
const res2 = isString(str2); // true
const res3 = isString(str3, true); // true
const res4 = String.isString(str3, 3); // true
const res5 = String.isString(str3, 4); // false

dir(res1, 'String.isString("' + str1 + '") // false');
dir(res2, 'isString("' + str2 + '") // true');
dir(res3, 'isString("' + str3 + '", true) // true');
dir(res4, 'String.isString("' + str3 + '", 3) // true');
dir(res5, 'String.isString("' + str3 + '", 4) // false');

