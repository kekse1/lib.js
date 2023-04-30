#!/usr/bin/env node.js

const str1 = '---2.4';
const str2 = '---2.25';

const res1 = parseFloat(str1, 16);
const res2 = parseFloat(str2).toString(16);

dir(res1, 'parseFloat("' + str1 + '", 16)');
dir(res2, 'parseFloat("' + str2 + '")');

