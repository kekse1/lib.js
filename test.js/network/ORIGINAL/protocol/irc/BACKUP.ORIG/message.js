#!/usr/bin/env node.js

IrcMessage = require('net/protocol/irc/message');

const res1 = IrcMessage.create('   @key=value;key2=value2          :nick!user@host   command     arg1   arg2 arg3    : dies ist die nachricht ');
const res2 = IrcMessage.create('USER kuchen kuchen localhost :Sebastian Kucharczyk');

dir(res1.toObject());
dir(res1.line);
console.eol(4);
dir(res2.toObject());
dir(res2.line);

