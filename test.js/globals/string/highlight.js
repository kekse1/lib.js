#!/usr/bin/env node.js

const str = 'dies ist ein test\r\neine zweite zeile.....'.toRandomCase();
const high = [ '..', 115, 'ein', 'xxx', 32 ];

const res1 = str.highlight(... high, true);
const res2 = str.highlight(... high, false);
const res3 = str.highlight(... high, null, false);

dir(str.quote(), '=> (...).highlight("..", 115, "ein", "xxx", 32, (null?), (true||false))');
console.eol(4);
stdout(res1);
console.eol(2);
stdout(res2);
console.eol(2);
stdout(res3);
console.eol();

