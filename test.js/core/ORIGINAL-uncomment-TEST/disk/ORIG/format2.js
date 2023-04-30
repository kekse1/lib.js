#!/usr/bin/env node.js

//
const max = 'z';
const min = 'a';
const size = 256;
const fragm = 65536;
const file = path.join(__dirname, 'format2.tmp');
const rev = false;

//
const disk = DISK.create({ path: file });

//
disk.format(max, min, size, rev, fragm);

