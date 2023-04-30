#!/usr/bin/env node.js

const strStart = [
	'eins zwei drei vier',
	'eins zwei drei acht',
	'eins zwei vier acht'
];

const strEnd = [
	'vier drei zwei eins',
	'acht drei zwei eins',
	'acht vier zwei eins'
];

const resStart = String.sameStart(... strStart);
const resEnd = String.sameEnd(... strEnd);

console.eol(2);
dir(strStart, '(start)');
console.eol(2);
dir(resStart, 'String.sameStart(... start)');
console.eol(6);
dir(strEnd, '(end)');
console.eol(2);
dir(resEnd, 'String.sameEnd(... end)');
console.eol();

