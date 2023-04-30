#!/usr/bin/env node.js

const str = '<bold>bold</bold>\nnext line.';

const res1 = str.lastIndexOf('BOLD');
const res2 = str.lastIndexOf('BOLD', null, false);
//const res3 = str.lastIndexOf('bold', 0, true, true);//TODO/
const res4 = str.lastIndexOf([10,10,13,'\r']);

dir(res1, str.quote('"') + '.lastIndexOf("BOLD")');
dir(res2, str.quote('"') + '.lastIndexOf("BOLD", null, false)');
//dir(res3, str.quote('"') + '.lastIndexOf("bold", 0, true, true)');
dir(res4, str.quote('"') + '.lastIndexOf([ 10, 10, 13, "\\r" ])');

