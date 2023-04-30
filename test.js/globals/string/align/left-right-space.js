#!/usr/bin/env node.js

const vector = [
	'eins',
	{ value: 'zwei', realLeftSpace: 12, prefix: '(12) ' },
	'drei',
	'vier'
];

const result = String.align(... vector, { realLeftSpace: 3, rightSpace: 3, width: 0, space: false, prefix: '(3) ' });
stdout(result);

