#!/usr/bin/env node.js

const str = 'abc "def\\\\" ghi';

const res1 = str.quote('"', true, true);
const res2 = str.quote('"', true, false);

dir(str, '(string)');
console.eol(3);
dir(res1, '(string).quote(`"`, true, true)');
dir(res2, '(string).quote(`"`, true, false)');

