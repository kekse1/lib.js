#!/usr/bin/env node.js

const o = { eins: { zwei: [ 1, 2, 3, 4 ], drei: undefined }, array: [1,2] };
const o2 = { eins: 'EINS' };

const r1 = Object.has('eins.drei', o);
const r2 = Object.has('eins.vier', o);
const r3 = Object.has('array.-2', o);

dir(o, '(object)');
console.eol(3);
dir(r1, 'Object.has("eins.drei", (object))');
dir(r2, 'Object.has("eins.vier", (object))');
dir(r3, 'Object.has("array.-2", (object))');

