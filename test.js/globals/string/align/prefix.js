#!/usr/bin/env node.js

const vector = [
	'test #1',
	{ value: 'test #2', prefix: ' + ' },
	{ value: 'test #3' },
	'test #4'
];

const result = String.align(... vector, { prefix: ' - ' });
stdout(result);

