#!/usr/bin/env node.js

const objects = [ { eins: 'EINS', zwei: 'ZWEI', drei: 'DREI' },
	{ eins: 'ONE', zwei: 'TWO', drei: 'THREE' },
	{ eins: 'eins', zwei: 'zwei', drei: 'drei' },
	{ eins: 'EINS', zwei: 'ZWEI', drei: 'DREI' } ];

const r0 = Object.filter([ 'eins', 'zwei', 'drei' ], ... objects, null); // [ 0, 1, 2, 3 ]
const r1 = Object.filter([ 'eins', 'two', 'three' ], ... objects, true); // [ ]

const r2 = Object.filter({ eins: 'EINS', zwei: 'ZWEI' }, ... objects, true); // [ 0, 3 ]
const r3 = Object.filter({ eins: 'string', zwei: [ 'number', 'string' ] }, true, true, ... objects) // [ 0, 1, 2, 3 ]

const r4 = Object.filter({ eins: 'String', zwei: [ 'String' ] }, true, false, ... objects); // [ 0, 1, 2, 3 ]
const r5 = Object.filter({ eins: [ 'String' ], two: [ 'Number', 'String' ] }, true, ... objects, null); // [ 0, 1, 2, 3 ]

dir(objects, '(objects ... _args)');
console.eol(4);
dir(r0, 'Object.filter([ "eins", "zwei", "drei" ], ... objects, null) // [ 0, 1, 2, 3 ]', false);
dir(r1, 'Object.filter([ "eins", "two", "three" ], ... objects, true) // []', false);
console.eol(2);
dir(r2, 'Object.filter({ eins: "EINS", zwei: "ZWEI" }, ... objects, true) // [ 0, 3 ]', false);
dir(r3, 'Object.filter({ eins: "string", zwei: [ "number", "string" ] }, true, true, ... objects) // [ 0, 1, 2, 3 ]', false);
console.eol(2);
dir(r4, 'Object.filter({ eins: "string", zwei: [ "string" ] }, true, false, ... objects) // [ 0, 1, 2, 3 ]', false);
dir(r5, 'Object.filter({ eins: [ "String" ], two: [ "Number", "String" ] }, true, ... objects, null); // [ ]', false);

