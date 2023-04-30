#!/usr/bin/env node.js

var str = '0123456789abcdef';

const res1 = str.removeAt(1, 3, 5, 7);
const res2 = str.removeAt(1, 3, 5, 7, 2n);

str = str.quote('"') + '.removeAt(';

dir(res1, str + '1, 3, 5, 7)');
dir(res2, str + '1, 3, 5, 7, 2n)');

