#!/usr/bin/env node.js

dir(date(), 'date()');
console.eol(2);

for(var i = 0; i < date.formats.length; i++)
{
	dir(date[date.formats[i]](), date[date.formats[i].toUpperCase()].toString('"') + '    [' + date.formats[i] + ']');
}

