#!/usr/bin/env node.js

const arr = [ 'eins', 'zwei', 3 ];

const res1 = arr.all('eins');
const res2 = arr.all('eins', 'zwei');
const res3 = arr.all('eins', 'zwei', 3, 4, 5);

dir(arr, '(array)');
console.eol(3);
dir(res1, '(array).all("eins")');
dir(res2, '(array).all("eins", "zwei")');
dir(res3, '(array).all("eins", "zwei", 3, 4, 5)');

