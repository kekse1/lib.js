#!/usr/bin/env node.js

const start1 = [
	'/var/tmp/a/b/aa/aaa/./',
	'/./..///var/tmp/a/b',
	'//var/tmp//',
	'/var/tmp/a/b/c/'
];

const start2 = [
	'././var/tmp/./a///b//',
	'var/tmp/a/c',
	'var/tmp/a/b'
];

const start3 = [
	'./tmp/a/b',
	'tmp/a/c',
	'tmp/a/e'
];

const start4 = [ ... start3 ];
start4.push('/tmp/a/g/');

//
console.eol(10);

const resStart1 = path.sameStart(... start1);
const resStart2 = path.sameStart(... start2);
const resStart3 = path.sameStart(... start3);
const resStart4 = path.sameStart(... start4);

//
console.eol(2);
dir(start1, '(start #1)');
dir(resStart1, 'path.sameStart(... (start #1))');
console.eol(3);
dir(start2, '(start #2)');
dir(resStart2, 'path.sameStart(... (start #2))');
console.eol(3);
dir(start3, '(start #3)');
dir(resStart3, 'path.sameStart(... (start #3)');
console.eol(3);
dir(start4, '(start #4)');
dir(resStart4, 'path.sameStart(... (start #4)');
console.eol();

