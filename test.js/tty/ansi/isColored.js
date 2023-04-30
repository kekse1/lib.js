#!/usr/bin/env node.js

const str1 = '(string #1) regular string';
const str2 = '(string #2) ' + 'colored'.brightRed + ' string';

log(str1);
log(str2);

const res1 = ansi.isColored.bg(str1);
const res2 = ansi.isColored(str1);
const res3 = ansi.isColored.bg(str2);
const res4 = ansi.isColored(str2);

console.eol(2);

dir(res1, 'ansi.isColored.bg(string #1)');
dir(res2, 'ansi.isColored(string #1)');
dir(res3, 'ansi.isColored.bg(string #2)');
dir(res4, 'ansi.isColored(string #2)');

