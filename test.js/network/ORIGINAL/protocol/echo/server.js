#!/usr/bin/env node.js

//
//port 7/7 und 77 @ tls..
const Server = require('net/server');
const server = Server.create({
	address: 'echo://0.0.0.0:7777'
});

server.start((_event, _server) => {
	//
});

