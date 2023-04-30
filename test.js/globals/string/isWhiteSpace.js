#!/usr/bin/env node.js

const str = 'abc ';

const res1 = str.isWhiteSpace(-1);
const res2 = str.isWhiteSpace();

dir(res1, str.toString('"') + '.isWhiteSpace(-1)');
dir(res2, str.toString('"') + '.isWhiteSpace()');

