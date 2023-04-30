#!/usr/bin/env node.js

// 
// call w/ argv '-?' or '--help'!!!
// 

getopt({
	//help: { short: '?', call: 'help', help: 'hiermit aufrufe der hilfe' },
	string: { help: 'ein regulaerer hilfe-string' },
	array: { help: [ 'ein % hilfe-string (%)', 'printf()', 3.14 ] }
});

