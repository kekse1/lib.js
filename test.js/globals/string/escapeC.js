#!/usr/bin/env node.js

const str = 'abc\r\ndef';
const res = str.escapeC(true);

console.log(res);

const un = res.less.unescapeC();

console.dir(un);

