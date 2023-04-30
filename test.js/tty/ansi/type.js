#!/usr/bin/env node.js

ansi = require('tty/ansi');

const seq = (ESC + '[2;2H' + NUL);

//process.stdout.write(seq + ' (2,2)');

const res1 = ansi.type(seq);
const res2 = ansi.is(seq, 'cursor');

dir(res1, 'ansi.type("' + seq.escapeHex(true) + '")');
dir(res2, 'ansi.is("' + seq.escapeHex(true) + '", "cursor")');

