#!/usr/bin/env node.js

const field = FIELD.create(16);

dir(field.toString(), 'FIELD.create()');

console.eol(3);
dir(field.index(-1), '(field).index(-1)');
console.eol(2);
dir(field.coordinates(-1, -2, -3));
console.eol();

