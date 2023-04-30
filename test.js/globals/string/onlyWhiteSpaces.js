#!/usr/bin/env node.js
const str = ' \t <b> ' + ESC + '[0m' + NUL + ' \t  </b> ';
const res = str.onlyWhiteSpaces(true);
dir(res, str.quote('"') + '.onlyWhiteSpaces(true)');
