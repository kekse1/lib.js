#!/usr/bin/env node.js

const d = new DISK({ path: path.join(__dirname, 'set-length.tmp') });

d.length = 20;

