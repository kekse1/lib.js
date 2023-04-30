#!/usr/bin/env node.js

const LAST = false;
const PARSE = true;
const PARSE_ARGV = true;

function callFunc(_event, ... _args)
{
	if(_event.index === 'example')
	{
		return 'RESULT OF .call FUNCTION (w/ ' + _args.length + ' arguments)';
	}
	else if(_event.index === 'lang')
	{
		return; // NOT changing the result..
	}

	dir(Object.keys(_event), 'Object.keys(_event) @ ' + _event.string + ' w/ (...)_args.length = ' + _args.length);
	dir(_args, '... _args');
	dir(_event.result, '_event.result ... w/ ..without(... RESERVED);');
	return 'Called ' + _event.string.toString('"') + '.. w/ (' + _args.length + ' + 1) arguments';
}

const args = getopt({
	lang: { short: 'l', args: 1, env: 'LANG', unescapeC: false, help: 'example language, to check w/ \'-lde\'' },
	lang2: { short: 'll', args: 1, env: 'LANGUAGE', help: 'testing checkNoSpaceArgument()' },
	test2: { short: '2', args: 2, help: 'this is a test', group: 'test group' },
	test1: { short: '1', args: 1, help: 'second test', group: 'test group' },
	example: { short: 'e', help: 'example item', group: null, env: 'test', undefined: 'undef', null: 'null', group: 'gruppe 2', call: callFunc },
	TEST1: { short: 'a', help: 'example help text', call: 'test' },
	TEST2: { short: 'b', help: 'example help zwei', call: 'test()' },
	help1: { short: '?', call: 'help' },
	help2: { short: 'h', call: 'help(222)' },
	help3: { short: 'H', call: 'help()', args: 2 },
	test: { args: 1, default: 'abc', short: 't', call: 'test(3.14, 2048n)' },
	'te=test': { args: 1, long: "TE=ST", short: 'T', env: 'X' },
	exit1: { short: 'x', call: 'exit(exiting(%).., 234, 3.14, 2048n)', help: 'test "exit" call #one' },
	exit2: { short: 'y', call: 'exit(123)', help: 'test "exit" call #two' },
	exit3: { short: 'z', call: 'exit', help: 'test "exit" call #three' },
	exit4: { short: 'v', call: 'exit()', args: 2, help: 'argue with .args > 0 (will be \'...\' argued ;-)' },
}, LAST, PARSE, PARSE_ARGV, [ callFunc, 'abc', 'def', 3.14 ]);

//
console.eol(7);
dir(process.args, 'args');
console.eol(3);
dir(process.env.test, 'process.env.test');
dir(getopt.getEnv('test'), 'getopt.getEnv("test")');

