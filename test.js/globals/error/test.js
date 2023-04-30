#!/usr/bin/env node.js

const e = new Error('\n\nfehler %\nfehler-zeile 2 %\nzeile 3 %\n\n');

e.eins = 'EINS';
e.zwei = 'ZWEI';
e.line = 3096;
e.bigint = 1000000n;
e.pi = 3.14;
e.multi = 'MULTI-' + EOL + 'LINE!' + ';-D';

x(e, { keys: Object.keys(e) }, 1, 2, 3);

