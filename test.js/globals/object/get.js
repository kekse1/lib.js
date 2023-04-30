#!/usr/bin/env node.js

const o = { eins: { zwei: 'EINS ZWEI', drei: undefined }, array: [1,2,3,4] };

const r0 = Object.get('eins.zwei', o);
const r1 = Object.get('eins.drei', o);
const r2 = Object.get('eins.vier', o);
const r3 = Object.get('array.5', o);
const r4 = Object.get('array.length', o);

dir(o, '(object)');
console.eol(3);
dir(r0, 'Object.get("eins.zwei", (object))');
dir(r1, 'Object.get("eins.drei", (object))');
dir(r2, 'Object.get("eins.vier", (object))');
dir(r3, 'Object.get("array.5", (object))');
dir(r4, 'Object.get("array.length", (object))');

