#!/usr/bin/env node.js

const lines = [ ",.-'`'-.,", '# ', '#', '/' ];

console.eol(3);
for(const l of lines)
{
	console.line(l, { center: ' console.line() ', right: ' (.. and set \'\$line\') ' });
	console.eol(3);
}

