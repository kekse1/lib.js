#!/usr/bin/env node.js

const p = path.join(__dirname, 'symlinks', 'test.ln');

const r1 = fs.readlinks.all(p, false);
const r2 = fs.readlinks.all(p, true);

dir(r1, 'fs.readlinks.all("' + p + '", false)');
dir(r2, 'fs.readlinks.all("' + p + '", true)');

