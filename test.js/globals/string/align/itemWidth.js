#!/usr/bin/env node.js

const vector = [
	20,
	'abc',
	'def',
	'ghi',
	{ value: 'jkl', width: 10 },
	'mno'
];

const result = String.align(... vector, { itemWidth: 5 });
stdout(result);

