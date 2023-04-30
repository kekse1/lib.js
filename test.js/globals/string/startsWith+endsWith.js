#!/usr/bin/env node.js

var str = 'abcdef';

const res1 = str.startsWith('a', 'b', 'cd');
const res2 = str.startsWith('ac', 'b');
const res3 = str.startsWith('ac', 'a');

const res4 = str.endsWith('de', 'f');
const res5 = str.endsWith('d', 'e', 'f');

const res6 = str.endsWith('ed', 'f');

str = str.toString('"');

dir(res1, str + '.startsWith("a", "b", "cd")');
dir(res2, str + '.startsWith("ac", "b")');
dir(res3, str + '.startsWitH("ac", "a")');
dir(res4, str + '.endsWith("de", "f")');
dir(res5, str + '.endsWith("d", "e", "f")');
dir(res6, str + '.endsWith("ed", "f")');

