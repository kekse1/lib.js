#!/usr/bin/env node.js

for(var i = 0; i < 2; i++)
{
	stdout(ansi.color4.table(!!i));
	console.eol(3);
}

