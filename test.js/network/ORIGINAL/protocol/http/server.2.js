#!/usr/bin/env node.js

//
const TIMEOUT = 20000;
const TIMEOUT_STOP = 10000;
const KILLALL = false;
const END_WITH_HTTP_EXAMPLE = true;
const LINES = 4;
const MAX = 16;
const WRITE_BITS = false;
const BUFFER_APPEND = false;
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
	readline: READLINE,

	//
	writeBits: WRITE_BITS,
	bufferAppend: BUFFER_APPEND,

	//address: 'https://0.0.0.0:4321',
	protocol: 'http',
	host: '0.0.0.0',
	tcp: 1234,
	tls: 4321,

	encoding: ENCODING,

	timeout: (typeof TIMEOUT === 'number' ? Math.abs(TIMEOUT.int) : 0),
	bufferDirectory: path.join(process.cwd(), 'buffer'),

	callback: connectionCallback,
	secure: secureCallback,
	insecure: insecureCallback
});

server.start((_event, _server) => {
	setTimeout(() => { server.stop((_event, _server) => {
		//
	}, KILLALL); }, TIMEOUT_STOP);
});

server.on('link', (_client, _server, _socket, _server_socket, _type) => {
	_client.warn('Setting \'% = %\'.. ^_^', '_client.readlineMaxLength', MAX);
	_client.readlineMaxLength = MAX;

	_client.on('line', (_args) => {
		if(_args.lines === LINES)
		{
			_args.stop();
		}
		else if(_args.lines === 1)
		{
			console.debug('HTTP HEAD'.highFG + ': ' + _args.line.highBG);

			if(END_WITH_HTTP_EXAMPLE)
			{
				_client.debug('Ending socket with HTTP example(!) now...');
				_client.endString('HTTP/1.1 200 OK\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Length: 5\r\n\r\nTEST!');
			}
		}

		dir(_args.line, _args.lines + ' / ' + LINES);
	});
});

server.on('unlink', (_client, _server, _socket, _server_socket, _type) => {
	//
});

