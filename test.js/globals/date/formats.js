#!/usr/bin/env node.js

dir(date.formats, 'date.formats');
console.eol(2);

for(var i = 0; i < date.formats.length; i++)
{
	dir(date[date.formats[i]](), date.formats[i].toString('"'));
}

