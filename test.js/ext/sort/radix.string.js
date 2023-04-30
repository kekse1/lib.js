#!/usr/bin/env node.js

const array = [ 'eins', 'zwei', 'drei' ];

const result1 = sort.radix.string(null, array, true, null, null);
const result2 = sort.radix.string(null, array, false, null, false);

dir(array, '(array)');
console.eol(3);
dir(result1, 'sort.radix.string(null, (array), TRUE, null, NULL)');
console.eol();
dir(result2, 'sort.radix.string(null, (array), FALSE, null, FALSE)');

