#!/usr/bin/env node.js

const stdinWas = Object.was(process.stdin);

dir(stdinWas, 'Object.was(process.stdin)');
console.eol(2);

const check1 = [ 'a', 'b' ];
const check2 = [ ... check1, 'stream' ];

const res1 = Object.was(process.stdin, ... check1);
const res2 = Object.was(process.stdin, ... check2, true);
const res3 = Object.was(process.stdin, ... check2, false);
const res4 = Object.was(process.stdin, 'x', 'Stream');

dir(res1, 'Object.was(process.stdin, "a", "b") // false');
dir(res2, 'Object.was(process.stdin, "a", "b", "stream", true) // false');
dir(res3, 'Object.was(process.stdin, "a", "b", "stream", false) // true');
dir(res4, 'Object.was(process.stdin, "x", "Stream") // true');

