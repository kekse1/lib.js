#!/usr/bin/env node.js

const str = 'a b c';
const res = str.toUint8Array();

dir(res, str.quote('"') + '.toUint8Array()');

