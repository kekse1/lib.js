#!/usr/bin/env node.js

var format;
const args = [ 16777216.14151617 ];
var result;

//
console.eol();

format = 'ein %{.2} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{.2!} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{4.0/10} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{!4.0} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{!4.0!} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein % test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{!} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{.4!} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{!2!} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{!2/16} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{4.2/16} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{!4.2/16} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{!-10 -/16} test';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

format = 'ein %{2.2} test %';
args[1] = '#2';
result = format.printf(... args);
dir(args, 'printf("' + format + '")');
stdout(result);

console.eol();

