#!/usr/bin/env node.js

const p = path.join(__dirname, 'symlinks', 'test.ln');

const r1 = fs.readlinks.one(p, false);
const r2 = fs.readlinks.one(p, true);

dir(r1, 'fs.readlinks.one("' + p + '", false)');
dir(r2, 'fs.readlinks.one("' + p + '", true)');

