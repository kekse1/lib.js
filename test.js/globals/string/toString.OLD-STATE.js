#!/usr/bin/env node.js

const str1 = 'ein "\'`" test';
const str2 = 'ein ``` test """"';

const r0 = str1.toString(true);
const r1 = str1.toString('"');
const r2 = str1.toString('( ',' )');
const r3 = str2.toString(true);

dir(r0, r1 + '.toString(true)');
dir(r1, r1 + '.toString(\'"\')');
dir(r2, r1 + '.toString(" (", " )")');
dir(r3, str2.quote('"') + '.toString(true)');

