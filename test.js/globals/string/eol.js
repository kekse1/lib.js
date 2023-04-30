#!/usr/bin/env node.js

const str = 'abc\rdef\r\nghi\njkl\n\rmno\nlast';

const res = str.eol();

dir(str);
dir(res);

