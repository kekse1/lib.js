#!/usr/bin/env node.js

const arrStart = [
	[ 'eins', 'zwei', 'drei', 'vier' ],
	[ 'eins', 'zwei', 'drei', 'acht' ],
	[ 'eins', 'zwei', 'vier', 'acht' ]
];

const arrEnd = [
	[ 'vier', 'drei', 'zwei', 'eins' ],
	[ 'acht', 'drei', 'zwei', 'eins' ],
	[ 'acht', 'vier', 'zwei', 'eins' ]
];

const resStart = Array.sameStart(... arrStart);
const resEnd = Array.sameEnd(... arrEnd);

console.eol(2);
dir(arrStart, '(start)');
console.eol(2);
dir(resStart, 'Array.sameStart(... start)');
console.eol(6);
dir(arrEnd, '(end)');
console.eol(2);
dir(resEnd, 'Array.sameEnd(... end)');
console.eol();

