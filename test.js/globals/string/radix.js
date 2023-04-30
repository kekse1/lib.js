#!/usr/bin/env node.js

var str = 'Dies ist ein Test! Hello World..';

var res1 = str.toRadix(0);
var back = res1.fromRadix(0);

var res2 = str.toRadix(2);
var res3 = str.toRadix('ab');

var res = res3.fromRadix('ab');

str = str.toString('"');

console.dir(res1, str + '.toRadix(1)');
dir(back, res1.toString('"') + '.fromRadix(1)');
console.eol();

dir(res2, str + '.toRadix(2)');
dir(res3, str + '.toRadix("ab")');
dir(res, res3.toString('"') + '.fromRadix("ab")');

