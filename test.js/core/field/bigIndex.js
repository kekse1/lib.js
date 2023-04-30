#!/usr/bin/env node.js

const field = FIELD.create(4, 3, 2, 1);

const res1 = field.bigIndex(1, 2, 3, 4);
const res2 = field.bigIndex(-1, -1, -1, -1);

dir(field.toString(), 'FIELD.create(4, 3, 2, 1)');
console.eol(2);
dir(res1, '(field).bigIndex(1, 2, 3, 4)');
console.eol();
dir(res2, '(field).bigIndex(-1, -1, -1, -1)');

