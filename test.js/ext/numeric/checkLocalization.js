#!/usr/bin/env node.js

const res0 = numeric.checkLocalization();
const res1 = numeric.checkLocalization('de');
const res2 = numeric.checkLocalization('en');

dir(res0, 'numeric.checkLocalization()');
dir(res1, 'numeric.checkLocalization("de")');
dir(res2, 'numeric.checkLocalization("en")');

