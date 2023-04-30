#!/usr/bin/env node.js

//
const FILL = LINE;
const FULL_FILL = false;

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
const result = String.align(... vector, { space: 4, fill: FILL, fullFill: FULL_FILL, itemWidth: '20%' });

console.eol();
stdout(result);
console.eol(2);

