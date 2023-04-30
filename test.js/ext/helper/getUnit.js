#!/usr/bin/env node.js

const str1 = '12..3..4px';
const str2 = '123..4   em';
const str3 = '%';
const str4 = '';

const res1 = getUnit(str1);
const res2 = getUnit(str2);
const res3 = getUnit(str3);
const res4 = getUnit(str4);

dir(res1, '[helper.]getUnit("' + str1 + '")');
dir(res2, '[helper.]getUnit("' + str2 + '")');
dir(res3, '[helper.]getUnit("' + str3 + '")');
dir(res4, '[helper.]getUnit("")');

