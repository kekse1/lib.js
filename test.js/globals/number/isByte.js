#!/usr/bin/env node.js

const r0 = isByte('50');
const r1 = isByte('50', true);
const r2 = Number.isByte('50');
const r3 = Number.isByte(255);
const r4 = (127).isByte;
const r5 = (256).isByte;

dir(r0, 'isByte("50")');
dir(r1, 'isByte("50", true|10)');
dir(r2, 'Number.isByte("50")');
dir(r3, 'Number.isByte(255)');
dir(r4, '(127).isByte');
dir(r5, '(256).isByte');

