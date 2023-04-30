#!/usr/bin/env node.js

const DEBUG_FROM = 0;
const DEBUG_TO = -1;

const str = [
	'tls://[::]:8080',
	'https://localhost:443//',
	'127.1:8080',
	'[::1]:8888#hash?NO-search',
	'[::1]',
	'[::1]:8888',
	'localhost',
	'colon:1234',
	'space 4321',
	'https://[::1]:8080//eins/zwei.tmp',
	'test.txt?search#hash',	//muss auch PURE PFADE zulassen!!! ;-)
	'../test.txt#testing',
	'/tmp/abc.txt',
	'host-port 1234',
	'host+port:4321',
	'[:ef:..]:8765',
	'[abc..] 9876',
	'file:///tmp/testing.tmp#test..',
	'https://user:passwd@host',
	'user@hostname 2345',
	'hostname',
	'1234',
	2345
];

const from = str.getIndex(DEBUG_FROM);
const to = str.getIndex(DEBUG_TO);

for(var i = from; i <= to && i < str.length; i++)
{
	const uniform = Uniform.create(str[i]);
	const rendered = uniform.toString();

	dir(uniform.toObject(true), str[i] + ' ==> ' + rendered);
}

