#!/usr/bin/env node.js

var str = alphabet.FULL;

const rest = [ 1, false, 16 ];

const res1 = str.ownHash(16, false, false, false, ... rest);
const res2 = str.ownHash(16, true, false, false, ... rest);
const res3 = str.ownHash(16, false, true, false, ... rest);
const res4 = str.ownHash(16, true, true, false, ... rest);
const res5 = str.ownHash(16, false, false, true, ... rest);
const res6 = str.ownHash(16, true, false, true, ... rest);
const res7 = str.ownHash(16, false, true, true, ... rest);
const res8 = str.ownHash(16, true, true, true, ... rest);

str = str.toString('"');

dir(res1, str + '.ownHash(16, false, false, false, ..)');
dir(res2, str + '.ownHash(16, true, false, false, ...)');
dir(res3, str + '.ownHash(16, false, true, false, ...)');
dir(res4, str + '.ownHash(16, true, true, false, ....)');
dir(res5, str + '.ownHash(16, false, false, true, ...)');
dir(res6, str + '.ownHash(16, true, false, true, ....)');
dir(res7, str + '.ownHash(16, false, true, true, ....)');
dir(res8, str + '.ownHash(16, true, true, true, .....)');

