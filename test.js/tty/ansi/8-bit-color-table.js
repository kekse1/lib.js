#!/usr/bin/env node.js

for(var i = 0; i < 2; i++)
{
	stdout(ansi.color8.table(!!i));
	console.eol(3);
}

