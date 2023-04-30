#!/usr/bin/env node.js

const p = path.join(__dirname, 'symlinks', 'test.ln');

const r1 = fs.readlinks(p, false);
const r2 = fs.readlinks(p, true);

dir(r1, 'fs.readlinks("' + p + '", false)');
dir(r2, 'fs.readlinks("' + p + '", true)');

