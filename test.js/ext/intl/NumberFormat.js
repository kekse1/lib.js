#!/usr/bin/env node.js
//
const result1 = intl.NumberFormat(1000000.1314);
const result2 = intl.NumberFormat(1000000.1314, 'en');
const result3 = intl.NumberFormat(1000000.1314, 'pl');

dir(result1, 'intl.NumberFormat(1000000.1314)');
dir(result2, 'intl.NumberFormat(1000000.1314, "en")');
dir(result3, 'intl.NumberFormat(1000000.1314, "pl")');

