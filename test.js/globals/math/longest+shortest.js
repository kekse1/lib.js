#!/usr/bin/env node.js

const arr1 = [ 'abcd', 'bcdef', 'ghijklmnopqr', 'abcd' ];
//const arr1 = [ null, 1, 3, 6, 9, 12n, 18, 24n, 29 ];
const arr2 = [ 'eins', 'zwei', 'drei', 'ab', 'A', 'B' ];

const longest1 = Math.longest(arr1, arr2);
const shortest1 = Math.shortest(arr1, arr2);
const longest2 = Math.longest(arr1, arr2, false);
const shortest2 = Math.shortest(arr1, arr2, true);
const shortest3 = Math.shortest(arr1, arr2, null);

dir(longest1, 'Math.longest(...)');
dir(shortest1, 'Math.shortest(...)');
dir(longest2, 'Math.longest(..., false)');
dir(shortest2, 'Math.shortest(..., true)');
dir(shortest3, 'Math.shortest(..., null)');

