#!/usr/bin/env node.js

const a = [97,98,99,100,101,102];
const b = a.setLength(3);
const c = a.setLength(-3);
const d = a.setLength(20);
const e = a.setLength(-20);

dir(a, '(Uint8Array)');
console.eol(2);
dir(b, '(Uint8Array).setLength(3)');
dir(c, '(Uint8Array).setLength(-3)');
console.eol();
dir(d, '(Uint8Array).setLength(20)');
dir(e, '(Uint8Array).setLength(-20)');

