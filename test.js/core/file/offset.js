#!/usr/bin/env node.js

const f = FILE.create(__filename);
dir(f.size, '.size');
console.eol(4);

for(var i = 0; i < 100; ++i)
{
	dir(f.offset(i), '.offset(' + i + ')');
}

