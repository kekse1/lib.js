#!/usr/bin/env node.js

//
const READLINE = true;
const ENCODING = null;

//
function connectionCallback(_client, _server, _socket, _serverSocket, _type)
{
	_client.warn('connection!');
}

function secureCallback(_client, _server, _socket, _serverSocket)
{
	_client.warn('secure callback!');
}

function insecureCallback(_client, _server, _socket, _serverSocket)
{
	_client.warn('insecure callback!');
}


const Server = require('net/server');
const server = Server.create({
	//
	readline: true,
	readlineEscape: '\\',
	//readlineMaxLength: 4,

	//
	//address: 'https://0.0.0.0:4321',
	/*protocol: 'http',
	host: '0.0.0.0',
	tcp: 1234,
	tls: 4321,*/
	address: 'tcp://127.0.0.1:6667',

	encoding: ENCODING

	/*, callback: connectionCallback,
	secure: secureCallback,
	insecure: insecureCallback*/
});


server.start((_event, _server) => {
	_server.info('Started! ;-)');
});

server.on('link', (_client, _server, _socket, _server_socket, _type) => {
	_client.on('line', (_args) => {
		dir(_args, _args.line.toString('"') + ' (#' + _args.lines + ')');
	});
});

server.on('unlink', (_client, _server, _socket, _server_socket, _type) => {
	//
});

