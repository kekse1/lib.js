#!/usr/bin/env node.js

const args = [ true, null, 3.14, 4096n ];
const res = String.printf(... args);

dir(args, '(args)');
console.eol(3);
stdout(res);

