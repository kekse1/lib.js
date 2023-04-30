#!/usr/bin/env node.js

const res1 = numeric.split('16777216.1415');
const res2 = numeric.splitLocalized('1.677.216,1415', 'de', false);
const res3 = numeric.split('1.677.216,1415', true, 'de');
const res4 = numeric.split('1677216');

dir(res1, 'numeric.split("16777216.1415")');
dir(res2, 'numeric.splitLocalized("1.677.216,1415", "de", false)');
dir(res3, 'numeric.split("1.677.216,1415", true, "de")');
dir(res4, 'numeric.split("1677216")');

