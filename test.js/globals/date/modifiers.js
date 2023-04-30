#!/usr/bin/env node.js

dir(Date.modifiers, 'Date.modifiers');
console.eol(2);

for(var i = 0; i < Date.modifiers.length; i++)
{
	dir(Date.format(`%${Date.modifiers[i]}`), Date.modifiers[i].toString('"'));
}

