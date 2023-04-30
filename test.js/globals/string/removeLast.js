#!/usr/bin/env node.js

const str1 = '12345678';

const res1 = str1.removeLast(3);
dir(res1, str1.toString('"') + '.removeLast(3)');

console.eol(2);

const str2 = 'abcdefabcdefabcdefabcdefabcdef';

const res2 = str2.removeLast(2, 'ab', 'ef');
dir(res2, str2.toString('"') + '.removeLast(2, "ab", "ef")');

