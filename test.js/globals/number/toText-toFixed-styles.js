#!/usr/bin/env node.js

var num = 4096.1415;

dir(num, '(number)');
console.eol(3);
dir(num.toText(), '(number).toText()');
dir(num.toText(2), '(number).toText(2)');
dir(num.toText(8), '(number).toText(8)');
console.eol(2);
dir(num.toText({ min: 0, max: 1 }), '(number).toText({ min: 0, max: 1 })');
dir(num.toText({ min: 2, max: 8 }), '(number).toText({ min: 2, max: 8 })');

