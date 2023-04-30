#!/usr/bin/env node.js

const str1 = '16,777,216.1415';
const str2 = '16.777.216,1415';

const res1 = numeric.parseLocalized(str1, 'en');
const res2 = numeric.parseLocalized(str2, 'de');

dir(res1, 'numeric.parseLocalized("' + str1 + '", "en")');
dir(res2, 'numeric.parseLocalized("' + str2 + '", "de")');

