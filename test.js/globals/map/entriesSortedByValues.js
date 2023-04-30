#!/usr/bin/env node.js

const ASC = false;
const map = new Map();

map.set('drei', 3);
map.set('null', 0);
map.set('zwei', 2);
map.set('vier', 4);
map.set('eins', 1);

const res = map.entriesSortedByValues(ASC);
dir(res, '(map).entriesSortedByValues(' + ASC + ')');

