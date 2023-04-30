#!/usr/bin/env node.js

const regexp = /abc/g;

dir(regexp, '(regexp)');

const res1 = regexp.addFlags('i');
const res2 = regexp.removeFlags('g');

console.eol();
dir(res1, regexp.toString() + '.addFlags("i")');
dir(res2, regexp.toString() + '.removeFlags("g")');

