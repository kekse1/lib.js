#!/usr/bin/env node.js

const o = { eins: 'eins', zwanzig: 'zwanzig', ab: 'ab', defghijklmnopq: 'def...', z: 'zzzzzzzzzzzzzzzzz' };
Object.defineProperty(o, 'asdkpjasdiasdjajoshdasouidhasojd', { get: function() { return 'test'; }});

const r1 = Object.findLongestKeyLength(o);
const r2 = Object.findLongestPropertyLength(o);

dir(o, '(object)');
console.eol(4);
dir(r1, 'Object.findLongestKeyLength(object)');
console.eol(2);
dir(r2, 'Object.findLongestPropertyLength(object)');
console.eol();

