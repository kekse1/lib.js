#!/usr/bin/env node.js

const input = [
	[ 1, 5, 3, 4, 5, 7, 2 ],
	[ 6, 4, 6, 2, 8, 1, 4, 7, 5 ],
	[ 4, 2, 3, 2, 5, 1, 9, 7 ]
];

const result = Array.intersect(... input);

dir(input, '(input)');
console.eol(4);
dir(result, 'Array.intersect(... (input))');

