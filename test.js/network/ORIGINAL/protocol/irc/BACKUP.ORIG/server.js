#!/usr/bin/env node.js

IRC = require('net/protocol/irc/');

const server = IRC.Server.create({
	path: path.join(__dirname, 'irc.json'),
	host: '127.0.0.1'
});

server.start();


dir(server.name, 'server.name');
server.name = 'opladen';
dir(server.name, 'server.name = "opladen"');

//
//todo/..! ;-D
//
//server.saveItem('irc/version', require('~/git/xyz/version.json'));
//server.saveItem('up', server.up);
//server.saveItem('host', server.host);

