#!/usr/bin/env node.js

const str = 'abc def ghi jkl';

const filter = [ 97, 'b', 'def', 32 ];

const res = str.filter(... filter);

dir(res, str.toString('"') + '.filter(97, "b", "def", 32)');

