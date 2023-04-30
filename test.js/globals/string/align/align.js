#!/usr/bin/env node.js

//
const vector = [
	{
		value: String.fill(96, 'abcdef'),
		width: 10
	},
	{
		value: String.fill(64, 'fedcba'),
		width: 15
	},
	{
		value: String.fill(192, 'xyz'),
		width: 20
	},
	{
		value: String.fill(128, '01'),
		width: 25
	}
];

//
const res1 = String.align(... vector, { align: 'left', verticalAlign: 'top' });
const res2 = String.align(... vector, { align: 'center', verticalAlign: 'middle' });
const res3 = String.align(... vector, { align: 'right', verticalAlign: 'bottom' });

console.eol();
stdout(res1);
console.eol();
stdout(res2);
console.eol();
stdout(res3);
console.eol();

