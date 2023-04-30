#!/usr/bin/env node.js

const SPEED = 2000;

function frame(_event, _animation)
{
	dir(_event, _event.type + ' @ ' + SPEED, 0);

	if(_event.fin && _event.reset() === 3)
	{
		_event.stop();
	}
}

Animation.start(frame, SPEED, 'ms');

