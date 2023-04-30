#!/usr/bin/env node.js

//
const vector = [
	{
		value: String.fill(384, 'abcdef'),
		width: 40
	},
	40,
	{
		value: String.fill(256, 'fedcba'),
		width: 20
	}
];

//
const res0 = String.align(... vector, { array: true, space: 4 });
const res1 = String.align(... vector, { space: 4 });

console.eol();
dir(vector, '(vector)');
console.eol(7);
dir(res0, 'String.align(vector, { arrays: true, space: 4 })');
console.eol(3);
stdout(res1);
console.eol(2);

