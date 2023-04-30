#!/usr/bin/env node.js

const res1 = fs.perms(__filename);

const res2 = fs.isPerm(parseInt(res1, 8));
const res3 = fs.isPerm(4095);
const res4 = fs.isPerm(4096);

dir(res1, 'fs.perms("' + __filename + '")');
dir(res2, 'fs.isPerm(parseInt("' + res1 + '", 8)');
dir(res3, 'fs.isPerm(4095)');
dir(res4, 'fs.isPerm(4096)');

