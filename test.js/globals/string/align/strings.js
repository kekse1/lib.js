#!/usr/bin/env node.js

//
const vector = [
	'abc',
	'abcdef',
	'abcdefghi',
	'abcdefghijkl'
];

//
const res1 = String.align(... vector, { align: 'center' });
const res2 = String.align(... vector, { width: '50%', align: 'right' });
const res3 = String.align(... vector, { width: 0 });
vector.splice(2, 0, 20);
const res4 = String.align(... vector, { width: 0 });

console.eol();
stdout(res1);
console.eol(2);
stdout(res2);
console.eol(2);
stdout(res3);
console.eol(2);
stdout(res4);
console.eol();

