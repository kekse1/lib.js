#!/usr/bin/env node.js

const keys = prompt.keys;

for(const type in keys)
{
	console.eol();
	dir(keys[type], '.type = ' + type.quote('"'));
}

console.eol();

