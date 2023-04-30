#!/usr/bin/env node.js

const items = [
	'example.com',
	'kuchen@kekse.biz',
	'nick!user@host',
	'nick!~user'
];

const Prefix = require('net/protocol/irc/').Prefix;

for(var i = 0; i < items.length; i++)
{
	items[i] = Prefix.parse(items[i]);
	dir(items[i].toObject(), items[i].toString().toString('"'));
	dir(items[i].isServer + ' // ' + items[i].identified, '.isServer // .identified');
	console.eol(3);
}

