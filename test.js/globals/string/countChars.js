#!/usr/bin/env node.js

const str = 'abcdefabcdefabc';

const res = str.countChars(97, 122);

dir(res, str.toString('"') + '.countChars(122, 97)');

