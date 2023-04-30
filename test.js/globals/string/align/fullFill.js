#!/usr/bin/env node.js

//
const FILL = LINE;
const FULL_FILL = true;

//
const vector = [
	{
		value: String.fill(384, 'abcdef')
	},
	{
		value: String.fill(256, 'fedcba')
	},
	{
		value: String.fill(768, 'xyz')
	},
	{
		value: String.fill(512, '01')
	}
];

//
const result = String.align(... vector, { space: 3, fill: FILL, fullFill: FULL_FILL, width: '100%' });

console.eol();
stdout(result);
console.eol(2);

