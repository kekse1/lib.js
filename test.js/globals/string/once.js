#!/usr/bin/env node.js

var str = 'abc def ghi jkl.';

const res1 = str.once(' ');
const res2 = str.once('!');
const res3 = str.once('.');

str = str.toString('"');

dir(res1, str + '.once(" ")');
dir(res2, str + '.once("!")');
dir(res3, str + '.once(".")');

