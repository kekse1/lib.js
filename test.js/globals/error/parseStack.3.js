#!/usr/bin/env node.js

//
const stack = '/home/kuchen/tmp/test.js:3' + EOL +
	'		  #  ' + EOL +
	'		  ^' + EOL +
	EOL +
	'SyntaxError: Invalid or unexpected token' + EOL +
	'    at Object.compileFunction (node:vm:352:18)' + EOL +
	'    at wrapSafe (node:internal/modules/cjs/loader:1027:15)' + EOL +
	'    at Module._compile (node:internal/modules/cjs/loader:1063:27)' + EOL +
	'    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)' + EOL +
	'    at Module.load (node:internal/modules/cjs/loader:975:32)' + EOL +
	'    at Function.Module._load (node:internal/modules/cjs/loader:822:12)' + EOL +
	'    at Module.require (node:internal/modules/cjs/loader:999:19)' + EOL +
	'    at Module.__module.require (/home/kuchen/git/xyz/lib.js/main.js:705:25)' + EOL +
	'    at require (node:internal/modules/cjs/helpers:102:18)' + EOL +
	'    at takeFile (/home/kuchen/git/xyz/lib.js/node.js:252:22)' + EOL +
	'    at take (/home/kuchen/git/xyz/lib.js/node.js:299:26)' + EOL +
	'    at /home/kuchen/git/xyz/lib.js/node.js:313:6' + EOL +
	'    at /home/kuchen/git/xyz/lib.js/node.js:330:5' + EOL +
	'    at /home/kuchen/git/xyz/lib.js/node.js:332:4' + EOL +
	'    at Object.<anonymous> (/home/kuchen/git/xyz/lib.js/node.js:334:3)' + EOL +
	'    at Module._compile (node:internal/modules/cjs/loader:1099:14)' + EOL +
	'    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)' + EOL +
	'    at Module.load (node:internal/modules/cjs/loader:975:32)' + EOL +
	'    at Function.Module._load (node:internal/modules/cjs/loader:822:12)' + EOL +
	'    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)' + EOL +
	'    at node:internal/main/run_main_module:17:47';


//
log(stack);
console.eol(7);
dir(Error.parseStack(stack, 'SyntaxError', false, false), 'Error.parseStack(stack, null, false, false)');

