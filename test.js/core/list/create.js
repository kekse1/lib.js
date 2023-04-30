#!/usr/bin/env node.js

const list1 = LIST.create('/tmp/test.tmp', 32);
const list2 = LIST.create(new Uint8Array(8));
const list3 = LIST.create(Array, 16);

dir(list1.array + ' / ' + list1.path + ' (' + list1.length + ')');
dir(list2.array);
dir(list3.array);

console.eol(2);
dir(list1.file, '(list).file @ .path = ' + list1.path);

