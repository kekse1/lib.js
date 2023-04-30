#!/usr/bin/env node.js

//
const REST = true;

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
const result = String.align(... vector, { space: 3, rest: REST });

console.eol();
stdout(result);
console.eol(2);

