#!/usr/bin/env node.js

var res = null;

function cb(_result, _break)
{
	if(! _break)
	{
		if(_result)
		{
			console.info('YES...');
		}
		else
		{
			console.warn('NO ...');
		}
	}
	else
	{
		console.error('(' + _break + ')');
	}

	console.debug(res.textLength + ' / ' + res.length);
}

res = console.confirm(cb, 'Do you want it now [%/%]!? ', 'yes', 'no');


