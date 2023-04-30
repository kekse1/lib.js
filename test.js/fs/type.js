#!/usr/bin/env node.js

const res1 = fs.type(__filename);
const res2 = fs.type(__dirname);

dir(res1, 'fs.type(__filename)');
dir(res2, 'fs.type(__dirname)');

