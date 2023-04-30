#!/usr/bin/env node.js

const o = [ 'one', 'two', 'three' ];

o.eins = 'EINS';
o.zwei = 'ZWEI';

dir(o, false);
dir(o, true);
dir(o, '(example object)', false);
dir(o, 3.14, 0);
dir(o, 4096n, { text: 'example', depth: 0, compact: true });

