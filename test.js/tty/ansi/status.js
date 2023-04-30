#!/usr/bin/env node.js

const MIN = 0;
const MAX = 100;
const STEP = 1;
const TIME = 50;

for(var i = MIN; i <= MAX; i += STEP)
{
	ansi.status(1, 'Counter: %', i);
	sleep(TIME);
}

ansi.status(1, 2);

