#!/usr/bin/env node.js

var str1 = 'ein\\ test < zwei';
var str2 = 'ein test < zwei';

const res1 = str1.firstOccurrence('<', '\\');
const res2 = str1.lastOccurrence('<', '\\');

const res3 = str2.firstOccurrence('\\', '<');
const res4 = str2.lastOccurrence('\\', '<');

const res5 = str1.firstOccurrence('a', 'b');
const res6 = str2.lastOccurrence('a', 'b');

str1 = str1.quote('"');
str2 = str2.quote('"');

dir(res1, str1 + '.firstOccurrence("<", "\\")');
dir(res2, str1 + '.lastOccurrence("<", "\\")');
console.eol();
dir(res3, str2 + '.firstOccurrence("\\", "<")');
dir(res4, str2 + '.lastOccurrence("\\", "<")');
console.eol();
dir(res5, str1 + '.firstOccurrence("a", "b")');
dir(res6, str2 + '.lastOccurrence("a", "b")');

