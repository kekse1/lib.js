#!/usr/bin/env node.js

//
const REST = true;

//
const vector = [
	{
		value: String.fill(384, 'abcdef'),
		width: 8
	},
	{
		value: String.fill(256, 'fedcba')
	},
	{
		value: String.fill(768, 'xyz')
	},
	{
		value: String.fill(512, '01'),
		width: 64
	}
];

//
const res = String.align(... vector, { width: -8, space: 4, rest: REST });

console.eol();
stdout(res);
console.eol();

