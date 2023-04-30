#!/usr/bin/env node.js

//TODO: .pad(), .padLeft(), .padRight(); .. atm only .padCenter();
//
var string = 'testing';
var result = string.padCenter(console.width, '.::');

process.stdout.write(result + EOL);

result = string.pad(10, '-+').toString('"');
log(result + ' (+10)');
result = string.pad(-10, '+-').toString('"');
log(result + ' (-10)');

