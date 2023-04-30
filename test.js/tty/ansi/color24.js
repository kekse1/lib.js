#!/usr/bin/env node.js

const res = 'abc'.color('f26');

console.debug(res + ' (console.debug(res))');
console.eol();
console.dir(res);

console.eol(3);

console.dir(ansi.type(res));

