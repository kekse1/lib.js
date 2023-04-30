#!/usr/bin/env node.js

const res1 = process.hrtime();
const res2 = process.hrtime.all();

dir(res1, 'process.hrtime()');
dir(res2, 'process.hrtime.all()');

