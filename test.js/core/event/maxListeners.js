#!/usr/bin/env node.js

const e = EVENT.create();
const m = e.getMaxListeners();

dir(m, '(EVENT).getMaxListeners()');

for(var i = 0; i < (m + 3); ++i)
{
	e.once('test', dir);
}

