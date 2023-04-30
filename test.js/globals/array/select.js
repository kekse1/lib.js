#!/usr/bin/env node.js

const arr1 = [
	{ eins: 'EINS', zwei: 'ZWEI' },
	{ eins: 'aaaa', zwei: 'bbbb' },
	{ eins: 'AAAA', zwei: 'BBBB' }
];

const arr2 = [
	[ 'eins', 'zwei' ],
	[ 'one', 'two' ],
	[ 'uno', 'due' ]
];

const arr3 = [
	[ { key: "one" } ],
	[ { key: "two" } ]
];

const res1 = arr1.select('eins');
const res2 = arr2.select(0);
const res3 = arr3.select('0.key');

dir(res1, '(array).select("eins")');
dir(res2, '(array).select(0)');
dir(res3, '(array).select("0.key")');

