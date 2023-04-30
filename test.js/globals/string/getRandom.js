#!/usr/bin/env node.js

const str = 'test';

const res1 = str.getRandom(16);
const res2 = str.getRandom(16, true);

dir(res1, str.toString('"') + '.getRandom(16)');
dir(res2, str.toString('"') + '.getRandom(16, true)');

