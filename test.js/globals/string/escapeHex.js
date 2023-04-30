#!/usr/bin/env node.js

const str = 'abc\r\ndef';
const res = str.escapeHex(['random','blue']);

console.log(res);

const un = res.less.unescapeHex();

dir(un);

