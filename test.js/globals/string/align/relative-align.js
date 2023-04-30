#!/usr/bin/env node.js

const vector = [
	{ value: 'test #1', align: 'left' },
	{ value: 'test #2' },
	'test #3',
	'test #4',
	{ value: 'test #5', align: 'right' }
];

const result = String.align(... vector, { align: 'center' });
stdout(result);

