#!/usr/bin/env node.js

function testFunc()
{
	stdout(arguments.toString());
	stdout(arguments.toString({ colors: true }));
	console.eol();
	stdout(arguments.toString({ colors: true, depth: 1, render: false, index: true, radix: -3 }));
	stdout(arguments.toString({ colors: true, depth: null, render: false, index: false, radix: -3, textRadix: true }));
}

testFunc('eins', 'zwei', 'drei');

