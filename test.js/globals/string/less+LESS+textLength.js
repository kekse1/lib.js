#!/usr/bin/env node.js

//
//BEHAVIOR CHANGES je nachdem which !BROWSER or !!BROWSER..
//

const str1 = 'bold-test w/ ansi'.bold + '   <b>bold-test w/ html/xml</b> ok?..';

dir(str1, '(string)');
console.eol(3);

const res1 = str1.textLength;
const res2 = str1.less;
const res3 = str1.LESS;

dir(res1, '(string).textLength (' + res1.length + ')');
dir(res2, '(string).less (' + res2.length + ')');
dir(res3, '(string).lESS (' + res3.length + ')');

