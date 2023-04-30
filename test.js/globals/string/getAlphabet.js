#!/usr/bin/env node.js

var str = 'Hello, World!';

const res1 = str.getAlphabet(null);
const res2 = str.getAlphabet(true);
const res3 = str.getAlphabet(false);

str = str.quote('"') + '.getAlphabet(';

dir(res1, str + 'null)');
dir(res2, str + 'true)');
dir(res3, str + 'false)');

