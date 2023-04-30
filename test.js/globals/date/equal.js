#!/usr/bin/env node.js

const one = new Date();
const two = new Date(one.getTime());
const tre = new Date(one.getTime());
const fur = one.getTime();
sleep(1000);
const fiv = new Date();

const r1 = Date.equal(one, two);
const r2 = Date.equal(one, two, tre);
const r3 = Date.equal(one, two, tre, fur);
const r4 = Date.equal(one, two, tre, fur, fiv);

dir(one, '(Date #1)');
dir(two, '(Date #2)');
dir(tre, '(Date #3)');
dir(fur, '(Date #4)');
dir(fiv, '(Date #5)');

console.eol(4);

dir(r1, 'Date.equal(#1, #2)');
dir(r2, 'Date.equal(#1, #2, #3)');
dir(r3, 'Date.equal(#1, #2, #3, #4)');
dir(r4, 'Date.equal(#1, #2, #3, #4, #5)');

