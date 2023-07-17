#!/usr/bin/env node.js

var count = 0;

function cb(_result, _stop, _reason)
{
	dir(_result, _reason + ': ' + _stop);
	
	if(++count >= 2)
	{
		return;
	}
	else
	{
		console.prompt(cb, true, 'Regular: when done, hit <%>: ', 'Enter');
	}
}

console.prompt(cb, { length: 6, until: 'xyz' }, 'Either % chars or `%`: ', 6, 'xyz');
