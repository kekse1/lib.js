#!/usr/bin/env node.js

IRC = require('net/protocol/irc/');

const server = IRC.Server.create({
	//TODO/meine ich '.root'? oder wozu?
	//TODO/UND @ TEXT-DB (4 irc-templates! ;-)
	//path: path.join(__dirname, 'irc'),
	host: '127.0.0.1',
	logger: 'irc-raw-log',//'irc-raw-log'//true for cwd().. ;-)
});

server.start();

/*server.onlink = (_client) => {
	dir(_client.write('test'), _client.toString() + '.write("test")');
};*/

//remove the path by = null:
//server.path = null;


/*
dir(server.name, 'server.name');
server.name = 'opladen';
dir(server.name, 'server.name = "opladen"');
 */

//
//todo/..! ;-D
//
//server.saveItem('irc/version', require('~/git/xyz/version.json'));
//server.saveItem('up', server.up);
//server.saveItem('host', server.host);

