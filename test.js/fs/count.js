#!/usr/bin/env node.js

const p = __dirname;

const res1 = fs.count.file(p, true);
const res2 = fs.count(p, true);

dir(res1, 'fs.count.file("' + p + '", true)');
dir(res2, 'fs.count("' + p + '", true)');

const res3 = fs.list.file(p, true);
const res4 = fs.list(p, true);

dir(res3, 'fs.list.file("' + p + '", true)');
dir(res4, 'fs.list("' + p + '", true)');

