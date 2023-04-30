#!/usr/bin/env node.js

//
const stack = 'Error: Invalid _radix [ -257 .. 256 ]' + EOL +
	 '	at module.exports (eval at require (http://localhost/kekse/lib.js:2317:10), :48:12)' + EOL +
	 '	at uuid (eval at require (http://localhost/kekse/lib.js:2317:10), :72:17)' + EOL +
	 '	at createState (eval at require (http://localhost/kekse/lib.js:2317:10), :195:17)' + EOL +
	 '	at eval (eval at require (http://localhost/kekse/lib.js:2317:10), :327:20)' + EOL +
	 '	at eval (eval at require (http://localhost/kekse/lib.js:2317:10), :594:3)' + EOL +
	 '	at eval ()' + EOL +
	 '	at require (http://localhost/kekse/lib.js:2317:10)' + EOL +
	 '	at eval (eval at require (http://localhost/kekse/lib.js:2317:10), :9:13)' + EOL +
	 '	at eval ()' + EOL +
	 '	at require (http://localhost/kekse/lib.js:2317:10)';

//
log(stack);
console.eol(7);
log(Error.parseStack(stack, null, true, false).join(EOL), 'Error.parseStack(stack, "Error", false, false).join(EOL)');

