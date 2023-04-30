#!/usr/bin/env node.js

const str = '  abc \t\t def \n \rn hjl ';
const res1 = str.reduce();
const res2 = str.reduce('a', 'b');

dir(str, '(string)');
dir(res1, '(string).reduce()');
dir(res2, '(string).reduce("a", "b")');

