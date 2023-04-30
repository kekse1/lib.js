#!/usr/bin/env node.js

var string = ',,eins,zwei,,drei,vier';

const result1 = string.split(',');
const result2 = string.split([',','e','ef'], 4);
const result3 = string.split([',','e'], 4, true);
const result4 = string.split(['e',','], -4);
const result5 = string.split([',','e'], -4, true);
const result6 = string.split(',', null, false, ',,');

string = string.quote('"');

dir(result1, string + '.split(",")');
dir(result2, string + '.split([",","e","ef"], 4)');
dir(result3, string + '.split([",","e"], 4, true)');
dir(result4, string + '.split(["e",","], -4)');
dir(result5, string + '.split([",","e"], -4, true)');
dir(result6, string + '.split(",", null, false, ",,")');

