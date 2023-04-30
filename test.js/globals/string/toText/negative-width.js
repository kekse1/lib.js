#!/usr/bin/env node.js

const str = String.repeat(4096, '012');
const pre = ' (PREFIX) ';

const res = str.toText({ prefix: pre, width: -10, all: false });

stdout(res);

