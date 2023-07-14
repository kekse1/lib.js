#!/usr/bin/env node.js

const a = ['eins','zwei','drei'];

dir(a, '(array)');
console.eol(3);

a.prefix('(prefix)');
a.suffix('(suffix)');

dir(a, '(after .prefix() and .suffix())');

