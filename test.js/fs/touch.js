#!/usr/bin/env node.js

const SYNC = true;
const ASYNC = true;

const PATH = '/tmp/touch-test.tmp';
const SIZE = 16;

if(SYNC)
{
	dir(fs.touch(PATH, null, SIZE));
	dir(fs.touch(PATH, null, SIZE));

	if(ASYNC)
	{
		fs.unlinkSync(PATH);
	}
}

if(ASYNC)
{
	var count = 2;

	const callback = (_error, _created, _truncated) => {
		console.debug('Created: % (%)', _created, _truncated);

		if(_error)
		{
			return x(_error, 'created: ' + _created);
		}
		else if(--count > 0)
		{
			fs.truncateSync(PATH, 6);
			fs.touch(PATH, callback, SIZE);
		}
	};

	fs.touch(PATH, callback, SIZE);
}

