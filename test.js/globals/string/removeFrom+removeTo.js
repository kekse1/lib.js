#!/usr/bin/env node.js

var str = 'index.html?abc=def';

const res1 = str.removeTo('html', '=');
const res2 = str.removeTo('!', '?');
const res3 = str.removeFrom('html', '.');
const res4 = str.removeFrom('!', '?');

const res5 = str.removeFrom('e');
const res6 = str.removeFrom('e', true);
const res7 = str.removeFrom('e', -5);

str = str.toString('"');

dir(res1, str + '.removeTo("html", "=")');
dir(res2, str + '.removeTo("!", "?")');
console.eol();
dir(res3, str + '.removeFrom("html", ".")');
dir(res4, str + '.removeFrom("!", "?")');
console.eol();
dir(res5, str + '.removeFrom("e")');
dir(res6, str + '.removeFrom("e", true)');
dir(res7, str + '.removeFrom("e", -5)');

