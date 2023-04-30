#!/usr/bin/env node.js

//
const LOCK_TIMEOUT = 10;

//
function callback(_event)
{
	dir(_event, { compact: true, depth: 1 });
};

//
function lockFunc()
{
	dir(ansi.cursor.lock, 'ansi.cursor.lock');
	
	if(ansi.cursor.lock)
	{
		return setTimeout(lockFunc, LOCK_TIMEOUT);
	}
	
	return restFunc();
}

function restFunc()
{
	const item = ansi.cursor.pop();
	write("POP()");

	ansi.clear();

	item.load(8, 8);
	write("item.load(8, 8)");

	item.load(24, 24);
	write("item.load(24, 24)");

	const res = item.remove();
	dir(res, 'item.remove()');

	console.eol(4);
	dir(item, '(item)');
}

function testFunc()
{
	write("START");

	ansi.cursor.push(callback);
	ansi.cursor.push(callback);

//	ansi.cursor.home();

	write("HOME");

	lockFunc();
}

testFunc();
