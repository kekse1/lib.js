#!/usr/bin/env node.js

const e = new Error("TEST-fehler");
var r = e.parseStack(false);

dir(e.stack, '(error).stack');
console.eol(8);
dir(r, '(error).parseStack(false)');
r = e.parseStack(true);
console.eol(4);
log(r.join(EOL), '(error).parseStack(true).join(EOL)');

