#!/usr/bin/env node.js

const escapes = [ 'hex', 'c', 'iso', 'ctrl' ];
const string = ('dies'.bold + ' ' + 'ist'.high + ' ' + 'ein'.underline + ' ' + 'test'.debugBG).italic;

log(string.toString('"'));
console.eol(2);

for(const esc of escapes)
{
	log(string.ansiHigh(esc).toString('"'));
}


