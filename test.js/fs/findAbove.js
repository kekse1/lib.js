#!/usr/bin/env node.js

const p = '/tmp/abc/def/ghi.tmp';
const r = fs.findAbove(p);

dir(r, 'fs.findAbove(' + p.toString('"') + ')');

