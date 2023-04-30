#!/usr/bin/env node.js

const col1 = '#abc';
const col2 = [ 255, 255, 255 ];

const res1 = ansi.isColor(col1);
const res2 = ansi.isColor(col2);

dir(res1, 'ansi.isColor("#abc")');
dir(res2, 'ansi.isColor([ 255, 255, 255 ])');

