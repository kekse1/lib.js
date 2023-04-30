#!/usr/bin/env node.js

const str = 'string'.highBG + '<b>testing</b>';

log(str);

dir(str.length, str.toString('"') + '.length');
dir(str.textLength, str.toString('"') + '.textLength');

