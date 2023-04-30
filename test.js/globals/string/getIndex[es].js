#!/usr/bin/env node.js

const str = 'abc ' + 'underline'.underline + ' def';

const res1 = str.getIndex(-1);
const res2 = str.getComplexIndex(-1);

dir(res1, str.toString('"') + '.getIndex(-1)');
dir(res2, str.toString('"') + '.getComplexIndex(-1)');

