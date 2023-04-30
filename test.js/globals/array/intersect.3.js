#!/usr/bin/env node.js

const a = [
	[ 1, 2, 3, 4, 5, 6, 6, 6, 7, 8, 9, 10 ],
	[ 1, 12, 113, 1, 25, 3, 6, 6 ]
];

const res1 = Array.intersect(... a);
const res2 = Array.intersect(... a, true);

dir(a, '(array)');
console.eol(4);
dir(res1, 'Array.intersect(... (array))');
console.eol(2);
dir(res2, 'Array.intersect(... (array), true)');

