#!/usr/bin/env node.js

var str = 'abcdefghijklmnopqrstuvwxyz';

const res1 = str.getStarting('cde', 'gh', 'j', 'a', 'b');
const res11 = str.getEnding('yz');
const res2 = str.getStarting('de', 'gh', 'c', 'f', 'ab');
const res22 = str.getEnding('zy');

str = str.toString('"');

dir(str, '(string)');
console.eol(4);

dir(res1, str + '.getStarting("cde", "gh", "j", "a", "b")');
console.eol();
dir(res11, str + '.getEnding("yz")');

console.eol(2);
dir(res2, str + '.getStarting("de", "gh", "c", "f", "ab")');
console.eol();
dir(res22, str + '.getEnding("zy")');

