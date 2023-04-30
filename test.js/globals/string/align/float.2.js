#!/usr/bin/env node.js

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
const res0 = String.align(... vector, { array: true, space: 4, width: 0.5 });
const res1 = String.align(... vector, { space: 4, width: 0.5 });

console.eol();
dir(vector, '(vector)');
console.eol(7);
dir(res0, 'String.align(vector, { arrays: true, space: 4 })');
console.eol(3);
stdout(res1);
console.eol(2);

