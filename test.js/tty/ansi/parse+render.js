#!/usr/bin/env node.js

const seq = ansi.color('#f00', '#ff0', 'test-string');

const res = ansi.parse(seq);

dir(res, 'ansi.parse("' + seq.escapeISO(true) + '")');

