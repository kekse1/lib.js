#!/usr/bin/env node.js

const a = new Uint8Array([2,4,6,8]);
const b = a.clone();

dir(a);
dir(b);
console.eol(2);
dir(a === b, 'a === b');
dir(a.buffer === b.buffer, 'a.buffer === b.buffer');
console.eol(2);
a[0] = 88;
dir(a);
dir(b);

