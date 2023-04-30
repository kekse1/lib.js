#!/usr/bin/env node.js

var arr1 = 'ein\\ test < zwei'.split('');
var arr2 = 'ein test < zwei'.split('');

const res1 = arr1.firstOccurrence('<', '\\');
const res2 = arr1.lastOccurrence('<', '\\');

const res3 = arr2.firstOccurrence('\\', '<');
const res4 = arr2.lastOccurrence('\\', '<');

const res5 = arr1.firstOccurrence('a', 'b');
const res6 = arr2.lastOccurrence('a', 'b');

str1 = arr1.join('').quote('"');
str2 = arr2.join('').quote('"');

dir(res1, str1 + '.firstOccurrence("<", "\\")');
dir(res2, str1 + '.lastOccurrence("<", "\\")');
console.eol();
dir(res3, str2 + '.firstOccurrence("\\", "<")');
dir(res4, str2 + '.lastOccurrence("\\", "<")');
console.eol();
dir(res5, str1 + '.firstOccurrence("a", "b")');
dir(res6, str2 + '.lastOccurrence("a", "b")');

