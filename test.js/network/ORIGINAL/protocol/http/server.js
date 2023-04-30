#!/usr/bin/env node.js

const Server = require('net/server');
const server = Server.create({

	address: 'http://0.0.0.0:1234',

	//buffer[Path]: path.join(__dirname, 'buffer')

});

server.start((_event, _server) => {
	//
});

