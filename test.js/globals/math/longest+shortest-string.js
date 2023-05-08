#!/usr/bin/env node.js

const args = [ 'eins', 'neunzehn', 'elf', 'zwei', 'sieben', 'vierundzwanzig', 'achtzehn', 'ten' ];

const r1 = Math.longest(args);
const r2 = Math.longest(args);//
const r3 = Math.shortest(args, true);
const r4 = Math.shortest(args, null);//
const r5 = Math.longest(args, false);//
const r6 = Math.shortest(args, false);//

dir(args, '(arguments)');
console.eol(4);
dir(r1, 'Math.longest(arguments)');
dir(r2, 'Math.longest(... arguments)');
dir(r3, 'Math.shortest(arguments, true)');
dir(r4, 'Math.shortest(... arguments, null)');
dir(r5, 'Math.longest(... arguments, false)');
dir(r6, 'Math.shortest(... arguments, false)');

