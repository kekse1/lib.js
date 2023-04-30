#!/usr/bin/env node.js

const p = __filename;
const o = { encoding };
const lines = [];

function cb(_event)
{
	dir(_event, { compact: true, depth: 1 });
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
	console.eol(8);
	dir(lines, 'fs.readLine(...)');
}

const res = fs.readLine(p, cb, o, true);
dir(res, 'fs.readLine("' + p + '", (cb), (opt), true)');

//
