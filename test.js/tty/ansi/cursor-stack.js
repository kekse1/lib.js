#!/usr/bin/env node.js

const TIME = 100;
const MAX = 50;

var counter = 0;
var state = null;

function test(_e)
{
	//w/ eol(4) just to demonstrate the cursor.load() is correct! ;-)
	write.eol(4, '[% %] %', TIME, 'milliseconds', ++counter);

	if(counter < MAX)
	{
		_e.load(2, 2);
	}
	else
	{
		ansi.cursor.show();

		dir(_e.stack.length, '.stack [' + _e.index + ']');
		_e.remove();
		dir(_e.count, '.count  //did: .remove()');
		dir(_e.stack.length, '.stack [' + _e.index + ']')
	}
}

ansi.cursor.hide();
ansi.clear();

ansi.push((_e) => {
	(state = _e).callback(test, TIME);
	_e.load(2, 2);
});

write('Counting to % .. every % ms.', MAX, TIME);

