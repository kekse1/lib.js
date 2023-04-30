#!/usr/bin/env node.js

var str = 'abcdefhijklmnopqrstuvwxyz';

//.removeEnding() is the same syntax!
const res1 = str.removeStarting('a', 'b', 'def').removeEnding('z', 'yy');
const res2 = str.removeStarting('def', 'a', 'bc').removeEnding('y', 'z');
const res3 = str.removeEnding('x', 'yz');
const res4 = str.removeEnding('z', 'yx');
const res5 = str.removeEnding('z', 'xy');

str = str.toString('"');

dir(str, '(string)');
console.eol(4);
dir(res1, str + '.removeStarting("a", "b", "def").removeEnding("z", "yy"); // only removing first two, as "c" is missing..');
console.eol(2);
dir(res2, str + '.removeStarting("def", "a", "bc").removeEnding("y", "z"); // removing all first six.');
console.eol(3);
dir(res3, str + '.removeEnding("x", "yz")');
dir(res4, str + '.removeEnding("z", "yx")');
dir(res5, str + '.removeEnding("z", "xy")');

