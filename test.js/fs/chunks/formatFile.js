#!/usr/bin/env node.js

//const LENGTH = 10;
const LENGTH = 14;//null
const CHUNK = 10;
const OFFSET = 3;
const RADIX = 10;
const ENCODING = 'utf8';
const TRUNCATE = true;
const REVERSE = true;
const THROW = true;
const FILE = 'testing.tmp';

function callback(_event)
{
	dir(_event, { compact: true, depth: 0, text: '_event @ callback()' });
}

const p = path.join(__dirname, FILE);

const r = fs.formatFile(p, callback, {
	chunk: CHUNK,
	offset: OFFSET,
	length: LENGTH,
	truncate: TRUNCATE,
	radix: RADIX,
	reverse: REVERSE,
	encoding: ENCODING
}, THROW);

dir(r, 'fs.formatFile("' + p + '", ...)');

