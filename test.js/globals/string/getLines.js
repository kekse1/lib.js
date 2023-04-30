#!/usr/bin/env node.js

var string = 'erste zeile\nzweite zeile\n\nvierte zeile\n';

const res1 = string.getLines();
const res2 = string.getLines(4);
const res3 = string.getLines(-4);
const res4 = string.getLines(4, true);
const res5 = string.getLines(-4, true);
const res6 = string.getLines(null, null, 4);

string = string.quote('"');

dir(res1, string + '.getLines()');
dir(res2, string + '.getLines(4)');
dir(res3, string + '.getLines(-4)');
dir(res4, string + '.getLines(4, true)');
dir(res5, string + '.getLines(-4, true)');
dir(res6, string + '.getLines(null, null, 4)');

