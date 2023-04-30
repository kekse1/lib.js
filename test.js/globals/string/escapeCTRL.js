#!/usr/bin/env node.js

const str = 'abc\r\ndef';
const res = str.escapeCTRL(true);

console.log(res);

const un = res.less.unescapeCTRL();

dir(un);

