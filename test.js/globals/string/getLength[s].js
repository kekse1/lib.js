#!/usr/bin/env node.js

const str = '1234';

const res1 = str.getLength(6);
const res2 = str.getLength(4, 2);
const res3 = str.getLength(str.length, 1);

dir(res1, '(4).getLength(6) // 4');
dir(res2, '(4).getLength(4, 2) // 2');
dir(res3, '(4).getLength(.length, 1) // 3');

const str2 = 'abc ' + 'bold'.bold + ' def';

console.eol(3);
log(str2);

dir(str2.getLength(-3), str2.toString('"') + '.getLength(-3)');
dir(str2.getComplexLength(-3), str2.toString('"') + '.getComplexLength(-3)');

