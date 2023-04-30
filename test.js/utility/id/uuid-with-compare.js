#!/usr/bin/env node.js

const COMPARE1 = { eins: 'EINS', zwei: 'ZWEI' };
const COMPARE2 = [ 'eins', 'zwei' ];

dir(COMPARE1, '(COMPARE #1)');
dir(COMPARE2, '(COMPARE #2)');

console.eol(4);

dir(uuid(COMPARE1), 'uuid(COMPARE #1)');
dir(uuid(COMPARE2), 'uuid(COMPARE #2)');

