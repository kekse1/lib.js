#!/usr/bin/env node.js
const http2 = require('http2');

const onRequest = (_req, _res) => {
	//
	_res.end('Bye!');

	//
	console.eol(2);
	dir(_req, 'request');
	console.eol(25);
	dir(_res, 'response');
	console.eol(2);
}

const httpd = http2.createServer({}, onRequest);
httpd.listen(8888);

