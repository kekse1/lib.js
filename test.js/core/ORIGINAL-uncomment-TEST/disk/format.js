#!/usr/bin/env node.js

//
//const TYPE = 16;
const TYPE = 'xyz';

//
const progress = (_event) => {
	dir(_event);
	console.eol();
};

const p = path.resolve('format.tmp');
const res = DISK.format(p, {
	//length: '1 kib',
	start: 0,
	stop: 31,
	//type: 16,
	type: TYPE,
	random: false,
	crypto: true,
	reverse: false,
	//progressCallback: progress,
	chunk: 20,
	cut: true,
	throw: true,
	fallback: false
}, progress);

console.eol(3);
dir(res, 'DISK.format(...)');
