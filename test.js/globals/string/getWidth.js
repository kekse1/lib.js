#!/usr/bin/env node.js

const w1 = 25.25;
const w2 = '-25.25';
const w3 = '25%';
const w4 = '-25%';
const w5 = 0.75;
const w6 = '-0.25';
const w7 = -(console.width + 3);
const w8 = (console.width + 3);

dir(console.width, 'console.width');
console.eol(2);

const r1 = String.getWidth(w1);
const r2 = String.getWidth(w2);
const r3 = String.getWidth(w3);
const r4 = String.getWidth(w4);
const r5 = String.getWidth(w5);
const r6 = String.getWidth(w6);
const r7 = String.getWidth(w7);
const r8 = String.getWidth(w8);

dir(r1, 'String.getWidth(' + w1 + ')');
dir(r2, 'String.getWidth("' + w2 + '")');
dir(r3, 'String.getWidth("' + w3 + '")');
dir(r4, 'String.getWidth("' + w4 + '")');
dir(r5, 'String.getWidth(' + w5 + ')');
dir(r6, 'String.getWidth("' + w6 + '")');
dir(r7, 'String.getWidth(' + w7 + ')');
dir(r8, 'String.getWidth(' + w8 + ')');

console.eol();

