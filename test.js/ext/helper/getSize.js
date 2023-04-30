#!/usr/bin/env node.js

const str1 = '12..3..4px';
const str2 = '123..4   px';
const str3 = 'px';
const str4 = '0';

const res1 = getSize(str1);
const res2 = getSize(str2);
const res3 = getSize(str3);
const res4 = getSize(str4);

dir(res1, '[helper.]getSize("' + str1 + '")');
dir(res2, '[helper.]getSize("' + str2 + '")');
dir(res3, '[helper.]getSize("' + str3 + '")');
dir(res4, '[helper.]getSize("")');

