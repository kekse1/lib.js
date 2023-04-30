#!/usr/bin/env node.js

const str = 'abc\r\ndef';
const res = str.escapeISO('random4');

console.log(res);

const un = res.less.unescapeISO();

dir(un);

