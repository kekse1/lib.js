#!/usr/bin/env node.js

// '.ansiSubstr[ing]()' sowie '.htmlSubstr[ing]()' are equal..

const str = '0123' + '4567'.rainbow().highBG + '89';

dir(str, '(string).highFG.highBG');

const res1 = str.substr(6, null, true);
const res2 = str.substr(3, 3, true);

dir(res1, str.less.toString('"') + '.substr(6, null, true)');
dir(res2, str.less.toString('"') + '.substr(3, 3, true)');

console.eol(3);
console.log(res1);
console.log(res2);
console.eol(2);

const res3 = str.ansiSubstring(6, 9);
const res4 = str.less.substring(6, 9);
const res5 = str.substring(3, 5, true);

dir(res3, str.less.toString('"') + '.ansiSubstring(6, 9)');
dir(res4, str.less.toString('"') + '.less.subtring(6, 9)');
dir(res5, str.less.toString('"') + '.substring(3, 5, true)');

log(res3);
log(res4);
console.eol();
log(res5);

