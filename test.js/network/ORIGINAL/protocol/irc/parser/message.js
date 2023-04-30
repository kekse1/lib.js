#!/usr/bin/env node.js

//
const items = [
	':nick!~user 404 eins zwei',
	'403   a   b  c  :  def  ',
	':host.com command :no params'
];

//
Message = require('net/protocol/irc/').Message;

for(var i = 0; i < items.length; i++)
{
	items[i] = Message.parse(items[i]);
	dir(items[i].toObject(), items[i].toString().toString('"'));
}

