#!/usr/bin/env node.js

const setCrypto = (_value) => {
	console.eol();
	console.debug('old state of \'%\': %', 'Math.crypto', Math.crypto);

	if(typeof _value === 'boolean')
	{
		CRYPTO = _value;
	}
	else
	{
		return x('Invalid _value (expecting a Boolean)');
	}

	console.debug('new state of \'%\': %', 'Math.crypto', Math.crypto);
	console.eol(2);
};

//
setCrypto(false);

var random = Math.random();
var byte = Math.random.byte(255, 128);
var float = Math.random.float(255, 128, true);

console.eol(3);

dir(random, 'Math.random() @ Math.crypto: ' + Math.crypto);
dir(byte, 'Math.random.byte(255, 128) @ Math.crypto: ' + Math.crypto);
dir(float, 'Math.random.float(255, 128, true) @ Math.crypto: ' + Math.crypto);

//
setCrypto(true);

random = Math.random();
byte = Math.random.byte(255, 128);
float = Math.random.float(255, 128, true);

console.eol(2);

dir(random, 'Math.random() @ Math.crypto: ' + Math.crypto);
dir(byte, 'Math.random.byte(255, 128) @ Math.crypto: ' + Math.crypto);
dir(float, 'Math.random.float(255, 128, true) @ Math.crypto: ' + Math.crypto);

//
console.eol(3);

