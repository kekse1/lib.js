#!/usr/bin/env node.js

const res0 = randomID();
const res1 = randomID(true, 10, '.');
const res2 = randomID(false, 2, '#');

dir(res0, '[id.]randomID()');
dir(res1, '[id.]randomID(true, 10, ".")');
dir(res2, '[id.]randomID(false, 2, "#")');
console.eol(4);
dir(isID(res0), 'isID("' + res0 + '")');
dir(isID(res1), 'isID("' + res1 + '")');
dir(isID(res2), 'isID("' + res2 + '")');
dir(isID('abc'), 'isID("abc")');
const u = randomUUID();
dir(isID(u), 'isID("' + u + '")');
dir(isID(u, false), 'isID("' + u + '", false)');

