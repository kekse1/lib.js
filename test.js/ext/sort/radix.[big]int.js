#!/usr/bin/env node.js

const array = [ 50n, -50n, 20n, 100n, 2000n, -2000n, 5000n, 1n ]; // only bigint or only integers.. and no mixing!

const result1 = sort.radix.int(null, array, true, null, null);
const result2 = sort.radix.bigint(null, array, false, null, false);

dir(array, '(array)');
console.eol(3);
dir(result1, 'sort.radix.int(null, (array), TRUE, null, NULL)');
console.eol();
dir(result2, 'sort.radix.bigint(null, (array), FALSE, null, FALSE)');

