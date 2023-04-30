#!/usr/bin/env node.js

const ASC = false;
const map = new Map();

map.set(3, 'drei');
map.set(0, 'null');
map.set(2, 'zwei');
map.set(4, 'vier');
map.set(1, 'eins');

const res = map.entriesSortedByKeys(ASC);
dir(res, '(map).entriesSortedByKeys(' + ASC + ')');

