#!/usr/bin/env node.js

const str = '<bold>bold</bold>\nnext line.';

const res1 = str.indexOf('BOLD');
const res2 = str.indexOf('BOLD', 0, false);
//const res3 = str.indexOf('bold', 0, true, true);//TODO/
const res4 = str.indexOf([10,10,13,'\r']);

dir(res1, str.quote('"') + '.indexOf("BOLD")');
dir(res2, str.quote('"') + '.indexOf("BOLD", 0, false)');
//dir(res3, str.quote('"') + '.indexOf("bold", 0, true, true)');
dir(res4, str.quote('"') + '.indexOf([ 10, 10, 13, "\\r" ])');

