#!/usr/bin/env node.js

const array = [
	{ eins: 1, zwei: 2, drei: 3 },
	{ eins: 4n, zwei: 5n, drei: 6n }
];

const min = Math.min(... array, 'eins');
const max = Math.max('drei', array);
dir(array, '(array)');
console.eol(4);
dir(min, 'Math.min(... array, "eins")');
dir(max, 'Math.max("drei", array)');

