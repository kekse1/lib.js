#!/usr/bin/env node.js

const a = [
	{ eins: 'EINS', zwei: 'ZWEI #1' },
	{ eins: 'EINS', zwei: 'ZWEI #2' },
	{ eins: 'eins', zwei: 'zwei' },
	{ eins: 'eins', zwei: 'drei' },
	{ eins: 'eins', zwei: 'vier' }
];

const map = a.index(['eins', 'zwei']);

dir(a, '(array)');
dir(map, '(array).index(["eins", "zwei"])');

