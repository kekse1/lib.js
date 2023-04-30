#!/usr/bin/env node.js

const res = fs.size(__filename);
dir(res, 'fs.size("' + __filename + '")');

