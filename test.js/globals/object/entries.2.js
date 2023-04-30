#!/usr/bin/env node.js

const a = [ 'a', 'b' ];
a.eins = 'TEST #1';
a.zwei = 'TEST #2';

dir(a, '(array+object)');
console.eol(3);
dir(Object.entries(a), 'Object.entries((array+object))');
console.eol();
dir(Object.entries(a, true), 'Object.entries((array+object), true)');

