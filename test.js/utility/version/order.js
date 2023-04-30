#!/usr/bin/env node.js

if(typeof version === 'undefined')
{
	version = require('utility/version');
}

const addr = [ '2.0.1-r1', '2.0.1-r2', '2.0.1', '2.2.0', '1.2.3-r1', '1.2.3' ];

const res = version.order(addr);

dir(addr, '(address)');
dir(res, 'version.order(address)');

