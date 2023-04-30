#!/usr/bin/env node.js

//
const REST = true;

//
const vector = [
	{
		value: String.fill(384, 'abcdef'),
		verticalAlign: 'bottom'
	},
	{
		value: String.fill(256, 'fedcba'),
		verticalAlign: 'middle'
	},
	{
		value: String.fill(768, 'xyz')
	},
	{
		value: String.fill(512, '01'),
		verticalAlign: 'top'
	}
];

//
const res = String.align(... vector, { verticalAlign: 'bottom', fullFill: true, fill: LINE, rest: REST });

console.eol();
stdout(res);
console.eol();

