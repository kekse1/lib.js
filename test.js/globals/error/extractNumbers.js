#!/usr/bin/env node.js

const res0 = Error.extractNumbers('a');
const res1 = Error.extractNumbers('abcdef');
const res2 = Error.extractNumbers('abcdef:2');
const res3 = Error.extractNumbers('abcdef:2:3');
const res4 = Error.extractNumbers('abcdef:2:3:4');
const res5 = Error.extractNumbers('abcdef:2:3:4:5:6');
const res6 = Error.extractNumbers('a::');
const res7 = Error.extractNumbers('::a:bc::');
const res8 = Error.extractNumbers(':a::2a3:6');
const res9 = Error.extractNumbers('a::2a3:4:6');
const resa = Error.extractNumbers('a::2a3:4:6:');

dir(res0, 'Error.extractNumbers("a")');
dir(res1, 'Error.extractNumbers("abcdef")');
dir(res2, 'Error.extractNumbers("abcdef:2")');
dir(res3, 'Error.extractNumbers("abcdef:2:3")');
dir(res4, 'Error.extractNumbers("abcdef:2:3:4")');
dir(res5, 'Error.extractNumbers("abcdef:2:3:4:5:6")');
dir(res6, 'Error.extractNumbers("a::")');
dir(res7, 'Error.extractNumbers("::a:bc::")');
dir(res8, 'Error.extractNumbers(":a::2a3:6")');
dir(res9, 'Error.extractNumbers("a::2a3:4:6")');
dir(resa, 'Error.extractNumbers("a::2a3:4:6:")');

