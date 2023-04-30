#!/usr/bin/env node.js

const de = '16.777.216,1415';

const resFalse = numeric.removeLocalization(de, 'en')
const resTrue = numeric.removeLocalization(de, 'de');

dir(resFalse, 'numeric.removeLocalization("' + de + '", "en")');
dir(resTrue, 'numeric.removeLocalization("' + de + '", "de")');

