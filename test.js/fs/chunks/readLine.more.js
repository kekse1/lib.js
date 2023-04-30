#!/usr/bin/env node.js

const p = __filename;
const o = {
	chunk: 8,
	//chunks: 16,
	encoding: 'utf8',
	lines: 14,
	stopLine: 32,
	startLine: 19,
	maxLineLength: 256,
	//length: 345,
	offset: 10,
	backwards: false
};

const lines = [];

function callback(_event)
{
	dir(_event, { compact: true, depth: 1, text: '_event' });
	console.info(('lines.push(' + lines.push(_event.line) + ')').color('random'));

	if(_event.finish)
	{
		output();
	}
	else
	{
		console.eol(3);
	}
}

function output()
{
	console.eol(lines.length);
	console.log(lines.join(EOL));
}

dir(o, '(options)');
console.eol(8);

const r = fs.readLine(p, callback, o, true);
dir(r, 'fs.readLine("' + p + '", (callback), (options), true)');

