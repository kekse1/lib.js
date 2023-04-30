#!/usr/bin/env node.js

const o = Object.create(null);

o['eins.zwei.drei'] = 'vier';
o['zwei.drei.vier'] = 'five';

if(typeof config === 'undefined')
{
	require('utility/config');
}

const res = config.render(o, true);

console.debug(res);

