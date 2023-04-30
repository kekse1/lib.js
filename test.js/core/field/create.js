#!/usr/bin/env node.js

const field1 = FIELD.create('/tmp/test.tmp', 3, 3, 3);
const field2 = FIELD.create(new Uint8Array(8), 3, 3, 3);
const field3 = FIELD.create(Array, 3, 3, 3);

dir(field1.array + ' / ' + field1.path + ' (' + field1.length + ')');
dir(field2.array);
dir(field3.array);

console.eol(2);
dir(field1.dimensions, '(field).dimensions');
dir(field1.file, '(field).file @ .path = ' + field1.path);

