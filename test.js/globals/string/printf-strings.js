#!/usr/bin/env node.js

var format;
const args = [ 'zweiter' ];
var result;

console.eol();

format = 'ein %{12} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{-12} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{12/2} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{!12 0} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{-16 .} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

args[0] = 'Array';
format = 'ein % test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

args[0] = 'sack';
args[1] = 'sackzementkreuzgranatenaberauchnochmal';
format = 'noch %{-8 -} ein %{8.-15} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

