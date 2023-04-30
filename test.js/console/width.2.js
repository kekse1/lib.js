#!/usr/bin/env node.js


var str;

for(var i = 1; i < 8; i++)
{
	console.info((String.fill(console.size.width - i, 'abcdef')).bold);
}

