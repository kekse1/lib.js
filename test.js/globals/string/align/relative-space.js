#!/usr/bin/env node.js

const vector = [
	'eins',
	'zwei',
	{ value: 'drei', space: 12 },
	'vier'
];

const result = String.align(... vector, { space: 2, width: 0 });
stdout(result);

