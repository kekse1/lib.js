#!/usr/bin/env node.js

const str = 'abcabcabcdedef';

const res1 = str.unique();
const res2 = str.unique(2);
const res3 = str.unique(2, false);

dir(res1, str.quote('"') + '.unique()         // ' + str.length + ' vs. ' + res1.length);
dir(res2, str.quote('"') + '.unique(2)        // ' + str.length + ' vs. ' + res2.length);
dir(res3, str.quote('"') + '.unique(2, false) // ' + str.length + ' vs. ' + res3.length);

