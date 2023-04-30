#!/usr/bin/env node.js

var str = 'abc';

const res1 = str.at(-1);
const res2 = str.at(-1, 'b');
const res3 = str.at(-2, 'bc');

dir(res1, '"abc".at(-1)');
dir(res2, '"abc".at(-1, "b")');
dir(res3, '"abc".at(-2, "bc")');

