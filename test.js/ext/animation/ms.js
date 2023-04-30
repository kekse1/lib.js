#!/usr/bin/env node.js

const SPEED = 3000;

function frame(_event, _animation)
{
	dir(_event, _event.type + ' @ ' + SPEED, 0);

	if(_event.fins === 3)
	{
		_event.stop();
	}
}

Animation.start(frame, SPEED, 'ms');

