#!/usr/bin/env node.js

const a = 255;
const b = '255';
const c = 256;
const d = '256';

const ra = String.isByte(a);
const rb = b.isByte(10);
const rc = String.isByte(c);
const rd = String.isByte(d, 10);

dir(ra, 'String.isByte(255)');
dir(rb, '"255".isByte(10)');
dir(rc, 'String.isByte(256)');
dir(rd, 'String.isByte("256", 10)');

